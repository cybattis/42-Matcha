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
public class UserPictureController(ILogger<UserPictureController> logger) : ControllerBase
{
    /// <summary>
    /// Upload user picture
    /// </summary>
    /// <param name="image">Image data</param>
    /// <param name="authorization">Token</param>
    /// <response code="200">Picture uploaded</response>
    /// <response code="400">Bad request</response>
    [HttpPost]
    [Route("[action]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Upload([FromForm] UserPictureModel image, [FromHeader] string authorization)
    {
        try {
            var id = JwtHelper.DecodeJwtToken(authorization);
            if (image.Position < 1 && image.Position > 5)
                return BadRequest("Invalid image position");
            
            // Check if image is valid
            if (image.Data.Length == 0)
                return BadRequest("Image is empty");
            if (image.Data.ContentType != "image/jpeg" && image.Data.ContentType != "image/png")
                return BadRequest("Invalid image type");
            if (image.Data.Length > 5 * 1024 * 1024) // 5MB
                return BadRequest("Image is too large");
            if (image.Data.Length < 1 * 1024) // 1KB
                return BadRequest("Image is too small");
            
            using var memoryStream = new MemoryStream();
            await image.Data.CopyToAsync(memoryStream);
            var bytes = memoryStream.ToArray();
            
            var isValid = Files.IsImageFileValid(bytes);
            if (!isValid)
                return BadRequest("Image type not supported");

            var userFolder = "images/";
            // Check if file path exist
            if (!Directory.Exists(userFolder))
                Directory.CreateDirectory(userFolder);
            
            // Save image to disk
            var url = userFolder + Guid.NewGuid() + image.Data.ContentType.Split('/')[1];
            await System.IO.File.WriteAllBytesAsync(url, bytes);
            
            // Save image url to database
            await using MySqlConnection conn = DbHelper.GetOpenConnection();
            await using MySqlCommand cmd = new MySqlCommand("UploadImage", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userID", id);
            cmd.Parameters.AddWithValue("@position", image.Position);
            cmd.Parameters.AddWithValue("@imageUrl", url);
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
    public ActionResult Swap(int id, [FromBody] SwapPicture swap)
    {
        try {
            if (swap.Position is < 1 or > 5)
                return ValidationProblem("Invalid image position of first image");
            if (swap.NewPosition is < 1 or > 5)
                return ValidationProblem("Invalid image position of second image");
            
            using MySqlConnection conn = DbHelper.GetOpenConnection();
            using MySqlCommand cmd = new MySqlCommand("SwapImages", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@userID", id);
            cmd.Parameters.AddWithValue("@position1", swap.Position);
            cmd.Parameters.AddWithValue("@position2", swap.NewPosition);
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
    public ActionResult Delete(int id, [FromForm] int position)
    {
        try {
            if (position is < 1 or > 5) {
                logger.LogError("Invalid image position");
                return ValidationProblem("Invalid image position");
            }
            
            using MySqlConnection conn = DbHelper.GetOpenConnection();
            
            Console.WriteLine("ID " + id + " Position " + position);
            
            using MySqlCommand getImageCmd = new MySqlCommand("GetUserImage", conn);
            getImageCmd.CommandType = CommandType.StoredProcedure;
            getImageCmd.Parameters.AddWithValue("@userID", id);
            getImageCmd.Parameters.AddWithValue("@position", position);
            using var reader = getImageCmd.ExecuteReader();
            
            // Delete image from disk
            if (!reader.Read()) {
                logger.LogError("Image not found in database");
                return ValidationProblem("Image not found");
            }
            
            var url = reader["image_url"].ToString() ?? "";
            reader.Close();
            
            if (System.IO.File.Exists(url))
                System.IO.File.Delete(url);
            else {
                logger.LogError("Image file does not exist");
                return ValidationProblem("Image does not exist");
            }
            
            using MySqlCommand deleteImageCmd = new MySqlCommand("DeleteImage", conn);
            deleteImageCmd.CommandType = CommandType.StoredProcedure;
            deleteImageCmd.Parameters.AddWithValue("@userID", id);
            deleteImageCmd.Parameters.AddWithValue("@position", position);
            var result = deleteImageCmd.ExecuteNonQuery();
            
            return result >= 1 ? Ok("Image deleted") : Problem("Fail to delete image in database", null, 500);
            
        } catch (Exception e) {
            logger.LogError(e, e.Message);
            return Problem(e.Message);
        }
    }
}