using Microsoft.EntityFrameworkCore.Migrations;

namespace LoanEmiCalculator.Data.Migrations
{
    public partial class migratedToDx : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "LoanInputs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "LoanInputs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "LoanInputs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "LoanInputs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MyProperty",
                table: "LoanInputs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "LoanInputs",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "LoanInputs");

            migrationBuilder.DropColumn(
                name: "City",
                table: "LoanInputs");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "LoanInputs");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "LoanInputs");

            migrationBuilder.DropColumn(
                name: "MyProperty",
                table: "LoanInputs");

            migrationBuilder.DropColumn(
                name: "State",
                table: "LoanInputs");
        }
    }
}
