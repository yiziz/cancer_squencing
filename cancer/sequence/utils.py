
def str2dict(s):
    #sDict = {}
    sDict = {"a":0, "g":0, "t":0, "c":0} # special for dna
    for char in s:
        #try:
        #    sDict[char] +=1
        #except:
        #    sDict[char] =1
        #if char in sDict.keys():
        #    sDict[char] +=1
        #else:
        #    sDict[char] =1
        
        sDict[char] +=1 # special for dna
    return sDict

def maxSim(d1, d2, padding=0):
    # d1 == target
    # d2 == dna
    # assume that's the same for both dicts
    length = sum(d1.values())
    matches = 0
    #a = 0
    #g = 0
    #c = 0
    #t = 0
    #try:
    #    a += min(d1["a"], d2["a"])
    #except:
    #    a = 0
    #try:
    #    g += min(d1["g"], d2["g"])
    #except:
    #    g = 0
    #try:
    #    c += min(d1["c"], d2["c"])
    #except:
    #    c = 0
    #try:
    #    t += min(d1["t"], d2["t"])
    #except:
    #    t = 0
    for letter in set(d1.keys() + d2.keys()):
        matches += min(d1.get(letter, 0), d2.get(letter, 0))
    #matches = matches + a + g + c + t
    matches += padding
    return matches / float(length)


def convertDNADict(d):
    dnaDict = {"a": 0, "g": 0, "t": 0, "c": 0}   
    for key, value in d.items():
        dnaDict[key] = value
    return dnaDict

def genDict(d, steps):
    if steps == 0:
        return [d]
    dList = []
    for key, value in d.items():
        if value > 0:
            temp = dict(d)
            temp[key] = value -1
            dList += genDict(temp, steps-1)
    return dList
    
    

def diffIndexes(str1, str2, offset=0):
    index = [0]
    indexes = []
    def incrIndex():
        index[0]+=1
        return
    def retIndex():
        return index[0] +offset
    for a,b in zip(str1,str2):
        if a != b:
            indexes.append(retIndex())
        incrIndex()
    return indexes

def diffRatio(str1, str2, offset=0):
    indexes = diffIndexes(str1, str2, offset)
    return {"ratio": float(len(str1)-len(indexes))/len(str1), "indexes": indexes}

def diffRatio2(str1, str2):
    return float(sum([a==b for a,b in zip(str1,str2)]))/len(str1)