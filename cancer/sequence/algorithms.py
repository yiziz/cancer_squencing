

from .utils import diffRatio, str2dict, maxSim


class BaseAlgo(object):
    
    def __init__(self, dna="", ratio=1):
        self._dna = dna
        self._checkRatio = ratio
        self._frequency = {}
        return None
    
    
    def matchTarget(self, target="", indexStart=0, indexEnd=None, foo=0):
        targetLength = len(target)
        #mutantIndexes = {}
        if targetLength < 1:
            #return mutantIndexes
            return self
        dna = self.getDNA()[indexStart:indexEnd]
        indexOffset = indexStart
        while len(dna) >= targetLength:
            diff = diffRatio(target, dna[:targetLength], indexOffset)
            if diff["ratio"] >= self.getCheckRatio():
                
                for index in diff["indexes"]:
                    # print str(index) + " | " + target + " | #" + dna[:targetLength] + " | @" + dna[:50] + " | " + str(indexStart)+"$"+str(indexOffset) + "$" + str(len(dna))
                    #if index in mutantIndexes.key():
                    #    mutantIndexes[index] +=1
                    #else:
                    #    mutantIndexes[index] = 1
                    try:
                        self.getFrequency()[index] += 1
                    except:
                        self.getFrequency()[index] = 1
                    #if index in self.getFrequency().keys():
                    #    self.getFrequency()[index] += 1
                    #else:
                    #    self.getFrequency()[index] = 1
            dna = dna[1:]
            indexOffset +=1
        #return mutantIndexes
        return self
    
    def matchTargetList(self, targetList, indexStart=0, indexEnd=None, foo=0):
        #mutantIndexes = {}
        if len(targetList) < 1:
            #return mutantIndexes
            return self
        for target in targetList:
            targetIndexes = self.matchTarget(target, indexStart, indexEnd, foo)
            #mutantIndexes = dict(mutantIndexes.items() + targetIndexes.items())
        #return mutantIndexes
        return self
        
    def reset(self):
        self._frequency = {}
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
    
class WildAlgo(BaseAlgo):
    
    def __init__(self, dna="", ratio=1, wild=0):
        super(WildAlgo, self).__init__(dna, ratio)
        self._wild = wild
        self._skippedIndexes = []
        self._dnaSegments = {}
        return None
    
    def _setWild(self, wild):
        self._wild = wild
        return self
    
    def _setSkippedIndexes(self, skippedIndexes):
        self._skippedIndexes = skippedIndexes
        return self
    
    def _setDNASegments(self, dnaSegments):
        self._dnaSegments = dnaSegments
        return self
    
    def getWild(self):
        return self._wild
    
    def getSkippedIndexes(self):
        return self._skippedIndexes
    
    def getDNASegments(self):
        return self._dnaSegments
    
    
    def getDNADict(self, target="", indexStart=0, padding=0):
        ###!!!! Only works with padding == 10 and targetLength == 30

        dnaList = []
        try:
            dnaList = self.getDNASegments()[indexStart]
        except:
            #paddingStart = indexStart + padding
            #paddingEnd = paddingStart + len(target) - padding
            tempDNA = self.getDNA()[indexStart:indexStart+len(target)]
            dnaList = [str2dict(tempDNA[padding:]),
                           str2dict(tempDNA[:padding]+tempDNA[padding*2:]), 
                           str2dict(tempDNA[:-padding]),
                        ]
            self.getDNASegments()[indexStart] = dnaList
        return dnaList
    
    def matchTarget(self, target="", indexStart=0, indexEnd=None, foo=1):
        ###!!!! Only works with padding == 10 and targetLength == 30
        targetLength = len(target)
        targetDict = str2dict(target)
        if targetLength < 1:
            return self
        mutateWild = (1-self.getCheckRatio())*targetLength
        padding = int(self.getWild()+mutateWild)
        finished = False
        while not finished:
            dnaList = self.getDNADict(target, indexStart, padding)
            indexEnd = indexStart+targetLength+padding-foo
            if indexEnd >= len(self.getDNA()):
                indexEnd = None
                finished = True
            if maxSim(targetDict, dnaList[0], padding) >= 1 or \
                maxSim(targetDict, dnaList[1], padding) >= 1 or \
                maxSim(targetDict, dnaList[2], padding) >= 1:
                super(WildAlgo, self).matchTarget(target, indexStart, indexEnd)
            else:
                self.getSkippedIndexes().append(indexStart)
            indexStart += padding
        return self
    
    def reset(self):
        self._dnaSegments = {}
        self._skippedIndexes = []
        return super(WildAlgo, self).reset()
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
