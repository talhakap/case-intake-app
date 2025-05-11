using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CaseIntakeApp.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddFilePathToCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "Cases",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "Cases");
        }
    }
}
