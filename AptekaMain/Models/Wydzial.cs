using System;
using System.Collections.Generic;

namespace AptekaMain.Models
{
    public partial class Wydzial
    {
        public Wydzial()
        {
            Batch = new HashSet<Batch>();
            Powiadomienie = new HashSet<Powiadomienie>();
            Pracownik = new HashSet<Pracownik>();
        }

        public int IdWydzial { get; set; }
        public string Adres { get; set; }
        public string KodPocztowy { get; set; }

        public ICollection<Batch> Batch { get; set; }
        public ICollection<Powiadomienie> Powiadomienie { get; set; }
        public ICollection<Pracownik> Pracownik { get; set; }
    }
}
