using System;
using System.Collections.Generic;

namespace AptekaMain.Models
{
    public partial class Pass
    {
        public int IdPass { get; set; }
        public string PassHash { get; set; }
        public int? IdPracownika { get; set; }

        public Pracownik IdPracownikaNavigation { get; set; }
    }
}
