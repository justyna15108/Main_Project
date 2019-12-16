using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace AptekaMain.Models
{
    public partial class AptekaMainContext : DbContext
    {
        public AptekaMainContext()
        {
        }

        public AptekaMainContext(DbContextOptions<AptekaMainContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Artykul> Artykul { get; set; }
        public virtual DbSet<Batch> Batch { get; set; }
        public virtual DbSet<Braki> Braki { get; set; }
        public virtual DbSet<Hurtownia> Hurtownia { get; set; }
        public virtual DbSet<Kategoria> Kategoria { get; set; }
        public virtual DbSet<ListaBrakow> ListaBrakow { get; set; }
        public virtual DbSet<Partia> Partia { get; set; }
        public virtual DbSet<Pass> Pass { get; set; }
        public virtual DbSet<Photo> Photo { get; set; }
        public virtual DbSet<Pracownik> Pracownik { get; set; }
        public virtual DbSet<Producent> Producent { get; set; }
        public virtual DbSet<Rabat> Rabat { get; set; }
        public virtual DbSet<ScanRecepty> ScanRecepty { get; set; }
        public virtual DbSet<Sprzedaz> Sprzedaz { get; set; }
        public virtual DbSet<SprzedazProduktow> SprzedazProduktow { get; set; }
        public virtual DbSet<UserSession> UserSession { get; set; }
        public virtual DbSet<Wydzial> Wydzial { get; set; }
        public virtual DbSet<Zamowienie> Zamowienie { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=tcp:aptekamain.database.windows.net,1433;Initial Catalog=AptekaMain;User ID=apteka_admin;Password=usermain0!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Artykul>(entity =>
            {
                entity.HasKey(e => e.IdArtykul);

                entity.Property(e => e.IdArtykul).HasColumnName("id_artykul");

                entity.Property(e => e.IlloscPodstawowa).HasColumnName("illosc_podstawowa");

                entity.Property(e => e.IlloscProduktow).HasColumnName("illosc_produktow");

                entity.Property(e => e.KategoriaIdKategoria).HasColumnName("Kategoria_Id_Kategoria");

                entity.Property(e => e.Nazwa)
                    .IsRequired()
                    .HasColumnName("nazwa")
                    .HasMaxLength(100);

                entity.Property(e => e.ProducentIdProducent).HasColumnName("Producent_Id_Producent");

                entity.Property(e => e.WymaganaRecepta).HasColumnName("wymagana_recepta");

                entity.HasOne(d => d.KategoriaIdKategoriaNavigation)
                    .WithMany(p => p.Artykul)
                    .HasForeignKey(d => d.KategoriaIdKategoria)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("artykul_kategoria_fk");

                entity.HasOne(d => d.ProducentIdProducentNavigation)
                    .WithMany(p => p.Artykul)
                    .HasForeignKey(d => d.ProducentIdProducent)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("artykul_producent_fk");
            });

            modelBuilder.Entity<Batch>(entity =>
            {
                entity.HasKey(e => e.IdBatch);

                entity.Property(e => e.IdBatch)
                    .HasColumnName("id_batch")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.IdPartia).HasColumnName("id_partia");

                entity.Property(e => e.Kod).HasColumnName("kod");

                entity.Property(e => e.Liczba).HasColumnName("liczba");

                entity.Property(e => e.WydzialAptekiIdWydzialu).HasColumnName("wydzial_apteki_id_wydzialu");

                entity.HasOne(d => d.IdBatchNavigation)
                    .WithOne(p => p.InverseIdBatchNavigation)
                    .HasForeignKey<Batch>(d => d.IdBatch)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("batch_partia_fk");

                entity.HasOne(d => d.IdPartiaNavigation)
                    .WithMany(p => p.Batch)
                    .HasForeignKey(d => d.IdPartia)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Batch__id_partia__6D0D32F4");

                entity.HasOne(d => d.WydzialAptekiIdWydzialuNavigation)
                    .WithMany(p => p.Batch)
                    .HasForeignKey(d => d.WydzialAptekiIdWydzialu)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("batch_wydzial_apteki_fk");
            });

            modelBuilder.Entity<Braki>(entity =>
            {
                entity.HasKey(e => e.IdBraki);

                entity.Property(e => e.IdBraki).HasColumnName("Id_Braki");

                entity.Property(e => e.ArtykulIdArtukulu).HasColumnName("artykul_id_artukulu");

                entity.Property(e => e.Illosc).HasColumnName("illosc");

                entity.Property(e => e.ListaBrakowIdListy).HasColumnName("lista_brakow_id_listy");

                entity.Property(e => e.ProcentBraku).HasColumnName("procent_braku");

                entity.HasOne(d => d.ArtykulIdArtukuluNavigation)
                    .WithMany(p => p.Braki)
                    .HasForeignKey(d => d.ArtykulIdArtukulu)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("braki_artykul_fk");

                entity.HasOne(d => d.ListaBrakowIdListyNavigation)
                    .WithMany(p => p.Braki)
                    .HasForeignKey(d => d.ListaBrakowIdListy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("braki_lista_brakow_fk");
            });

            modelBuilder.Entity<Hurtownia>(entity =>
            {
                entity.HasKey(e => e.IdHurtownia);

                entity.Property(e => e.IdHurtownia).HasColumnName("id_hurtownia");

                entity.Property(e => e.DniNaDostawe).HasColumnName("dni_na_dostawe");

                entity.Property(e => e.DniNaOplate).HasColumnName("dni_na_oplate");

                entity.Property(e => e.Nazwa)
                    .IsRequired()
                    .HasColumnName("nazwa")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Kategoria>(entity =>
            {
                entity.HasKey(e => e.IdKategoria);

                entity.Property(e => e.IdKategoria).HasColumnName("id_kategoria");

                entity.Property(e => e.Nazwa)
                    .HasColumnName("nazwa")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<ListaBrakow>(entity =>
            {
                entity.HasKey(e => e.IdLista);

                entity.ToTable("Lista_brakow");

                entity.Property(e => e.IdLista).HasColumnName("id_lista");

                entity.Property(e => e.DataGen)
                    .HasColumnName("data_gen")
                    .HasColumnType("date");
            });

            modelBuilder.Entity<Partia>(entity =>
            {
                entity.HasKey(e => e.IdPartia);

                entity.Property(e => e.IdPartia).HasColumnName("id_partia");

                entity.Property(e => e.ArtykulIdArtukulu).HasColumnName("artykul_id_artukulu");

                entity.Property(e => e.CenaWSprzedazy).HasColumnName("cena_w_sprzedazy");

                entity.Property(e => e.CenaWZakupu).HasColumnName("cena_w_zakupu");

                entity.Property(e => e.DataWaznosci)
                    .HasColumnName("data_waznosci")
                    .HasColumnType("date");

                entity.Property(e => e.Liczba).HasColumnName("liczba");

                entity.Property(e => e.LiczbaWSprzedazy).HasColumnName("liczba_w_sprzedazy");

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasMaxLength(50);

                entity.Property(e => e.ZamowienieIdZamowienia).HasColumnName("zamowienie_id_zamowienia");

                entity.HasOne(d => d.ArtykulIdArtukuluNavigation)
                    .WithMany(p => p.Partia)
                    .HasForeignKey(d => d.ArtykulIdArtukulu)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("partia_artykul_fk");

                entity.HasOne(d => d.ZamowienieIdZamowieniaNavigation)
                    .WithMany(p => p.Partia)
                    .HasForeignKey(d => d.ZamowienieIdZamowienia)
                    .HasConstraintName("partia_zamowienie_fk");
            });

            modelBuilder.Entity<Pass>(entity =>
            {
                entity.HasKey(e => e.IdPass);

                entity.Property(e => e.IdPass).HasColumnName("id_pass");

                entity.Property(e => e.IdPracownika).HasColumnName("id_pracownika");

                entity.Property(e => e.PassHash)
                    .HasColumnName("pass_hash")
                    .HasMaxLength(100);

                entity.HasOne(d => d.IdPracownikaNavigation)
                    .WithMany(p => p.Pass)
                    .HasForeignKey(d => d.IdPracownika)
                    .HasConstraintName("FK__Pass__id_pracown__160F4887");
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.HasKey(e => e.IdPhoto);

                entity.Property(e => e.IdPhoto).HasColumnName("id_photo");

                entity.Property(e => e.ArtykulIdArtukulu).HasColumnName("artykul_id_artukulu");

                entity.Property(e => e.Photo1)
                    .HasColumnName("photo")
                    .HasColumnType("image");

                entity.Property(e => e.PhotoName)
                    .HasColumnName("photo_name")
                    .HasMaxLength(100);

                entity.Property(e => e.PhotoPath)
                    .HasColumnName("photo_path")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.ArtykulIdArtukuluNavigation)
                    .WithMany(p => p.Photo)
                    .HasForeignKey(d => d.ArtykulIdArtukulu)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("image_artykul_fk");
            });

            modelBuilder.Entity<Pracownik>(entity =>
            {
                entity.HasKey(e => e.IdPracownika);

                entity.Property(e => e.IdPracownika).HasColumnName("id_pracownika");

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(50);

                entity.Property(e => e.Imie)
                    .HasColumnName("imie")
                    .HasMaxLength(100);

                entity.Property(e => e.Nazwisko)
                    .HasColumnName("nazwisko")
                    .HasMaxLength(100);

                entity.Property(e => e.PoziomDostepu).HasColumnName("poziom_dostepu");

                entity.Property(e => e.WydzialAptekiIdWydzialu).HasColumnName("wydzial_apteki_id_wydzialu");

                entity.HasOne(d => d.WydzialAptekiIdWydzialuNavigation)
                    .WithMany(p => p.Pracownik)
                    .HasForeignKey(d => d.WydzialAptekiIdWydzialu)
                    .HasConstraintName("pracownik_wydzial_apteki_fk");
            });

            modelBuilder.Entity<Producent>(entity =>
            {
                entity.HasKey(e => e.IdProducent);

                entity.Property(e => e.IdProducent).HasColumnName("id_producent");

                entity.Property(e => e.Kraj)
                    .HasColumnName("kraj")
                    .HasMaxLength(100);

                entity.Property(e => e.Nazwa)
                    .IsRequired()
                    .HasColumnName("nazwa")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Rabat>(entity =>
            {
                entity.HasKey(e => e.IdRabat);

                entity.Property(e => e.IdRabat).HasColumnName("id_rabat");

                entity.Property(e => e.CzyJestAktywny)
                    .HasColumnName("czy_jest_aktywny")
                    .HasMaxLength(1)
                    .IsUnicode(false);

                entity.Property(e => e.DataPoczatku)
                    .HasColumnName("data_poczatku")
                    .HasColumnType("date");

                entity.Property(e => e.DataZakonczenia)
                    .HasColumnName("data_zakonczenia")
                    .HasColumnType("date");

                entity.Property(e => e.ProcentRabatu).HasColumnName("procent_rabatu");
            });

            modelBuilder.Entity<ScanRecepty>(entity =>
            {
                entity.HasKey(e => e.IdScan);

                entity.ToTable("Scan_recepty");

                entity.Property(e => e.IdScan).HasColumnName("id_scan");

                entity.Property(e => e.Scan)
                    .HasColumnName("scan")
                    .IsUnicode(false);

                entity.Property(e => e.ScanName)
                    .HasColumnName("scan_name")
                    .HasMaxLength(100);

                entity.Property(e => e.ScanPath)
                    .HasColumnName("scan_path")
                    .HasMaxLength(100);

                entity.Property(e => e.SprzedazIdSprzedazy).HasColumnName("sprzedaz_id_sprzedazy");

                entity.HasOne(d => d.SprzedazIdSprzedazyNavigation)
                    .WithMany(p => p.ScanRecepty)
                    .HasForeignKey(d => d.SprzedazIdSprzedazy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("scan_recepty_sprzedaz_fk");
            });

            modelBuilder.Entity<Sprzedaz>(entity =>
            {
                entity.HasKey(e => e.IdSprzedaz);

                entity.Property(e => e.IdSprzedaz).HasColumnName("id_sprzedaz");

                entity.Property(e => e.DataSprzedazy)
                    .HasColumnName("data_sprzedazy")
                    .HasColumnType("datetime");

                entity.Property(e => e.RabatIdRabatu).HasColumnName("rabat_id_rabatu");

                entity.Property(e => e.ReceptaDolaczona)
                    .HasColumnName("recepta_dolaczona")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Suma).HasColumnName("suma");

                entity.Property(e => e.TypOplaty)
                    .HasColumnName("typ_oplaty")
                    .HasMaxLength(50);

                entity.Property(e => e.WymaganaRecepta)
                    .HasColumnName("wymagana_recepta")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.RabatIdRabatuNavigation)
                    .WithMany(p => p.Sprzedaz)
                    .HasForeignKey(d => d.RabatIdRabatu)
                    .HasConstraintName("sprzedaz_rabat_fk");
            });

            modelBuilder.Entity<SprzedazProduktow>(entity =>
            {
                entity.HasKey(e => e.IdSp);

                entity.ToTable("Sprzedaz_produktow");

                entity.Property(e => e.IdSp).HasColumnName("id_sp");

                entity.Property(e => e.BatchId).HasColumnName("batch_id");

                entity.Property(e => e.Liczba).HasColumnName("liczba");

                entity.Property(e => e.SprzedazId).HasColumnName("sprzedaz_id");

                entity.HasOne(d => d.Batch)
                    .WithMany(p => p.SprzedazProduktow)
                    .HasForeignKey(d => d.BatchId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("sprzedaz_produktów_batch_w_aptece_fk");

                entity.HasOne(d => d.Sprzedaz)
                    .WithMany(p => p.SprzedazProduktow)
                    .HasForeignKey(d => d.SprzedazId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("sprzedaz_produktów_sprzedaz_fk");
            });

            modelBuilder.Entity<UserSession>(entity =>
            {
                entity.HasKey(e => e.IdSession);

                entity.ToTable("User_session");

                entity.Property(e => e.IdSession).HasColumnName("id_session");

                entity.Property(e => e.Access).HasColumnName("access");

                entity.Property(e => e.Active).HasColumnName("active");

                entity.Property(e => e.PracownikIdPracownika).HasColumnName("pracownik_id_pracownika");

                entity.Property(e => e.Token).HasColumnName("token");

                entity.HasOne(d => d.PracownikIdPracownikaNavigation)
                    .WithMany(p => p.UserSession)
                    .HasForeignKey(d => d.PracownikIdPracownika)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("session_pracownik_fk");
            });

            modelBuilder.Entity<Wydzial>(entity =>
            {
                entity.HasKey(e => e.IdWydzial);

                entity.Property(e => e.IdWydzial).HasColumnName("id_wydzial");

                entity.Property(e => e.Adres)
                    .HasColumnName("adres")
                    .HasMaxLength(100);

                entity.Property(e => e.KodPocztowy)
                    .HasColumnName("kod_pocztowy")
                    .HasMaxLength(10);
            });

            modelBuilder.Entity<Zamowienie>(entity =>
            {
                entity.HasKey(e => e.IdZamowienia);

                entity.Property(e => e.IdZamowienia).HasColumnName("id_zamowienia");

                entity.Property(e => e.DataDostawy)
                    .HasColumnName("data_dostawy")
                    .HasColumnType("date");

                entity.Property(e => e.DataOplaty)
                    .HasColumnName("data_oplaty")
                    .HasColumnType("date");

                entity.Property(e => e.DataZamowienia)
                    .HasColumnName("data_zamowienia")
                    .HasColumnType("date");

                entity.Property(e => e.HurtowniaIdHurtowni).HasColumnName("hurtownia_id_hurtowni");

                entity.Property(e => e.Oplacono).HasColumnName("oplacono");

                entity.Property(e => e.Status)
                    .HasColumnName("status")
                    .HasMaxLength(50);

                entity.Property(e => e.SumaZamowienia).HasColumnName("suma_zamowienia");

                entity.HasOne(d => d.HurtowniaIdHurtowniNavigation)
                    .WithMany(p => p.Zamowienie)
                    .HasForeignKey(d => d.HurtowniaIdHurtowni)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("zamowienie_hurtownia_fk");
            });
        }
    }
}
