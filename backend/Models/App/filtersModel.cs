using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models.App
{
    public class FiltersModel
    {
        public required string id { get; set;}
        public required int range { get; set; }
        public required int ageGap { get; set; }
        public required int fameGap { get; set; }
    }
}