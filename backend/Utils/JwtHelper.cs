using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Utils;

public class JwtHelper
{
    /// <summary>
    /// Génère un JWT avec les informations de l'utilisateur.
    /// </summary>
    /// <param name="userId">L'identifiant unique de l'utilisateur</param>
    /// <param name="username">Le nom d'utilisateur</param>
    /// <returns>Un token JWT signé</returns>
    public string GenerateJwtToken(int userId, string username)
    {
        string secretKey = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "";
        var issuer = Environment.GetEnvironmentVariable("JWT_Issuer") ?? "";
        var audience = Environment.GetEnvironmentVariable("JWT_Audience") ?? "";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim("Id", Guid.NewGuid().ToString()),
                new Claim("username", username),
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString(CultureInfo.InvariantCulture), ClaimValueTypes.Integer64),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            ]),
            Expires = DateTime.UtcNow.AddMinutes(5),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        // var jwtToken = tokenHandler.WriteToken(token);
        var stringToken = tokenHandler.WriteToken(token);
        return stringToken;
    }
}
