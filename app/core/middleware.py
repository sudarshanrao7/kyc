from django.utils.deprecation import MiddlewareMixin
from django.urls.base import reverse
from django.utils.functional import SimpleLazyObject
from app.authorize.utils import authorize_credentials


class KYCAuthMiddleware(MiddlewareMixin):
	""" Middleware for authorizing JSON Web Tokens in Authorize Header """
	
	def process_request(self, request):
		if request.path.startswith('/api'):
			request.user = SimpleLazyObject(lambda: authorize_credentials(request))
	
	def process_response(self, request, response):
		return response
	
	def process_exception(self, request, exception):
		raise exception