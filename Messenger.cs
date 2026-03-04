using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.Json;


[Serializable]
public struct Promise {
	public string message {get; set;}
	public int loadprev {get; set;}	
	public int chat {get; set;}	
	public string chatName {get; set;}
	public int server {get; set;}
	public string serverName {get; set;}
	
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
}
