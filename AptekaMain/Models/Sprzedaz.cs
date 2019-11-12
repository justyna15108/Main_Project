﻿using System;
using System.Collections.Generic;

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
        public DateTime? DataSprzedazy { get; set; }
        public long? Suma { get; set; }
        public int? RabatIdRabatu { get; set; }
        public string TypOplaty { get; set; }

        public Rabat RabatIdRabatuNavigation { get; set; }
        public ICollection<ScanRecepty> ScanRecepty { get; set; }
        public ICollection<SprzedazProduktow> SprzedazProduktow { get; set; }
    }
}
