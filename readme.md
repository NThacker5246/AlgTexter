# AlgTexter


### This is project, that written as reborn of HMM and FreeTube. We will integrate this with Alogical Office with chatting and video sharing

---
### API working:
Here, we're using for API an POST xhr. The POST files can store more than GET, because GET stores data in string, nethier POST, that stores in TCP package body.

How to send:

```js

var xhr = new XMLHttpRequest(); // initalize the object
xhr.open("POST", "127.0.0.1/api/printf"); //127.0.0.1 - is local address. it can be any - like gimaker.online or localhost
xhr.send("{\"hello\":\"world\"}"); // the body can by any for printf, but in other funcs it will use json

//in console after xhr finishes
console.log(xhr.responseText); //{"hello":"world"} - ponged

```
We also can read in `xhr.onreadystatechange` and check if `readyState == 4` and `xhr.status == 200` to use it in code.

Current functions:
1. `/printf` - pongs with the same answer

In development I'll add more
