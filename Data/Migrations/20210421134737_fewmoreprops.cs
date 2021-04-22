using Microsoft.EntityFrameworkCore.Migrations;

namespace LoanEmiCalculator.Data.Migrations
{
    public partial class fewmoreprops : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LoanInputs",
                columns: table => new
                {
                    Key = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LoanAmount = table.Column<double>(type: "float", nullable: false),
                    RateOfInterest = table.Column<double>(type: "float", nullable: false),
                    NoOfInstallments = table.Column<double>(type: "float", nullable: false),
                    MonthlyRateOfInterest = table.Column<double>(type: "float", nullable: false),
                    EMI = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoanInputs", x => x.Key);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoanInputs");
        }
    }
}
