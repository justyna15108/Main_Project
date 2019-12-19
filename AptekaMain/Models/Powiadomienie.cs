using System;
using System.Collections.Generic;

namespace AptekaMain.Models
{
    public partial class Powiadomienie
    {
        public int IdPowiadomienie { get; set; }
        public string Tresc { get; set; }
        public DateTime DataGeneracji { get; set; }
        public int WydzialIdWydzial { get; set; }

        public Wydzial WydzialIdWydzialNavigation { get; set; }
    }
}
