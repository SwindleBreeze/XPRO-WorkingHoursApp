namespace WorkingHoursApp.Models
{

    public enum TypeOfEmployment
    {
        PermanentContract,
        FixedTermContract,
        Student,
        Contracted,
        Freelancer,
        Other
    }
    public class User
    {
        public int UserID { get; set; }
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
        public string? ProfilePicturePath { get; set; }

        // Navigation properties
        public ICollection<WorkingHours> WorkingHours { get; set; } = new List<WorkingHours>();
        
    }
}