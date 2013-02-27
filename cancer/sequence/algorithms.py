

from .utils import diffRatio


class BaseAlgo(object):
    
    def __init__(self, dna="", ratio=1):
        self._dna = dna
        self._checkRatio = ratio
        self._frequency = {}
        return None
    
    
    def matchTarget(self, target="", indexStart=0):
        targetLength = len(target)
        #mutantIndexes = {}
        if targetLength < 1:
            #return mutantIndexes
            return self
        dna = self.getDNA()[indexStart:]
        indexOffset = indexStart
        while len(dna) >= targetLength:
            diff = diffRatio(target, dna[:targetLength], indexOffset)
            if diff["ratio"] >= self.getCheckRatio():
                for index in diff["indexes"]:
                    #if index in mutantIndexes.key():
                    #    mutantIndexes[index] +=1
                    #else:
                    #    mutantIndexes[index] = 1
                    if index in self.getFrequency().keys():
                        self.getFrequency()[index] += 1
                    else:
                        self.getFrequency()[index] = 1
            dna = dna[1:]
            indexOffset +=1
        #return mutantIndexes
        return self
    
    def matchTargetList(self, targetList, indexStart=0):
        #mutantIndexes = {}
        if len(targetList) < 1:
            #return mutantIndexes
            return self
        for target in targetList:
            targetIndexes = self.matchTarget(target, indexStart)
            #mutantIndexes = dict(mutantIndexes.items() + targetIndexes.items())
        #return mutantIndexes
        return self
        
    
    def setCheckRatio(self, ratio):
        self._checkRatio = ratio
        return self
    
    def _setDNA(self, dna):
        self._dna = dna
        return self
    
    def getCheckRatio(self):
        return self._checkRatio
    
    def getDNA(self):
        return self._dna
    
    def getFrequency(self):
        return self._frequency
