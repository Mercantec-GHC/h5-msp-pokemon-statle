namespace statle.Api.Models;

public class LeaderBoard
{
    public int Id { get; set;}
    public Game ?Score { get; set;}
    public User ?User { get; set;}

    public DateTime CreatedAt { get; set;} = DateTime.UtcNow;

}