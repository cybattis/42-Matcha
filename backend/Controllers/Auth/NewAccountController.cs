using System.ComponentModel;
using backend.Database;
using backend.Models.Users;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Tls;
using Utils.Checks;
using Utils.Crypt;
using Utils.Notify;

namespace backend.Controllers.Auth{
    [ApiController]
    [Route("Auth/")]
    public class NewAccountController : ControllerBase
    {
        private class NewAccountResponse {
            public string? UserName { get; set; }
            public string? Password { get; set; }
            public string? Mail { get; set; }
            public string? BirthDate { get; set; }
            public NewAccountResponse()
            {
                UserName = "";
                Password = "";
                Mail = "";
                BirthDate = "";
            }
        }
        private NewAccountResponse ResponseMessage = new NewAccountResponse();
        private bool CheckUserInfo(NewAccountModel newAccount){
            if (!Checks.IsValidUserName(newAccount.UserName))
            {
                // verif si il respecte les conditions de nomage et aussi si il n'existe pas deja
                return false;
            }
            if (Checks.IsValidPassword(newAccount.Password, newAccount.UserName))
            {
                ResponseMessage.Password = "Mot de passe incorect:\nIl faut au moins 1 majuscule 1 minuscule 1 caractere special et 1 chiffre\nLe mot de passe doit faire au moins 8 caracteres";

            }
            if (!Checks.IsValidMail(newAccount.Mail)) {
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
                DbHelper db = new ();
                using (MySqlConnection dbClient = db.GetConnection()){
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

                    //TODO ENDPOINT VALID ACCOUNT
                    string verificationLink = Environment.GetEnvironmentVariable("ROOT_URL") + "/Auth/verifyAccount/" + Guid.NewGuid().ToString();
                    (string salt, string hashedPassword) = Crypt.cryptPassWord("userPassword123");
                    newAccount.Password = hashedPassword;
                    using (MySqlCommand cmd = new MySqlCommand("InsertNewAccount", dbClient))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@userName", newAccount.UserName);
                        cmd.Parameters.AddWithValue("@userPassword", newAccount.Password);
                        cmd.Parameters.AddWithValue("@userMail", newAccount.Mail);
                        cmd.Parameters.AddWithValue("@userBirthDate", newAccount.BirthDate);
                        cmd.Parameters.AddWithValue("@verificationLink", verificationLink);
                        cmd.Parameters.AddWithValue("@salt", verificationLink);
                        cmd.ExecuteNonQuery();
                    }
                    Notify.SendVerificationEmail(newAccount.Mail, verificationLink);
                }
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
        [Route("[action]/{verificationID:string}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult verifyAccount(string verificationID){
            
            return Ok("Verification completed");
        }
    }
}