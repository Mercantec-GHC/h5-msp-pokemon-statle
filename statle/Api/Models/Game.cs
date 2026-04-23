namespace statle.Api.Models
{
    public class Game
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public int Score { get; set; }
         public string UsedStatsJson { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public User User { get; set; } = null!;
    }
}