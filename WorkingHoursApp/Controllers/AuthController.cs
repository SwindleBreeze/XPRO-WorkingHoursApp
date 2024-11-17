using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WorkingHoursApp.Models;
using WorkingHoursApp.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace WorkingHoursApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Username == login.Username);

            if (user == null || user.Password != login.Password)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // return token and proile picture path
            return Ok(new { token, user.ProfilePicturePath, user.UserID });
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterModel model)
        {

            if (!ModelState.IsValid)
            {
                // Return the validation errors
                return BadRequest(ModelState);
            }

            try
            {
                // Handle regular form data
                var firstName = model.FirstName;
                var lastName = model.LastName;
                var email = model.Email;
                var phoneNumber = model.PhoneNumber;
                var jobPosition = model.JobPosition;
                var typeOfEmployment = model.TypeOfEmployment;
                var comment = model.Comment;
                var activeStatus = model.ActiveStatus;
                var username = model.Username;
                var password = model.Password;
                var filePath = "";
                // Handle file upload (if a profile picture is provided)
                if (model.ProfilePicture != null)
                {
                    // Example: Save the file to the server
                    filePath = Path.Combine("uploads", "profile_pictures", $"{model.Username}_{Guid.NewGuid()}.jpg");
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.ProfilePicture.CopyToAsync(fileStream);
                    }
                }

                // After handling form data and file, you can proceed with registration logic
                // e.g., store the data in the database

                var user = new User
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    PhoneNumber = phoneNumber,
                    JobPosition = jobPosition,
                    TypeOfEmployment = typeOfEmployment,
                    Comment = comment,
                    ActiveStatus = activeStatus,
                    Username = username,
                    Password = password,
                    ProfilePicturePath = filePath
                };

                _context.Users.Add(user);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Registration successful" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Registration failed", error = ex.Message });
            }
        }



        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key is not configured.");
            }
            var key = Encoding.ASCII.GetBytes(jwtKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
