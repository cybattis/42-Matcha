namespace backend.Models.Users;

public class UserPicture
{
    public int Position { get; set; }
    
    public IFormFile Data { get; set; } = null!;
}

public class SwapPicture
{
    public int Position { get; set; }
    
    public int NewPosition { get; set; }
}