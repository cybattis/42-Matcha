namespace backend.Models.Users;

public class TagModel(int id, string name)
{
    public int Id { get; set; } = id;
    public string Name { get; set; } = name;
}