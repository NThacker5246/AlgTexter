using System.Net;
using System.Net.Sockets;
using System;
using System.Collections;
using System.Collections.Generic;

using System.Globalization;
using System.Text;
using System.Text.Json;

Server sv = new Server(80, 2048);
while(true){
	sv.TickServer();
}