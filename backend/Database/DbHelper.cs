using System.Data;
using MySql.Data.MySqlClient;

namespace backend.Database;

public class DbHelper
{
    private static readonly string ConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? 
                                                      "Server=localhost;Port=3307;Database=matcha_db;user=user;password=usermdp;";

    public static MySqlConnection GetConnection() => new(ConnectionString);
    
    public static MySqlConnection GetOpenConnection()
    {
        MySqlConnection connection = new(ConnectionString);
        connection.Open();
        return connection;
    }
}