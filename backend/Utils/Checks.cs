using System;
using System.ComponentModel;
using System.Net.Mail;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using backend.Database;
using MySql.Data.MySqlClient;

namespace utils.Checks{

    public class Checks {

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
                using (MySqlConnection dbClient = db.GetConnection())
                {
                    dbClient.Open();

                    using (MySqlCommand cmd = new MySqlCommand("CheckMailTaken", dbClient))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@userMail", email);

                        // La procédure stockée renvoie un entier ou un booléen
                        object? result = cmd.ExecuteScalar();

                        // Si la procédure renvoie 1 ou "true", l'e-mail est déjà pris
                        if (result != null && Convert.ToInt32(result) > 0)
                        {
                            return false; // E-mail déjà pris
                        }
                    }
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


        public static bool IsValidPassword(string? password, string? UserName)
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

        public static bool IsValidUserNameFormat(string UserName){
            var regex = new Regex("^[a-zA-Z][a-zA-Z0-9_-]{5,20}$");
            return regex.IsMatch(UserName);
        }
        
        public static bool IsValidUserName(string? UserName){
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
                using (MySqlConnection dbClient = db.GetConnection())
                {
                    dbClient.Open();

                    using (MySqlCommand cmd = new MySqlCommand("CheckUserNameTaken", dbClient))
                    {
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
    }
}