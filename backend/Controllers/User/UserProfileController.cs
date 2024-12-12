using System.Data;
using backend.Database;
using backend.Models.Users;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers.User;

[ApiController]
[Route("[controller]")]
public class UserProfileController(ILogger<UserProfileController> logger) : ControllerBase
{
    /// <summary>
    /// Get user profile
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
            using MySqlConnection conn = DbHelper.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("GetUserProfile", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userID", id);
            
            using MySqlDataReader reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                var profile = new UserProfileModel
                {
                    FirstName = reader["first_name"].ToString() ?? "",
                    LastName = reader["last_name"].ToString() ?? "",
                    GenderId = reader["gender_id"] as int?,
                    SexualOrientation = reader["sexual_orientation"] as int?,
                    Biography = reader["biography"].ToString() ?? "",
                    Coordinates = reader["coordinates"].ToString() ?? "",
                };

                // Tags
                if (reader.NextResult()) {
                    while (reader.Read())
                        profile.Tags.Add(reader["tag_id"] as int? ?? 0);
                } 
                
                // Pictures
                if (reader.NextResult()) {
                    while (reader.Read())
                        profile.Images.Add(reader["image_url"] as string ?? "");
                }
                // reader.Close();
                return Ok(profile);
            }
            return ValidationProblem();
        }
        catch (MySqlException e)
        {
            logger.LogError(e.Message);
            return Problem(detail: e.Message);
        }
    }

    /// <summary>
    /// Update user profile
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="data">User input data</param>
    /// <response code="200">profile updated</response>
    /// <response code="400">Bad request</response>
    [HttpPost]
    [Route("[action]/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult Update(int id, [FromForm] UserProfileModel data)
    {
        var result = Checks.ValidateProfileData(data);
        if (!result.IsValid)
            return BadRequest(result.Message);
        
        try {
            using MySqlConnection conn = DbHelper.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("UpdateUserProfile", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userID", id);
            cmd.Parameters.AddWithValue("@firstName", data.FirstName);
            cmd.Parameters.AddWithValue("@lastName", data.LastName);
            cmd.Parameters.AddWithValue("@genderID", data.GenderId);
            cmd.Parameters.AddWithValue("@sexualOrientation", data.SexualOrientation);
            cmd.Parameters.AddWithValue("@biography", data.Biography);
            cmd.Parameters.AddWithValue("@coordinates", data.Coordinates);
            cmd.ExecuteNonQuery();
            return Ok("Profile successfully updated");
        }
        catch (MySqlException e) {
            logger.LogError(e.Message);
            return Problem(detail: e.Message);
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