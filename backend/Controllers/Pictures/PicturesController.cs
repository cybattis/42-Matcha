using System.Data;
using backend.Database;
using backend.Models.Users;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Mysqlx;

namespace backend.Controllers.Pictures;

[ApiController]
[Route("[controller]")]
public class PicturesController(ILogger<PicturesController> logger) : ControllerBase
{
    private readonly IDbHelper _db = new DbHelper();
    
    [HttpPost]
    [Route("Upload/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult Upload(int id, [FromForm] UserPictures data)
    {
        // Console.WriteLine(data[0].FileName);
        // try {
        //     using (MySqlCommand cmd = new MySqlCommand("UploadPictures", _db.GetConnection()))
        //     {
        //         cmd.CommandType = CommandType.StoredProcedure;
        //         cmd.Parameters.AddWithValue("@userId", id);
        //         
        //         cmd.ExecuteNonQuery();
        //     }
        //     return Ok("Images successfully uploaded");
        // }
        // catch (MySqlException ex)
        // {
        //     logger.LogError(ex.Message);
        //     return new BadRequestResult();
        // }
        return Ok("Images successfully uploaded");
    }
    
}