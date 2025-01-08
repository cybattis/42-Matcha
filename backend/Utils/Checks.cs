using System.Net.Mail;
using System.Text.RegularExpressions;
using backend.Database;
using backend.Models.Users;
using MySql.Data.MySqlClient;

namespace backend.Utils;

public static class Checks {

    public static bool IsValidMail(string? email)
    {
        // Vérification si l'e-mail est null
        if (string.IsNullOrEmpty(email))
        {
            return false;
        }

        // Validation du format de l'e-mail
        try
        {
            var mailAddress = new MailAddress(email);
        }
        catch (FormatException)
        {
            return false; // Format invalide
        }

            // Vérification en base de données
        try
        {
            DbHelper db = new();
            using MySqlConnection dbClient = DbHelper.GetOpenConnection();

            using MySqlCommand cmd = new MySqlCommand("CheckMailTaken", dbClient);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userMail", email);

            // La procédure stockée renvoie un entier ou un booléen
            var result = cmd.ExecuteScalar();

            // Si la procédure renvoie 1 ou "true", l'e-mail est déjà pris
            if (result != null && Convert.ToInt32(result) > 0)
            {
                return false; // E-mail déjà pris
            }
        }
        catch (Exception ex)
        {
            // Log l'erreur ou gérer comme nécessaire
            Console.WriteLine($"Erreur lors de la vérification de l'e-mail : {ex.Message}");
            return false;
        }

        return true; // E-mail valide et disponible
    }


    public static bool IsValidPassword(string? password, string UserName)
    {
        if (password == null)
        {
            return false;
        }
        string pattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$";
        if (!Regex.IsMatch(password, pattern))
        {
            return false;
        }
        if (password.Contains(UserName))
        {
            return false;
        }
        return true;
    }

    public static bool IsValidBirthDate(DateTime? BirthDate)
    {
        if (BirthDate == null){
            return false;
        }
        DateTime today = DateTime.Today;
        int age = today.Year - BirthDate.Value.Year;
            
        if (BirthDate.Value.Date > today.AddYears(-age))
        {
            age--;
        }
        return age >= 18;
    }

    public static bool IsValidUserNameFormat(string UserName) {
        var regex = new Regex("^[a-zA-Z][a-zA-Z0-9_-]{5,20}$");
        return regex.IsMatch(UserName);
    }
        
    public static bool IsValidUserName(string? UserName) {
        if (string.IsNullOrEmpty(UserName)){
            return false;
        }
        if (!IsValidUserNameFormat(UserName))
        {
            return false;
        }
        try
        {
            DbHelper db = new();
            using MySqlConnection dbClient = DbHelper.GetOpenConnection();

            using MySqlCommand cmd = new MySqlCommand("CheckUserNameTaken", dbClient);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@username", UserName);

            // La procédure stockée doit renvoyer un entier ou un booléen
            object? result = cmd.ExecuteScalar();
        
            // Si la procédure renvoie 1 ou "true", le nom est pris
            if (result != null && Convert.ToInt32(result) > 0)
            {
                return false; // Nom d'utilisateur déjà pris
            }
        }
        catch (Exception ex)
        {
            // Log l'erreur ou gérer comme nécessaire
            Console.WriteLine($"Erreur lors de la vérification du nom d'utilisateur : {ex.Message}");
            return false;
        }
        return true;
    }
    
    public static bool IsAlpa(string str)
    {
        return str.All(char.IsLetter);
    }
    
    public static bool IsNumeric(string str)
    {
        return str.All(char.IsDigit);
    }
    
    public static bool IsDecimal(string str)
    {
        return decimal.TryParse(str, out _);
    }
    
    public static bool IsAlphaNumeric(string str)
    {
        return str.All(char.IsLetterOrDigit);
    }
    
    public static bool HasValidLength(string str, int min, int max)
    {
        return str.Length >= min && str.Length <= max;
    }
    
    public static bool IsCoordinate(string str)
    {
        var parts = str.Split(',');
        if (parts.Length != 2)
            return false;

        if (!IsDecimal(parts[0]) || !IsDecimal(parts[1]))
            return false;

        var latitude = decimal.Parse(parts[0]);
        var longitude = decimal.Parse(parts[1]);

        return latitude is >= -90 and <= 90 && longitude is >= -180 and <= 180;
    }
    
    public static bool IsValidBiography(string str)
    {
        var regex = new Regex(@"^[ A-Za-z0-9_@./#&+-]{0,280}$");
        return regex.IsMatch(str);
    }
    
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public string Message { get; set; } = "";
    }

    public static ValidationResult ValidateProfileData(UserProfileModel data)
    {
        if (data.FirstName == null || !IsAlpa(data.FirstName!))
            return new ValidationResult { IsValid = false, Message = "Invalid first name" };
        
        if (data.LastName == null || !IsAlpa(data.LastName!))
            return new ValidationResult { IsValid = false, Message = "Invalid last name" };
        
        if (data.GenderId is null or < 0 or > 2)
            return new ValidationResult { IsValid = false, Message = "Invalid"};
        
        if (data.SexualOrientation is null or < 0 or > 3)
            return new ValidationResult { IsValid = false, Message = "Invalid sexual orientation" };
        
        if (data.Biography == null || !IsValidBiography(data.Biography!))
            return new ValidationResult { IsValid = false, Message = "Invalid biography" };
        
        if (data.Coordinates == null || !HasValidLength(data.Coordinates!, 0, 25) || !IsCoordinate(data.Coordinates!))
            return new ValidationResult { IsValid = false, Message = "Invalid coordinates" };
        
        return new ValidationResult { IsValid = true };
    }
}