# AlgTexter


### This is project, that written as reborn of HMM and FreeTube. We will integrate this with Alogical Office with chatting and video sharing

---
### API working:
Here, we're using for API an POST xhr. The POST package can store more than GET, because GET stores data in string, nethier POST, that stores in TCP package body.

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
2. `/send` - send message. Uses a JSON object to get parameters
```json
{
  "message": "Hello, world", //Message
  "chat": 0, //chat id to send
  "chatName": "", //unused
  "loadprev": 0 // unused (must be int!)
}
```
3. `/read` - reads chat textwall
```json
{
  "message": "", //unused
  "chat": 0, //chat from read
  "chatName": "", //unused
  "loadprev": 0 // how many block are shifted from end
}
```
4. `/addchat` - add a new chat
```json
{
  "message": "", //unused
  "chat": 0, //unused (must be int!)
  "chatName": "CoolHeckers", //name of new chat
  "loadprev": 0 //unused (must be int!)
}
```
5. `/getindexer` - reads all info from indexate file
In:
```json
{
  "message": "", //unused
  "chat": 0, //unused (must be int!)
  "chatName": "", //unused
  "loadprev": 0 //unused (must be int!)
}
```
Out:
```json
{
  "chats": ["Chat0", ..., "MyCoolChat"], //chat names
  "length": [1, ..., 2] //blocks count
}
```

### Block system and Indexers

If we use a one .txt file for chat, we will use a lot of drive resource. First, we have to read all file and send (file can be too big), and rewrite whole file (if we send something). So, we're using block system. We have blocks (with limited size), that cannot be modified (excepting last block), so disk defragmentator will opimize all other blocks, that can be readed faster that big file. So we need use Indexer for chats.
Indexator looks like this
```json
{
  "chats": ["Chat0", ..., "MyCoolChat"], //chat names
  "length": [1, ..., 2] //blocks count
}
```

Blocks count (`length`) is the pointer to last block. When we read the last block (and previous one), we use this property to get chat. Chats are chat names - this property displays to user.
