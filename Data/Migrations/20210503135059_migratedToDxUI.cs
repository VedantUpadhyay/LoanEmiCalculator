using Microsoft.EntityFrameworkCore.Migrations;

namespace LoanEmiCalculator.Data.Migrations
{
    public partial class migratedToDxUI : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MyProperty",
                table: "LoanInputs");

            migrationBuilder.AddColumn<string>(
                name: "TransactionDate",
                table: "LoanInputs",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TransactionDate",
                table: "LoanInputs");

            migrationBuilder.AddColumn<int>(
                name: "MyProperty",
                table: "LoanInputs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
