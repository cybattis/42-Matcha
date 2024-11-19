using System.ComponentModel;

namespace backend.Models.Users;

public class UserProfile
{
    // User info
    [DefaultValue("Jean")]
    public string? FirstName {get;set;}
    [DefaultValue("Bono")]
    public string? LastName {get;set;}
    [DefaultValue("0")]
    public int? GenderId {get;set;} // 0: Men 1: Women
    [DefaultValue("0")]
    public int? SexualOrientation {get;set;}
    [DefaultValue("This is a bio.")]
    public string? Biography {get;set;}
    [DefaultValue("Lyon")]
    public string? Localisation {get;set;}
    
    // Pictures
    public string? Picture1 {get;set;}
    public string? Picture2 {get;set;}
    public string? Picture3 {get;set;}
    public string? Picture4 {get;set;}
    public string? Picture5 {get;set;}
    
    // Tags
    public int? Tag1 {get;set;}
    public int? Tag2 {get;set;}
    public int? Tag3 {get;set;}
    public int? Tag4 {get;set;}
    public int? Tag5 {get;set;}
}