using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkingHoursApp.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AbsenceTypes",
                columns: table => new
                {
                    AbsenceTypeID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AbsenceName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbsenceTypes", x => x.AbsenceTypeID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<string>(type: "TEXT", nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", nullable: false),
                    LastName = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PhoneNumber = table.Column<string>(type: "TEXT", nullable: false),
                    JobPosition = table.Column<string>(type: "TEXT", nullable: false),
                    TypeOfEmployment = table.Column<int>(type: "INTEGER", nullable: false),
                    Comment = table.Column<string>(type: "TEXT", nullable: false),
                    ActiveStatus = table.Column<bool>(type: "INTEGER", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "WorkingHours",
                columns: table => new
                {
                    WorkingHoursID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ArrivalTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    DepartureTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    LunchStartTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    LunchEndTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    IsAbsent = table.Column<bool>(type: "INTEGER", nullable: false),
                    UserID = table.Column<string>(type: "TEXT", nullable: false),
                    AbsenceTypeID = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkingHours", x => x.WorkingHoursID);
                    table.ForeignKey(
                        name: "FK_WorkingHours_AbsenceTypes_AbsenceTypeID",
                        column: x => x.AbsenceTypeID,
                        principalTable: "AbsenceTypes",
                        principalColumn: "AbsenceTypeID");
                    table.ForeignKey(
                        name: "FK_WorkingHours_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkingHours_AbsenceTypeID",
                table: "WorkingHours",
                column: "AbsenceTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkingHours_UserID",
                table: "WorkingHours",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkingHours");

            migrationBuilder.DropTable(
                name: "AbsenceTypes");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
