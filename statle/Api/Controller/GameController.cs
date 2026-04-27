using Microsoft.AspNetCore.Mvc;
using statle.Api.Services;
using statle.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace statle.Api.Controller;


[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly GameEngine _gameEngine;
  
    private static GameEngine.Game? _currentGame;
    private static PokemonDetails? _currentPokemon;

    private readonly AppDbContext _dbContext;
   

    public GameController(GameEngine gameEngine, AppDbContext dbContext)
    {
        _gameEngine = gameEngine;
        _dbContext = dbContext;
    }

    [HttpPost("start")]
    public IActionResult StartGame()
    {
        _currentGame = _gameEngine.StartGame();
        _currentPokemon = _gameEngine.GetRandomPokemon();

        if (_currentPokemon == null)
        {
            return NotFound("Could not find a Pokémon to start the game.");
        }

        
        return Ok(new { message = "New game started. A mystery Pokémon has been chosen.", gameId = _currentGame.GameId, pokemonName = _currentPokemon.Name });
    }

    [HttpPost("guess/{stat}")]
    public IActionResult GuessStat(string stat)
    {
        if (_currentGame == null || _currentPokemon == null)
        {
            return BadRequest("Game has not been started. Please call /api/game/start first.");
        }

        var (updatedGame, message) = _gameEngine.PickStat(_currentGame, _currentPokemon, stat);

        _currentGame = updatedGame;

        int gained = 0;
        switch (stat.ToLower())
        {
            case "hp":
                gained = _currentPokemon.Stats.Hp;
                break;
            case "attack":
                gained = _currentPokemon.Stats.Attack;
                break;
            case "defense":
                gained = _currentPokemon.Stats.Defense;
                break;
            case "sp_atk":
                gained = _currentPokemon.Stats.special_attack;
                break;
            case "sp_def":
                gained = _currentPokemon.Stats.special_defense;
                break;
            case "speed":
                gained = _currentPokemon.Stats.Speed;
                break;
        }

        _currentPokemon = _gameEngine.GetRandomPokemon();

        return Ok(new { message, updatedGame.Score, pokemonName = _currentPokemon.Name, gained, usedStats = _currentGame.UsedStats });
    }

    [HttpPost("Save")]
    [Authorize]
    public async Task<IActionResult> SaveGame()
    {
        if (_currentGame == null)
            return BadRequest();

        foreach (var claim in User.Claims)
            Console.WriteLine($"CLAIM: {claim.Type} = {claim.Value}");

        var userIdClaim = User.Claims.FirstOrDefault(c =>
            c.Type == System.Security.Claims.ClaimTypes.NameIdentifier && Guid.TryParse(c.Value, out _));
        if (userIdClaim == null)
            return Unauthorized("User ID not found in token.");
        var userId = Guid.Parse(userIdClaim.Value);

        var game = new Game
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Score = _currentGame.Score,
            UsedStatsJson = System.Text.Json.JsonSerializer.Serialize(_currentGame.UsedStats)
        };

        _dbContext.Games.Add(game);
        await _dbContext.SaveChangesAsync();

        return Ok();
    }
}