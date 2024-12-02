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
                        profile.Images.Add(reader["image_data"] as byte[] ?? new byte[0]);
                }
                return Ok(profile);
            }
            return new BadRequestResult();
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
    /// <param name="data">User input data</param>
    /// <response code="200">profile created</response>
    /// <response code="400">Bad request</response>
    [HttpPost]
    [Route("Create/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult CreateProfile(int id, [FromForm] UserProfile data)
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
                if (i >= data.Tags.Count) {
                    cmd.Parameters.AddWithValue("@_tag"+ (i + 1), null);
                    continue;
                }
                cmd.Parameters.AddWithValue("@_tag"+ (i + 1), data.Tags[i]);
            }
            // Pictures
            for (int i = 0; i < 5; i++) {
                if (i >= data.InputImages.Count) {
                    cmd.Parameters.AddWithValue("@_picture"+ (i + 1), null);
                    continue;
                }
                
                using var memoryStream = new MemoryStream();
                
                // Validate image format try to convert to JPEG or PNG
                if (data.InputImages[i].ContentType != MediaTypeNames.Image.Jpeg &&
                    data.InputImages[i].ContentType != MediaTypeNames.Image.Png) {
                    
                    // data.InputImages[i].CopyTo(memoryStream);
                    // var image = Image.FromStream(memoryStream);
                }
                
                // Validate image size
                if (data.InputImages[i].Length > 500000) // 5MB
                    return new BadRequestResult();
                
                // Read the image binary data from the HTTP request
                data.InputImages[i].CopyTo(memoryStream);
                var imageBytes = memoryStream.ToArray();
                cmd.Parameters.Add("@_picture"+ (i + 1), MySqlDbType.Blob).Value = imageBytes;
            }
            
            cmd.ExecuteNonQuery();
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
    [HttpPost]
    [Route("Update/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult UpdateProfile(int id, [FromBody] UserProfile data)
    {
        return new AcceptedResult();
    }
}