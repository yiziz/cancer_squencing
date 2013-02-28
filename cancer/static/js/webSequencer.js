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
	
	this.matchTarget = function(target, indexStart){
		target = typeof target == "undefined" ? "" : target;
		indexStart = typeof indexStart == "undefined" ? 0 : indexStart;
        var targetLength = target.length;
        if (targetLength < 1) {
            return this;
        }
        var dna = this.getSeq().getDNA();
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
    
    this.matchTargetList = function(targetList, dna, indexStart) {
    	indexStart = typeof indexStart == "undefined" ? 0 : indexStart;
    	targetList = typeof targetList == "undefined" ? [] : targetList;
        if (targetList.length < 1){
            return this;
        }
        for (var i=0; i<targetList.length; i++){
            var targetIndexes = this.compareTarget(targetList[i], indexStart);
        }
        return this;
    }
    
    this.boo = function(){
    	alert("moo");
    }
    
    /*
    this.matchTargetList = function(targetList){
    	targetList = typeof targetList == "undefined" ? [] : targetList;
    	var dnaDict = this.getSeq().getDNADict();
    	for (var key in dnaDict){
    		this.compareTargetList(targetList, dnaDict[key], key);
    	}
    	return this;
    }*/
    
    
}



var jsWildAlgo = function(seq, ratio, wild){
	
	this.orig_matchTarget = this.matchTarget;
	this._wild = wild
    this._skippedIndexes = []
    this._dnaSegments = {}
	
	
	
}

jsWildAlgo.prototype = new jsAlgo();
jsWildAlgo.base = jsAlgo.prototype;




var Sequencer = function(dna, startIndex) {
	
	this._dna = dna; // in this case is an array of strings
	this._startIndex = startIndex;
	var seq = this;
	
	this._setDNA = function(dna){
		this._dna = dna;
	}
	
	this.getDNA = function(){
		return this._dna;
	}
	
	this.getStartIndex = function(){
		return this._startIndex;
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
		},
		str2dict: function(s){
			sDict = {"a":0, "g":0, "t":0, "c":0};
			for (var i=0; i<s.length; i++){
				sDict[s[i]] +=1;
			}
			return sDict;
		},
		maxSim: function(targetString, dnaDict, padding){
			// different inputs from python version
			padding = typeof padding == "undefined" ? 0 : padding;
			var letters = ["a", "g", "t", "c"];
			var tLength = targetString.length;
			var matches = 0;
			tDict = seq.utils.str2dict(targetString);
			for (var index in letters){
				matches += Math.min(tDict[letters[index]], dnaDict[letters[index]]);
			}
			matches += padding;
			return matches/tLength;
		},
	}
	
	
	this._algo = null;
	this.setAlgo = function(algo){
		this._algo = algo;
		algo.setSeq(this);
	}
	
	this.getAlgo = function(){
		return this._algo;
	}
	
	
	// this.setAlgo(new jsAlgo(this, 0.9));
	this.setAlgo(new jsWildAlgo(this, 0.9, 7));
	
	
	
	
}