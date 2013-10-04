self.port.on("showLoading", function (oMediathek) {
	setLayer("#loadingLayer");
});

self.port.on("showNoMediathek", function (oMediathek) {
	setLayer("#noMediathekLayer");
});

self.port.on("showURLs", function (oVideoURLs) {
	var node = $("#selectionLayer");
	node.html("");
	
	for (var i = 0; i < oVideoURLs.length; i++) {
		var btn = $("<button>" + oVideoURLs[i].desc + "</button>");

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

function download() {
	alert("Hallo");
};
