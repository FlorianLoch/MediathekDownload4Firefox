exports.ZDFHandler = ZDFHandler;

var Request = require("sdk/request").Request;

function ZDFHandler() {
	//Simply returns the name of the channel
	this.getNameOfChannel = function () {
		return "ZDF";
	};
	
	//Returns the URL of the logo/icon of this mediathek 
	this.getLogoURL = function () {
		return "http://upload.wikimedia.org/wikipedia/commons/thumb/0/02/ZDF.svg/200px-ZDF.svg.png";
	};	
	
	//Returns the URL of the landing page of the according mediathek
	this.getHomepage = function () {
		return "http://www.zdf.de/ZDFmediathek/hauptnavigation/startseite?flash=off";
	};
	
	//A URL is given to this method and it has to decide whether this object is the right handler for this url/mediathek
	this.isHandlerForURL = function (sURL) {
		if (sURL.search(".*http://www.zdf.de/ZDFmediathek/beitrag/video/.*flash=off") > -1) {
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
		var sAndroidUA = "Android 2.2";
		
		Request({
		  url: sURL,
		  headers: {"User-Agent": sAndroidUA},
		  onComplete: function (response) {
		  	  var src = response.text;
		  	  
		  	  //Parse the page for the URLs
		  	  var prefixName = "<h1 class=\"beitragHeadline\">";
		  	  var prefixHigh = "<li>DSL 1000 <a href=\"";
		  	  var prefixVeryHigh = "<li>DSL 2000 <a href=\"";
		  	  
		  	  var name = findString(src, prefixName, 0, "<");
		  	  var high = findString(src, prefixHigh, name.offset, "\"");
		  	  var veryHigh = findString(src, prefixVeryHigh, high.offset, "\"");
		  	  
		  	  var res = new Array();
		  	  res[0] = {};
		  	  res[0].desc = "Hohe Qualität (DSL 1000)";
		  	  res[0].fs = "unbekannt";
		  	  res[0].url = high.str;
		  	  res[0].name = name.str;
		  	  res[1] = {};
		  	  res[1].desc = "Sehr hohe Qualität (DSL 2000)";
		  	  res[1].fs = "unbekannt";
		  	  res[1].url = veryHigh.str;		
		  	  res[1].name = name.str;
		  	  
		  	  console.log(name.str);
		  	  
		  	  //Give the result back via the callback-function
		  	  fnCallback(res);
		  }
		}).get();
	};
	
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
