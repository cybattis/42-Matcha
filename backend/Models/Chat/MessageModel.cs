using Newtonsoft.Json;

namespace backend.Models.Chat;

public class WebsocketMessage
{
    [JsonProperty]
    public string? Message { get; set; }
    [JsonProperty]
    public object? Data { get; set; }
}

public class MessageModel
{
    // [JsonIgnore]
    // public int Id { get; set; }
    [JsonIgnore]
    public int SenderId { get; set; }
    [JsonProperty]
    public int ReceiverId { get; set; }
    [JsonProperty]
    public string? Timestamp { get; set; }
    [JsonProperty]
    public string? Message { get; set; }
}

public class NotificationModel
{
    [JsonIgnore]
    public int Id { get; set; }
    [JsonProperty]
    public string? Content { get; set; }
    [JsonProperty]
    public string? Timestamp { get; set; } 
    [JsonProperty]
    public int Status { get; set; }
}