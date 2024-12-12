using backend.Models.Auth;
using backend.Database;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Utils.Crypt;
using Utils.Notify;
using System.Data;
using Utils.Auth;
using Utils.Checks;
namespace backend.Controllers.Auth {
    [ApiController]
    [Route("Auth/")]
    public class loginController : ControllerBase
    {

        [HttpPost]
        [Route("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
                using (MySqlConnection dbClient = db.GetOpenConnection())
                {
                    using (MySqlCommand cmd = new MySqlCommand("GetUserPasswordByUsername", dbClient))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@inputUsername", newLogin.UserName);
                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                string hashedPassword = reader.GetString("password");
                                string salt = reader.GetString("salt");
                                int userId = reader.GetInt32("user_id");
                                // Vérification du mot de passe
                                bool isPasswordValid = Crypt.VerifyPassword(newLogin.Password, salt, hashedPassword);
                                if (isPasswordValid)
                                {
                                    string token = GenerateJwtToken(userId, newLogin.UserName);
                                    return Ok(new
                                    {
                                        Message = "Connexion réussie.",
                                        Token = token
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
        private string GenerateJwtToken(int userId, string username)
        {
            string secretKey = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "DefaultSecretKey";
            JwtHelper jwtHelper = new JwtHelper(secretKey);
            return jwtHelper.GenerateJwtToken(userId, username);
        }

        
        [HttpPost]
        [Route("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult ForgotenPassword([FromBody] ForgotenPasswordModel forgotenPassword)
        {
            try 
            {
                if (!Checks.IsValidMail(forgotenPassword.mail) && !Checks.IsValidUserName(forgotenPassword.UserName))
                {
                    return BadRequest("Invalide username or email");
                }
                string ForgotenPasswordLink = Environment.GetEnvironmentVariable("ROOT_URL") + "/Auth/ForgotenPassword/" + Guid.NewGuid().ToString();
                DbHelper db = new();
                using (MySqlConnection dbClient = db.GetOpenConnection())
                {
                    using (MySqlCommand cmd = new MySqlCommand("CheckUserExist", dbClient))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@inputUsername", forgotenPassword.UserName);
                        cmd.Parameters.AddWithValue("@inputMail", forgotenPassword.mail);
                        MySqlParameter existsParam = new MySqlParameter("@userExists", MySqlDbType.Int32)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(existsParam);

                        cmd.ExecuteNonQuery();

                        // Vérifiez si l'utilisateur existe
                        int userExists = Convert.ToInt32(existsParam.Value);
                        if (userExists == 0)
                        {
                            Notify.SendForgotenPasswordMail(forgotenPassword.mail, ForgotenPasswordLink);
                            return Ok("If informations are valid, a mail will be sent to the adress");
                        }
                    }
                    return Ok("If informations are valid, a mail will be sent to the adress");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur : {ex.Message}");
                return StatusCode(500, "An error occurred. Please try again later.");
            }
        }
    }
}