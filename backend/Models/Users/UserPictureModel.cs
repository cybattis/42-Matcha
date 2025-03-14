namespace backend.Models.Users;

public class UserPictureModel
{
    public int Position { get; set; }
    
    public IFormFile Data { get; set; } = null!;
}