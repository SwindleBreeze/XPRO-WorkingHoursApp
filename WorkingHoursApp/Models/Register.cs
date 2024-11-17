using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace WorkingHoursApp.Models
{
    public class RegisterModel
    {
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        [Required]
        public string Email { get; set; }
        
        public string? PhoneNumber { get; set; }
        
        [Required]
        public string JobPosition { get; set; }
        
        [Required]
        public TypeOfEmployment TypeOfEmployment { get; set; }
        
        public string? Comment { get; set; }
        
        public bool ActiveStatus { get; set; }
        
        [Required]
        public string Username { get; set; }
        
        [Required]
        public string Password { get; set; }
        
        // Add a property for the uploaded profile picture
        public IFormFile? ProfilePicture { get; set; }
        public string? ProfilePicturePath { get; set; }
    }
}
