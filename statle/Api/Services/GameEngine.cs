using System.Text.Json;

namespace statle.Api.Services;
public class GameEngine
{
    List<String> usedStats = new List<String>();
    private readonly List<PokemonDetails> _pokemonList;
    private readonly Random _rng = new();

    public GameEngine()
    {
        var baseDirectory = AppContext.BaseDirectory;
        var projectRoot = Path.GetFullPath(Path.Combine(baseDirectory, "..", "..", "..", ".."));
        var jsonFilePath = Path.Combine(projectRoot, "public", "pokemon-details.json");

        var jsonString = File.ReadAllText(jsonFilePath);
        var pokemonData = JsonSerializer.Deserialize<PokemonData>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        _pokemonList = pokemonData?.Pokemon ?? new List<PokemonDetails>();
    }

     public (Game game, string message) PickStat(Game game, PokemonDetails pokemon, string chosenStat)
{
    
    if (game.UsedStats.Contains(chosenStat.ToLower()))
    {
        return (game, "Stat already used!");
    }

    int value = 0;

    
    switch (chosenStat.ToLower())
    {
        case "hp":
            value = pokemon.Stats.Hp;
            break;
        case "attack":
            value = pokemon.Stats.Attack;
            break;
        case "defense":
            value = pokemon.Stats.Defense;
            break;
        case "sp_atk":
            value = pokemon.Stats.special_attack;
            break;
        case "sp_def":
            value = pokemon.Stats.special_defense;
            break;
        case "speed":
            value = pokemon.Stats.Speed;
            break;
        default:
            return (game, "Invalid stat");
    }

    
    game.UsedStats.Add(chosenStat.ToLower());
    game.Score += value;

    return (game, $"You gained {value} points!");
}
    public class Game
    {
     public Guid GameId { get; set; } = Guid.NewGuid();
     public List<string> UsedStats { get; set; } = new List<string>();
     public int Score { get; set; } = 0;   
    }

    public Game StartGame()
    {
        return new Game();
    }

    public void ShowRandomPokemonStats()
    {
        if (_pokemonList.Count == 0)
        {
            Console.WriteLine("No Pokémon loaded.");
            return;
        }

        var randomPokemon = GetRandomPokemon();
        if (randomPokemon != null)
        {
            Console.WriteLine($"Generated Pokemon: {randomPokemon.Name}, ID: {randomPokemon.Id}, HP: {randomPokemon.Stats.Hp}, Attack: {randomPokemon.Stats.Attack}, Defense: {randomPokemon.Stats.Defense}, Special Attack: {randomPokemon.Stats.special_attack}, Special Defense: {randomPokemon.Stats.special_defense}, Speed: {randomPokemon.Stats.Speed}");
        }
    }

    public PokemonDetails? GetRandomPokemon()
    {
        if (_pokemonList.Count == 0)
        {
            return null;
        }
        var index = _rng.Next(_pokemonList.Count);
        return _pokemonList[index];
    }
}


public class PokemonData
{
    public List<PokemonDetails> Pokemon { get; set; } = new();
}

public class PokemonDetails
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Sprites Sprites { get; set; } = new();
    public Stats Stats { get; set; } = new();
}

public class Sprites
{
    public string? FrontDefault { get; set; }
}

public class Stats
{
    public int Hp { get; set; }
    public int Attack { get; set; }
    public int Defense { get; set; }
    public int special_attack { get; set; }
    public int special_defense { get; set; }
    public int Speed { get; set; }
}

