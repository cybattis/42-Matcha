using System.Data;
using MySql.Data.MySqlClient;

namespace backend.Database;

public class DbHelper: IDbHelper
{
    private ILogger<IDbHelper> _logger;
    private readonly MySqlConnection _connection = new();

    public DbHelper(ILogger<IDbHelper> logger)
    {
        _logger = logger;
        
        string myConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") ?? "";
        _logger.LogDebug($"DB_CONNECTION_STRING: {myConnectionString}");

        try {
            _logger.LogDebug("Connecting to MySQL...");
            _connection.ConnectionString = myConnectionString;
            _connection.Open();
        }
        catch (MySqlException ex)
        {
            _logger.LogDebug(ex.Message);
        }

        if (_connection.State == ConnectionState.Open)
            _logger.LogDebug("Connection is open");
    }
    
    public MySqlConnection GetConnection() => _connection;
}