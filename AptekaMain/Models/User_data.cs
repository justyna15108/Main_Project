using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AptekaMain.Models
{
    public class User_data
    {
        public int IdPracownika { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Haslo { get; set; }
        public int? PoziomDostepu { get; set; }
        public int? WydzialAptekiIdWydzialu { get; set; }
        public string Email { get; set; }
    }
}
