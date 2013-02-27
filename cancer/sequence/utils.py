


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