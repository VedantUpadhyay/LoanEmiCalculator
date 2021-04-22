using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace LoanEmiCalculator.Models
{
    public class LoanTransaction
    {
        [Key]
        public int Id { get; set; }

        public int LoanId { get; set; }

        [ForeignKey("LoanId")]
        public LoanInput LoanInput { get; set; }

        public int InstallmentNo { get; set; }

        public double Opening { get; set; }
        
        public double Principal { get; set; }

        public double Interest { get; set; }

        public double emi { get; set; }

        public double Closing { get; set; }

        public double CummulativeInterest { get; set; }
    }
}
