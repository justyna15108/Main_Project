using System;
using System.Collections.Generic;

namespace AptekaMain.Models
{
    public partial class Pracownik
    {
        public Pracownik()
        {
            Pass = new HashSet<Pass>();
            UserSession = new HashSet<UserSession>();
        }

        public int IdPracownika { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public int? PoziomDostepu { get; set; }
        public int? WydzialAptekiIdWydzialu { get; set; }
        public string Email { get; set; }

        public Wydzial WydzialAptekiIdWydzialuNavigation { get; set; }
        public ICollection<Pass> Pass { get; set; }
        public ICollection<UserSession> UserSession { get; set; }
    }
}
