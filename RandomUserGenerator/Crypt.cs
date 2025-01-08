using System.Security.Cryptography;
using System.Text;

namespace RandomUserGenerator;

public static class Crypt 
{
    public static (string salt, byte[] hashedPassword) CryptPassWord(string password)
    {
        // Génère un sel aléatoire
        var saltBytes = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }
        string salt = Convert.ToBase64String(saltBytes).Substring(0, 16);

        // Concatène le sel au mot de passe
        string saltedPassword = salt + password;

        // Hache le mot de passe avec le sel
        using (var sha256 = SHA256.Create())
        {
            byte[] hashedPassword = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
            // string hashedPassword = Convert.ToBase64String(hashBytes);

            return (salt, hashedPassword);
        }
    }
}