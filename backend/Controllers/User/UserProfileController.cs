using System.Data;
using System.Net.Mime;
using backend.Database;
using backend.Models.Users;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers.User;

[ApiController]
[Route("[controller]")]
public class UserProfileController(ILogger<UserProfileController> logger) : ControllerBase
{
    private readonly IDbHelper _db = new DbHelper();
    
    /// <summary>
    /// Create user profile
    /// </summary>
    /// <param name="id">User ID</param>
    /// <response code="200">Success</response>
    /// <response code="400">Bad request</response>
    [HttpGet]
    [Route("[action]/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult Get(int id)
    {
        try {
            using MySqlConnection conn = _db.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("GetUserProfile", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userId", id);
            
            using MySqlDataReader reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                var profile = new UserProfile
                {
                    FirstName = reader["first_name"].ToString() ?? "",
                    LastName = reader["last_name"].ToString() ?? "",
                    GenderId = reader["gender_id"] as int?,
                    SexualOrientation = reader["sexual_orientation"] as int?,
                    Biography = reader["biography"].ToString() ?? "",
                    Localisation = reader["localisation"].ToString() ?? "",
                };

                // Tags
                if (reader.NextResult()) {
                    while (reader.Read())
                        profile.Tags.Add(reader["tag_id"] as int? ?? 0);
                } 
                
                // Pictures
                if (reader.NextResult())
                {
                    while (reader.Read())
                        profile.Images.Add(reader["image_url"] as string ?? "");
                }
                reader.Close();
                return Ok(profile);
            }
            return new BadRequestResult();
        }
        catch (MySqlException e)
        {
            logger.LogError(e.Message);
            return Problem(statusCode: 500, detail: e.Message);
        }
    }  

    /// <summary>
    /// Create user profile
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="data">User input data</param>
    /// <response code="200">profile created</response>
    /// <response code="400">Bad request</response>
    [HttpPost]
    [Route("[action]/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult Create(int id, [FromForm] UserProfile data)
    {
        try {
            using MySqlConnection conn = _db.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("CreateUserProfile", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@_user_id", id);
            cmd.Parameters.AddWithValue("@_first_name", data.FirstName);
            cmd.Parameters.AddWithValue("@_last_name", data.LastName);
            cmd.Parameters.AddWithValue("@_gender_id", data.GenderId);
            cmd.Parameters.AddWithValue("@_sexual_orientation", data.SexualOrientation);
            cmd.Parameters.AddWithValue("@_biography", data.Biography);
            cmd.Parameters.AddWithValue("@_localisation", data.Localisation);
            
            // Tags
            for (int i = 0; i < 5; i++) {
                if (i >= data.Tags.Count || data.Tags[i] == 0) {
                    cmd.Parameters.AddWithValue("@_tag"+ (i + 1), null);
                    continue;
                }
                cmd.Parameters.AddWithValue("@_tag"+ (i + 1), data.Tags[i]);
            }
            cmd.ExecuteNonQuery();
            return Ok("Profile successfully created");
        }
        catch (MySqlException e)
        {
            logger.LogError(e.Message);
            return Problem(statusCode: 500, detail: e.Message);
        }
    }
    
    /// <summary>
    /// Update user profile
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="data">User data</param>
    /// <response code="201">profile updated</response>
    /// <response code="400">Bad request</response>
    [HttpPatch]
    [Route("[action]/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult Update(int id, [FromBody] UserProfile data)
    {
        return new AcceptedResult();
    }
    
    /// <summary>
    /// Delete user profile
    /// </summary>
    /// <param name="id">User ID</param>
    /// <response code="201">profile updated</response>
    /// <response code="400">Bad request</response>
    [HttpDelete]
    [Route("[action]/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult Delete(int id)
    {
        return new AcceptedResult();
    }
}