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
	
	this.matchTarget = function(target, indexStart, dnaLength){
		target = typeof target == "undefined" ? "" : target;
		indexStart = typeof indexStart == "undefined" ? 0 : indexStart;
        var targetLength = target.length;
        if (targetLength < 1) {
            return this;
        }
        var dna = this.getSeq().getDNA();
        var tempDNA = dna.substr(indexStart, dnaLength);
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
            var targetIndexes = this.matchTarget(targetList[i], indexStart);
        }
        return this;
    }
    
    this.reset = function(){
    	this._frequency = {};
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
	this.orig_reset = this.reset;
	this._wild = wild;
    this._skippedIndexes = [];
    this._dnaSegments = {};
	
	this.getDNASegments = function(){
		return this._dnaSegments;
	}
	
	this.getWild = function(){
		return this._wild;
	}
	
	this.getSkippedIndexes = function(){
		return this._skippedIndexes;
	}
	
	this.getDNAList = function(target, indexStart, padding){
		// !!!! Only works with padding == 10 and targetLength == 30
		indexStart = typeof indexStart == "undefined" ? 0 : indexStart;
		padding = typeof padding == "undefined" ? 0 : padding;
		var dnaList = [];
		if(typeof this.getDNASegments()[indexStart] != "undefined"){
			dnaList = this.getDNASegments()[indexStart];
		} else {
			var str2dict = this.getSeq().utils.str2dict;
			var paddingStart = indexStart + padding;
			var dnaLength = target.length - padding;
			var dna = this.getSeq().getDNA().substr(paddingStart, dnaLength)
			//dnaDict = str2dict(dna);
			tempDNA = this.getSeq().getDNA().substr(indexStart, target.length);
            dnaList = [str2dict(tempDNA.substr(padding)),
                           str2dict(tempDNA.substr(0,padding)+tempDNA.substr(padding*2)), 
                           str2dict(tempDNA.substr(0, padding*2)),
                        ];
			this.getDNASegments()[indexStart] = dnaList;
		}
		return dnaList;
	}
	
	this.matchTarget = function(target, indexStart, dnaLength){
		// !!!! Only works with padding == 10 and targetLength == 30
		indexStart = typeof indexStart == "undefined" ? 0 : indexStart;
		var targetLength = target.length;
		var targetDict = this.getSeq().utils.str2dict(target);
		if(targetLength <1){
			return this;
		}
		var mutateWild = (1-this.getCheckRatio())*targetLength;
		var padding = parseInt(this.getWild()+mutateWild);
		var finished = false;
		var maxSim = this.getSeq().utils.maxSim;
		while(!finished){
			var dnaList = this.getDNAList(target, indexStart, padding);
			var indexEnd = indexStart+targetLength+padding-1;
			if(indexEnd >= this.getSeq().getDNA().length){
				indexEnd = this.getSeq().getDNA().length;
				finished = true;
			}
			//console.log(indexStart);
			if(maxSim(targetDict, dnaList[0], padding) >= 1 || 
					maxSim(targetDict, dnaList[1], padding) >= 1 || 
					maxSim(targetDict, dnaList[2], padding) >= 1
					){
				this.orig_matchTarget(target, indexStart, indexEnd-indexStart);
				
			} else {
				this.getSkippedIndexes().push(indexStart);
			}
			indexStart += padding;
		}
		return this;
	
	}
	
	this.reset = function(){
		this._skippedIndexes = [];
		this._dnaSegments = {};
	}
	
}

jsWildAlgo.prototype = new jsAlgo();
jsWildAlgo.base = jsAlgo.prototype;


var jsWAlgo = function(seq, ratio, wild){
	
	this.orig_matchTarget = this.matchTarget;
	this.orig_reset = this.reset;
	this._wild = wild;
    this._skippedIndexes = [];
    this._dnaSegments = {};
	
	this.getDNASegments = function(){
		return this._dnaSegments;
	}
	
	this.getWild = function(){
		return this._wild;
	}
	
	this.getSkippedIndexes = function(){
		return this._skippedIndexes;
	}
	
	this.getDNADict = function(target, indexStart, padding){
		indexStart = typeof indexStart == "undefined" ? 0 : indexStart;
		padding = typeof padding == "undefined" ? 0 : padding;
		var dnaDict = {};
		if(typeof this.getDNASegments()[indexStart] != "undefined"){
			dnaDict = this.getDNASegments()[indexStart];
		} else {
			var paddingStart = indexStart + padding;
			var dnaLength = target.length - padding;
			var dna = this.getSeq().getDNA().substr(paddingStart, dnaLength)
			dnaDict = this.getSeq().utils.str2dict(dna);
			this.getDNASegments()[indexStart] = dnaDict;
		}
		return dnaDict;
	}
	
	this.matchTarget = function(target, indexStart, dnaLength){
		indexStart = typeof indexStart == "undefined" ? 0 : indexStart;
		var targetLength = target.length;
		var targetDict = this.getSeq().utils.str2dict(target);
		if(targetLength <1){
			return this;
		}
		var mutateWild = (1-this.getCheckRatio())*targetLength;
		var padding = parseInt(this.getWild()+mutateWild);
		var finished = false;
		while(!finished){
			var dnaDict = this.getDNADict(target, indexStart, padding);
			var indexEnd = indexStart+targetLength+padding-1;
			if(indexEnd >= this.getSeq().getDNA().length){
				indexEnd = this.getSeq().getDNA().length;
				finished = true;
			}
			//console.log(indexStart);
			if(this.getSeq().utils.maxSim(targetDict, dnaDict, padding) >= 1){
				this.orig_matchTarget(target, indexStart, indexEnd-indexStart);
				
			} else {
				this.getSkippedIndexes().push(indexStart);
			}
			indexStart += padding;
		}
		return this;
	
	}
	
	this.reset = function(){
		this._skippedIndexes = [];
		this._dnaSegments = {};
	}
	
}

jsWAlgo.prototype = new jsAlgo();
jsWAlgo.base = jsAlgo.prototype;




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
		maxSim: function(tDict, dnaDict, padding){
			padding = typeof padding == "undefined" ? 0 : padding;
			var letters = ["a", "g", "t", "c"];
			var tLength = 0;
			var matches = 0;
			for (var index in letters){
				var tLetter = tDict[letters[index]];
				tLength += tLetter;
				matches += Math.min(tLetter, dnaDict[letters[index]]);
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





