using System.Net;
using System.Net.Sockets;
using System;
using System.Collections;
using System.Collections.Generic;

using System.Globalization;
using System.Text;
using System.Text.Json;

Server sv = new Server(80, 1024*1024);
// Promise test = new Promise();
// test.message = "Hello";
Console.WriteLine("Server started");
// Console.WriteLine(Messenger.FromBase64("SGVsbG8sIHdvcmxkISBJdCdzIGJhc2U2NCBoYWNrZXJzIGRlY29kZQ=="));

while(true){
	sv.TickServer();
}