function getObjectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
 

function parseHashBangArgs(aURL) {
	aURL = aURL || window.location.href;

	var vars = {};
	var hashes = aURL.slice(aURL.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		var hash = hashes[i].split('=');
		if (hash.length > 1) {
			vars[hash[0]] = hash[1];
		} else {
			;//vars[hash[0]] = null;
		}
	}
	return vars;
}

$(document).ready(
		function() {

			/*
			 * 
			var urlkey = window.location.pathname.substring(3);
			vars = parseHashBangArgs();
			console.log(vars);
 
			var originalsrc = document.getElementById("communityexpress").src;

			var newsrc = window.location.origin;
			var friendlyURL = vars["friendlyURL"];
			delete vars["friendlyURL"];

			newsrc = newsrc + "/" + friendlyURL;
			console.log(newsrc);

			var isFirst = true;
			for ( var property in vars) {
				if (vars.hasOwnProperty(property)) {
					var delimiter;
					if (isFirst === true) {
						delimiter = "?";
						isFirst = false;
					} else {
						delimiter = "&";
					}
					newsrc = newsrc + delimiter + property + "="
							+ vars[property];

				}
			}
			newsrc = newsrc + "&desktopiframe=true";
			console.log(newsrc);

			var newsrc = window.location.origin + window.location.search
					+ "&desktopiframe=true";
            */
			urlparams = parseHashBangArgs();
			console.log(urlparams);
			var newsrc;
			//if(getObjectSize(urlparams)===1) 
			if(jQuery.isEmptyObject(urlparams))
			  newsrc = window.location.href+"?desktopiframe=true";
			else
		      newsrc = window.location.href+"&desktopiframe=true";
			
			document.getElementById('communityexpress').src = newsrc;

		});