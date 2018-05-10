from django.core.files.base import ContentFile
from django.core.files.storage import default_storage, FileSystemStorage
from django.http.response import JsonResponse, HttpResponseBadRequest
from django.utils.encoding import smart_text
import os,json,shutil

from django.views.decorators.http import require_http_methods

from app.api.error_response import handling_exception_response
from app.api.utils import get_bad_packet,get_success_packet
from app.core.decorators import login_check
from app.utils.utils import generate_guid
from kyc_app.settings import MEDIA_ROOT, MEDIA_URL


@login_check
@require_http_methods(["POST"])
def file_upload(request):
	try:
		error_obj = get_bad_packet()
		response_obj = get_success_packet()
		upload_results = []
		for file in request.FILES.getlist("files", []):
			file_name = smart_text((file.name).replace (" ", "_"))
			guid = generate_guid()
			path_string = u"uploads/{0}/{1}".format(guid,file_name)
			path = default_storage.save(path_string, ContentFile(file.read()))
			path = os.path.join(MEDIA_URL, path)
			upload_results.append({
				'guid': guid,
				'name': file_name,
				'url': path
			})
		response_obj['data'] = upload_results
		return JsonResponse(response_obj)
	except Exception as e:
		return handling_exception_response(request, e)
	
@login_check
@require_http_methods(["POST"])
def file_delete(request):
	try:
		error_obj = get_bad_packet()
		response_obj = get_success_packet()
		params = json.loads(request.body)
		guid = params.get("guid",None)
		if guid is None:
			return HttpResponseBadRequest(content_type="application/json", content=json.dumps(error_obj))
		path_string = u"uploads/{0}".format(guid)
		shutil.rmtree(os.path.join(MEDIA_ROOT, path_string))
		return JsonResponse(response_obj)
	except Exception as e:
		return handling_exception_response(request, e)