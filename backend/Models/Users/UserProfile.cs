using System.ComponentModel;
using System.Text.Json.Serialization;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

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
    
    public List<int> Tags {get;set;} = new();
    
    [JsonIgnore] // In GET request
    public List<IFormFile> InputImages {get;set;} = new();
    
    [SwaggerIgnore] // In POST request
    public List<byte[]> Images {get;set;} = new();
}