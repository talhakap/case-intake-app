using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using CaseIntakeApp.Backend.Models;
using CaseIntakeApp.Backend.Data;

namespace CaseIntakeApp.Backend.Controllers
{
    [ApiController] //Enables automatic model validation and API-specific behavior.
    [Route("api/[controller]")]//Maps this controller to the route api/case.
    public class CaseController : ControllerBase
    {
        private readonly CaseDbContext _context;
        //Dependency injection of the database context to interact with the database.
        public CaseController(CaseDbContext context)
        {
            _context = context;
        }
        // POST api/case
        // Handles the submission of a new case.
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SubmitCase([FromForm] Case newCase, IFormFile? file)
        {
            if (file != null)//Check if a file was uploaded.
            {
                // Validate file size (optional)
                if (file.Length > 5 * 1024 * 1024) // 5 MB limit
                {
                    return BadRequest("File size exceeds the limit of 5 MB.");
                }

                // Validate file type (optional)
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
                var fileExtension = Path.GetExtension(file.FileName);
                if (!allowedExtensions.Contains(fileExtension.ToLower()))
                {
                    return BadRequest("Invalid file type. Only JPG, PNG, and PDF files are allowed.");
                }

                // Save the file to the server

                // Create a directory for uploaded files if it doesn't exist
                // You can change the path as needed
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                newCase.FilePath = fileName;
            }
            // Validate the case data
            _context.Cases.Add(newCase);
            // Save the case to the database
            await _context.SaveChangesAsync();
            // Return a success response with the case reference
            return Ok(new { reference = $"CASE-{newCase.Id:D6}" });
        }


        // GET api/case/{id}
        // Retrieves a specific case by its ID.
        [HttpGet]
        public async Task<IActionResult> GetAllCases()
        {
            return Ok(await _context.Cases.ToListAsync());
        }


        //Removes a specific case by its ID.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCase(int id)
        {
            var existing = await _context.Cases.FindAsync(id);
            if (existing == null) return NotFound();

            _context.Cases.Remove(existing);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Updates a specific case by its ID.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCase(int id, [FromBody] Case updated)
        {
            if (id != updated.Id) return BadRequest();

            var existing = await _context.Cases.FindAsync(id);
            if (existing == null) return NotFound();

            existing.FullName = updated.FullName;
            existing.Email = updated.Email;
            existing.CaseType = updated.CaseType;
            existing.Description = updated.Description;
            // Optionally update file path or submittedAt if needed

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        // Resets the database and deletes all uploaded files.
        // This is a dangerous operation and should be protected in production.
        [HttpPost("reset")]
        public async Task<IActionResult> ResetCases()
        {
            // 1. Delete all case records
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Cases");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM sqlite_sequence WHERE name='Cases'");

            // 2. Delete all uploaded files
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
            if (Directory.Exists(uploadsPath))
            {
                foreach (var file in Directory.GetFiles(uploadsPath))
                {
                    System.IO.File.Delete(file);
                }
            }

            return Ok("Reset complete");
        }



    }
}
