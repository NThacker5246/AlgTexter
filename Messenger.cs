using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Linq;
using System.Numerics;


[Serializable]
public struct Promise {
	public string message {get; set;}
	public int loadprev {get; set;}	
	public int chat {get; set;}	
	public string chatName {get; set;}
	public int server {get; set;}
	public string serverName {get; set;}
	public string fileName {get; set;}
	public string fileBody {get; set;}
	public int fileOffset {get; set;}

	//account
	public string userName {get; set;}
	public ulong passHash {get; set;}
	
}
[Serializable]
public struct Indexer {
	public int[] length {get; set;}
	public string[] chats {get; set;}
}

[Serializable]
public struct ServerIndexer {
	// public int[] length {get; set;}
	public string[] servers {get; set;}
}


public class Messenger {
	public static void SendText(Promise into){
		ServerIndexer sdex = JsonSerializer.Deserialize<ServerIndexer>(File.ReadAllText("./messenger/indexator.json"));
		Indexer idex = JsonSerializer.Deserialize<Indexer>(File.ReadAllText($"./messenger/{sdex.servers[into.server]}/indexer.json"));
		Console.WriteLine($"./messenger/{sdex.servers[into.server]}/{idex.chats[into.chat]}_{idex.length[into.chat]}.txt");
		if(!File.Exists($"./messenger/{sdex.servers[into.server]}/{idex.chats[into.chat]}_{idex.length[into.chat]}.txt")){
			FileStream stream1 = File.Create($"./messenger/{sdex.servers[into.server]}/{idex.chats[into.chat]}_{idex.length[into.chat]}.txt");
			stream1.Close();
			Console.WriteLine("Created");
		}
		string text = File.ReadAllText($"./messenger/{sdex.servers[into.server]}/{idex.chats[into.chat]}_{idex.length[into.chat]}.txt");
		if(text.Length > 64) {
			idex.length[into.chat] += 1;
			File.WriteAllText($"./messenger/{sdex.servers[into.server]}/indexer.json", JsonSerializer.Serialize(idex));
			FileStream stream = File.Create($"./messenger/{sdex.servers[into.server]}/{idex.chats[into.chat]}_{idex.length[into.chat]}.txt");
			stream.Close();
			text = "";
		}
		Console.WriteLine(into.message);
		text += "<br>";
		text += into.message;
		File.WriteAllText($"./messenger/{sdex.servers[into.server]}/{idex.chats[into.chat]}_{idex.length[into.chat]}.txt", text);
	}
	public static string GetText(Promise into){
		ServerIndexer sdex = JsonSerializer.Deserialize<ServerIndexer>(File.ReadAllText("./messenger/indexator.json"));
		Indexer idex = JsonSerializer.Deserialize<Indexer>(File.ReadAllText($"./messenger/{sdex.servers[into.server]}/indexer.json"));
		if(idex.length.Length == 0) return "";
		into.loadprev = clamp(into.loadprev, 0, idex.length[into.chat]);
		if(!File.Exists($"./messenger/{sdex.servers[into.server]}/{idex.chats[into.chat]}_{idex.length[into.chat] - into.loadprev}.txt")) return "NoChat";
		return File.ReadAllText($"./messenger/{sdex.servers[into.server]}/{idex.chats[into.chat]}_{idex.length[into.chat] - into.loadprev}.txt");
	}

	static int clamp(int a, int n, int x){
		if(n > a) return n;
		if(x < a) return x;
		return a;
	}

	public static void AddChat(Promise into){
		ServerIndexer sdex = JsonSerializer.Deserialize<ServerIndexer>(File.ReadAllText("./messenger/indexator.json"));
		Indexer idex = JsonSerializer.Deserialize<Indexer>(File.ReadAllText($"./messenger/{sdex.servers[into.server]}/indexer.json"));
		string[] chats = new string[idex.chats.Length + 1];
		int[] length = new int[idex.length.Length + 1];
		for(int i = 0; i < idex.length.Length; ++i){
			chats[i] = idex.chats[i];
			length[i] = idex.length[i];
		}
		length[idex.length.Length] = 0;
		chats[idex.chats.Length] = into.chatName;
		idex.length = length;
		idex.chats = chats;
		string dex = JsonSerializer.Serialize(idex);
		File.WriteAllText($"./messenger/{sdex.servers[into.server]}/indexer.json", dex);
	}
	public static string GetAllIndexator(Promise into){
		ServerIndexer sdex = JsonSerializer.Deserialize<ServerIndexer>(File.ReadAllText("./messenger/indexator.json"));
		return File.ReadAllText($"./messenger/{sdex.servers[into.server]}/indexer.json");
	}

	public static string GetAllIndexatorServer(Promise into){
		return File.ReadAllText($"./messenger/indexator.json");
	}

	public static void AddServer(Promise into){
		ServerIndexer sdex = JsonSerializer.Deserialize<ServerIndexer>(File.ReadAllText("./messenger/indexator.json"));
		string[] servn = new string[sdex.servers.Length + 1];
		for(int i = 0; i < sdex.servers.Length; ++i){
			servn[i] = sdex.servers[i];
		}
		servn[sdex.servers.Length] = into.serverName;
		sdex.servers = servn;
		File.WriteAllText("./messenger/indexator.json", JsonSerializer.Serialize(sdex));
		Directory.CreateDirectory($"./messenger/{into.serverName}");
		FileStream file = File.Create($"./messenger/{into.serverName}/indexer.json");
		file.Close();
		File.WriteAllText($"./messenger/{into.serverName}/indexer.json", "{\"length\":[],\"chats\":[]}");
	}

	public static void LoadFile(Promise into){
		Console.WriteLine("LoadFile started");
		byte[] fileBody = FromBase64(into.fileBody);
		byte[] toWrite = File.ReadAllBytes($"./frontend/msg-files/{into.fileName}");
		for(int i = 384 * into.fileOffset; i < 384 * into.fileOffset + fileBody.Length; ++i){
			toWrite[i] = fileBody[i - 384 * into.fileOffset];
			// Console.WriteLine("Written byte");
		}
		File.WriteAllBytes($"./frontend/msg-files/{into.fileName}", toWrite);
	}

	public static void CreateFile(Promise into){
		byte[] toWrite = new byte[into.fileOffset];
		File.WriteAllBytes($"./frontend/msg-files/{into.fileName}", toWrite);
	}


	public static byte[] FromBase64(string o){
		int offset = 0;
		for(;;++offset){
			if(o[o.Length - offset - 1] != '=') break;
		}
		byte[] outer = new byte[o.Length / 4 * 3 - offset];
		string bs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		Dictionary<char, int> base64 = new Dictionary<char, int>(); 
		

		for(int i = 0; i < bs.Length; ++i){
			base64.Add(bs[i], i);
		}

		int j = 0;
		try {
			for(int i = 0; i < o.Length; i += 4){
				char a = o[i], b = o[i+1], c = o[i+2], d = o[i+3];
				int ar = base64[a];
				int br = base64[b]; 
				int cr, dr;
				if(c == '='){
					cr = 0;
					dr = 0;
				} else if(d == '='){
					cr = base64[c]; 
					dr = 0;
				} else {
					cr = base64[c]; 
					dr = base64[d];
				}


				int pqr = (ar << 18) | (br << 12) | (cr << 6) | dr;
				outer[j] = (byte) (pqr >> 16);
				if(j + 1 < outer.Length) outer[j + 1] = (byte) ((pqr >> 8) & 255);
				if(j + 1 < outer.Length) outer[j + 2] = (byte) (pqr & 255);
				j += 3;
			}
		} catch(Exception e) {
		
		}
		return outer;
	}
}
