using System;
using System.Collections.Generic;

namespace AptekaMain.Models
{
    public partial class PowiadomienieGlobalne
    {
        public int IdPowiadomienie { get; set; }
        public string Tresc { get; set; }
        public DateTime Data { get; set; }
    }
}
