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
}
[Serializable]
public struct Indexer {
	public int length {get; set;}
}


public class Messenger {
	public static void SendText(Promise into){

		Indexer idex = JsonSerializer.Deserialize<Indexer>(File.ReadAllText("./messenger/indexer.json"));

		string text = File.ReadAllText($"./messenger/block{idex.length}.txt");
		if(text.Length > 64) {
			idex.length += 1;
			File.WriteAllText("./messenger/indexer.json", JsonSerializer.Serialize(idex));
			FileStream stream = File.Create($"./messenger/block{idex.length}.txt");
			stream.Close();
			text = "";
		}
		Console.WriteLine(into.message);
		text += "<br>";
		text += into.message;
		File.WriteAllText($"./messenger/block{idex.length}.txt", text);
	}
	public static string GetText(Promise into){
		Indexer idex = JsonSerializer.Deserialize<Indexer>(File.ReadAllText("./messenger/indexer.json"));
		into.loadprev = clamp(into.loadprev, 0, idex.length);
		return File.ReadAllText($"./messenger/block{idex.length - into.loadprev}.txt");
	}
	
	static int clamp(int a, int n, int x){
		if(n > a) return n;
		if(x < a) return x;
		return a;
	}
}
