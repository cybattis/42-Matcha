using System.ComponentModel;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Models.Users;

public class UserProfileModel
{
    [DefaultValue("Jean")]
    public string? FirstName {get;set;}

    [DefaultValue("Bono")]
    public string? LastName {get;set;}

    [DefaultValue(1)]
    public int? Gender {get;set;} // 1: Men 2: Women

    [DefaultValue(1)]
    public int? SexualOrientation {get;set;}

    [DefaultValue("This is a bio.")]
    public string? Biography {get;set;}

    [DefaultValue("45.7736192,4.7579136")] // 45.7736192 4.7579136 → École 42 position
    public string? Coordinates {get;set;}
    
    [DefaultValue(0)]
    public int? ProfileCompletionPercentage {get;set;}
    
    [DefaultValue(0)]
    public int? FameRating {get;set;}

    // For GET request
    [SwaggerIgnore]
    [DefaultValue(false)]
    public bool? IsVerified {get;set;}
    [SwaggerIgnore]
    public Dictionary<string, int> Tags {get;set;} = new();
    [SwaggerIgnore]
    public List<string> Images {get;set;} = new();
}
