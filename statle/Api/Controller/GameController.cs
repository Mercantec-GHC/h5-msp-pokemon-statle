using Microsoft.AspNetCore.Mvc;
using statle.Api.Services;
namespace statle.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private readonly GameEngine _gameEngine;
    // In a real application, you would use a database or a cache to store games.
    // For this simple test, we'll just store one game in memory.
    private static GameEngine.Game? _currentGame;
    private static PokemonDetails? _currentPokemon;

    public GameController(GameEngine gameEngine)
    {
        _gameEngine = gameEngine;
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

        // We don't return the pokemon details, just a confirmation.
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

        return Ok(new { message, updatedGame.Score, pokemonName = _currentPokemon.Name, usedStats = _currentGame.UsedStats });
    }
}