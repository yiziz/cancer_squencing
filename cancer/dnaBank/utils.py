import random

def createRandomDNA(length=0, seed="gatc"):
    return "".join(random.choice(seed) for x in range(length))


def createRead(dna="", length=0):
    dnaLength = len(dna)
    if dnaLength < length:
        return
    index = random.randint(0, dnaLength-length-1)
    return dna[index:index+length]

def createReadList(dna="", length=0, num=0):
    readList = []
    while num > 0:
        readList.append(createRead(dna, length))
        num -=1
    return readList

def randomDNAIndexes(dna="", num=0):
    dnaLength = len(dna)
    return random.sample(range(dnaLength-1), num)


def mutateDNA(dna="", num=0, seed="gatc", mutateIndexes=[]):
    if num == 0:
        return dna
    if len(mutateIndexes) == 0:
        mutateIndexes = randomDNAIndexes(dna, num)
    dnaList = list(dna)
    seed2List = list(seed)
    for index in mutateIndexes:
        base = list(seed2List)
        base.remove(dnaList[index])
        dnaList[index] = random.choice(base)
    return "".join(dnaList)


class DNAFactory(object):
    
    def __init__(self, length=0, seed="gatc"):
        self._seed = seed
        self._length = length
        self._dna = ""
        self._mutateIndexes = []
        return None
    
    def createDNA(self):
        self._setDNA(createRandomDNA(self.getLength(), self.getSeed()))
        return self
    
    def mutateDNA(self, num=0, mutateIndexes=[]):
        if len(mutateIndexes) == 0:
            mutateIndexes = randomDNAIndexes(self.getDNA(), num)
        self._setDNA(mutateDNA(self.getDNA(), num, self.getSeed(), mutateIndexes))
        self._setMutateIndexes(self.getMutateIndexes() + mutateIndexes)
        return self
    
    def _setDNA(self, dna):
        self._dna = dna
        return self
    
    def _setSeed(self, seed):
        self._seed = seed
        return self
    
    def _setLength(self, length):
        self._length = length
        return self
    
    def _setMutateIndexes(self, mutateIndexes):
        self._mutateIndexes = mutateIndexes
        self.getMutateIndexes().sort()
        return self
    
    
    def getRead(self, length=0):
        return createRead(self.getDNA(), length)
    
    def getReadList(self, length=0, num=0):
        return createReadList(self.getDNA(), length, num)
    
    def getDNA(self):
        return self._dna
    
    def getLength(self):
        return self._length
    
    def getSeed(self):
        return self._seed
    
    def getMutateIndexes(self):
        return self._mutateIndexes
    
    
    
class RefFactory(DNAFactory):
    
    def __init__(self, length=0, seed="gatc"):
        super(RefFactory, self).__init__(length, seed)
        self.createDNA()
        return None
    
class DonorFactory(DNAFactory):
    
    def __init__(self, reference, mutateNum=0):
        self._reference = reference
        super(DonorFactory, self).__init__(self.getReference().getLength(), self.getReference().getSeed())
        self._setDNA(self.getReference().getDNA())
        self.mutateDNA(mutateNum)
        return None
    
    def _setReference(self, reference):
        self._reference = reference
        return self
    
    def getReference(self):
        return self._reference
    
class CancerFactory(DNAFactory):
    
    def __init__(self, donor, mutateNum=0):
        self._donor = donor
        super(CancerFactory, self).__init__(self.getDonor().getLength(), self.getDonor().getSeed())
        self._setDNA(self.getDonor().getDNA())
        self.mutateDNA(mutateNum)
        return None
    
    def mutateDNA(self, num=0, mutateIndexes=[]):
        if len(mutateIndexes) == 0:
            mutateIndexes = randomDNAIndexes(self.getDNA(), num)
        # excluding mutations already in donor
        # inefficient
        while True:
            intersect = [val for val in mutateIndexes if val in self.getDonor().getMutateIndexes()]
            if len(intersect) > 0:
                mutateIndexes = randomDNAIndexes(self.getDNA(), num)
            else:
                break
        super(CancerFactory, self).mutateDNA(num, mutateIndexes)
        return self
    
    def _setDonor(self, donor):
        self._donor = donor
        return self
    
    def getDonor(self):
        return self._donor




