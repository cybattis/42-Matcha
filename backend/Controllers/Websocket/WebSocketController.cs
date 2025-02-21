using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using backend.Models.Chat;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers.Websocket;

public class WebSocketController : ControllerBase
{
    private readonly ConcurrentDictionary<int, WebSocket> _sockets = new();

    [SwaggerIgnore]
    [Route("/ws")]
    public async Task Get()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            try {
                await Echo(webSocket);
            } catch (Exception e) {
                Console.WriteLine(e);
            }
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    private async Task Echo(WebSocket ws)
    {
        var buffer = new byte[4096];
        
        try {
            var receiveResult = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (!receiveResult.CloseStatus.HasValue)
            {
                var data = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
                var message = JsonConvert.DeserializeObject<WebsocketMessage>(data)!;
                
                Console.WriteLine($"MESSAGE: {message.Message} - {message.Data}");
                
                if (receiveResult.MessageType == WebSocketMessageType.Close) 
                {
                    if (ws.State == WebSocketState.Open && receiveResult.CloseStatus.HasValue)
                    {
                        await ws.CloseOutputAsync(
                            receiveResult.CloseStatus.Value,
                            receiveResult.CloseStatusDescription,
                            CancellationToken.None);
                        // if (_sockets.TryRemove(id, out _) == false) {
                        //     Console.WriteLine("Failed to remove socket");
                        // }
                        Console.WriteLine("Connection closed");
                    }
                }
                
                if (data == "ping")
                {
                    await ws.SendAsync(
                        new ArraySegment<byte>(Encoding.UTF8.GetBytes("pong")),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None);
                }
                
                if (message.Message == "connection")
                {
                    Console.WriteLine("Connection request");
                    
                    var id = Utils.JwtHelper.DecodeJwtToken(message.Data as string ?? "");
                    Console.WriteLine($"Authenticated: {id}");
                    
                    _sockets.TryAdd(id, ws);
                }
                
                buffer = new byte[4096];
                receiveResult = await ws.ReceiveAsync(
                    new ArraySegment<byte>(buffer), CancellationToken.None);
            }
        }
        catch (WebSocketException wse)
        {
            Console.WriteLine($"WebSocketException: {wse.Message}");
            Console.WriteLine($"WebSocketException: {wse.StackTrace}");
            // if (_sockets.TryRemove(id, out _) == false)
            // {
            //     Console.WriteLine("Failed to remove socket");
            // }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }
}