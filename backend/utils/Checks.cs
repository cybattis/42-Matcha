using System;
using System.ComponentModel;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace utils.Checks{

    public class Checks {
        public static bool IsValidEmail(string? email)
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

        public static bool IsValidUserNameFormat(string UserName){
            var regex = new Regex("^[a-zA-Z][a-zA-Z0-9_-]{3,20}$");
            return regex.IsMatch(UserName);
        }
        public static bool IsValidUserName(string? UserName){
            if (string.IsNullOrEmpty(UserName)){
                return false;
            }
            if (IsValidUserNameFormat())
            return true;
        }
    }
}