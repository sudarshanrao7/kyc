
from django.http.response import HttpResponse, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseServerError
from django.db import IntegrityError
import traceback
import json
from app.api.utils import get_error_packet
from kyc_app.settings import DEBUG



def handling_exception_response(request,e=None):
	error_object = get_error_packet()
	if DEBUG:
		print traceback.format_exc()
	else:
		#Send to slack
		pass
	messages = "Internal Server Error!"
	if e is not None and DEBUG:
		try:
			messages = ', '.join(e.messages)
		except :
			pass
	error_object["reason"] = messages
	return  HttpResponseServerError(json.dumps(error_object),content_type="application/json")
	
	
def invalid_session():
	response_obj = {}
	response_obj['status'] = '401'
	response_obj['reason'] = 'Invalid Session'
	return HttpResponse(status=401,content_type="application/json",content=json.dumps(response_obj))

def permission_denied():
	response_obj = {}
	response_obj['status'] = '403'
	response_obj['reason'] = 'Permission Denied'
	return HttpResponseForbidden(content_type="application/json",content=json.dumps(response_obj))

def method_not_allowed():
	response_obj = {}
	response_obj['status'] = '403'
	response_obj['reason'] = 'Method not allowed'
	return HttpResponseNotAllowed(content_type="application/json",content=json.dumps(response_obj))

def unsupported_version():
	response_obj = {}
	response_obj['status'] = '459'
	response_obj['reason'] = "We are very sorry we no longer support this old version of api"
	return HttpResponse(status=459,content_type="application/json",content=json.dumps(response_obj))
