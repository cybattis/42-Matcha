namespace backend.Models.Chat;

public class MessageModel
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public DateTime Timestamp { get; set; }
    public string Content { get; set; }
    public int Status { get; set; }
}

public class NotificationModel
{
    public int Id { get; set; }
    public string Content { get; set; }
    public int Status { get; set; }
    public DateTime Timestamp { get; set; }
}