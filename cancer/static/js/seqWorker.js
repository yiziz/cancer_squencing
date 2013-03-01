importScripts('/static/js/webSequencer.js')


var seq = null;
var dnaPackage = null;
var start = null;
var time = null;

function sendResults(){
	var algo = seq.getAlgo();
	results = {
		"_frequency": algo.getFrequency(),
		"_skippedIndexes": algo.getSkippedIndexes(),
		"_dnaSegments": algo.getDNASegments(),
		"duration": time,
		
	}
	self.postMessage({"results": results});
	return
}

self.addEventListener("message", function(e){
	var data = e.data;
	switch(data.cmd) {
		case "processDNA":
			dnaPackage = data.dnaPackage;
			seq = new Sequencer(dnaPackage["dna"], dnaPackage["startIndex"]);
			break;
		case "run":
			start = new Date();
			seq.getAlgo().matchTargetList(dnaPackage["readList"]);
			time = (new Date() -start)/1000;
			sendResults();
			break;
		case "sendFreq":
			self.postMessage({"_frequency": seq.getAlgo().getFrequency()});
			break;
		case "reset":
			seq.getAlgo().reset();
		default:
			break;
	}
});
