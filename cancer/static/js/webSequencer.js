var jsAlgo = function(seq, ratio) {
		
	ratio = typeof ratio == "undefined" ? 0.9 : ratio;
	
	this._checkRatio = ratio;
	this._frequency = {}
	this._seq = seq;
	
	this.setSeq = function(seq){
		this._seq = seq;
		return this;
	}
	
	this.getCheckRatio = function(){
		return this._checkRatio;
	}
	
	this.getFrequency = function(){
		return this._frequency;
	}
	
	this.getSeq = function(){
		return this._seq;
	}
	
	this.compareTarget = function(target, dna, indexStart){
		target = typeof target == "undefined" ? "" : target;
		indexStart = typeof indexStart == "undefined" ? 0 : indexStart;
        var targetLength = target.length;
        if (targetLength < 1) {
            return this;
        }
        var tempDNA = dna.substr(indexStart);
        var indexOffset = indexStart;
        while (tempDNA.length >= targetLength){
            var diff = this.getSeq().utils.diffRatio(target, tempDNA.substr(0, targetLength), indexOffset);
            if (diff["ratio"] >= this.getCheckRatio()){
                for(var i=0; i<diff["indexes"].length; i++){
                    if (typeof this.getFrequency()[diff["indexes"][i]] != "undefined"){
                    	this.getFrequency()[diff["indexes"][i]] += 1;
                    } else {
                    	this.getFrequency()[diff["indexes"][i]] = 1;
                    }
                }
            }
            tempDNA = tempDNA.substr(1);
            indexOffset +=1;
        }
        return this;
	}
    
    this.compareTargetList = function(targetList, dna, indexStart) {
    	indexStart = typeof indexStart == "undefined" ? 0 : indexStart;
    	targetList = typeof targetList == "undefined" ? [] : targetList;
        if (targetList.length < 1){
            return this;
        }
        for (var i=0; i<targetList.length; i++){
            var targetIndexes = this.compareTarget(targetList[i], dna, indexStart);
        }
        return this;
    }
    
    this.matchTargetList = function(targetList){
    	targetList = typeof targetList == "undefined" ? [] : targetList;
    	var dnaDict = this.getSeq().getDNADict();
    	for (var key in dnaDict){
    		this.compareTargetList(targetList, dnaDict[key], key);
    	}
    	return this;
    }
    
    
}



var jsWildAlgo = function(){
}

jsWildAlgo.prototype = new jsAlgo()




var Sequencer = function(dnaDict) {
	
	this._dnaDict = dnaDict; // in this case is an array of strings
	var seq = this;
	
	this.getDNADict = function(){
		return this._dnaDict;
	}
	
	this.utils = {
		diffIndexes: function(str1, str2, offset){
			offset = typeof offset == "undefined" ? 0 : offset;
			var indexes = [];
			for(var i=0; i<str1.length; i++){
				if (str1[i] != str2[i]) {
					indexes.push(i +offset);
				}
			}
			return indexes;
		},
		diffRatio: function(str1, str2, offset){
			offset = typeof offset == "undefined" ? 0 : offset;
			var indexes = this.diffIndexes(str1, str2, offset);
			return {"ratio": (str1.length-indexes.length)/str1.length, "indexes": indexes}
		}
	}
	
	
	this._algo = null;
	this.setAlgo = function(algo){
		this._algo = algo;
		algo.setSeq(this);
	}
	
	
	this.setAlgo(new jsAlgo(this, 0.9));
	
	
	
	
}