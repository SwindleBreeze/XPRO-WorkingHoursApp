using System.ComponentModel.DataAnnotations;

namespace WorkingHoursApp.Models
{
    public class CreateModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string JobPosition { get; set; }
        public TypeOfEmployment TypeOfEmployment { get; set; }
        public string? Comment { get; set; }
        public bool ActiveStatus { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public IFormFile? ProfilePicture { get; set; }
    }
}
