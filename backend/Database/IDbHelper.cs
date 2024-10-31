using MySql.Data.MySqlClient;

namespace backend.Database;

public interface IDbHelper
{
    public MySqlConnection GetConnection();
}