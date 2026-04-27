using Microsoft.AspNetCore.Mvc;
using statle.Api.Services;
using statle.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace statle.Api.Controller;


[ApiController]
[Route("api/[controller]")]
public class LeaderBoardController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public LeaderBoardController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // GET: api/leaderboard/top
    [HttpGet("top")]
    public IActionResult GetTopScores(int count = 10)
    {
       
        var topGamesPerUser = _dbContext.Games
            .Include(g => g.User)
            .AsEnumerable()
            .GroupBy(g => g.UserId)
            .Select(g => g.OrderByDescending(x => x.Score).First())
            .OrderByDescending(g => g.Score)
            .Take(count)
            .Select(g => new {
                Username = g.User.Username,
                Score = g.Score,
                Date = g.CreatedAt
            })
            .ToList();

        return Ok(topGamesPerUser);
    }
}