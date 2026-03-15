var onof = document.getElementById('onof');
var flag = false;
var base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var fbase = {"0":52,"1":53,"2":54,"3":55,"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,"w":48,"x":49,"y":50,"z":51,"+":62,"/":63};


navigator.mediaDevices.getUserMedia({ audio: true})
.then(stream => {
	const mediaRecorder = new MediaRecorder(stream);
	let voice = [];
	mediaRecorder.start();

	mediaRecorder.addEventListener("dataavailable",function(event) {
		voice.push(event.data);
	});

	mediaRecorder.addEventListener("stop", function() {
		const voiceBlob = new Blob(voice, {type: 'audio/wav'});
		const audioBlobUrl = URL.createObjectURL(voiceBlob);
		const audio = new Audio(audioBlobUrl);
		audio.play();
		voice[0].bytes().then((result) => {
			console.log(fromBase64(toBase64(result)));
		});
		voice = [];
	});

	onof.addEventListener("click", function (argument) {
		flag = !flag;
		mediaRecorder.stop();
	});

	setInterval(function replay() {
		if(flag){
			mediaRecorder.stop();
			mediaRecorder.start();
		}
	}, 1000);
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
function fromBase64(o) {
	var offset = 0;
	for(;;++offset){
		// console.log(offset);
		if(o[o.length - offset - 1] != "=") break;
	}
	var out = []; 
	var j = 0;
	for (var i = 0; i < o.length; i += 4) {
		
		var a = fbase[o[i]], b = fbase[o[i+1]], c = fbase[o[i+2]], d = fbase[o[i+3]];
		var pqr = (a << 18) | (b << 12) | (c << 6) | d;
		if(i + 4 >= o.length){
			switch(offset){
				case 0:
					out.push(pqr >> 16);
					out.push((pqr >> 8) & 255); 
					out.push(pqr & 255);
					break;
				case 1:
					out.push(pqr >> 16);
					out.push((pqr >> 8) & 255);
					break;
				case 2:
					out.push(pqr >> 16);
					break;
			}
		} else {
			out.push(pqr >> 16);
			out.push((pqr >> 8) & 255); 
			out.push(pqr & 255);
			j += 3;
		}
	}
	return out; 
}

