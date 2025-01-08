using System.Security.Cryptography;
using System.Text;

namespace backend.Utils;

public static class Crypt 
{
    public static (string salt, string hashedPassword) CryptPassWord(string password)
    {
        // Génère un sel aléatoire
        var saltBytes = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }
        string salt = Convert.ToBase64String(saltBytes);

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

    /// <summary>
    /// Verify a password against a stored salt and hash.
    /// </summary>
    /// <param name="password">The plain text password</param>
    /// <param name="salt">The salt used during hashing</param>
    /// <param name="hashedPassword">The hashed password to compare against</param>
    /// <returns>True if the password matches, false otherwise</returns>
    public static bool VerifyPassword(string password, string salt, byte[] hashedPassword)
    {
        // Concatène le sel au mot de passe
        string saltedPassword = salt + password;

        // Hache le mot de passe avec le même algorithme
        using var sha256 = SHA256.Create();
        byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
        
        string inputPassword = Convert.ToBase64String(hashBytes);
        string storedPassword = Convert.ToBase64String(hashedPassword);
        Console.WriteLine(inputPassword, storedPassword);

        // Compare les hachages
        return inputPassword == storedPassword;
        
    }
}