using System;
using System.ComponentModel;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace utils.Checks{

    public class Checks {
        public static bool IsValidMail(string? email)
        {
            if (email == null){
                return false;
            }
            try
            {
                var mailAddress = new MailAddress(email);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
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

            // Ajuster l'âge si l'anniversaire de cette année n'est pas encore passé
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
            return true;
        }
    }
}