using System.Data;
using System.Security.Cryptography;
using System.Text.Json;
using MySql.Data.MySqlClient;
using RandomUserGenerator;

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? 
                                                  "Server=localhost;Port=3307;Database=db;user=user;password=password;";

Console.WriteLine("Generating User Data...");

var client = new HttpClient();
var response = await client.GetAsync("https://randomuser.me/api/?results=10");
var content = await response.Content.ReadAsStringAsync();
var users = JsonSerializer.Deserialize<RandomUserResponse>(content) ?? new RandomUserResponse();

Console.WriteLine("User Data Generated!");

Console.WriteLine("Inserting in the database...");

await using MySqlConnection connection = new(connectionString);
connection.Open();

var lorem = new Bogus.DataSets.Lorem("en");
var random = new Bogus.Randomizer();

foreach (var user in users.Results)
{
    await using MySqlCommand cmd = new("AddGeneratedUser", connection);
    cmd.CommandType = CommandType.StoredProcedure;
    cmd.Parameters.AddWithValue("@username", user.Login.Username);
    cmd.Parameters.AddWithValue("@password", user.Login.Password);
    cmd.Parameters.AddWithValue("@email", user.Email);
    cmd.Parameters.AddWithValue("@birthDate", user.Dob.Date.Split("T")[0]);
    
    cmd.Parameters.AddWithValue("@firstName", user.Name.First);
    cmd.Parameters.AddWithValue("@lastName", user.Name.Last);
    cmd.Parameters.AddWithValue("@gender", user.Gender == "Male" ? 1 : 2);
    cmd.Parameters.AddWithValue("@sexualOrientation", random.WeightedRandom([1, 2, 3], [0.5f, 0.25f, 0.25f]));
    cmd.Parameters.AddWithValue("@coordinates", user.Location.Coordinates.Latitude + "," + user.Location.Coordinates.Longitude);
    
    // Random Bio
    var bio = lorem.Sentences(RandomNumberGenerator.GetInt32(1, 5));
    Console.WriteLine($"Bio: {bio}");
    cmd.Parameters.AddWithValue("@biography", bio);
    
    // Random tags
    var tags = new List<int>();
    var numberOfTags = random.Int(0, 5);
    for (int i = 0; i < numberOfTags; i++) {
        var tag = random.Int(1, 38);
        while (tags.Contains(tag)) {
            tag = random.Int(1, 38);
        }
        tags.Add(tag);
    }

    for (int i = 0; i < numberOfTags; i++) {
        cmd.Parameters.AddWithValue("@tag"+i, tags[i]);
    }
    
    if (tags.Count < 5) {
        for (int i = tags.Count; i < 5; i++) {
            cmd.Parameters.AddWithValue("@tag"+i, null);
        }
    }
    
    // Downloaded image
    
    
    // Generated images
    var images = new List<string>();
    var numberOfImages = random.Int(0, 4);
    for (int i = 0; i < numberOfImages; i++) {
        var image = $"https://picsum.photos/200/300.jpg?random={random.Int(1, 1000)}";
        images.Add(image);
    }
    
    await cmd.ExecuteNonQueryAsync();
    
    Console.WriteLine($"User {user.Name.First} {user.Name.Last} added to the database!");
}

connection.Close();