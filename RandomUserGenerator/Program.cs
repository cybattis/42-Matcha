using MySql.Data.MySqlClient;
using RandomUserGenerator;

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? 
                       "Server=localhost;Port=3307;Database=db;user=user;password=password;";
var imagesPath = "/home/cybattis/Dev/42/Matcha/backend/images/";

Console.WriteLine("Initializing...");

// Check if file path exist
if (!Directory.Exists(imagesPath))
    Directory.CreateDirectory(imagesPath);

await using MySqlConnection connection = new(connectionString);
connection.Open();

Console.WriteLine("Generating User Data...");
Console.WriteLine("Generating female users...");
await GenerateUser.Generate(connection, "female", 100, imagesPath);
Console.WriteLine("Done!");

Console.WriteLine("Generating male users...");
await GenerateUser.Generate(connection, "male", 100, imagesPath);
Console.WriteLine("Done!");

connection.Close();

Console.WriteLine("Generation Complete!");





