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
}
[Serializable]
public struct Indexer {
	public int[] length {get; set;}
	public string[] chats {get; set;}
}


public class Messenger {
	public static void SendText(Promise into){

		Indexer idex = JsonSerializer.Deserialize<Indexer>(File.ReadAllText("./messenger/indexer.json"));
		if(!File.Exists($"./messenger/{idex.chats[into.chat]}{idex.length[into.chat]}.txt")){
			FileStream stream1 = File.Create($"./messenger/{idex.chats[into.chat]}{idex.length[into.chat]}.txt");
			stream1.Close();
		}
		string text = File.ReadAllText($"./messenger/{idex.chats[into.chat]}{idex.length[into.chat]}.txt");
		if(text.Length > 64) {
			idex.length[into.chat] += 1;
			File.WriteAllText("./messenger/indexer.json", JsonSerializer.Serialize(idex));
			FileStream stream = File.Create($"./messenger/{idex.chats[into.chat]}{idex.length[into.chat]}.txt");
			stream.Close();
			text = "";
		}
		Console.WriteLine(into.message);
		text += "<br>";
		text += into.message;
		File.WriteAllText($"./messenger/{idex.chats[into.chat]}{idex.length[into.chat]}.txt", text);
	}
	public static string GetText(Promise into){
		Indexer idex = JsonSerializer.Deserialize<Indexer>(File.ReadAllText("./messenger/indexer.json"));
		into.loadprev = clamp(into.loadprev, 0, idex.length[into.chat]);
		if(!File.Exists($"./messenger/{idex.chats[into.chat]}{idex.length[into.chat] - into.loadprev}.txt")) return "NoChat";
		return File.ReadAllText($"./messenger/{idex.chats[into.chat]}{idex.length[into.chat] - into.loadprev}.txt");
	}

	static int clamp(int a, int n, int x){
		if(n > a) return n;
		if(x < a) return x;
		return a;
	}

	public static void AddChat(Promise into){
		Indexer idex = JsonSerializer.Deserialize<Indexer>(File.ReadAllText("./messenger/indexer.json"));
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
		File.WriteAllText("./messenger/indexer.json", dex);
	}
	public static string GetAllIndexator(Promise into){
		return File.ReadAllText("./messenger/indexer.json");
	}
}
