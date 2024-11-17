using System.ComponentModel.DataAnnotations;

namespace WorkingHoursApp.Models
{
    public class LoginModel
    {
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }

}