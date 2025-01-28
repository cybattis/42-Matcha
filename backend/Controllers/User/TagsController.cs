using System.Data;
using backend.Database;
using backend.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers.User;

[ApiController]
[Authorize]
[Route("[controller]")]
public class TagsController(ILogger<TagsController> logger): ControllerBase
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
    public async Task<ActionResult> GetList()
    {
        try {
            var tags = new List<TagModel>();
            
            await using MySqlConnection conn = DbHelper.GetOpenConnection();
            await using MySqlCommand cmd = new MySqlCommand("GetAllTags", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            
            using var reader = cmd.ExecuteReaderAsync();
            while (await reader.Result.ReadAsync()) {
                var tag = new TagModel(reader.Result["id"] as int? ?? 0, reader.Result["name"] as string ?? "");
                tags.Add(tag);
            }
            return Ok(tags);
        }
        catch (MySqlException e) {
            logger.LogError(message: e.Message);
            return Problem(title: "Server error", detail: "");
        }
    }
    
    /// <summary>
    /// Update user tag
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="tagId">tag id</param>
    /// <response code="200">Tag updated</response>
    /// <response code="400">Bad request</response>
    [HttpPost]
    [Route("[action]/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult UpdateTag(int id, [FromForm] int tagId)
    {
        try {
            if (tagId < 1)
                return BadRequest("Invalid tag id");
            
            using MySqlConnection conn = DbHelper.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("UpdateTag", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userID", id);
            cmd.Parameters.AddWithValue("@tagID", tagId);
            cmd.ExecuteNonQuery();
            return Ok("Tag updated");
        }
        catch (MySqlException e) {
            logger.LogError(e.Message);
            return Problem(detail: e.Message);
        }
    }
}