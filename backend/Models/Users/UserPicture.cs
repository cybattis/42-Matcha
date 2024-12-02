namespace backend.Models.Users;

public class UserPicture
{
    public int position { get; set; }
    
    public IFormFile data { get; set; }
}