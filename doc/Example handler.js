/*
	THIS IS A REFERENCE FILE FOR ADDING FURTHER MEDIATHEK-HANDLERS BESIDE THE ZDFHANDLER
	THE HANDLER SHOULD BE LOCATED IN lib/MediathekHandler-DIRECTORY.	

	Each handler need to be added to the MediathekCore-instance at initialization
	
	Also each handler needs to have an icon in the data/mediathekIcons-directory which can be
	shown as part of the widgets content (beside the name of the mediathek, or being more precise the name of the channel).
	The icon therefore has to be named like this: name is the result of a this.getNameOfChannel()-call
	name.png
*/

exports.ZDFHandler = ZDFHandler;

function ZDFHandler() {
	//Simply returns the name of the channel (might be used to concatenate the path of a icon; e. g.: data/'ZDF'.png)
	this.getNameOfChannel = function () {
		return "ZDF";
	};
	
	//Returns the URL of the logo/icon of this mediathek 
	this.getLogoURL = function () {
		return "URL TO THE LOGO OF THIS CHANNEL (APPROX. 150x150)";
	};
	
	//Returns the URL of the landing page of the according mediathek
	this.getHomepage = function () {
		
	};
	
	//A URL is given to this method and it has to decide whether this object is the right handler for this url/mediathek
	this.isHandlerForURL = function (sURL) {
		
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
	this.getVideoFileURLs = function () {
		
	};
};
