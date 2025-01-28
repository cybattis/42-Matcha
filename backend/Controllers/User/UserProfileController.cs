using System.Data;
using backend.Database;
using backend.Models.Users;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers.User;

[ApiController]
[Authorize]
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
    public async Task<ActionResult> Get(int id)
    {
        try {
            await using MySqlConnection conn = DbHelper.GetOpenConnection();
            await using MySqlCommand cmd = new MySqlCommand("GetUserProfile", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userID", id);
            
            await using MySqlDataReader reader = cmd.ExecuteReader();
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
                await reader.CloseAsync();
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
    /// Get user profile
    /// </summary>
    /// <response code="200">Success</response>
    /// <response code="400">Bad request</response>
    [HttpGet]
    [Route("[action]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Me()
    {
        //Decode token
        //Get user id from token
        Request.Headers.TryGetValue("Authorization", out var token);
        Console.WriteLine(token.ToString());
        
        try {
            await using MySqlConnection conn = DbHelper.GetOpenConnection();
            await using MySqlCommand cmd = new MySqlCommand("GetUserProfile", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userID", 1);

            await using MySqlDataReader reader = cmd.ExecuteReader();
            if (!reader.Read()) return ValidationProblem();
            
            var profile = new UserProfileModel
            {
                FirstName = reader["first_name"].ToString() ?? "",
                LastName = reader["last_name"].ToString() ?? "",
                GenderId = reader["gender_id"] as int?,
                SexualOrientation = reader["sexual_orientation"] as int?,
                Biography = reader["biography"].ToString() ?? "",
                Coordinates = reader["coordinates"].ToString() ?? "",
                IsVerified = reader["is_verified"] as bool? ?? false,
                ProfileCompletionPercentage = reader["profile_completion_percentage"] as int? ?? 0,
                FameRating = reader["fame"] as int? ?? 0
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
            await reader.CloseAsync();
            
            // logger.LogInformation("{profile}", profile.ToString());
                
            return Ok(profile);
        }
        catch (MySqlException e)
        {
            // logger.LogError("{e}", e.Message);
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
}