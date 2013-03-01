"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase


class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)

from dnaBank import utils
from .algorithms import BaseAlgo, WildAlgo
import time


refLen = 10000
readLen = 15000
donorM = 12
cancerM = 4


ref = utils.RefFactory(refLen)
donor = utils.DonorFactory(ref, donorM)
cancer = utils.CancerFactory(donor, cancerM)
rList = donor.getReadList(30, readLen) + cancer.getReadList(30, readLen)
instance = {"dna":ref.getDNA(), "readList":rList, "startIndex":0, 
            "donorIndex": donor.getMutateIndexes(), "cancerIndex": cancer.getMutateIndexes()}

base = BaseAlgo(ref.getDNA(), 0.9)
wild = WildAlgo(ref.getDNA(), 0.9, 7)


def bob(tList):
    start = time.time()
    wild.matchTargetList(tList)
    return time.time() -start

def dod(tList):
    start = time.time()
    base.matchTargetList(tList)
    return time.time() -start

t = bob(rList)
t2 = dod(rList)

print donor.getMutateIndexes()
print cancer.getMutateIndexes()

print t
print len(wild.getSkippedIndexes())
print wild.getFrequency()

print "\n\n\n"

print t2
print base.getFrequency()


