import datetime
from marshmallow import Schema
from pyramid.httpexceptions import HTTPInternalServerError
from pyramid.renderers import JSON


class RenderSchema(Schema):
    """
    Schema to prevent marshmallow from using its default type mappings.
    We use this schema for rendering output: For those cases we don't want
    marshmallow's default type mappings. We want Pyramid's JSON-rendering
    functionality instead, where we already have some json-adapers.
    """
    TYPE_MAPPING = {}
    class Meta:
        ordered = True


class SchemaJsonRenderer(JSON):
    """
    Extends Pyramid's JSON renderer with marshmallow-serialization.

    When a view-method defines a marshmallow Schema as request.render_schema,
    that schema will be used for serializing the return value.
    """

    def __call__(self, info):
        """
        If a schema is present, replace value with output from schema.dump(..).
        """
        original_render = super().__call__(info)

        def schema_render(value, system):
            request = system.get('request')
            if (request is not None and isinstance(getattr(request, 'render_schema', None), Schema)):
# This doesn't catch errors...
                value, errors = request.render_schema.dump(value)
# This will catch errors
#                try:
#                    value, errors = request.render_schema.dump(value)
#                except Exception:
#                    errors = True

#                if errors:
#                    raise HTTPInternalServerError(body="Serialization failed.")

            return original_render(value, system)

        return schema_render


def custom_json_renderer():
    """
    Return a custom json renderer that can deal with some datetime objects.
    """
    def datetime_adapter(obj, request):
        #return obj.isoformat()
        return obj.strftime('%Y-%m-%dT%H:%M:%SZ')

    def time_adapter(obj, request):
        return str(obj)

    def bytes_adapter(obj, request):
        return obj.decode('ascii')

    json_renderer = SchemaJsonRenderer(indent=1)
    json_renderer.add_adapter(datetime.datetime, datetime_adapter)
    json_renderer.add_adapter(datetime.time, time_adapter)
    json_renderer.add_adapter(bytes, bytes_adapter)
    return json_renderer

