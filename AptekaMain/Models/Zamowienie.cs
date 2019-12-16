using System;
using System.Collections.Generic;

namespace AptekaMain.Models
{
    public partial class Zamowienie
    {
        public Zamowienie()
        {
            Partia = new HashSet<Partia>();
        }

        public int IdZamowienia { get; set; }
        public DateTime? DataZamowienia { get; set; }
        public DateTime? DataOplaty { get; set; }
        public DateTime? DataDostawy { get; set; }
        public int HurtowniaIdHurtowni { get; set; }
        public bool? Oplacono { get; set; }
        public string Status { get; set; }
        public double? SumaZamowienia { get; set; }

        public Hurtownia HurtowniaIdHurtowniNavigation { get; set; }
        public ICollection<Partia> Partia { get; set; }
    }
}
