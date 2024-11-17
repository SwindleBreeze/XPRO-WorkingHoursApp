namespace WorkingHoursApp.Models
{
    public class AbsenceType
    {
        public int AbsenceTypeID { get; set; }
        public string AbsenceName  { get; set; }

        // Navigation properties
        public ICollection<WorkingHours> WorkingHours { get; set; } = new List<WorkingHours>();
    }
}