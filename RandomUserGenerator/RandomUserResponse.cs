using System.Text;
using System.Text.Json.Serialization;

namespace RandomUserGenerator;

[Serializable]
public class RandomUserResponse
{
    [JsonPropertyName("results")]
    public RandomUser[] Results { get; set; } = Array.Empty<RandomUser>();

    public override string ToString()
    {
        var sb = new StringBuilder();
        foreach (var user in Results)
        {
            user.Name.First = user.Name.First.First().ToString().ToUpper() + user.Name.First.Substring(1);
            user.Name.Last = user.Name.Last.First().ToString().ToUpper() + user.Name.Last.Substring(1);
            sb.Append($"Name: {user.Name.First} {user.Name.Last}\n");
            sb.Append(user.Gender);
        }
        return sb.ToString();
    }
}

[Serializable]
public class RandomUser
{
    [JsonPropertyName("gender")]
    public string Gender { get; set; } = string.Empty;
    
    [JsonPropertyName("name")]
    public Name Name { get; set; } = new Name();
    
    [JsonPropertyName("location")]
    public Location Location { get; set; } = new Location();
    
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
    
    [JsonPropertyName("login")]
    public Login Login { get; set; } = new Login();
    
    [JsonPropertyName("dob")]
    public Dob Dob { get; set; } = new Dob();
    
    // [JsonPropertyName("registered")]
    // public Registered Registered { get; set; } = string.Empty;
    
    [JsonPropertyName("info")]
    public Info Info { get; set; } = new Info();
}

[Serializable]
public class Name
{
    [JsonPropertyName("first")]
    public string First { get; set; } = string.Empty;
    
    [JsonPropertyName("last")]
    public string Last { get; set; } = string.Empty;
}

[Serializable]
public class Location
{
    [JsonPropertyName("city")]
    public string City { get; set; } = string.Empty;
    
    [JsonPropertyName("state")]
    public string State { get; set; } = string.Empty;
    
    [JsonPropertyName("country")]
    public string Country { get; set; } = string.Empty;
    
    [JsonPropertyName("coordinates")]
    public Coordinates Coordinates { get; set; } = new Coordinates();
}

[Serializable]
public class Coordinates
{
    [JsonPropertyName("latitude")]
    public string Latitude { get; set; } = string.Empty;
    
    [JsonPropertyName("longitude")]
    public string Longitude { get; set; } = string.Empty;
}

[Serializable]
public class Login
{
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;
    
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}

[Serializable]
public class Dob
{
    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;
    
    [JsonPropertyName("age")]
    public int Age { get; set; }
}

// ========================

[Serializable]
public class Info
{
    [JsonPropertyName("seed")]
    public string Seed { get; set; } = string.Empty;
    
    [JsonPropertyName("results")]
    public int Results { get; set; }
    
    [JsonPropertyName("page")]
    public int Page { get; set; }
    
    [JsonPropertyName("version")]
    public string Version { get; set; } = string.Empty;
}