using Microsoft.EntityFrameworkCore;
using statle.Api.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}
    
        public DbSet<User> Users => Set<User>();
         public DbSet<Game> Games => Set<Game>();
         public DbSet<LeaderBoard> LeaderBoard => Set<LeaderBoard>();
    

    
}