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
		contentScriptFile: [
								data.url("frontendWorker.js"),
								data.url("jquery-1.10.2.min.js")
						]
	});
	
	oWidget = widgets.Widget({
		id: "mozilla-link",
		label: "Mozilla website",
		panel: oSelectPanel,
		width: 200,
		content: setWidgetContent(null, true) //Run this function in "return mode"
	});
	
	//Set the default content for the widget
	setWidgetContent(null);
	
	oSelectPanel.on("show", function () {
		addonStarted();
	});
	
	//Needs as parameter (oVideoInfo) a object like the following:
	// {url: "URL of video", name: "Name of Video"}
	oSelectPanel.port.on("URLSelected", function (oVideo) {
		console.log("EMIT RECEIVED");
		downloadVideo(oVideo.url);
	});
	
	tabs.on("ready", function () {
		urlChanged(tabs.activeTab.url);
	});
	
	tabs.on("activate", function () {
		urlChanged(tabs.activeTab.url);
	});	
	
	console.log("Started");
})();

function urlChanged (sURL) {
	sCurrentURL = sURL;
	console.log("URL-Changed: " + sURL);
	console.log("NEW URL: " + sCurrentURL);

	var oMediathekInfo = core.getMediathekInfo(sCurrentURL);

	setWidgetContent(oMediathekInfo);	
}

function addonStarted () { 
	var oMediathek = null;
	if (sCurrentURL) {
		oMediathek = core.getMediathekInfo(sCurrentURL);	
	}
	
	//If there is no handler for this url there is no data and if there is no data we should tell the user about this fact
	if (!oMediathek) {
		//List all the hp-URLs of all mediatheks
		// TODO
		
		oSelectPanel.port.emit("showNoMediathek", {});
		return;
	}
	
	//Show loading state until the page has been parsed for the video files	
	oSelectPanel.port.emit("showLoading", oMediathek);		
	
	//Start the request-and-parsing-process - when finished the callback function get called
	core.getVideoFileURLs(function (oVideoURLs) {
		//Inform the panel that the URLs have been found or not (but the request and parsing finished) and
		//thereby enable the user to select a video to download
		oSelectPanel.port.emit("showURLs", oVideoURLs);		
	});
}

function setWidgetContent (oMediathekInfo, bReturnMode) {
	//Set default 
	if (!oMediathekInfo) {
		oMediathekInfo = {};
		oMediathekInfo.name = "Keine Mediathek";
		oMediathekInfo.icon = data.url("mediathekIcons/default.png");
	}
	
	//Load the template and replace the placeholders with the values
	var tmpl = data.load("widgetContentTemplate.html");
	tmpl = tmpl.replace("$ICON_URL$", oMediathekInfo.icon);
	tmpl = tmpl.replace("$MEDIATHEK_NAME$", oMediathekInfo.name);
	
	if (!bReturnMode) {
		oWidget.content = tmpl;
	}
	else {
		return tmpl;
	}
}

function downloadVideo(sURL) {
	console.log("OPEN NEW TAB: " + sURL);
	tabs.open(sURL);	
}

function downloadVideo3 (sLocalFileName, sRemoteFileName) {
	const {Cc, Ci, Cu} = require("chrome");
	const {notify} = require("sdk/notifications");
	const {Widget} = require("sdk/widget");
	 
	const {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm", {});
	const {Services} = Cu.import("resource://gre/modules/Services.jsm", {});
	const {Task} = Cu.import("resource://gre/modules/Task.jsm", {});
	 
	function download() {
	  Task.spawn(function() {
		var options = {
		  source: sRemoteFileName,
		  target: "S:\\" + sLocalFileName + ".mp4",
		};
		// Firefox pre Aurora-25 did implement an "old" API version, which required
		// a different set of options.
		// See: http://mzl.la/1cwWZ2N
		if (Services.vc.compare(Services.appinfo.version, "25.0a") < 0) {
		  var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
		  file.initWithPath(options.target);
		  options = {
			source: {uri: Services.io.newURI(options.source, null, null)},
			target: {file: file},
			saver: {type: "copy"},
		  };
		}
	 
		var d = yield Downloads.createDownload(options);
		var res = d.whenSucceeded();
		// lets start the download ...
		yield d.start();
		// ... and wait for it to finish
		yield res;
	 
		notify({
		  title: "Test-Extension",
		  text: "Download finished",
		  onClick: function (data) {
			if ('showContainingDirectory' in d) {
			  d.showContainingDirectory();
			}
		  }
		});
	  }).then(null, function(ex) {
		Cu.reportError(ex);
		notify({
		  title: "Test-Extension",
		  text: "Error: " + ex
		});
	  });
	}
	
	download();
}

function downloadVideo2 (sLocalFileName, sRemoteFileName) {
    var saveToDirectory = 'S:\\';

    var chrome = require("chrome");

    var oIOService = chrome.Cc["@mozilla.org/network/io-service;1"].getService(chrome.Ci.nsIIOService)

    var oLocalFile = chrome.Cc["@mozilla.org/file/local;1"].createInstance(chrome.Ci.nsILocalFile);
    oLocalFile.initWithPath(saveToDirectory + sLocalFileName);

    var oDownloadObserver = {onDownloadComplete: function(nsIDownloader, nsresult, oFile) {console.log('download complete...')}};

    var oDownloader = chrome.Cc["@mozilla.org/network/downloader;1"].createInstance();
    oDownloader.QueryInterface(chrome.Ci.nsIDownloader);
    oDownloader.init(oDownloadObserver, oLocalFile);

    var oHttpChannel = oIOService.newChannel(sRemoteFileName, "", null);
    oHttpChannel.QueryInterface(chrome.Ci.nsIHttpChannel);
    oHttpChannel.asyncOpen(oDownloader, oLocalFile);  	
}