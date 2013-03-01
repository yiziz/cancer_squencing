# Create your views here.

from django.views.generic import View
from django.http import HttpResponse

from . import utils





import json

def getAllDNA():
    pass

def getSingleDNA(request):
    refLen = 10000
    readLen = 15000
    donorM = 12
    cancerM = 3
    ref = utils.RefFactory(refLen)
    donor = utils.DonorFactory(ref, donorM)
    cancer = utils.CancerFactory(donor, cancerM)
    rList = donor.getReadList(30, readLen) + cancer.getReadList(30, readLen)
    instance = {"dna":ref.getDNA(), "readList":rList, "startIndex":0, 
                "donorIndex": donor.getMutateIndexes(), "cancerIndex": cancer.getMutateIndexes()}
    return HttpResponse(json.dumps(instance), content_type="application/json")

#class foo(JSONResponseMixin, View):
#    
#    def get(self, request, *args, **kwargs):
#        instance = {"foo":"boo"}
#        return self.render_json_object_response(instance)



