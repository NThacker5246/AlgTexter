using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Linq;
using System.Numerics;

public struct User {
	public string username;
	public ulong pwd;
}

public class Account {
	public static string Register(Promise into){
		User user = new User();
		if(into.userName == ""){
			return "Not name";
		} else if(into.passHash == 0){
			return "Not password";
		}
		user.username = into.userName;
		user.pwd = into.passHash;
		string toSave = JsonSerializer.Serialize(user);
		if(File.Exists($"./accounts/{user.username}.json")){
			return "User exists";
		}
		File.WriteAllText($"./accounts/{user.username}.json", toSave);
		return "Registered";
	}

	public static string Login(Promise into){
		if(!File.Exists($"./accounts/{into.userName}.json")){
			return "Not user";
		}
		User user = JsonSerializer.Deserialize<User>(File.ReadAllText($"./accounts/{into.userName}.json"));
		if(user.pwd == into.passHash){
			return "Logined";
		}
		return "Wrong password";

	}

	public static int getHash(string s){
		int o = 0;
		for(int i = 0; i < s.Length; ++i){
			o = (o << 5) - o + (s[i] - '0');
		}
		return o;
	}
}