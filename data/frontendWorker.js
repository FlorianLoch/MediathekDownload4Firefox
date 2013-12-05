//I know this code for DOM-generating might not by great (some things could be refactored and moved to functions etc.),
//but before putting time (which I do not have at the moment due to studying) into this I would like to publish this "dirty" but perfectly working version.
//I will clean it up a in following release.

self.port.on("showLoading", function (oMediathek) {
	$("div").hide();
	$("#selectionLayer").empty();
	
	$("#loadingLayer").show();
});

self.port.on("showNoMediathek", function (arMediatheken) {
	var noMedLay = document.getElementById("noMediathekLayer");
	for (var i = 0; i < noMedLay.childNodes.length; i++) {
		noMedLay.removeChild(noMedLay.childNodes[i]);
	}
	noMedLay.appendChild(document.createTextNode("Diese Seite konnte leider keiner Mediathek zugeordnet werden"));
	noMedLay.appendChild(document.createElement("br"));
	var listDiv = document.createElement("div");
	listDiv.setAttribute("id", "mediathekenList");
	listDiv.appendChild(document.createTextNode("Folgende Mediatheken werden unterstützt:"));
	var listUl = document.createElement("ul");

	for (var i = 0; i < arMediatheken.length; i++) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		a.setAttribute("target", "_blank");
		a.setAttribute("href", escapeHTML(arMediatheken[i].url)); 
		a.appendChild(document.createTextNode(escapeHTML(arMediatheken[i].name)));
		li.appendChild(a);

		listUl.appendChild(li);
	}

	listDiv.appendChild(listUl);
	noMedLay.appendChild(listDiv);
		
	setLayer("#noMediathekLayer", 0);
});

self.port.on("showURLs", function (oVideoURLs) {
	var node = document.getElementById("selectionLayer");
	for (var i = 0; i < node.childNodes.length; i++) {
		node.removeChild(node.childNodes[i]);
	}
	
	if (oVideoURLs == null || oVideoURLs.length == 0) {
		var text = "";
		
		if (oVideoURLs == null) {
			text += "Beim Suchen der Video-Dateien ist leider ein Fehler aufgetreten.";
		}
		else {
			text += "Für diese Sendung konnten keine herunterladbaren Videos gefunden werden.";	
		}
		
		text += "<br>Das tut uns Leid!<br><img id='sadPingu' src='sad_pinguin.svg'>";
		
		node.innerHTML = text; //safe, because only predefined, constant string
		setLayer("#selectionLayer", 300);

		return;		
	}
	
	for (var i = 0; i < oVideoURLs.length; i++) {
		if (oVideoURLs[i].exists == true) {
			//var btn = $("<button class='btn btn-primary btn-download'>" + escapeHTML(oVideoURLs[i].desc) + " (" + round(escapeHTML(oVideoURLs[i].fs) / 1024 / 1024) + " mb)</button>");
			var btn = document.createElement("button");
			btn.setAttribute("class", "btn btn-primary btn-download");
			btn.appendChild(document.createTextNode(escapeHTML(oVideoURLs[i].desc) + " (" + round(escapeHTML(oVideoURLs[i].fs) / 1024 / 1024) + " mb)"));

			//This (complex) way is needed because otherwise the data would just be 
			//referenced, not copied - this would result in problems because of iterating		
			(function (oURL) {
				btn.addEventListener("click", function () {
						self.port.emit("URLSelected", {url: escapeHTML(oURL.url), name: escapeHTML(oURL.desc)});	
				}, false);
			})(oVideoURLs[i]);
			
			node.appendChild(btn);
		}
	}
		
	setLayer("#selectionLayer", 300);
});

function setLayer (sLayerId, duration) {
	$("body > div:not(" + sLayerId + ")").fadeOut({
			duration: duration,
			complete: function() {
				setTimeout(function() {
						$(sLayerId).delay(duration).fadeIn({
								duration: duration,
								done: function () {
									//self.port.emit("resizePanel", 330, $(sLayerId).height());
								}
						});
				});
			}
	});
}

function round(iVal) {
	return Math.round(iVal * 100) / 100;	
}

function escapeHTML(sStr) {
    return sStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}