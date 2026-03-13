var form = document.getElementById('reg');
var login = document.getElementById('login');
var paswd = document.getElementById('paswd');
var cout = document.getElementById('out'); 

form.onsubmit = function(e) {
	e.preventDefault();

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "127.0.0.1/api/register");
	hash = getHash(paswd.value);
	var object = {
		userName: login.value,
		passHash: hash
	}

	xhr.onreadystatechange = function () {
		if(xhr.readyState == 4){
			switch(xhr.responseText){
				case "Registered":
					location.href = "http://127.0.0.1/relog/log.html";
					break;
				case "User exists":
					cout.innerHTML = "User ound with this login. Try Log in";
					break;
				case "Not name":
					cout.innerHTML = "Write a login";
					break;
				case "Not password":
					cout.innerHTML = "Write a password";
					break;
			}
		}
	}

	xhr.send(JSON.stringify(object));
}

function getHash(s) {
	var o = 0;
	for(var i = 0; i < s.length; ++i){
		o = (o << 5) - o + s.charCodeAt(i)
	}
	return o;
}