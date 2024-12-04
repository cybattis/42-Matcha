using System.Net.Mail;

namespace utils.Notify {
    public class Notify {
        public static void SendVerificationEmail(string email, string verificationLink)
        {
            try
            {
                // TODO a voir pour modif le ?? et mettre des vrai valeur par defaut
                string smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? "smtp.gmail.com";
                int smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? "587");
                string smtpUser = Environment.GetEnvironmentVariable("NO_REPLY_MAIL") ?? "3000"; // Votre adresse Gmail
                string smtpPass = Environment.GetEnvironmentVariable("NO_REPLY_MAIL_PASSWORD") ?? "localhost:3000"; // Mot de passe d'application Gmail

                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress(smtpUser, "Matcha");
                    mail.To.Add(email);
                    mail.Subject = "Verify Your Email Address";
                    //TODO rendre ca plus joli
                    mail.Body = $@"
                        <html>
                        <body>
                            <h1>Welcome to Matcha!</h1>
                            <p>Click the link below to verify your email address:</p>
                            <a href='{verificationLink}'>Verify Email</a>
                            <p>If you didn't request this, you can ignore this email.</p>
                        </body>
                        </html>";
                    mail.IsBodyHtml = true;

                    using (SmtpClient smtp = new SmtpClient(smtpHost, smtpPort))
                    {
                        smtp.Credentials = new System.Net.NetworkCredential(smtpUser, smtpPass);
                        smtp.EnableSsl = true; // Sécurise la connexion
                        smtp.Send(mail);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
                throw;
            }
        }
    }
}
