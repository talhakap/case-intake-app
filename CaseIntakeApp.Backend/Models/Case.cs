// This file is part of the Case Intake App.
namespace CaseIntakeApp.Backend.Models
{
    // Represents a case submitted by a user.
    // This class is used to define the structure of the case data.
    public class Case
    {
        public int Id { get; set; }
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string CaseType { get; set; } = ""; // e.g., Complaint, Request
        public string Description { get; set; } = "";
        public string? FilePath { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
