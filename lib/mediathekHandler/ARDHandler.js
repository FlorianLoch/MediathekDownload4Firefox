/*

	The pattern for downloading videos from ARD-Mediathek is the following: 
	1: Take the given url, e. g.: http://www.ardmediathek.de/puls/startrampe/feathery-slow-version-startrampe-live-session?documentId=17262134
	2: Extract the end part, in this case "feathery-slow-version-startrampe-live-session?documentId=17262134".
	3: Replace "documentId" by "docId"
	4: Append this string to "m.ardmediathek.de", e. g.: m.ardmediathek.de/feathery-slow-version-startrampe-live-session?docId=17262134
	5: Now ARD delivers you the mobile page for this video - here you can extract around 4 video URLs.
	
	Supported pages should match the following pattern: http://www.ardmediathek.de/.*?documentId=[0-9]*

*/
exports.ARDHandler = ARDHandler;

var Request = require("sdk/request").Request;

function ARDHandler() {
	//Simply returns the name of the channel
	this.getNameOfChannel = function () {
		return "ARD";
	};
	
	//Returns the URL of the logo/icon of this mediathek 
	this.getLogoURL = function () {
		return "";
	};	
	
	//Returns the URL of the landing page of the according mediathek
	this.getHomepage = function () {
		return "http://www.ardmediathek.de/";
	};
	
	//A URL is given to this method and it has to decide whether this object is the right handler for this url/mediathek
	this.isHandlerForURL = function (sURL) {
		if (sURL.search("http://www.ardmediathek.de/.*?documentId=[0-9]*") > -1) {
			return true;
		}
		else {
			return false;
		}
	};
	
	//Result needs to have this JSON-syntax:
	/*
		[
			{
				desc: "Low Quality",
				fs: "Filesize in Bytes",
				url: "http://anywhere...",
				name: "Name"
			},
			{
				desc: "High Quality",
				fs: "see above",
				url: "http://idontknowwherebutishastobesomewhere",
				name: "Name"
			}
		]
	*/
	this.getVideoFileURLs = function (sURL, fnCallback) {
		sURL = buildURLOfMobileSite(sURL);
		
		if (sURL == null) {
			fnCallback(null);
			return;
		}
		
		var self = this;
		
console.log("Started searching!");
console.log(sURL);

		Request({
		  url: sURL,
		  onComplete: function (response) {
console.log("Found page");

		  	  var src = response.text;
		  	  
		  	  //Parse the page for the URLs
		  	  var prefixName = "<h1 class=\"clipTitel\">";
		  	  
		  	  var arURLs = src.match(/http:\/\/.*\.mp4/g);
		  	  
		  	  var res = new Array();
		  	  
		  	  if (arURLs == undefined) {
		  	  	  fnCallback(res); //With the empty array the frontendWorker knows, that no videos have been found
		  	  	  console.log("No URLs found!");
		  	  	  return;
		  	  }
		  	  
		  	  var name = findString(src, prefixName, 0, "<");
		  	  
		  	  if (arURLs.length >= 3) {
		  	  //if (arURLs[3] == undefined) {
				  res[0] = {};
				  res[0].desc = "Niedrige Qualität";
				  res[0].fs = "";
				  res[0].url = arURLs[arURLs.length-1];
				  res[0].name = name.str;
			  //}
			  //if (arURLs[0] == undefined) {
				  res[1] = {};
				  res[1].desc = "Mittlere Qualität";
				  res[1].fs = "";
				  res[1].url = arURLs[0];		
				  res[1].name = name.str;
		  	  //}	  	  
		  	  //if (arURLs[2] == undefined) {
				  res[2] = {};
				  res[2].desc = "Hohe Qualität";
				  res[2].fs = "";
				  res[2].url = arURLs[arURLs.length-2];		
				  res[2].name = name.str;		
			  //}		  	  	  
		  	  }
			  
		  	  console.log("Finished Searching!");

		  	  //Give the result back via the callback-function
		  	  self._parent.getFileSizes(res, fnCallback);
		  }
		}).get();
	};
	
	function buildURLOfMobileSite(sURL) {
		//For description of the following lines see comment above
		try {
			var tmp = sURL.substr(indexOfCharReverse(sURL, "/") + 1);
			tmp = tmp.replace("documentId", "docId");
			
			var mobURL = "http://m.ardmediathek.de/" + tmp;
			
			return mobURL;
		} catch (e) {
			console.log("Could not build URL of mobile site of ARD-Mediathek: " + e);
			return null;
		}
	}
	
	function indexOfCharReverse(sString, cChar) {
		for (var i = sString.length - 1; i >= 0; i--) {
			if (sString.charAt(i) == cChar) {
				return i;
			}
		}	
		
		return -1;
	}
	
	function findString(sHTML, sPrefix, iOffset, cEndChar) {
		var posPrefix = sHTML.indexOf(sPrefix, iOffset);
		
		if (posPrefix == -1) {
			var res = {};
			res.str = null;
			res.offset = 0;
			
			return res;
		}
		
		var str = "";
		
		for (var i = posPrefix + sPrefix.length; i < sHTML.length; i++) {
			if (sHTML.charAt(i) == cEndChar) {
				break;
			}
			
			str = str + sHTML.charAt(i);
		}
		
		var res = {};
		res.str = str;
		res.offset = i;
		
		return res;
	}
};
