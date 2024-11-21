using System.ComponentModel;

namespace backend.Models.Users;

public class UserProfile
{
    // User info
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
    [DefaultValue("Lyon")]
    public string? Localisation {get;set;}
    
    // Tags
    public List<int> Tags {get;set;} = new();
    
    // Pictures
    public List<string> Pictures {get;set;} = new();
}