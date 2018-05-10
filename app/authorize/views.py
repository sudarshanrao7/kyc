from django.http.response import  HttpResponseBadRequest,\
    JsonResponse
import json

from django.views.decorators.http import require_http_methods
from django.views.generic.base import View
from app.api.utils import get_success_packet, get_bad_packet
from app.api.error_response import handling_exception_response, invalid_session
from app.authorize.utils import create_jwt_token
from app.kyc.serializer import KYC_DETAILED_SERIALIZER_FIELDS
from app.user.serializer import USER_SERIALIZE_FIELDS
from app.api.utils import model_to_dict


@require_http_methods(["GET"])
def authenticate(request):
	"""
		Helps  to check if the JWT token is still valid and returns logged in user details
		Advance usecases like reissue token which is about to expire etc can be added..
	"""
	try:
		response_object = get_success_packet()
		if request.user is None or request.user.is_anonymous() or not request.user.is_authenticated():
			return invalid_session()
		else:
			response_object['user'] = model_to_dict(request.user,fields=USER_SERIALIZE_FIELDS)
			response_object['user']["kyc"] = model_to_dict(request.user.kyc,fields=KYC_DETAILED_SERIALIZER_FIELDS)
			return JsonResponse(response_object)
	except Exception as e:
		return handling_exception_response(request,e)


@require_http_methods(["POST"])
def login(request):
	try:
		response_object = get_success_packet()
		error_obj = get_bad_packet()
		params = json.loads(request.body)
		email = params.get("email", None)
		password = params.get("password", None)
		if email is None or password is None:
			return HttpResponseBadRequest(
				content_type="application/json",
				content=json.dumps(error_obj)
			)
		user, token = create_jwt_token(email, password)
		if user is None or token is None or user.is_anonymous() or not user.is_authenticated():
			error_obj['reason'] = "Invalid Credentials"
			return HttpResponseBadRequest(
				content_type="application/json",
				content=json.dumps(error_obj)
			)
		else:
			response_object['token'] = token
			response_object['user'] = model_to_dict(user,fields=USER_SERIALIZE_FIELDS)
			response_object['user']["kyc"] = model_to_dict(user.kyc, fields=KYC_DETAILED_SERIALIZER_FIELDS)
			return JsonResponse(response_object)
	except Exception as e:
		print e
		return handling_exception_response(request,e)	