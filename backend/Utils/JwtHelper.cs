using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Utils.Auth
{
    public class JwtHelper
    {
        private readonly string _secretKey;

        public JwtHelper(string secretKey)
        {
            _secretKey = secretKey;
        }

        /// <summary>
        /// Génère un JWT avec les informations de l'utilisateur.
        /// </summary>
        /// <param name="userId">L'identifiant unique de l'utilisateur</param>
        /// <param name="username">Le nom d'utilisateur</param>
        /// <returns>Un token JWT signé</returns>
        public string GenerateJwtToken(int userId, string username)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()), // Identifiant utilisateur
                new Claim("username", username),                          // Nom d'utilisateur
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // ID unique du JWT
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString(), ClaimValueTypes.Integer64) // Date d'émission
            };

            var token = new JwtSecurityToken(
                issuer: "matcha",                // Issuer : Identifiant de l'application
                audience: "matcha-users",        // Audience : Destinataires du token
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), // Expiration (1 heure)
                signingCredentials: credentials    // Clé de signature
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
