var widgets = require("sdk/widget");
var tabs = require('sdk/tabs');
var panels = require("sdk/panel");
var data = require("sdk/self").data;
var mediathekCores = require("./MediathekCore.js").MediathekCore;
var zdfHandlers = require("./mediathekHandler/ZDFHandler.js").ZDFHandler;

var core = new mediathekCores();
var sCurrentURL; //gets set and updated by onActivate-Callback of tabs

var oSelectPanel;
var oWidget

(function init() {
	//Add all mediathek-handlers to the core
	core.addMediathekHandler(new zdfHandlers());			
	
	oSelectPanel = panels.Panel({
		width: 300,
		height: 200,
		contentURL: data.url("frontend.html"),
		contentScriptFile: data.url("frontendWorker.js")
	});
	
	oWidget = widgets.Widget({
		id: "mozilla-link",
		label: "Mozilla website",
		contentURL: "http://www.mozilla.org/favicon.ico",
		panel: oSelectPanel
	});
	
	oSelectPanel.on("show", function () {
		addonStarted();
	});
	
	oSelectPanel.port.on("URLSelected", function (sURL) {
		downloadVideo(sURL);
	});
	
	tabs.on("ready", function () {
		sCurrentURL = tabs.activeTab.url;
	});
	
	console.log("Started");
})();

function addonStarted () {
	var oMediathek = core.getMediathekInfo(sCurrentURL);
	
	//Show loading state until the page has been parsed for the video files	
	oSelectPanel.port.emit("showLoading", oMediathek);		
	
	//Start the request-and-parsing-process - when finished the callback function get called
	core.getVideoFileURLs(function (oVideoURLs) {
		//Inform the panel that the URLs have been found or not (but the request and parsing finished) and
		//thereby enable the user to select a video to download
		oSelectPanel.port.emit("showURLs", oVideoURLs);		
		
		
	});
}

function downloadVideo (sURL) {
	
}