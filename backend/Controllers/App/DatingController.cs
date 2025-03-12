using backend.Database;
using backend.Models.App;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace backend.Controllers.App;

[ApiController]
[Authorize]
[Route("App/")]
public class DatingController : ControllerBase
{
    [HttpPost]
    [Route("[action]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public IActionResult Dating([FromBody] FiltersModel matchingSettings, [FromHeader] string authorization)
    {
        var id = JwtHelper.DecodeJwtToken(authorization);
        List<ProfilesModel> profilesMatchingFilters = new();
        using MySqlConnection dbClient = DbHelper.GetOpenConnection();
        using var command = new MySqlCommand("GetMatchingProfiles", dbClient);
        command.CommandType = System.Data.CommandType.StoredProcedure;

        // Paramètres : tu peux les adapter à ton modèle DatingModel
        command.Parameters.AddWithValue("@ref_user_id", matchingSettings.id);
        command.Parameters.AddWithValue("@max_distance_km", matchingSettings.range);
        command.Parameters.AddWithValue("@max_age_gap", matchingSettings.ageGap);
        try
        {
            using var reader = command.ExecuteReader();

            while (reader.Read())
            {
                profilesMatchingFilters.Add(new ProfilesModel
                {
                    Id = reader.GetInt32("id"),
                    Name = reader.GetString("name"),
                    age = CalculateAge(reader.GetDateTime("birthdate")),
                    tags = reader.GetString("tags").Split(','), // si tu as une colonne "tags" séparée par virgule
                    profileImageUrl = reader.GetString("profileImageUrl")
                });
            }

            return Ok(profilesMatchingFilters);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erreur lors de la récupération des profils : {ex.Message}");
        }
    }

    private int CalculateAge(DateTime birthdate)
    {
        var today = DateTime.Today;
        var age = today.Year - birthdate.Year;
        if (birthdate > today.AddYears(-age)) age--;
        return age;
    }
}