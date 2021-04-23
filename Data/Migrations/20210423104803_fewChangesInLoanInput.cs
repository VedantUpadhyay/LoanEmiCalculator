using Microsoft.EntityFrameworkCore.Migrations;

namespace LoanEmiCalculator.Data.Migrations
{
    public partial class fewChangesInLoanInput : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Key",
                table: "LoanInputs",
                newName: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "LoanInputs",
                newName: "Key");
        }
    }
}
