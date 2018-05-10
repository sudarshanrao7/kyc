from django.conf.urls import url,include

urlpatterns = [ 
	url(r'^core/', include("app.core.urls")),
    url(r'^eform/', include("app.eform.urls")),
	url(r'^authorize/', include("app.authorize.urls")),
]

