using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models.App
{
    public class ProfilesModel
    {
        public required int Id { get; set;}
        public required string Name { get; set;}
        public required int age { get; set;}
        public required string [] tags { get; set; }
        public required string profileImageUrl { get; set;}
    }
}