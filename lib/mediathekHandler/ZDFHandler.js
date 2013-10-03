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
		return true;
	};
	
	//Result needs to have this JSON-syntax:
	/*
	{
		[
			{
				desc: "Low Quality
				fs: "Filesize in Bytes
				url: "http://anywhere..."
			},
			{
				desc: "High Quality
				fs: "see above
				url: "http://idontknowwherebutishastobesomewhere"
			}
		]
	}
	*/
	this.getVideoFileURLs = function (sURL, fnCallback) {
		var sAndroidUA = "Android 2.2";
		
		Request({
		  url: sURL,
		  headers: {"User-Agent": sAndroidUA},
		  onComplete: function (response) {
		  	  //Parsen
		  	  
		  	  //rückgabe
		  	  fnCallback.call(oVideoURLs);
		  }
		}).get();
	};
};
