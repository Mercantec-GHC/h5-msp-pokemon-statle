using Microsoft.AspNetCore.Mvc;
using statle.Api.Services;
using statle.Api.Models;
using bcrypt = BCrypt.Net.BCrypt;
namespace statle.Api.Controller;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("register")]
public async Task<IActionResult> Register(string username, string password)
{
    var hash = BCrypt.Net.BCrypt.HashPassword(password);

    var user = new User
    {
        Id = Guid.NewGuid(),
        Username = username,
        PasswordHash = hash
    };

    _dbContext.Users.Add(user);
    await _dbContext.SaveChangesAsync();

    return Ok();
}
}