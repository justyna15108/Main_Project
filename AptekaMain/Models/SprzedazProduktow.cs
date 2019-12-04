using System;
using System.Collections.Generic;

namespace AptekaMain.Models
{
    public partial class SprzedazProduktow
    {
        public int IdSp { get; set; }
        public int SprzedazId { get; set; }
        public int BatchId { get; set; }
        public int? Liczba { get; set; }

        public Batch Batch { get; set; }
        public Sprzedaz Sprzedaz { get; set; }
    }
}
