# AlgTexter


### This is project, that written as reborn of HMM and FreeTube. We will integrate this with Alogical Office with chatting and video sharing

---
### API working:
Here, we're using for API an POST xhr. The POST package can store more than GET, because GET stores data in string, nethier POST, that stores in TCP package body.

How to send:

```js

var xhr = new XMLHttpRequest(); // initalize the object
var o = {
  server: 0,
  chat: 0,
  message: "Hello, world!"
}; //prompt
xhr.open("POST", "127.0.0.1/api/send"); //127.0.0.1 - is local address. it can be any - like gimaker.online or localhost
xhr.send(JSON.stringify(o)); // the body

//in console after xhr finishes
console.log(xhr.responseText); //Succesful

```
We also can read in `xhr.onreadystatechange` and check if `readyState == 4` and `xhr.status == 200` to use it in code.

Current functions:
1. `/printf` - pongs with the same answer
2. `/send` - send message. Uses a JSON object to get parameters
```json
{
  "message": "Hello, world", //message
  "chat": 0, //chat id to send
  "server": 0 //server id to send
}
```
3. `/read` - reads chat textwall
```json
{
  "chat": 0, //chat from read
  "server": 0, //server from read
  "loadprev": 0 // how many block are shifted from end
}
```
4. `/addchat` - add a new chat
```json
{
  "chatName": "CoolHeckers", //name of new chat
  "server": 0 //id of server add
}
```
5. `/getindexer` - reads all info from server indexate file (returns chat structure)
In:
```json
{
  "server": 0 //server where we will read
}
```
Out:
```json
{
  "chats": ["Chat0", ..., "MyCoolChat"], //chat names
  "length": [1, ..., 2] //blocks count
}
```
6. `/addserver` - adds a new server
```json
{
  "serverName": "AlogicalCommunity" // name of the new server
}
```
7. `/getservers` - read all servers - no body needed
```
{}
```
8. `/createfile` - reserves a file size on server and fills with '\0'
```
{
  "fileOffset": 1048576, //size (bytes)
  "fileName": "myfile.txt" //the name of file
}
```
9. `/loadfile` - loads a file block. File does splitted on blocks by 384 bytes, so that to bypass a low size of package (and may be load async)
```json
{
  "fileOffset": 5, //fivth block
  "fileName": "myfile.txt", //name of file
  "fileBody": "VGhpcyBpcyBteSB0ZXN0IHRleHQ=" //body of block
}
```
10. `/register` - registers a user
In:
```json
{
  userName: "NThacker1",
  passHash: 2581257 //hash of the password
}
```
Out:
```
Registered - success
User exists - user was registed earlier
Not name - name was empty
Not password - password was empty
```
11. `/login` - logins user (return if user logined)
In:
```json
{
  userName: "NThacker1",
  passHash: 2581257 //hash of the password
}
```
Out:
```
Logined - success, user logined
Not user - user was unregisted
Wrong password - password is incorect
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
