using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AptekaMain.Models
{
    public partial class Sprzedaz
    {
        public Sprzedaz()
        {
            ScanRecepty = new HashSet<ScanRecepty>();
            SprzedazProduktow = new HashSet<SprzedazProduktow>();
        }

        public int IdSprzedaz { get; set; }
        [Column(TypeName="datetime")]
        public DateTime? DataSprzedazy { get; set; }
        public int? RabatIdRabatu { get; set; }
        public string TypOplaty { get; set; }
        public bool? WymaganaRecepta { get; set; }
        public bool? ReceptaDolaczona { get; set; }
        public double? Suma { get; set; }

        public Rabat RabatIdRabatuNavigation { get; set; }
        public ICollection<ScanRecepty> ScanRecepty { get; set; }
        public ICollection<SprzedazProduktow> SprzedazProduktow { get; set; }
    }
}
