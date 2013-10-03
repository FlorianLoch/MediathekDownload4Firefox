exports.MediathekCore = MediathekCore; //Needed for the add-on API

function MediathekCore () {
	var arHandler = new Array();
	var sCurrentURL;
	var oCurrentHandler;
	
	this.addMediathekHandler = function (oHandler) {
		arHandler.push(oHandler);
	};
	
	//Return information about this specific mediathek; if this URL doesn't match any of the handlers, "null" is returned.
	//This method also sets the currentHandler, so it has to be the starting point for each and every approach
	//The information is returned using the following syntax:
	/*
		{
			name: "Name",
			hp: "URL of homepage",
			logo: "URL of logo"
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
		
		oCurrentHandler = oHandler;
		sCurrentURL = sURL;
		
		return res;
	};
	
	//For the syntax of the returned object see the according comment in "doc/Example handler.js" because
	//this method is actually just a delegating/forwarding method
	this.getVideoFileURLs = function (fnCallback) {
		return oCurrentHandler.getVideoFileURLs(sCurrentURL);
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
