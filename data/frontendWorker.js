self.port.on("showLoading", function (oMediathek) {
	$("div").hide();
	$("#selectionLayer").html("");
	
	$("#loadingLayer").show();
});

self.port.on("showNoMediathek", function (oMediathek) {
	setLayer("#noMediathekLayer");
});

self.port.on("showURLs", function (oVideoURLs) {
	var node = $("#selectionLayer");
	node.html("");
	
	if (oVideoURLs == null || oVideoURLs.length == 0) {
		var text = "";
		
		if (oVideoURLs == null) {
			text += "Beim Suchen der Video-Dateien ist leider ein Fehler aufgetreten.";
		}
		else {
			text += "Für diese Sendung konnten keine herunterladbaren Videos gefunden werden.";	
		}
		
		text += "<br>Das tut uns Leid!<br><img id='sadPingu' src='sad_pinguin.svg'>";
		
		node.html(text);
		setLayer("#selectionLayer");

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
	$("div:not(" + sLayerId + ")").fadeOut({
			duration: 400,
			complete: function() {
				setTimeout(function() {
						$(sLayerId).delay(300).fadeIn({
								duration: 400
						}, 10000);
				});
			}
	});
}

function round(iVal) {
	return Math.round(iVal * 100) / 100;	
}
