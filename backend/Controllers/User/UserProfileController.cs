using System.Data;
using backend.Database;
using backend.Models;
using backend.Models.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers.User;

[ApiController]
[Route("[controller]")]
public class UserProfileController(ILogger<UserProfileController> logger) : ControllerBase
{
    private readonly IDbHelper _db = new DbHelper();
    
    [Route("[action]/{id:int}")] 
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult Get(int id)
    {
        try {
            using (MySqlCommand cmd = new MySqlCommand("GetUserProfile", _db.GetConnection()))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userId", id);
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
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
                            Tag1 = reader["tag1"] as int?,
                            Tag2 = reader["tag2"] as int?,
                            Tag3 = reader["tag3"] as int?,
                            Tag4 = reader["tag4"] as int?,
                            Tag5 = reader["tag5"] as int?,
                            Picture1 = reader["picture1"].ToString() ?? "",
                            Picture2 = reader["picture2"].ToString() ?? "",
                            Picture3 = reader["picture3"].ToString() ?? "",
                            Picture4 = reader["picture4"].ToString() ?? "",
                            Picture5 = reader["picture5"].ToString() ?? ""
                        };
                        
                        return Ok(profile);
                    }
                    return new BadRequestResult();
                }
            }
        }
        catch (MySqlException ex)
        {
            logger.LogError(ex.Message);
            return Problem(statusCode: 500, detail: ex.Message);
        }
    }  

    /// <summary>
    /// Create user profile
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="data">User data</param>
    /// <response code="200">profile created</response>
    /// <response code="400">Bad request</response>
    [Route("Create/{id:int}")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult CreateProfile(int id, [FromBody] UserProfile data)
    {
        try {
            using (MySqlCommand cmd = new MySqlCommand("CreateUserProfile", _db.GetConnection()))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userId", id);
                cmd.Parameters.AddWithValue("@_first_name", data.FirstName);
                cmd.Parameters.AddWithValue("@_last_name", data.LastName);
                cmd.Parameters.AddWithValue("@_gender_id", data.GenderId);
                cmd.Parameters.AddWithValue("@_sexual_orientation", data.SexualOrientation);
                cmd.Parameters.AddWithValue("@_biography", data.Biography);
                cmd.Parameters.AddWithValue("@_localisation", data.Localisation);
                cmd.ExecuteNonQuery();
            }
            return Ok("Profile successfully created");
        }
        catch (MySqlException ex)
        {
            logger.LogError(ex.Message);
            return new BadRequestResult();
        }
    }
    
    /// <summary>
    /// Update user profile
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="data">User data</param>
    /// <response code="201">profile updated</response>
    /// <response code="400">Bad request</response>
    [Route("Update/{id:int}")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult UpdateProfile(int id, [FromBody] UserProfile data)
    {
        return new AcceptedResult();
    }
}