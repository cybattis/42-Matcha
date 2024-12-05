using System.Net.Mail;
using MySql.Data.MySqlClient;

namespace backend.Utils;

public class Validator
{
    public static bool IsNull(object? str)
    {
        return str == null;
    }
    
    public static bool IsEmpty(string str)
    {
        return string.IsNullOrEmpty(str);
    }
    
    public static bool IsAlpa(string str)
    {
        foreach (char c in str)
        {
            if (!char.IsLetter(c))
                return false;
        }
        return true;
    }
    
    public static bool IsNumeric(string str)
    {
        foreach (char c in str)
        {
            if (!char.IsDigit(c))
                return false;
        }
        return true;
    }
    
    public static bool IsDecimal(string str)
    {
        return decimal.TryParse(str, out _);
    }
    
    public static bool IsAlphaNumeric(string str)
    {
        foreach (char c in str)
        {
            if (!char.IsLetterOrDigit(c))
                return false;
        }
        return true;
    }
    
    public static bool IsEmail(string email)
    {
        try {
            var mailAddress = new MailAddress(email);
        }
        catch (FormatException) {
            return false;
        }
        return true;
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

    public static bool ValidateProfileData(MySqlDataReader reader)
    {
        if (!reader.HasRows)
            return false;

        var firstName = reader["first_name"].ToString();
        if (IsNull(firstName) || !IsAlpa(firstName!))
            return false;

        var lastName = reader["last_name"].ToString();
        if (IsNull(lastName) || !IsAlpa(lastName!))
            return false;

        var genderId = reader["gender_id"] as int?;
        if (IsNull(genderId) || genderId < 0 || genderId > 2)
            return false;

        var sexualOrientation = reader["sexual_orientation"] as int?;
        if (IsNull(sexualOrientation) || sexualOrientation < 0 || sexualOrientation > 3)
            return false;

        var biography = reader["biography"].ToString();
        if (IsNull(biography) || !HasValidLength(biography!, 0, 280) || !IsAlphaNumeric(biography!))
            return false;

        var localisation = reader["localisation"].ToString();
        if (IsNull(localisation) || !HasValidLength(localisation!, 0, 25) || !IsCoordinate(localisation!))
            return false;

        return true;
    }
}