using System.Data;
using System.Text;
using backend.Database;
using backend.Models.Users;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers.User;

[ApiController]
[Route("[controller]")]
public class UserPictureController(ILogger<UserPictureController> logger) : ControllerBase
{
    private readonly IDbHelper _db = new DbHelper();
    
    /// <summary>
    /// Upload user picture
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="image">Image data</param>
    /// <response code="200">Picture uploaded</response>
    /// <response code="400">Bad request</response>
    [HttpPost]
    [Route("[action]/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult Upload(int id, [FromForm] UserPicture image)
    {
        try {
            if (image.Position is < 1 or > 5)
                return ValidationProblem("Invalid image position");
            
            // Check if image is valid
            if (image.Data.Length == 0)
                return ValidationProblem("Image is empty");
            if (image.Data.ContentType != "image/jpeg" && image.Data.ContentType != "image/png")
                return ValidationProblem("Invalid image type");
            if (image.Data.Length > 5 * 1024 * 1024) // 5MB
                return ValidationProblem("Image is too large");
            if (image.Data.Length < 1 * 1024) // 1KB
                return ValidationProblem("Image is too small");
            
            using MySqlConnection conn = _db.GetOpenConnection();
            
            using MySqlCommand getImageCmd = new MySqlCommand("GetUserImage", conn);
            getImageCmd.CommandType = CommandType.StoredProcedure;
            getImageCmd.Parameters.AddWithValue("@_userID", id);
            getImageCmd.Parameters.AddWithValue("@_position", image.Position);
            using MySqlDataReader reader = getImageCmd.ExecuteReader();
            
            // Check if an image already exist at that position
            if (reader.Read() && reader.HasRows) {
                logger.LogError("Image already present at that position delete it first");
                return ValidationProblem("Image already present at that position");
            }
            reader.Close();
            
            using var memoryStream = new MemoryStream();
            image.Data.CopyTo(memoryStream);
            var bytes = memoryStream.ToArray();
            
            var isValid = Files.IsImageFileValid(bytes);
            if (!isValid)
                return ValidationProblem("Image type not supported");

            var userFolder = "images/";
            // Check if file path exist
            if (!Directory.Exists(userFolder))
                Directory.CreateDirectory(userFolder);
            
            // Save image to disk
            var url = userFolder + Guid.NewGuid() + ".png";
            System.IO.File.WriteAllBytes(url, bytes);
            
            // Save image url to database
            using MySqlCommand cmd = new MySqlCommand("UploadImage", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@_userId", id);
            cmd.Parameters.AddWithValue("@_position", image.Position);
            cmd.Parameters.AddWithValue("@_image_url", url);
            var result = cmd.ExecuteNonQuery();
            
            return result >= 1 ? Ok("Image uploaded") : Problem("Fail to upload image to database", null, 500);
            
        } catch (Exception e) {
            logger.LogError(e, e.Message);
            return Problem(e.Message);
        }
    }
    
    /// <summary>
    /// Upload user picture
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="swap">Image position info</param>
    /// <response code="200">Picture swapped</response>
    /// <response code="400">Bad request</response>
    [HttpPost]
    [Route("[action]/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult SwapImage(int id, [FromBody] SwapPicture swap)
    {
        try {
            if (swap.Position is < 1 or > 5)
                return ValidationProblem("Invalid image position of first image");
            if (swap.NewPosition is < 1 or > 5)
                return ValidationProblem("Invalid image position of second image");
            
            using MySqlConnection conn = _db.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("SwapImages", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@_userId", id);
            cmd.Parameters.AddWithValue("@_position1", swap.Position);
            cmd.Parameters.AddWithValue("@_position2", swap.NewPosition);
            var result = cmd.ExecuteNonQuery();
            
            return result >= 1 ? Ok("Image swap") : Problem("Fail to swap images", null, 500);
            
        } catch (Exception e) {
            logger.LogError(e, e.Message);
            return Problem(e.Message);
        }
    }
    
    /// <summary>
    /// Upload user picture
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="position">Image position</param>
    /// <response code="200">Picture deleted</response>
    /// <response code="400">Bad request</response>
    [HttpDelete]
    [Route("[action]/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult Delete(int id, int position)
    {
        try {
            if (position is < 1 or > 5) {
                logger.LogError("Invalid image position");
                return ValidationProblem("Invalid image position");
            }
            
            using MySqlConnection conn = _db.GetOpenConnection();
            
            using MySqlCommand getImageCmd = new MySqlCommand("GetUserImage", conn);
            getImageCmd.Parameters.AddWithValue("@_userId", id);
            getImageCmd.Parameters.AddWithValue("@_position", position);
            using var reader = getImageCmd.ExecuteReader();
            
            // Delete image from disk
            if (!reader.Read()) {
                logger.LogError("Image not found in database");
                return ValidationProblem("Image not found");
            }
            
            var url = reader["image_url"].ToString() ?? "";
            if (System.IO.File.Exists(url))
                System.IO.File.Delete(url);
            else {
                logger.LogError("Image file does not exist");
                return ValidationProblem("Image does not exist");
            }
            
            using MySqlCommand deleteImageCmd = new MySqlCommand("DeleteImage", conn);
            deleteImageCmd.CommandType = CommandType.StoredProcedure;
            deleteImageCmd.Parameters.AddWithValue("@_userId", id);
            deleteImageCmd.Parameters.AddWithValue("@_position", position);
            var result = deleteImageCmd.ExecuteNonQuery();
            
            return result >= 1 ? Ok("Image deleted") : Problem("Fail to delete image in database", null, 500);
            
        } catch (Exception e) {
            logger.LogError(e, e.Message);
            return Problem(e.Message);
        }
    }
}