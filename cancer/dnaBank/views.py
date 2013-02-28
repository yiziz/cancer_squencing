# Create your views here.

from django.views.generic import View
from braces.views import JSONResponseMixin
from django.http import HttpResponse

from . import utils





import json

def getAllDNA():
    pass

def getSingleDNA(request):
    ref = utils.RefFactory(500)
    donor = utils.DonorFactory(ref, 10)
    cancer = utils.CancerFactory(donor, 5)
    rF = donor.getRead(30)
    instance = {"dna":ref.getDNA(), "read":rF, "startIndex":0,}
    return HttpResponse(json.dumps(instance), content_type="application/json")

class foo(JSONResponseMixin, View):
    
    def get(self, request, *args, **kwargs):
        instance = {"foo":"boo"}
        return self.render_json_object_response(instance)



