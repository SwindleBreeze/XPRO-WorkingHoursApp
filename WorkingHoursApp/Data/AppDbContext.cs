using Microsoft.EntityFrameworkCore;
using WorkingHoursApp.Models;

namespace WorkingHoursApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<WorkingHours> WorkingHours { get; set; }
        public DbSet<AbsenceType> AbsenceTypes { get; set; }

        protected override async void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasKey(u => u.UserID);  // Ensure that UserID is the primary key

            modelBuilder.Entity<User>()
                .Property(u => u.UserID)
                .ValueGeneratedOnAdd(); // Ensure auto-increment is enabled

            modelBuilder.Entity<WorkingHours>()
                .HasKey(wh => wh.WorkingHoursID);

            modelBuilder.Entity<WorkingHours>()
                .Property(wh => wh.WorkingHoursID)
                .ValueGeneratedOnAdd();

        }

        // Function to seed the database with initial data
        public static async Task SeedDataAsync(AppDbContext context)
        {
            // Seed User data
            if (!context.Users.Any())
            {
                await context.Users.AddAsync(new User 
                { 
                    UserID = 2, 
                    Username = "admin", 
                    Password = "admin", 
                    FirstName = "Admin", 
                    LastName = "Admin", 
                    Email = "admin@official.com", 
                    JobPosition = "Admin", 
                    TypeOfEmployment = TypeOfEmployment.PermanentContract, 
                    ActiveStatus = true 
                });

                await context.SaveChangesAsync();
            }

            // Seed AbsenceTypes if they are not already present
            if (!context.AbsenceTypes.Any())
            {
                await context.AbsenceTypes.AddRangeAsync(
                    new AbsenceType { AbsenceTypeID = 1, AbsenceName = "Leave" },
                    new AbsenceType { AbsenceTypeID = 2, AbsenceName = "Sick Leave" },
                    new AbsenceType { AbsenceTypeID = 3, AbsenceName = "Child Care" },
                    new AbsenceType { AbsenceTypeID = 4, AbsenceName = "Vacation" },
                    new AbsenceType { AbsenceTypeID = 5, AbsenceName = "Bereavement" }
                );

                await context.SaveChangesAsync();
            }
        }

    }

}
