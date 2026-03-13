var form = document.getElementById('log');
var login = document.getElementById('login');
var paswd = document.getElementById('paswd');
var cout = document.getElementById('out'); 

form.onsubmit = function(e) {
	e.preventDefault();

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "127.0.0.1/api/login");
	hash = getHash(paswd.value);
	var object = {
		userName: login.value,
		passHash: hash
	}

	xhr.onreadystatechange = function () {
		if(xhr.readyState == 4){
			switch(xhr.responseText){
				case "Logined":
					setCookie("login", login.value);
					location.href = "http://127.0.0.1/messenger/";
					break;
				case "Not user":
					cout.innerHTML = "No user found with this login";
					break;
				case "Wrong password":
					cout.innerHTML = "Password is incorect. Retry";
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