using System.Net.WebSockets;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers.Websocket;

[Authorize]
public class WebSocketController(ILogger<WebSocketController> logger) : ControllerBase
{
    private readonly ILogger<WebSocketController> _logger = logger;
    private readonly Dictionary<int, WebSocket> _sockets = [];

    [Route("/ws/{id}")]
    [SwaggerIgnore]
    public async Task Get(int id)
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            _sockets.Add(id, webSocket);
            await Echo(id);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    private async Task Echo(int id)
    {
        var webSocket = _sockets[id];
        var buffer = new byte[1024 * 4];
        var receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        
        try {
            while (!receiveResult.CloseStatus.HasValue)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
                Console.WriteLine($"Received Count {receiveResult.Count}: {message} ");
                
                if (receiveResult.MessageType == WebSocketMessageType.Close) 
                {
                    if (webSocket.State == WebSocketState.Open && receiveResult.CloseStatus.HasValue)
                    {
                        await webSocket.CloseOutputAsync(
                            receiveResult.CloseStatus.Value,
                            receiveResult.CloseStatusDescription,
                            CancellationToken.None);
                        _sockets.Remove(id);
                        Console.WriteLine("Connection closed");
                    }
                }
                
                if (message == "ping")
                {
                    await webSocket.SendAsync(
                        new ArraySegment<byte>(Encoding.UTF8.GetBytes("pong")),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None);
                }
                
                await webSocket.SendAsync(
                    new ArraySegment<byte>(buffer, 0, receiveResult.Count),
                    receiveResult.MessageType,
                    receiveResult.EndOfMessage,
                    CancellationToken.None);
                
                buffer = new byte[1024 * 4];
                receiveResult = await webSocket.ReceiveAsync(
                    new ArraySegment<byte>(buffer), CancellationToken.None);
            }
        } catch (Exception e) {
            Console.WriteLine(e);
            
        }
    }
}