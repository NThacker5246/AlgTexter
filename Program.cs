using System.Net;
using System.Net.Sockets;
using System;
using System.Collections;
using System.Collections.Generic;

using System.Globalization;
using System.Text;
using System.Text.Json;

Server sv = new Server(80, 2048);
Promise test = new Promise();
test.message = "Hello";
Console.WriteLine(JsonSerializer.Serialize(test));

while(true){
	sv.TickServer();
}