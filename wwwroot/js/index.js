var loanAmount;
var roi;
var noi;
var monthlyRoi;
var emiCalculated;
var validateFlag = false;

var loanUserInput;
var loanTransactionsData;

$().ready(function () {
    $("input").each(function (index, elem) {
        $(elem).removeAttr("value");
    });
    $("#LoanAmount").focus();

    $("#userInput input").on("blur", function () {

        loanAmount = $("#LoanAmount").val();
        roi = $("#RateOfInterest").val();
        noi = $("#NoOfInstallments").val();

        //console.log(loanAmount, roi, noi);

        if (loanAmount !== "" && roi !== "" && noi !== "") {
            validateFlag = true;
            //$("#MonthlyRateOfInterest").removeAttr("disabled");
            monthlyRoi = roi / (1200);
            $("#MonthlyRateOfInterest").val(monthlyRoi);
            $("#EMI").removeAttr("disabled");
            // emiCalculated = loanAmount * monthlyRoi * (1 + monthlyRoi) 
            emiCalculated = loanAmount * ((monthlyRoi * Math.pow((1 + monthlyRoi), noi * 12)) / (Math.pow(1 + monthlyRoi, noi * 12) - 1));
            $("#emi").val(emiCalculated);
            $("#loanSummaryTable").removeClass("displayNone");
        }
        else {
            $("#postBackButton").attr("disabled", "true");
        }
    });
    

    $('.dataTables_length').addClass('bs-select');

    $("#postBackButton").click(function () {
        $.ajax({
            method: 'post',
            url: '/Customer/Home/Index',
            data: {
                'loanAmount': loanAmount,
                'rateOfInterest': roi,
                'noOfInstallments': noi * 12,
                'monthlyRateOfInterest': monthlyRoi,
                'emi': emiCalculated,
                'loanTransactions': loanTransactionsData
            },
            success: function (response) {
                console.log(response);
            }
        });
    });

    $("#getDetailsBtn").click(function () {
        if (validateFlag) {
            
            $.ajax({
                method: 'post',
                url: '/Customer/Home/GetDetails',
                data: {
                    'loanAmount': loanAmount,
                    'rateOfInterest': roi,
                    'noOfInstallments': noi * 12,
                    'monthlyRateOfInterest': monthlyRoi,
                    'emi': emiCalculated
                },
                success: function (response) {

                    loanUserInput = {
                        'loanAmount': loanAmount,
                        'rateOfInterest': roi,
                        'noOfInstallments': noi * 12,
                        'monthlyRateOfInterest': monthlyRoi,
                        'emi': emiCalculated
                    };

                    loanTransactionsData = response.loanTransactions;
                    fillLoanTransactionsTable(response);

                   /* $("#loanTransactionsTable").dataTable({
                        "pagingType": "numbers",
                        "pageLength": 10,
                        "sortable": "false",
                        "ordering": "false",
                        "searching": "false"
                    });*/

                    $("#postBackButton").removeAttr("disabled");
                    $("#loanTransactionsTable").removeClass("displayNone");
                    console.log(typeof (response.loanTransactions));
                    console.log(response.loanTransactions);
                }
            });
        }
     
    });
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fillLoanTransactionsTable(data) {
    data = data.loanTransactions;
    
    for (var i = 0; i < data.length; i++) {
        var row = "<tr>";
        row += `<td>${numberWithCommas(data[i].installmentNo)}</td>`;

        row += `<td>${numberWithCommas(data[i].opening.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].principal.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].interest.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].emi.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].closing.toFixed(2))}</td>`;

        row += `<td>${numberWithCommas(data[i].cummulativeInterest.toFixed(2))}</td>`;

        row += "</tr>";

        $("#loanTransactionsTable").append(row);
    }


}