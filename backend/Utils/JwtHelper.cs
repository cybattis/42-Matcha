using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Utils;

public static class JwtHelper
{
    /// <summary>
    /// Génère un JWT avec les informations de l'utilisateur.
    /// </summary>
    /// <param name="userId">L'identifiant unique de l'utilisateur</param>
    /// <param name="username">Le nom d'utilisateur</param>
    /// <returns>Un token JWT signé</returns>
    public static string GenerateJwtToken(int userId, string username)
    {
        var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "";
        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "";
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim("Id", Guid.NewGuid().ToString()),
                new Claim("Username", username),
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString(CultureInfo.InvariantCulture), ClaimValueTypes.Integer64),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            ]),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var stringToken = tokenHandler.WriteToken(token);
        return stringToken;
    }
    
    public static (int id, string username) DecodeJwtToken(string authorization)
    {
        var token = authorization.Replace("Bearer ", "");
        var handler = new JwtSecurityTokenHandler();
        var tokenS = handler.ReadToken(token) as JwtSecurityToken;
        var id = int.Parse(tokenS?.Claims.First(claim => claim.Type == "sub").Value ?? "0");
        var username = tokenS?.Claims.First(claim => claim.Type == "Username").Value ?? "";
        
        return (id, username);
    }
}
