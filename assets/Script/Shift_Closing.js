$(document).ready(function () {

    var currentDate = new Date().toISOString().split("T")[0];
    $("#Date").val(currentDate);

    $("#Shift_Closing_container").hide();
    $("#Shift_Closing_Section").hide();


    $.ajax({
        url: baseurl + "Work_Master/Depertments",
        type: "POST",
        success: function (response) {
            var responseData = JSON.parse(response);
            var Department_Data = responseData.Departments;

            var Department = { };

            for (var i = 0; i < Department_Data.length; i++) {
                var DName = Department_Data[i];
                Department[DName.Name] = DName.Name;
            }

            $("#Department").empty();
            $("#Department").append($("<option></option>").attr("value", '').text(''));
            $("#Department").append($("<option></option>").attr("value", 'All').text('All'));
            $.each(Department, function (key, value) {
                $("#Department").append($("<option></option>").attr("value", key).text(value));
            });

        }
    });

    // $.ajax({
    //     url: baseurl + "Work_Master/Shifts",
    //     type: "POST",
    //     success: function (response) {
    //         var responseData = JSON.parse(response);
    //         var Shifts = responseData.Shifts;

    //         $("#Shift").empty();
    //         $.each(Shifts, function (index, value) {
    //             $("#Shift").append($("<option></option>").attr("value", value).text(value));
    //         });

    //         $("#Shift option:first").prop("selected", true);
    //     },
    // });


    $.ajax({
        url: baseurl + "Work_Master/Shifts",
        type: "POST",
        success: function (response) {
            var responseData = JSON.parse(response);
            var Shifts = responseData.Shifts;

            var Shift = {};


             for (var i = 0; i < Shifts.length; i++) {
                    var DName = Shifts[i];
                    Shift[DName.ShiftDesc] = DName.ShiftDesc;
                }

            $.each(Shift, function (index, value) {
                $("#Shift").append($("<option></option>").attr("value", value).text(value));
            });

            $("#Shift option:first").prop("selected", true);
        },
    });


$("#Department").on("change", function () {

    var Department = $("#Department").val();

    $.ajax({
        url: baseurl + "Work_Master/Work_Areas",
        type: "POST",
        data: { Department },

        success: function (response) {
            var responseData = JSON.parse(response);
            var Work_Areas = responseData.Work_Areas;

            var Work_Area = { "": "" };

            for (var i = 0; i < Work_Areas.length; i++) {
                var DName = Work_Areas[i];
                Work_Area[DName.WorkArea] = DName.WorkArea;
            }

            $("#Work_Area").empty();
            $.each(Work_Area, function (key, value) {
                $("#Work_Area").append($("<option></option>").attr("value", key).text(value));
            });

            $("#Work_Area option:first").prop("selected", true);
        }
    })

    if (Department == 'All') {
        var Date = $("#Date").val();
        var Shift = $("#Shift").val();

        $.ajax({
            url: baseurl + "Reports/All_Department_Reports",
            type: "POST",
            data: { Department, Date, Shift },

            success: function (response) {
                var responseData = JSON.parse(response);

                if (responseData.status == 'error') {
                    swal({
                        type: 'warning',
                        title: 'Warning',
                        text: responseData.mesaage,
                    });
                } else {
                    $("#Shift_Closing_container").hide();
                    $("#Shift_Closing_Section").show();
                    $("#Shift_Employee_List tbody").empty();

                    var processedEmpNos = new Set();

                    $.each(responseData, function (index, item) {
                        if (!processedEmpNos.has(item.EmpNo)) {
                            processedEmpNos.add(item.EmpNo);

                            var row = `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.Department}</td>
                                    <td>${item.WorkArea}</td>
                                    <td>${item.Job_Card_No}</td>
                                    <td data-EmployeeId="${item.EmpNo}">${item.EmpNo}</td>
                                    <td data-EmployeeName="${item.FirstName}">${item.FirstName}</td>
                                    <td><input type="checkbox" class="OTEmployeeCheckbox" data-empno="${item.EmpNo}"></td>
                                </tr>
                            `;
                            $("#Shift_Employee_List tbody").append(row);
                        }
                    });

                    // Initialize DataTable after appending rows
                    $("#Shift_Employee_List").DataTable({
                        "paging": true,
                        "searching": true,
                        "ordering": true,
                        "info": true
                    });
                }
            }
        })
    }

});



    // Date Wil  Change then Updated

    $("#Date").on("change", function () {


    $("#Shift_Closing_container").hide();
    $("#Shift_Closing_Section").hide();
    $("#Shift_Employee_List tbody").empty();

    var Department = $("#Department").val();

        if (Department === 'All') {

            $("#Shift_Closing_container").hide();


        var Date = $("#Date").val();
        var Shift = $("#Shift").val();

        $.ajax({
            url: baseurl + "Reports/All_Department_Reports",
            type: "POST",
            data: { Department, Date, Shift },
            success: function (response) {
                var responseData = JSON.parse(response);

                if (responseData.status === 'error') {
                    swal({
                        type: 'warning',
                        title: 'Warning',
                        text: responseData.message, // Fixed typo here
                    });
                } else {
                    // $("#Shift_Closing_container").show();
                    $("#Shift_Closing_Section").show();
                    $("#Shift_Employee_List tbody").empty();

                    var processedEmpNos = new Set();

                    $.each(responseData, function (index, item) {
                        if (!processedEmpNos.has(item.EmpNo)) {
                            processedEmpNos.add(item.EmpNo);

                            var row = `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.Department}</td>
                                    <td>${item.WorkArea}</td>
                                    <td>${item.Job_Card_No}</td>
                                    <td data-EmployeeId="${item.EmpNo}">${item.EmpNo}</td>
                                    <td data-EmployeeName="${item.FirstName}">${item.FirstName}</td>
                                    <td><input type="checkbox" class="OTEmployeeCheckbox" data-empno="${item.EmpNo}"></td>
                                </tr>
                            `;
                            $("#Shift_Employee_List tbody").append(row);
                        }
                    });

                    // Destroy the existing DataTable instance (if any) before initializing a new one
                    if ($.fn.dataTable.isDataTable('#Shift_Employee_List')) {
                        $('#Shift_Employee_List').DataTable().clear().destroy();
                    }

                    // Initialize DataTable after appending rows
                    $("#Shift_Employee_List").DataTable({
                        "paging": true,
                        "searching": true,
                        "ordering": true,
                        "info": true
                    });
                }
            }
        });
    }
});








    $("#Work_Area").on("change", function () {

        $("#Shift_Closing_container").hide();


        var Department = $("#Department").val();
        var Work_Area = $("#Work_Area").val();

        $.ajax({
            url: baseurl + "Work_Master/JobCards",
            type: "POST",
            data:
            {
                Department,
                Work_Area
            },

            success: function (response) {
                var responseData = JSON.parse(response);
                var JobCards = responseData.JobCards;

                var JobCard = {};

                for (var i = 0; i < JobCards.length; i++) {
                    var DName = JobCards[i];
                    JobCard[DName.JobCard_No] = DName.JobCard_No;
                }

                $("#JobCardNo").empty();
                $.each(JobCard, function (key, value) {
                    $("#JobCardNo").append($("<option></option>").attr("value", key).text(value));
                });

                $("#JobCardNo option:first").prop("selected", true);

                var Date = $("#Date").val();
                var Department = $("#Department").val();
                var Shift = $("#Shift").val();
                var Work_Area = $("#Work_Area").val();
                var JobCard = $("#JobCardNo").val();


                $.ajax({
                    url: baseurl + "Allocation/Shift_Employee_Work_Details",
                    type: "POST",
                    data:
                    {
                        Date,
                        Shift,
                        Department,
                        Work_Area,
                        JobCard

                    },
                    success: function (response) {

                        var responseData = JSON.parse(response);
                        var Shift_Employee_Work_Details = responseData.Shift_Employee_Work_Details;

                        if (Shift_Employee_Work_Details.length > 0) {

                            $("#Shift_Closing_container").show();
                            $("#Shift_Closing_Section").show();

                            $("#Shift_Employee_List tbody").empty();

                            var processedEmpNos = new Set();

                            $.each(Shift_Employee_Work_Details, function (index, item) {
                                if (!processedEmpNos.has(item.EmpNo)) {
                                    processedEmpNos.add(item.EmpNo);

                                    var row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.Department}</td>
                        <td>${item.WorkArea}</td>
                        <td>${item.Job_Card_No}</td>
                        <td data-EmployeeId="${item.EmpNo}">${item.EmpNo}</td>
                        <td data-EmployeeName="${item.FirstName}">${item.FirstName}</td>
                        <td><input type="checkbox" class="OTEmployeeCheckbox" data-empno="${item.EmpNo}"></td>
                    </tr>
                `;
                                    $("#Shift_Employee_List tbody").append(row);
                                }
                            });

                        } else if (Shift_Employee_Work_Details.length == 0) {

                            swal({
                                type: 'warning',
                                title: 'Warning',
                                text: 'Employee Details Not Found. Please Try Again!'
                            });

                        }
                    }

                });





            }
        })

    });


    $("#Shift_Employee_List_Update").on("click", function () {

    swal({
        title: 'Employee Shift Closing Remarks',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Edit',
        showLoaderOnConfirm: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        preConfirm: function (reason) {
            return new Promise(function (resolve, reject) {
                if (reason && reason.trim() !== "") {
                    resolve(reason);
                } else {
                    reject('Please provide a valid reason!');
                }
            });
        },
        allowOutsideClick: false
    }).then(function (result) {

        var Date = $("#Date").val();
        // var Department = $("#Department").val();
        var Shift = $("#Shift").val();
        // var Work_Area = $("#Work_Area").val();
        // var JobCardNo = $("#JobCardNo").val();

        var employeesData = [];

        $(".OTEmployeeCheckbox").each(function () {
            var empNo = $(this).data("empno");
            var isChecked = $(this).prop("checked") ? 1 : 0;
            employeesData.push({
                EmployeeId: empNo,
                OTConfirm: isChecked,
            });
        });

        $.ajax({
            url: baseurl + "Allocation/Employee_Shift_Closings",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                Date: Date,
                Department: Department,
                Shift: Shift,
                Work_Area: Work_Area,
                JobCardNo: JobCardNo,
                Remarks: result,
                Employees: employeesData,
            }),
            success: function (response) {
                var responseData = JSON.parse(response);

                if (responseData.status == "success") {
                    swal({
            icon: 'success',
            title: 'Employee Shift Closing Successfully!',
            html: 'Updated: ' + result
        });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error: ", status, error);
            },
        });

        swal({
            type: 'success',
            title: 'Employee Shift Closed Successfully!',
            html: 'Updated: ' + result.value // Access the 'value' property of the result object
        });

    }).catch(function (error) {
        swal({
            icon: 'warning',
            title: 'Warning',
            text: error
        });
    });

    });




    $("#Shift_Closing_Report").on("click", function () {

		var Date = $("#Date").val();
		var Department = $("#Department").val();
		var Shift = $("#Shift").val();
		var Work_Area = $("#Work_Area").val();
        var JobCardNo = $("#JobCardNo").val();


		$.ajax({
			url: baseurl + "Reports/Shift_Closing_Report",
			type: "POST",
			data: {
				Date: Date,
				Department: Department,
				Shift: Shift,
				Work_Area: Work_Area,
				JobCardNo: JobCardNo,
			},
			success: function (response) {
				var responseData = JSON.parse(response);

				if (responseData.file_url) {
					var link = document.createElement("a");
					link.href = responseData.file_url;
					link.download = "shift_closing_report.csv";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				} else {
					alert("Failed to generate the report");
				}
			},
		});
    });


    $("#Shift_Closing_container_All").on("click", function () {

        var Date = $("#Date").val();
        var Shift = $("#Shift").val();


        $.ajax({
            url: baseurl + "Reports/Shift_Closing_All_Report",
            type: "POST",
            data: {
                Date,
                Shift
            },
            success: function (response) {

                var responseData = JSON.parse(response);

                if (responseData.status == 'error') {

                     swal({
                        icon: 'warning',
                        title: 'Warning',
                        text: responseData.mesaage
                    });

                } else {

                    var link = document.createElement("a");
					link.href = responseData.file_url;
					link.download = "shift_closing_report.csv";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

                }

            }
        })

    })



    $("#No_Work_Employee_List_View").on("click", function () {


        var Date = $("#Date").val();
        var Shift = $("#Shift").val();


        $.ajax({
            url: baseurl + "Reports/Shift_Closing_All_Report",
            type: "POST",
            data: {
                Date,
                Shift
            },
            success: function (response) {

                var responseData = JSON.parse(response);

                if (responseData.status == 'error') {

                     swal({
                        icon: 'warning',
                        title: 'Warning',
                        text: responseData.mesaage
                    });

                } else {

                    var link = document.createElement("a");
					link.href = responseData.file_url;
					link.download = "shift_closing_report.csv";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

                }

            }
        })



    })

})