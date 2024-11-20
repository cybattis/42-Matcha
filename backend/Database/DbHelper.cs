using System.Data;
using MySql.Data.MySqlClient;

namespace backend.Database;

public class DbHelper: IDbHelper
{
    private readonly MySqlConnection _connection = new();

    public DbHelper()
    {
        string myConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") 
                                    ?? "Server=localhost;Port=3307;Database=db;user=user;password=password;";
        Console.WriteLine($"DB_CONNECTION_STRING: {myConnectionString}");

        try {
            Console.WriteLine("Connecting to MySQL...");
            _connection.ConnectionString = myConnectionString;
            _connection.Open();
        }
        catch (MySqlException ex)
        {
            Console.WriteLine(ex.Message);
        }

        if (_connection.State == ConnectionState.Open)
            Console.WriteLine("Connection is open");
    }
    
    public MySqlConnection GetConnection() => _connection;
}