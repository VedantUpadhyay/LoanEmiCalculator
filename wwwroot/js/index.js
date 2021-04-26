

var loanAmount;
var roi;
var noi;
var monthlyRoi;
var emiCalculated;
var validateFlag = false;

var loanUserInput;
var loanTransactionsData;


$().ready(function () {
    //$("#getDetailsBtn").attr("disabled", "true");

    $('input').keyup(function () {
        var empty = false;
        $('form > input').each(function () {
            if ($(this).val() == '') {
                empty = true;
            }
        });
        if (empty) {
            console.log('all fields are empty..');
            $('#postBackButton').attr('disabled', 'true');
        }
        else {
            $('#postBackButton').removeAttr('disabled');
        }
    });

    $("input").each(function (index, elem) {
        $(elem).removeAttr("value");
        //$(elem).change(function () {
        //    $("#postBackButton").attr("disabled", "true");
        //    if (loanAmount !== "" && roi !== "" && noi !== "") {
        //        $("#getDetailsBtn").attr("disabled", "false");
        //    }
        //});
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
            $("#emi").val(emiCalculated.toFixed(2));
            $("#loanSummaryTable").removeClass("displayNone");
        }
        else {
            $("#postBackButton").attr("disabled", "true");
           // $("#getDetailsBtn").attr("disabled", "true");
        }
    });

    $(document).ajaxStart(function () {
        $('#loading').show();
    }).ajaxStop(function () {
        $('#loading').hide();
    });

    $('.dataTables_length').addClass('bs-select');

    $("#postBackButton").click(function () {
        $.ajax({
            method: 'post',
            url: '/Customer/Home/Index',
            data: {
                'loanAmount': loanAmount,
                'rateOfInterest': roi,
            /*'noOfInstallments': Math.ceil(noi * 12),*/
                'noOfInstallments': noi,
                'monthlyRateOfInterest': monthlyRoi,
                'emi': emiCalculated,
                'loanTransactions': loanTransactionsData
            },
            success: function (response) {
                console.log(response);
                loanTransactionsData = null;
                if (response.success == true) {
                    toastr.success('Data Saved Successfully.');
                }
                else if (response.success == false) {
                    toastr.info('Data Already Exists..');
                }
            }
        });
    });

    $("#getDetailsBtn").click(function () {

        loanAmount = $("#LoanAmount").val();
        roi = $("#RateOfInterest").val();
        noi = $("#NoOfInstallments").val();

        //console.log(loanAmount, roi, noi);

        if (loanAmount !== "" && roi !== "" && noi !== "") {

            $.ajax({
                method: 'post',
                url: '/Customer/Home/GetDetails',
                data: {
                    'loanAmount': loanAmount,
                    'rateOfInterest': roi,
                /*'noOfInstallments': Math.ceil(noi * 12),*/
                    'noOfInstallments': noi,
                    'monthlyRateOfInterest': monthlyRoi,
                    'emi': emiCalculated
                },
                success: function (response) {



                    loanUserInput = {
                        'loanAmount': loanAmount,
                        'rateOfInterest': roi,
                    /*'noOfInstallments': Math.ceil(noi * 12),*/
                        'noOfInstallments': noi,
                        'monthlyRateOfInterest': monthlyRoi,
                        'emi': emiCalculated
                    };

                    if (dataTableExists()) {
                        emptyDataTable();
                    }

                    loanTransactionsData = response.loanTransactions;
                    fillLoanTransactionsTable(response);

                    $("#loanTransactionsTable").fancyTable({
                        pagination: "true",
                        perPage: "10",
                        sortable: "false",
                        searchable: "false",
                        globalSearch: false
                    });

                    $("#postBackButton").removeAttr("disabled");
                    $("#loanTransactionsTable").removeClass("displayNone");

                    console.log(response.loanTransactions);
                }
            });
        }
        else {
            toastr.warning("All the fields are required..");
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

function emptyDataTable() {
    $("#loanTransactionsTable").empty();
    $("#loanTransactionsTable").append(`<thead>
                        <tr class="bg-dark text-white">
                            <th style="width:10px">Installment</th>
                            <th>Opening</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>EMI</th>
                            <th>Closing</th>
                            <th>Cummulative Interest</th>
                        </tr>
                    </thead>`);
}

function dataTableExists() {
    if ($("#loanTransactionsTable").children().length > 1) {
        return true;
    }
    return false;
}