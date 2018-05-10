"""kyc URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
import settings
from django import views as django_views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = []
if settings.DEBUG:
	urlpatterns += [
		url(r'^%s(?P<path>.*)$' % settings.MEDIA_URL[1:],
			django_views.static.serve,
			{'document_root': settings.MEDIA_ROOT, 'show_indexes': True}), ]
	urlpatterns += staticfiles_urlpatterns()
	
urlpatterns += [ 
    url(r'^api/', include("app.api.urls")),
    url(r'^', include("app.home.urls")),
]
