using System.Diagnostics;
using backend.Database;
using backend.Models.Users;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers.Auth;

[ApiController]
[Route("Auth/")]
public class NewAccountController : ControllerBase
{
    private class NewAccountResponse {
        public string? UserName { get; set; } = "";
        public string? Password { get; set; } = "";
        public string? Mail { get; set; } = "";
        public string? BirthDate { get; set; } = "";
    }
    
    private NewAccountResponse ResponseMessage = new NewAccountResponse();
    
    private bool CheckUserInfo(NewAccountModel newAccount)
    {
        if (!Checks.IsValidUserName(newAccount.UserName))
        {
            ResponseMessage.UserName = "Nom d'utilisateur invalide:\nIl doit contenir entre 3 et 20 caracteres\nIl ne doit pas contenir de caractere speciaux";
            return false;
        }
        if (Checks.IsValidPassword(newAccount.Password, newAccount.UserName))
        {
            ResponseMessage.Password = "Mot de passe incorect:\nIl faut au moins 1 majuscule 1 minuscule 1 caractere special et 1 chiffre\nLe mot de passe doit faire au moins 8 caracteres";
            return false;
        }
        if (!Checks.IsValidMail(newAccount.Email)) {
            ResponseMessage.Mail = "L'adresse e-mail est invalide. Veuillez fournir une adresse e-mail valide.";
            return false;
        }
        if (!Checks.IsValidBirthDate(newAccount.BirthDate)) {
            ResponseMessage.BirthDate = "Vous devez etre majeur pour vous inscrire.";
            return false;
        }
        return true;
    }
    
    [HttpPost]
    [Route("[action]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult CreateNewAccount([FromBody] NewAccountModel newAccount)
    {
        try {
            using MySqlConnection dbClient = DbHelper.GetConnection();
            if (!CheckUserInfo(newAccount)) {
                return new ObjectResult(new
                {
                    Error = "InvalidEmail",
                    Message = "L'adresse e-mail est invalide.",
                    Details = ResponseMessage
                })
                {
                    StatusCode = 400
                };
            }

            string verificationLink = Guid.NewGuid().ToString();
            (string salt, byte[] hashedPassword) = Crypt.CryptPassWord(newAccount.Password ?? throw new InvalidOperationException());

            using MySqlCommand cmd = new MySqlCommand("InsertNewAccount", dbClient);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userName", newAccount.UserName);
            cmd.Parameters.AddWithValue("@userPassword", hashedPassword);
            cmd.Parameters.AddWithValue("@userMail", newAccount.Email);
            cmd.Parameters.AddWithValue("@userBirthDate", newAccount.BirthDate);
            cmd.Parameters.AddWithValue("@verificationLink", verificationLink);
            cmd.Parameters.AddWithValue("@verificationIDExpiration", DateTime.UtcNow.AddHours(1));
            cmd.Parameters.AddWithValue("@salt", salt);
            cmd.ExecuteNonQuery();

            if (newAccount.Email != null) 
                Notify.SendVerificationEmail(newAccount.Email, verificationLink);
            return Ok(new {
                Message = "Account created successfully."
            });
        }
        catch (Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest(new {
                Error = "An error occured",
                Message = $"{e.Message}"
            });
        }
    }
    [HttpPost]
    [Route("[action]/{verificationID}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult VerifyAccount(string verificationID)
    {
        try
        {
            if (string.IsNullOrEmpty(verificationID)) {
                return BadRequest("Verification link incorrect");
            }

            using MySqlConnection dbClient = DbHelper.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("GetVerificationAccountInfo", dbClient);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@inputVerifyLink", verificationID);

            using MySqlDataReader reader = cmd.ExecuteReader();
            if (!reader.Read()) 
                return BadRequest("Verification link not found or invalid.");
            
            // Extraire les colonnes retournées
            int userId = reader.GetInt32("user_id");
            bool isVerified = reader.GetBoolean("is_verified");
            string emailVerificationLink = reader.GetString("email_verification_link");
            bool profileCompleted = reader.GetBoolean("profile_completed");
            string email = reader.GetString("email");
            DateTime forgotenPasswordLinkExpiration = reader.GetDateTime("forgoten_password_link_expiration");
            // Vérifier l'état de l'utilisateur
            if (isVerified)
            {
                return BadRequest("Account is already verified.");
            }
            if (emailVerificationLink != verificationID || forgotenPasswordLinkExpiration < DateTime.UtcNow)
            {
                return BadRequest("Email expired.");
            }
            // Mettez à jour l'état de vérification ici si nécessaire
            using MySqlCommand updateCmd = new MySqlCommand("assertAccountVerification", dbClient);
            updateCmd.Parameters.AddWithValue("@userId", userId);
            updateCmd.ExecuteNonQuery();

            return Ok("Verification completed successfully.");
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return StatusCode(500, new
            {
                Error = "ServerError",
                Message = "Une erreur interne est survenue. Veuillez réessayer."
            });
        }
    }
}