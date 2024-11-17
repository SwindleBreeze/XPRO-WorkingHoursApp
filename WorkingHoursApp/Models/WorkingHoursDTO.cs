public class WorkingHoursDto
{
    public int WorkingHoursID { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan? ArrivalTime { get; set; }
    public TimeSpan? DepartureTime { get; set; }
    public TimeSpan? LunchStartTime { get; set; }
    public TimeSpan? LunchEndTime { get; set; }
    public bool IsAbsent { get; set; }
    public string? AbsenceName { get; set; }

    public int UserID { get; set; }
}
