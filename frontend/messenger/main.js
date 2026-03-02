var button = document.getElementById('send');
var area = document.getElementById('message');
var out = document.getElementById('answer');
var up = document.getElementById('up'), down = document.getElementById('down');

var counter = 0;

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
		loadprev: 0
	};

	xhr.send(JSON.stringify(object));
});

function readText() {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "127.0.0.1/api/read");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			out.innerHTML = xhr.responseText;
		}
	}
	var object = {
		message: "",
		loadprev: counter
	};
	xhr.send(JSON.stringify(object));
}

setInterval(readText, 1000);