using backend.Models.Auth;
using backend.Database;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Data;
using backend.Utils;

namespace backend.Controllers.Auth;

[ApiController]
[route("Auth/")]
public class LoginController : ControllerBase
{

    [HttpPost]
    [route("[action]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public IActionResult Login([FromBody] LoginModel newLogin)
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

            using MySqlConnection dbClient = DbHelper.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("GetUserPasswordByUsername", dbClient);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@inputUsername", newLogin.UserName);

            using MySqlDataReader reader = cmd.ExecuteReader();
            if (!reader.Read())
            {
                return Unauthorized(new { Error = "UserNotFound", Message = "Utilisateur introuvable." });
            }
            
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
            return Unauthorized(new
            {
                Error = "InvalidCredentials",
                Message = "Mot de passe incorrect."
            });
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
    [route("[action]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult ForgotenPassword([FromBody] ForgottenPasswordModel forgottenPassword)
    {
        try 
        {
            if (!Checks.IsValidMail(forgottenPassword.Email) && !Checks.IsValidUserName(forgottenPassword.UserName))
            {
                return BadRequest("Invalide username or email");
            }
            //Environment.GetEnvironmentVariable("ROOT_URL") + "/Auth/ForgotenPassword/" +
            string forgotenPasswordLink =  Guid.NewGuid().ToString();
            using MySqlConnection dbClient = DbHelper.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("CheckUserExist", dbClient);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@inputUsername", forgottenPassword.UserName);
            cmd.Parameters.AddWithValue("@inputMail", forgottenPassword.Email);
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
                if (forgottenPassword.Email != null)
                    Notify.SendForgottenPasswordMail(forgottenPassword.Email, forgotenPasswordLink);
                return Ok("If informations are valid, a mail will be sent to the adress");
            }

            return Ok("If informations are valid, a mail will be sent to the adress");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erreur : {ex.Message}");
            return StatusCode(500, "An error occurred. Please try again later.");
        }
    }
}