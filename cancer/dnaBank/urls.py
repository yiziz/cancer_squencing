from django.conf.urls.defaults import patterns, url
from . import views


urlpatterns = patterns('',
                       
    #url(
    #    regex=r'^api/getDNA',  #(?P<slug>[-\w]+)/$
    #    view=views.foo.as_view(),
    #    name='dna_api',
    #),
    url('^getSingleDNA/', views.getSingleDNA, name="getDNA"),
)
