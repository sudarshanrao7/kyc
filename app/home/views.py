from django.shortcuts import render_to_response
from django.template.context import RequestContext
from kyc_app.settings import STATIC_URL


def webapp_render(request): 
    context = {'STATIC_URL':STATIC_URL}
    response =  render_to_response("webapp.html",context,RequestContext(request))  
    return response 