namespace WorkingHoursApp.Models
{
    public class WorkingHours
    {
        public int WorkingHoursID { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan? ArrivalTime { get; set; }
        public TimeSpan? DepartureTime { get; set; }
        public TimeSpan? LunchStartTime { get; set; }
        public TimeSpan? LunchEndTime { get; set; }
        public bool IsAbsent { get; set; }
        // Foreign key to User
        public int UserID { get; set; } // Foreign key property
        public User? User { get; set; } // Navigation property

        // nullable foreign key to AbsenceType
        public int? AbsenceTypeID { get; set; } // Foreign key property
        public AbsenceType? AbsenceType { get; set; } // Navigation property
    }
}
