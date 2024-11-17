using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkingHoursApp.Data;
using WorkingHoursApp.Models;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace WorkingHoursApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }
        [Authorize]
        // GET: api/Reports/TotalHoursByUser/{id}
        [HttpGet("TotalHoursByUser/{id}")]
        public async Task<ActionResult<double>> GetTotalHoursByUser(int id)
        {
            var totalHours = await _context.WorkingHours
                .Where(wh => wh.UserID == id)
                .SumAsync(wh => EF.Functions.DateDiffMinute(wh.ArrivalTime, wh.DepartureTime) / 60.0);

            return Ok(totalHours);
        }

        [Authorize]
        // GET: api/Reports/AbsentUsers
        [HttpGet("AbsentUsers")]
        public async Task<ActionResult<IEnumerable<User>>> GetAbsentUsers()
        {
            var absentUsers = await _context.WorkingHours
                .Where(wh => wh.IsAbsent)
                .Select(wh => wh.User)
                .Distinct()
                .ToListAsync();

            return Ok(absentUsers);
        }

        [Authorize]
        // GET: api/Reports/TotalHoursByDay/{date}
        [HttpGet("TotalHoursByDay/{date}")]
        public async Task<ActionResult<double>> GetTotalHoursByDay(DateTime date)
        {
            var totalHours = await _context.WorkingHours
                .Where(wh => wh.Date == date)
                .SumAsync(wh => EF.Functions.DateDiffMinute(wh.ArrivalTime, wh.DepartureTime) / 60.0);

            return Ok(totalHours);
        }

        [Authorize]
        // GET: api/Reports/TotalHoursByMonth/{month}
        [HttpGet("TotalHoursByMonth/{month}")]
        public async Task<ActionResult<double>> GetTotalHoursByMonth(int month)
        {
            var totalHours = await _context.WorkingHours
                .Where(wh => wh.Date.Month == month)
                .SumAsync(wh => EF.Functions.DateDiffMinute(wh.ArrivalTime, wh.DepartureTime) / 60.0);

            return Ok(totalHours);
        }

        [Authorize]
        // GET: api/Reports/TotalHoursByYear/{year}
        [HttpGet("TotalHoursByYear/{year}")]
        public async Task<ActionResult<double>> GetTotalHoursByYear(int year)
        {
            var totalHours = await _context.WorkingHours
                .Where(wh => wh.Date.Year == year)
                .SumAsync(wh => EF.Functions.DateDiffMinute(wh.ArrivalTime, wh.DepartureTime) / 60.0);

            return Ok(totalHours);
        }

        [Authorize]
        // GET: api/Reports/AbsenceTypes
        [HttpGet("AbsenceTypes")]
        public async Task<ActionResult<IEnumerable<AbsenceType>>> GetAbsenceTypes()
        {
            var absenceTypes = await _context.AbsenceTypes.ToListAsync();
            return Ok(absenceTypes);
        }
    }
}
