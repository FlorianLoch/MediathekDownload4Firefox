exports.MediathekCore = MediathekCore; //Needed for the add-on API

var data = require("sdk/self").data;
var Request = require("sdk/request").Request;

function MediathekCore () {
	var arHandler = new Array();
	var sCurrentURL;
	var oCurrentHandler;
	
	this.addMediathekHandler = function (oHandler) {
		//Add reference to itself
		oHandler._parent = this;
		
		arHandler.push(oHandler);
	};
	
	//Return information about this specific mediathek; if this URL doesn't match any of the handlers, "null" is returned.
	//This method also sets the currentHandler, so it has to be the starting point for each and every approach
	//The information is returned using the following syntax:
	/*
		{
			name: "Name",
			hp: "URL of homepage",
			logo: "URL of logo",
			icon: "URL of icon"
		}
	*/
	this.getMediathekInfo = function (sURL) {
		var oHandler = getHandlerForURL(sURL);
		
		if (!oHandler) {
			return null;
		}
		
		var res = {};
		res.name = oHandler.getNameOfChannel();
		res.hp = oHandler.getHomepage();
		res.logo = oHandler.getLogoURL();
		res.icon = data.url("mediathekIcons/" + oHandler.getNameOfChannel() + ".png");
		
		oCurrentHandler = oHandler;
		sCurrentURL = sURL;
		
		return res;
	};
	
	//For the syntax of the returned object see the according comment in "doc/Example handler.js" because
	//this method is actually just a delegating/forwarding method
	this.getVideoFileURLs = function (fnCallback) {
		return oCurrentHandler.getVideoFileURLs(sCurrentURL, fnCallback);
	};
	
	this.getFileSizes = function (oVideoURLs, fnCallback) {
		console.log(oVideoURLs);

		function requestSize(iCounter) {
			if (iCounter < oVideoURLs.length) {
				Request({
				  url: oVideoURLs[iCounter].url,
				  onComplete: function (response) {	
				  		if (response.status == 200) {
					  		oVideoURLs[iCounter].exists = true;				  			
					  		oVideoURLs[iCounter].fs = response.headers["Content-Length"];
					  		console.log("Size: " + response.headers["Content-Length"]);
					  	}
					  	else {
					  		//Not found, so this URL might not exist
					  		oVideoURLs[iCounter].exists = false;
					  		console.log("URL seems not to exist.");
					  	}

					  	requestSize(iCounter + 1);
				  }
				}).head();
			}
			else {
				console.log(oVideoURLs);
				
				fnCallback(oVideoURLs);
			}
		}
		
		requestSize(0);
	};
	
	this.listMediatheken = function () {
		var arMediatheken = new Array();
		for (var i = 0; i < arHandler.length; i++) {
			arMediatheken.push({
				name: arHandler[i].getNameOfChannel(),
				url: arHandler[i].getHomepage()	
			});
		}
		
		return arMediatheken;
	};
	
	function getHandlerForURL (sURL) {
		
		for (var i = 0; i < arHandler.length; i++) {
			var oHandler = arHandler[i];
			
			if (oHandler.isHandlerForURL(sURL)) {
				return oHandler;
			}
		}
		
		return null;
	}
};
