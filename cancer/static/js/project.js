/* Project specific Javascript goes here. */

var Sequencer = function() {
	this.utils = function() {
		this.diffIndexes = function(str1, str2, offset){
			offset = typeof offset == "undefined" ? 0 : offset;
			var indexes = [];
			for(var i=0; i<str1.length; i++){
				if (str1[i] != str2[i]) {
					indexes.push(i +offset);
				}
			}
			return indexes;
		}
		this.diffRatio = function(str1, str2, offset){
			offset = typeof offset == "undefined" ? 0 : offset;
			var indexes = this.diffIndexes(str1, str2, offset);
			return [(str1.length-indexes.length)/str1.length, indexes]
		}
	}
	this.utils = new this.utils();
}