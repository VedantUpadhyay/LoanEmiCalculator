using Microsoft.EntityFrameworkCore.Migrations;

namespace LoanEmiCalculator.Data.Migrations
{
    public partial class EmiNameChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EMI",
                table: "LoanInputs",
                newName: "emi");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "emi",
                table: "LoanInputs",
                newName: "EMI");
        }
    }
}
