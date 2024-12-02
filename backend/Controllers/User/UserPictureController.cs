using System.Data;
using System.Text;
using backend.Database;
using backend.Models.Users;
using backend.Utils;
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
    /// <param name="image">image content</param>
    /// <response code="200">Picture uploaded</response>
    /// <response code="400">Bad request</response>
    [HttpPost]
    [Route("Upload/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult Upload(int id, [FromForm] UserPicture image)
    {
        try {
            if (image.position < 1 || image.position > 5)
                return new BadRequestObjectResult("Invalid image position");
            
            using var memoryStream = new MemoryStream();
            image.data.CopyTo(memoryStream);
            var bytes = memoryStream.ToArray();

            // Check if image is valid
            if (image.data.Length == 0)
                return new BadRequestObjectResult("Image is empty");
            var isValid = Files.IsImageFileValid(bytes);
            if (!isValid)
                return new BadRequestObjectResult("Image type not supported");
            if (image.data.ContentType != "image/jpeg" && image.data.ContentType != "image/png")
                return new BadRequestObjectResult("Invalid image type");
            if (image.data.Length > 5 * 1024 * 1024) // 5MB
                return new BadRequestObjectResult("Image is too large");
            if (image.data.Length < 1 * 1024) // 1KB
                return new BadRequestObjectResult("Image is too small");

            var userFolder = "images/";
            // Check if file path exist
            if (!Directory.Exists(userFolder))
                Directory.CreateDirectory(userFolder);
            
            // Save image to disk
            var url = userFolder + Guid.NewGuid() + ".png";
            System.IO.File.WriteAllBytes(url, bytes);
            
            // Save image url to database
            using MySqlConnection conn = _db.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("AddImage", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@_userId", id);
            cmd.Parameters.AddWithValue("@_position", image.position);
            cmd.Parameters.AddWithValue("@_image_url", url);
            cmd.ExecuteNonQuery();
            
            return Ok("Image uploaded");
            
        } catch (Exception e) {
            logger.LogError(e, "Failed to upload picture");
            return new BadRequestResult();
        }
    }
    
    /// <summary>
    /// Upload user picture
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="position">image position of user</param>
    /// <response code="200">Picture deleted</response>
    /// <response code="400">Bad request</response>
    [HttpPost]
    [Route("Delete/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult Upload(int id, int position)
    {
        try {
            if (position < 1 || position > 5)
                return new BadRequestObjectResult("Invalid image position");
            
            using MySqlConnection conn = _db.GetOpenConnection();
            
            using MySqlCommand getImageCmd = new MySqlCommand("GetUserImage", conn);
            getImageCmd.Parameters.AddWithValue("@_userId", id);
            getImageCmd.Parameters.AddWithValue("@_position", position);
            using var reader = getImageCmd.ExecuteReader();
            
            // Delete image from disk
            if (!reader.Read())
                return new BadRequestObjectResult("Image url not found");
            
            var url = reader["image_url"].ToString() ?? "";
            if (System.IO.File.Exists(url))
                System.IO.File.Delete(url);
            else {
                logger.LogError("Image does not exist");
                return new BadRequestObjectResult("Image does not exist in file system");
            }
            
            using MySqlCommand deleteImageCmd = new MySqlCommand("DeleteImage", conn);
            deleteImageCmd.CommandType = CommandType.StoredProcedure;
            deleteImageCmd.Parameters.AddWithValue("@_userId", id);
            deleteImageCmd.Parameters.AddWithValue("@_position", position);
            var result = deleteImageCmd.ExecuteNonQuery();
            
            return result >= 1 ? Ok("Image deleted") : Problem("Failed to delete image", null, 500);
            
        } catch (Exception e) {
            logger.LogError(e, "Failed to delete picture");
            return new BadRequestResult();
        }
    } 
}