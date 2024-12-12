namespace backend.Models.Users
{
    public class NewAccountModel
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public DateTime BirthDate { get; set; }
    }
}
