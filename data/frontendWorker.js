self.port.on("showLoading", function (oMediathek) {
	setLayer("#loadingLayer");
});

self.port.on("showNoMediathek", function (oMediathek) {
	setLayer("#noMediathekLayer");
});

self.port.on("showURLs", function (oVideoURLs) {
	var node = $("#selectionLayer");
	node.html("");
	
	if (oVideoURLs == null) {
		node.html("Beim Finden der Video-Dateien ist leider ein Fehler aufgetreten.")
		return;
	}
	
	for (var i = 0; i < oVideoURLs.length; i++) {
		var btn = $("<button class='btn btn-primary btn-download'>" + oVideoURLs[i].desc + " (" + round(oVideoURLs[i].fs / 1024 / 1024) + " mb)</button>");

		//This (complex) ways is needed because otherwise the data would just be 
		//referenced, not copied - this would result in problems because of iterating		
		(function (oURL) {
			btn.click(function () {
					self.port.emit("URLSelected", {url: oURL.url, name: oURL.desc});	
			});
		})(oVideoURLs[i]);
		
		node.append(btn);
	}
		
	setLayer("#selectionLayer");
});

function setLayer (sLayerId) {
	$("div").hide();
	$(sLayerId).show();	
}

function round(iVal) {
	return Math.round(iVal * 100) / 100;	
}
