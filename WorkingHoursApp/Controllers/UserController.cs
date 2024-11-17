using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkingHoursApp.Data;
using WorkingHoursApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace WorkingHoursApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            // Return all users in json format

            return await _context.Users.ToListAsync();
        }

        [Authorize]
        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            // convert string to int

            var user = await _context.Users.FindAsync(int.Parse(id));
            if (user == null) return NotFound();
            return user;
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromForm] CreateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Create a new user
                var user = new User
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber ?? string.Empty,
                    JobPosition = model.JobPosition,
                    TypeOfEmployment = model.TypeOfEmployment,
                    Comment = model.Comment ?? string.Empty,
                    ActiveStatus = model.ActiveStatus,
                    Username = model.Username,
                    Password = model.Password
                };

                string newFilePath = string.Empty;

                // Handle file upload for profile picture
                if (model.ProfilePicture != null)
                {
                    // Generate a new file path
                    newFilePath = Path.Combine("uploads", "profile_pictures", $"{model.Username}_{Guid.NewGuid()}.jpg");

                    // Save the file to the server
                    using (var fileStream = new FileStream(newFilePath, FileMode.Create))
                    {
                        await model.ProfilePicture.CopyToAsync(fileStream);
                    }

                    // Set the profile picture path to the user's model
                    user.ProfilePicturePath = newFilePath;
                }

                // Add the user to the context
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Return the created user with a 201 Created response
                return CreatedAtAction(nameof(GetUser), new { id = user.UserID }, user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "User creation failed", error = ex.Message });
            }
        }


        [Authorize]
    // PUT: api/User/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] UpdateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != model.UserID)
            {
                return BadRequest(new { message = "User ID mismatch" });
            }

            try
            {
                // Retrieve the user from the database
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Update user properties
                user.FirstName = model.FirstName ?? user.FirstName;
                user.LastName = model.LastName ?? user.LastName;
                user.Email = model.Email ?? user.Email;
                user.PhoneNumber = model.PhoneNumber ?? user.PhoneNumber;
                user.JobPosition = model.JobPosition ?? user.JobPosition;
                user.TypeOfEmployment = model.TypeOfEmployment ?? user.TypeOfEmployment;
                user.Comment = model.Comment ?? user.Comment;
                user.ActiveStatus = model.ActiveStatus ?? user.ActiveStatus;

                string newFilePath = user.ProfilePicturePath ?? string.Empty;

                // Handle file upload for profile picture
                if (model.ProfilePicture != null)
                {
                    // Generate a new file path
                    newFilePath = Path.Combine("uploads", "profile_pictures", $"{user.Username}_{Guid.NewGuid()}.jpg");

                    // Save the file to the server
                    using (var fileStream = new FileStream(newFilePath, FileMode.Create))
                    {
                        await model.ProfilePicture.CopyToAsync(fileStream);
                    }

                    // Optionally delete the old file if it exists
                    if (!string.IsNullOrEmpty(user.ProfilePicturePath) && System.IO.File.Exists(user.ProfilePicturePath))
                    {
                        System.IO.File.Delete(user.ProfilePicturePath);
                    }

                    user.ProfilePicturePath = newFilePath;
                }

                // Mark the user as modified and save changes
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { message = "User updated successfully", updatedUser = user });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Update failed", error = ex.Message });
            }
        }


        [Authorize]
        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
