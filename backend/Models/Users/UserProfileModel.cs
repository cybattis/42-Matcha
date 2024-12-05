using System.ComponentModel;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Models.Users;

public class UserProfileModel
{
    [DefaultValue("Jean")]
    public string? FirstName {get;set;}

    [DefaultValue("Bono")]
    public string? LastName {get;set;}

    [DefaultValue("1")]
    public int? GenderId {get;set;} // 1: Men 2: Women

    [DefaultValue("1")]
    public int? SexualOrientation {get;set;}

    [DefaultValue("This is a bio.")]
    public string? Biography {get;set;}

    [DefaultValue("45.7736192,4.7579136")] // 45.7736192 4.7579136 → École 42 position
    public string? Localisation {get;set;}

    // For GET request
    [SwaggerIgnore]
    public List<int> Tags {get;set;} = new();
    [SwaggerIgnore]
    public List<string> Images {get;set;} = new();
}
