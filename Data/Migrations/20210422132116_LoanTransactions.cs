using Microsoft.EntityFrameworkCore.Migrations;

namespace LoanEmiCalculator.Data.Migrations
{
    public partial class LoanTransactions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InstallmentNo",
                table: "LoanTransactions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InstallmentNo",
                table: "LoanTransactions");
        }
    }
}
