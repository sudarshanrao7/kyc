from app.api.error_response import invalid_session, unsupported_version
from app.api.utils import get_error_packet
from kyc_app.settings import SUPPORTED_API_VERSIONS
import json



def login_check(function=None,redirect_field_name=None):
    def _decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated():
                return view_func(request, *args, **kwargs)
            else:
                return invalid_session()
        return _wrapped_view
    if function is None:
        return _decorator
    else:
        return _decorator(function)

def api_check():
	def _method_wrapper(view_method):
		def _arguments_wrapper(request, *args, **kwargs) :
			operation = kwargs.get("operation")
			params = {}
			params =  dict(params, **kwargs)
			if request.method == "GET":
				params = json.loads(json.dumps(request.GET))
			elif request.FILES:
				params = json.loads(json.dumps(request.POST))
			else:
				params = json.loads(request.body)

			error_response_obj = get_error_packet()
			request.params = params
			api_version = kwargs["api_version"]
			if str(api_version) not in SUPPORTED_API_VERSIONS:
				return unsupported_version()


			return view_method(request, *args, **kwargs)
		return _arguments_wrapper
	return _method_wrapper