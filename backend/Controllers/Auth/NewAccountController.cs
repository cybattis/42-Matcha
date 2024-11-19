using backend.Models.Users;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Tls;

namespace backend.Controllers.Auth;

[ApiController]
[Route("Auth/[controller]")]
public class NewAccountController : ControllerBase
{
    private string ResponseMessage = "";
    
    private bool CheckUserInfo(NewAccountModel newAccount){
        if (!Checks.IsValidEmail(newAccount.Mail)) {
            ResponseMessage += "L'adresse e-mail est invalide. Veuillez fournir une adresse e-mail valide.";
            return false;
        }
        if (!Checks.IsValidUserName(newAccount.UserName))
        {
            return false;
        }
        if (string.IsNullOrEmpty(ResponseMessage)){
            return true;
        }
        ResponseMessage += "an error occured during the User info Check";
        return false;
    }
    
    [HttpPost]
    public IActionResult CreateNewAccount([FromBody] NewAccountModel newAccount)
    {
        try {
            if (!CheckUserInfo(newAccount)) {
                return new ObjectResult(new
                {
                    Error = "InvalidEmail",
                    Message = "L'adresse e-mail est invalide."
                })
                {
                    StatusCode = 400
                };
            }
            // Exemple d'ajout de logique
            Console.WriteLine($"Creating account for {newAccount.UserName}");

            return Ok("Account created successfully.");
        }
        catch (Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest(new {
               Error = "An error occured",
               Message = $"{e.Message}"
            });
        }
    }
}