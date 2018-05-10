from django.conf.urls import  url,include
from app.core import views as core_views 

urlpatterns = [
	url(r'^file_upload', core_views.file_upload, name="file_upload"),
	url(r'^file_delete', core_views.file_delete, name="file_delete"),
]
