function convertMD(text) {
	return linker(imager(next_to(bolder(italicer(ucoder(coder(striker(text))))))));
}

var bolder = function(text){
	var bld = text.split("*");
	var result = bld[0];
	for(var i = 1; i < bld.length; i += 2){
		result += "<b>" + bld[i] + "</b>" + bld[i+1];
	} 
	return result;
}

var italicer = function(text){
	var itc = text.split("**");
	var result = itc[0];
	for(var i = 1; i < itc.length; i += 2){
		result += "<i>" + itc[i] + "</i>" + itc[i+1];
	} 
	return result;
}

var coder = function(text){
	var cld = text.split("\`\`\`");
	var result = cld[0];
	for(var i = 1; i < cld.length; i += 2){
		result += "<pre class=\"code\">" + cld[i] + "</pre>" + cld[i+1];
	} 
	return result;
}

var ucoder = function(text){
	var cld = text.split("\`");
	var result = cld[0];
	for(var i = 1; i < cld.length; i += 2){
		result += "<pre class=\"code\">" + cld[i] + "</pre>" + cld[i+1];
	} 
	return result;
}

var next_to = function(text) {
	var strings = text.split("\n");
	var result = "";
	for(var i = 0; i < strings.length; ++i){
		var keyword = strings[i].split(' ', 1);
		var raw = strings[i].substring(keyword[0].length+1);
		switch(keyword[0]){
			case '#':
				result += "<h1 class=\"md-h1\">" + raw + "</h1>";
				break;

			case '##':
				result += "<h2 class=\"md-h2\">" + raw + "</h2>";
				break;

			case '###':
				result += "<h3 class=\"md-h3\">" + raw + "</h3>";
				break;

			case '####':
				result += "<h4 class=\"md-h4\">" + raw + "</h4>";
				break;

			case '#####':
				result += "<h5 class=\"md-h5\">" + raw + "</h5>";
				break;

			case '######':
				result += "<h6 class=\"md-h6\">" + raw + "</h6>";
				break;

			case '>':
				result += "<pre class=\"quote\">" + raw + "</pre>";
				break;

			default:
				result += strings[i] + "<br>";
				break;
		}
	}
	return result;
}

var striker = function(text){
	var strk = text.split("~~");
	var result = strk[0];
	for(var i = 1; i < strk.length; i += 2){
		result += "<s>" + strk[i] + "</s>" + strk[i+1];
	} 
	return result;
}

var linker = function (text) {
	var lks = text.split("[");
	var result = lks[0];
	for(var i = 1; i < lks.length; ++i){
		var term = lks[i].indexOf("]");
		var link = lks[i].substring(lks[i].indexOf("(")+1, lks[i].indexOf(")"))
		result += "<a href=\"" + link + "\">" + lks[i].substring(0, term) + "</a>" + lks[i].substring(term+1, lks[i].length).replace("(" + link + ")", "");
	}
	
	return result;   
}

var imager = function (text) {
	var lks = text.split("![");
	var result = lks[0];
	for(var i = 1; i < lks.length; ++i){
		var term = lks[i].indexOf("]");
		var link = lks[i].substring(lks[i].indexOf("(")+1, lks[i].indexOf(")"))
		result += "<img class=\"md-image\" src=\"" + link + "\" title=\"" + lks[i].substring(0, term) + "\">" + lks[i].substring(term+1, lks[i].length).replace("(" + link + ")", "");
	}
	
	return result;   
}