var button = document.getElementById('send');
var area = document.getElementById('message');
var out = document.getElementById('answer');
var up = document.getElementById('up'), down = document.getElementById('down');
var createChat = document.getElementById('createchat');
var createServer = document.getElementById('createserver');

var counter = 0;
var chat = document.getElementById('chats');
var newchatname = document.getElementById('chatname');

var server = document.getElementById('servers');
var newservname = document.getElementById('servname');

up.addEventListener("click", () => {++counter;});
down.addEventListener("click", () => {--counter;});

button.addEventListener("click", function(e) {
	e.preventDefault();

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "127.0.0.1/api/send");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			console.log(xhr.responseText);
		}
	}

	var object = {
		message: area.value,
		loadprev: 0,
		chat: parseInt(chat.value),
		chatName: "",
		server: parseInt(server.value)
	};

	xhr.send(JSON.stringify(object));
});

createChat.addEventListener("click", function(e) {
	e.preventDefault();

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "127.0.0.1/api/addchat");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			console.log(xhr.responseText);
		}
	}

	var object = {
		message: "",
		loadprev: 0,
		chat: 0,
		chatName: newchatname.value,
		server: parseInt(server.value),
		serverName: ""
	};

	xhr.send(JSON.stringify(object));
});

createServer.addEventListener("click", function(e) {
	e.preventDefault();

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "127.0.0.1/api/addserver");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			console.log(xhr.responseText);
		}
	}

	var object = {
		message: "",
		loadprev: 0,
		chat: 0,
		chatName: "",
		server: 0,
		serverName: newservname.value
	};

	xhr.send(JSON.stringify(object));
});


function readText() {
	var xhr = new XMLHttpRequest();
	if(chat.value == "") return;
	xhr.open("POST", "127.0.0.1/api/read");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			out.innerHTML = xhr.responseText;
		}
	}
	var object = {
		message: "",
		loadprev: counter,
		chat: parseInt(chat.value),
		chatName: "",
		server: parseInt(server.value),
		serverName: ""
	};
	xhr.send(JSON.stringify(object));
}

function readChats() {
	var xhr = new XMLHttpRequest();
	if(server.value == "") return;
	xhr.open("POST", "127.0.0.1/api/getindexer");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200){
			var obj = JSON.parse(xhr.responseText);
			var temp = chat.value;
			chat.innerHTML = "";
			for (var i = 0; i < obj.chats.length; i++) {
				chat.innerHTML += "<option value=\"" + i + "\">" + obj.chats[i] + "</option>";
			}			
			chat.value = temp;
		}
	}

	var object = {
		message: "",
		loadprev: 0,
		chat: 0,
		chatName: "",
		server: parseInt(server.value),
		serverName: ""
	};

	xhr.send(JSON.stringify(object));
}

function readServers() {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "127.0.0.1/api/getservers");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200){
			var obj = JSON.parse(xhr.responseText);
			console.log(obj);
			var temp = server.value;
			server.innerHTML = "";
			for (var i = 0; i < obj.servers.length; i++) {
				server.innerHTML += "<option value=\"" + i + "\">" + obj.servers[i] + "</option>";
			}			
			server.value = temp;
		}
	}

	var object = {
		message: "",
		loadprev: 0,
		chat: 0,
		chatName: "",
		server: 0,
		serverName: ""
	};

	xhr.send(JSON.stringify(object));
}

setInterval(readServers, 1000);
setInterval(readChats, 1000);
setInterval(readText, 1000);