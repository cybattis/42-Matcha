using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using backend.Models.Chat;
using Newtonsoft.Json;

namespace backend.Services;

public interface IWebSocketService
{
    public Task HandleWebsocket(WebSocket ws);
}

public class WebSocketService(ILogger<IWebSocketService> logger): IWebSocketService
{
    private readonly ConcurrentDictionary<int, WebSocket> _connections = new();
    
    public async Task HandleWebsocket(WebSocket ws)
    {
        var buffer = new byte[4096];
        var id = 0;
        
        try
        {
            WebSocketReceiveResult receiveResult;
            do {
                receiveResult = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                var data = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
                                
                if (data == "ping") {
                    await ws.SendAsync(
                        new ArraySegment<byte>(Encoding.UTF8.GetBytes("pong")),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None);
                    continue;
                }
                
                dynamic message = JsonConvert.DeserializeObject<WebsocketMessage>(data)!;
                if (message == null) {
                    logger.LogError("Failed to deserialize message");
                    continue;
                }
                
                logger.LogDebug($"MESSAGE: {message.Message}");
                
                if (receiveResult.MessageType == WebSocketMessageType.Close) 
                {
                    if (ws.State == WebSocketState.Open && receiveResult.CloseStatus.HasValue)
                    {
                        await ws.CloseOutputAsync(
                            receiveResult.CloseStatus.Value,
                            receiveResult.CloseStatusDescription,
                            CancellationToken.None);
                        if (id > 0 && !_connections.TryRemove(id, out _)) {
                            logger.LogError("Failed to remove socket");
                        }
                        logger.LogDebug($"Socket count: {_connections.Count}");
                        logger.LogDebug("Connection closed");
                        return;
                    }
                }
                
                if (message.Message == "connection")
                {
                    logger.LogInformation("Connection request");
                    
                    id = Utils.JwtHelper.DecodeJwtToken(message.Data as string ?? "");
                    if (_connections.ContainsKey(id)) {
                        logger.LogWarning("Connection already exists for id: {id}", id);
                        _connections.TryGetValue(id, out var existing);
                        _connections.TryUpdate(id, ws, existing!);
                    }
                    else
                    {
                        var tryAdd = _connections.TryAdd(id, ws);
                        if (!tryAdd) {
                            logger.LogError("Failed to add socket for id: {id}", id);
                        }
                    }
                    
                    logger.LogInformation($"Socket count: {_connections.Count}");
                    
                    var ack = new WebsocketMessage
                    {
                        Message = "ack",
                        Data = "Connection established"
                    };
                    var ackData = JsonConvert.SerializeObject(ack);
                    await ws.SendAsync(
                        new ArraySegment<byte>(Encoding.UTF8.GetBytes(ackData)),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None);
                }

                if (message.Message == "chat")
                {
                    logger.LogInformation("Chat message");
                    dynamic msg = JsonConvert.DeserializeObject<MessageModel>(message.Data.ToString());
                    if (msg == null) {
                        logger.LogError("Failed to deserialize message");
                        continue;
                    }
                    logger.LogInformation($"Chat message: {msg.Message} - {msg.Timestamp} - {msg.ReceiverId}");
                    if (!_connections.TryGetValue(msg.ReceiverId, out WebSocket receiver))
                    {
                        logger.LogError("Receiver not found");
                        continue;
                    }
                    
                    var msgData = new WebsocketMessage
                    {
                        Message = "chat",
                        Data = new MessageModel 
                        {
                            SenderId = id,
                            ReceiverId = msg.ReceiverId,
                            Timestamp = msg.Timestamp,
                            Message = msg.Message
                        }
                    };
                    var msgJson = JsonConvert.SerializeObject(msgData);
                    await receiver.SendAsync(
                        new ArraySegment<byte>(Encoding.UTF8.GetBytes(msgJson)),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None);
                    
                }
                
            } while (!receiveResult.CloseStatus.HasValue);
        }
        catch (WebSocketException wse)
        {
            if (id > 0 && !_connections.TryRemove(id, out _))
                logger.LogError("Failed to remove socket");
            logger.LogError($"WebSocketException: {wse.Message}");
            logger.LogError($"WebSocketException: {wse.StackTrace}");
        }
        catch (Exception e)
        {
            logger.LogError("{e}", e);
        }
    }
}