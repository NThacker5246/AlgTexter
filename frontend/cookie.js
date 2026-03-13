function setCookie(name, value) {
	document.cookie = name + "=" + value + "; max-age=1000000000; path=/";
}

function setCookie(name, value, date) {
	document.cookie = name + "=" + value + "; max-age=" + date * 1000 + "; path=/";
}

function getCookie(name) {
	var cooks = document.cookie.split("; ");
	for (var i = 0; i < cooks.length; i++) {
		var kv = cooks[i].split("=");
		if(kv[0] == name) return kv[1];
	}
}

function removeCookie(name) {
	document.cookie = name + "=; expires=100; path=/";
}