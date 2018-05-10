from django.conf.urls import  url
from app.home import views as home_views

urlpatterns = [    
    url(r'^', home_views.webapp_render, name='webapp_render'),
]
