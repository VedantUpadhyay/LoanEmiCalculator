using Microsoft.EntityFrameworkCore.Migrations;

namespace LoanEmiCalculator.Data.Migrations
{
    public partial class checking : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LoanTransactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LoanId = table.Column<int>(type: "int", nullable: false),
                    Opening = table.Column<double>(type: "float", nullable: false),
                    Principal = table.Column<double>(type: "float", nullable: false),
                    Interest = table.Column<double>(type: "float", nullable: false),
                    emi = table.Column<double>(type: "float", nullable: false),
                    Closing = table.Column<double>(type: "float", nullable: false),
                    CummulativeInterest = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoanTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LoanTransactions_LoanInputs_LoanId",
                        column: x => x.LoanId,
                        principalTable: "LoanInputs",
                        principalColumn: "Key",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LoanTransactions_LoanId",
                table: "LoanTransactions",
                column: "LoanId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoanTransactions");
        }
    }
}
