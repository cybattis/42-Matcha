using backend.Models.Chat;

namespace backend.Services;

public class ChatService
{
    public void SendMessage(string message)
    {
        var newMessage = new MessageModel
        {
            Id = 1,
            SenderId = 1,
            ReceiverId = 2,
            Timestamp = DateTime.Now,
            Content = message,
            Status = 0
        };
    }
}