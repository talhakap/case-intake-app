using Microsoft.EntityFrameworkCore;
using CaseIntakeApp.Backend.Models;


namespace CaseIntakeApp.Backend.Data
{
    // This class represents the database context for the case intake application.
    public class CaseDbContext : DbContext
    {
        // Constructor that takes DbContextOptions and passes them to the base class.
        public CaseDbContext(DbContextOptions<CaseDbContext> options) : base(options) {}

        // This method is called when the application is starting up.
        public DbSet<Case> Cases => Set<Case>();
    }
}
