using backend.Models.Auth;
using backend.Database;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using utils.Crypt;

namespace backend.Controllers.Auth {
    [ApiController]
    [Route("Auth/[controller]")]
    public class loginController : ControllerBase
    {

        [HttpPost]
        public IActionResult login([FromBody] LoginModel newLogin)
        {
            try
            {
                // Vérification des entrées
                if (string.IsNullOrEmpty(newLogin.UserName) || string.IsNullOrEmpty(newLogin.Password))
                {
                    return BadRequest(new
                    {
                        Error = "InvalidInput",
                        Message = "Nom d'utilisateur et mot de passe requis."
                    });
                }
                DbHelper db = new();
                using (MySqlConnection dbClient = db.GetConnection())
                {
                    using (MySqlCommand cmd = new MySqlCommand("GetUserByUsername", dbClient))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@inputUsername", newLogin.UserName);

                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                string hashedPassword = reader.GetString("password");
                                string salt = reader.GetString("salt");

                                // Vérification du mot de passe
                                bool isPasswordValid = Crypt.VerifyPassword(newLogin.Password, salt, hashedPassword);
                                if (isPasswordValid)
                                {
                                    return Ok(new
                                    {
                                        Message = "Connexion réussie."
                                    });
                                }
                                else
                                {
                                    return Unauthorized(new
                                    {
                                        Error = "InvalidCredentials",
                                        Message = "Mot de passe incorrect."
                                    });
                                }
                            }
                            else
                            {
                                return Unauthorized(new
                                {
                                    Error = "UserNotFound",
                                    Message = "Utilisateur introuvable."
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la connexion : {ex.Message}");
                return StatusCode(500, new
                {
                    Error = "ServerError",
                    Message = "Une erreur interne est survenue. Veuillez réessayer."
                });
            }
        }

        private string GenerateJwtToken(string username)
        {
            // Implémentez la logique de génération d'un JWT ici si vous utilisez des tokens
            return "dummy-token-for-now"; // Remplacez par la vraie implémentation
        }
    }
}