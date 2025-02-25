using System.Data;
using backend.Database;
using backend.Models.Match;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers.Match;

[ApiController]
[Authorize]
[Route("[controller]")]
public class MatchController(ILogger<MatchController> logger): ControllerBase
{
    /// <summary>
    /// Get tags list
    /// </summary>
    /// <response code="200">Tag lists</response>
    /// <response code="500">Error serveur</response>
    [HttpGet]
    [Route("[action]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Get([FromHeader] string authorization)
    {
        var id = JwtHelper.DecodeJwtToken(authorization);
        
        try {
            var matches = new List<MatchModel>();
            
            await using MySqlConnection conn = DbHelper.GetOpenConnection();
            await using MySqlCommand cmd = new MySqlCommand("GetUserMatches", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userID", id);
            
            using var reader = cmd.ExecuteReaderAsync();
            while (await reader.Result.ReadAsync()) {
                var match = new MatchModel
                {
                    FirstName = reader.Result["first_name"].ToString() ?? "",
                    LastName = reader.Result["last_name"].ToString() ?? "",
                    ImageUrl = reader.Result["image_url"].ToString() ?? ""
                };
                matches.Add(match);
            }
            
            return Ok(matches);
        }
        catch (MySqlException e) {
            logger.LogError(message: e.Message);
            return Problem(title: "Server error", detail: "");
        }
    }
}