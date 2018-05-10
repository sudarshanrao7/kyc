from django.conf.urls import url,include
from views import ApplicationFormList,ApplicationFormDetailsView


urlpatterns = [
	url(r'^$', ApplicationFormList.as_view(), name="eform_list"),
	url(r'^(?P<pk>\d+)', ApplicationFormDetailsView.as_view(), name="eform"),
]

