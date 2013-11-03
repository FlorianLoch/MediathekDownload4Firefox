//Searches for all a's that are in class .crypted_mail and decrypts them.
//Points has to be replaced by "%46" and "@" by "%6584" (ASCII codes for "A" and "T")
//Florian Loch, 03.11.2013
//Needs jQuery to work
$(document).ready(function () {
	decryptMailAdresses();
});

function decryptMailAdresses() {
	$(".crypted_mail").each(function (iIndx) {
		var href = $(this).attr("href");
		href = href.replace(/%46/g, ".");
		href = href.replace(/%6584/, "@");
		href = "mailto:" + href;
		$(this).attr("href", href);

		console.log("Attr: " + href);
	});
}