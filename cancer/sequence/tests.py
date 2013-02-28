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

ref = utils.RefFactory(500)
donor = utils.DonorFactory(ref, 10)
cancer = utils.CancerFactory(donor, 5)

base = BaseAlgo(ref.getDNA(), 0.9)
wild = WildAlgo(ref.getDNA(), 0.9, 7)

rList = donor.getReadList(30, 20000)

def bob(tList):
    start = time.time()
    wild.matchTargetList(tList)
    return time.time() -start

def dod(tList):
    start = time.time()
    base.matchTargetList(tList)
    return time.time() -start
# t = bob(rList[:1])
