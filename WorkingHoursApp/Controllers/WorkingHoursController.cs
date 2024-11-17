using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkingHoursApp.Data;
using WorkingHoursApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace WorkingHoursApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkingHoursController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkingHoursController(AppDbContext context)
        {
            _context = context;
        }

        // [Authorize]
        // GET: api/WorkingHours
        [HttpGet]
        public async Task<IActionResult> GetWorkingHours()
        {
            var workingHours = await _context.WorkingHours
                .Include(wh => wh.AbsenceType)
                .Select(wh => new WorkingHoursDto
                {
                    WorkingHoursID = wh.WorkingHoursID,
                    Date = wh.Date,
                    ArrivalTime = wh.ArrivalTime,
                    DepartureTime = wh.DepartureTime,
                    LunchStartTime = wh.LunchStartTime,
                    LunchEndTime = wh.LunchEndTime,
                    IsAbsent = wh.IsAbsent,
                    AbsenceName = wh.AbsenceType != null ? wh.AbsenceType.AbsenceName : null,
                    UserID = wh.UserID
                })
                .ToListAsync();

            return Ok(workingHours);
        }


        [Authorize]
        // GET: api/WorkingHours/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkingHours>> GetWorkingHoursById(int id)
        {
            var workingHours = await _context.WorkingHours
                .Include(wh => wh.User)
                .Include(wh => wh.AbsenceType)
                .FirstOrDefaultAsync(wh => wh.WorkingHoursID == id);

            if (workingHours == null) return NotFound();
            return workingHours;
        }

        [Authorize]
        // GET: api/WorkingHours/{userId}/{month}/{year}
        [HttpGet("{userId}/{month}/{year}")]
        public async Task<IActionResult> GetWorkingHoursByMonthAndYear(int userId, int month, int year)
        {
            var workingHours = await _context.WorkingHours
                .Include(wh => wh.AbsenceType)
                .Where(wh => wh.UserID == userId && 
                            wh.Date.Month == month && 
                            wh.Date.Year == year)
                .Select(wh => new WorkingHoursDto
                {
                    WorkingHoursID = wh.WorkingHoursID,
                    Date = wh.Date,
                    ArrivalTime = wh.ArrivalTime,
                    DepartureTime = wh.DepartureTime,
                    LunchStartTime = wh.LunchStartTime,
                    LunchEndTime = wh.LunchEndTime,
                    IsAbsent = wh.IsAbsent,
                    AbsenceName = wh.AbsenceType != null ? wh.AbsenceType.AbsenceName : null,
                    UserID = wh.UserID
                })
                .ToListAsync();

            if (workingHours == null || !workingHours.Any())
            {
                return Ok(new { message = "No records found for the specified month and year." });
            }

            return Ok(workingHours);
        }


        [Authorize]
        [HttpPost]
        public async Task<ActionResult<WorkingHours>> LogWorkingHours(WorkingHours workingHours)
        {
            if (!ModelState.IsValid)
            {
                Console.WriteLine("Model state is invalid");
                return BadRequest(ModelState);
            }

            // Extract the day, month, and year from the workingHours object
            var workingDate = workingHours.Date.Date; // Assuming 'Date' is a DateTime property
            var existingRecord = await _context.WorkingHours
                .Where(w => w.Date.Year == workingDate.Year && w.Date.Month == workingDate.Month && w.Date.Day == workingDate.Day)
                .FirstOrDefaultAsync();

            // If a record already exists for that day, return a conflict status
            if (existingRecord != null)
            {
                return Conflict("Working hours already logged for this day.");
            }

            // Add the new working hours record since no existing record was found
            _context.WorkingHours.Add(workingHours);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorkingHoursById), new { id = workingHours.WorkingHoursID }, workingHours);
        }


        [Authorize]
        // PUT: api/WorkingHours/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkingHours(int id, WorkingHours workingHours)
        {
            if (id != workingHours.WorkingHoursID) return BadRequest();
            _context.Entry(workingHours).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.WorkingHours.Any(e => e.WorkingHoursID == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        [Authorize]
        // DELETE: api/WorkingHours/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkingHours(int id)
        {
            var workingHours = await _context.WorkingHours.FindAsync(id);
            if (workingHours == null) return NotFound();
            _context.WorkingHours.Remove(workingHours);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
