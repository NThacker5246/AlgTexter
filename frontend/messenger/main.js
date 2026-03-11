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

var fila = document.getElementById('fila');
var fileout = document.getElementById('fileout')

var base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var fbase = {"0":52,"1":53,"2":54,"3":55,"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,"w":48,"x":49,"y":50,"z":51,"+":62,"/":63};

var loadfilebut = document.getElementById('loadfilebut');
var filetype = document.getElementById('filetype');

loadfilebut.addEventListener("click", function (e) {
	fila.files[0].bytes().then((o) => {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "127.0.0.1/api/send");

		var link = "";

		switch(filetype.value){
			case "down":
				link = "<a download=\"\" href=\"/msg-files/" + fila.value.slice(12) + "\">" + fila.value.slice(12) + "</a>";
				break;
			case "img":
				link = "<img src=\"/msg-files/" + fila.value.slice(12) + "\">";
				break;
			case "msc":
				link = "<audio controls=\"\" src=\"/msg-files/" + fila.value.slice(12) + "\">" + fila.value.slice(12) + "</audio>";
				break;
			case "vid":
				link = "<video controls=\"\" src=\"/msg-files/" + fila.value.slice(12) + "\">" + fila.value.slice(12) + "</video>";
				break;
		}

		var msg = {
			message: link,
			loadprev: 0,
			chat: parseInt(chat.value),
			chatName: "",
			server: parseInt(server.value)
		};
		xhr.send(JSON.stringify(msg));

		xhr = new XMLHttpRequest();
		xhr.open("POST", "127.0.0.1/api/createfile");
		var object = {
			fileName: fila.value.slice(12), //trunciate C:\fakepath\
			fileOffset: o.length
		};
		
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4 && xhr.status == 200){
				for(var i = 0; i < o.length / 384; ++i){
					var xhl = new XMLHttpRequest();
					xhl.open("POST", "127.0.0.1/api/loadfile");

					var toSend = toBase64(o, 384*i, 384*(i+1) > o.length ? o.length : 384*(i+1));

					var obj = {
						fileName: fila.value.slice(12),
						fileOffset: i,
						fileBody: toSend
					}
					xhl.send(JSON.stringify(obj));
				}
			}
		}

		xhr.send(JSON.stringify(object));


		// for(var i = 0; i < basefile.lengt / 384; ++i){
		// 	xhr.open("POST", "127.0.0.1/api/loadfile");

			

		// 	xhr.send(JSON.stringify(object));
		// }
	});
});

function toBase64(o) {
	var ostatok = o.length % 3;
	var out = ""; 
	switch(ostatok){
		case 0:
			for (var i = 0; i < o.length; i += 3) {
				var pqr = (o[i] << 16) | (o[i+1] << 8) | o[i+2];
				var a = (pqr >> 18), b = (pqr >> 12) & 63, c = (pqr >> 6) & 63, d = pqr & 63;
				out += base[a] + base[b] + base[c] + base[d];
			}
			break;
		case 1:
			for (var i = 0; i < o.length; i += 3) {
				var pqr;
				if(i+2 >= o.length){
					pqr = (o[i] << 16) | (o[i+1] << 8) | 0;
				} else {
					pqr = (o[i] << 16) | (o[i+1] << 8) | o[i+2];
				}
				var a = (pqr >> 18), b = (pqr >> 12) & 63, c = (pqr >> 6) & 63, d = pqr & 63;
				out += base[a] + base[b] + base[c] + base[d];
				if(i+2 >= o.length) out += "=";
			}
			break;
		case 2:
			for (var i = 0; i < o.length; i += 3) {
				var pqr;
				if(i+2 >= o.length){
					pqr = (o[i] << 16) | 0;
				} else {
					pqr = (o[i] << 16) | (o[i+1] << 8) | o[i+2];
				}
				var a = (pqr >> 18), b = (pqr >> 12) & 63, c = (pqr >> 6) & 63, d = pqr & 63;
				out += base[a] + base[b] + base[c] + base[d];
				if(i+2 >= o.length) out += "==";
			}
			break;
	}

	return out;
}

function toBase64(o, start, end) {
	var ostatok = o.length % 3;
	var out = ""; 
	switch(ostatok){
		case 0:
			for (var i = start; i < end; i += 3) {
				var pqr = (o[i] << 16) | (o[i+1] << 8) | o[i+2];
				var a = (pqr >> 18), b = (pqr >> 12) & 63, c = (pqr >> 6) & 63, d = pqr & 63;
				out += base[a] + base[b] + base[c] + base[d];
			}
			break;
		case 1:
			for (var i = start; i < o.length; i += 3) {
				var pqr;
				if(i+2 >= o.length){
					pqr = (o[i] << 16) | (o[i+1] << 8) | 0;
				} else {
					pqr = (o[i] << 16) | (o[i+1] << 8) | o[i+2];
				}
				var a = (pqr >> 18), b = (pqr >> 12) & 63, c = (pqr >> 6) & 63, d = pqr & 63;
				out += base[a] + base[b] + base[c] + base[d];
				if(i+2 >= o.length) out += "=";
			}
			break;
		case 2:
			for (var i = start; i < end; i += 3) {
				var pqr;
				if(i+2 >= o.length){
					pqr = (o[i] << 16) | 0;
				} else {
					pqr = (o[i] << 16) | (o[i+1] << 8) | o[i+2];
				}
				var a = (pqr >> 18), b = (pqr >> 12) & 63, c = (pqr >> 6) & 63, d = pqr & 63;
				out += base[a] + base[b] + base[c] + base[d];
				if(i+2 >= o.length) out += "==";
			}
			break;
	}

	return out;
}

function fromBase64(o) {
	var out = "";
	var offset = 0;
	for(;;++offset){
		// console.log(offset);
		if(o[o.length - offset - 1] != "=") break;
	}
	for (var i = 0; i < o.length; i += 4) {
		
		var a = fbase[o[i]], b = fbase[o[i+1]], c = fbase[o[i+2]], d = fbase[o[i+3]];
		var pqr = (a << 18) | (b << 12) | (c << 6) | d;
		if(i + 4 >= o.length){
			switch(offset){
				case 0:
					out += String.fromCharCode(pqr >> 16) + String.fromCharCode((pqr >> 8) & 255) + String.fromCharCode(pqr & 255);
					break;
				case 1:
					out += String.fromCharCode(pqr >> 16) + String.fromCharCode((pqr >> 8) & 255);
					break;
				case 2:
					out += String.fromCharCode(pqr >> 16);
					break;
			}
		} else {
			out += String.fromCharCode(pqr >> 16) + String.fromCharCode((pqr >> 8) & 255) + String.fromCharCode(pqr & 255);
		}
	}
	out = out.substring(0, o.length-offset);
	return out;	
}



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

/*
input.files[0].bytes().then((val) => {val[i]})
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
*/