from django.conf.urls import  url,include
from app.authorize import views as auth_views 




urlpatterns = [
	url(r'^login$', auth_views.login, name="login"),
	url(r'^authenticate$', auth_views.authenticate, name="authenticate"),
]
