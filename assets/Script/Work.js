$(document).ready(function () {
	var currentDate = new Date().toISOString().split("T")[0];
	$("#Date").val(currentDate);

	$.ajax({
		url: baseurl + "JobCard/Get_Department",
		type: "POST",
		success: function (response) {
			var responseData = JSON.parse(response);
			var Department = { "": "" };

			for (var i = 0; i < responseData.length; i++) {
				var DName = responseData[i];
				Department[DName.Name] = DName.Name;
			}

			$("#Department").empty();
			$.each(Department, function (key, value) {
				$("#Department").append(
					$("<option></option>").attr("value", key).text(value)
				);
			});
		},
	});

	$("#Department").on("change", function () {
		var Department = $("#Department").val();

		$.ajax({
			url: baseurl + "Master/Sub_Depart",
			type: "POST",
			data: {
				Department: Department,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				var DeptName = {};

				for (var i = 0; i < responseData.length; i++) {
					var DName = responseData[i];
					DeptName[DName.DeptName] = DName.DeptName;
				}

				$("#sub_Department")
					.empty()
					.append(
						$("<option></option>").attr("value", "").text("Select this option")
					);

				$.each(DeptName, function (key, value) {
					$("#sub_Department").append(
						$("<option></option>").attr("value", key).text(value)
					);
				});
			},
		});
	});

	$("#sub_Department").on("change", function () {
		var Sub_Department = $("#sub_Department").val();
		var Department = $("#Department").val();

		$.ajax({
			url: baseurl + "Master/JobCardNo",
			type: "POST",
			data: {
				Department: Department,
				Sub_Department: Sub_Department,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				var Jobcardno = {};

				for (var i = 0; i < responseData.JobCardNo.length; i++) {
					var DName = responseData.JobCardNo[i];
					Jobcardno[DName.Job_Card_No] = DName.Job_Card_No;
				}

				$("#JobCardNo")
					.empty()
					.append(
						$("<option></option>").attr("value", "").text("Select this option")
					);

				$.each(Jobcardno, function (key, value) {
					$("#JobCardNo").append(
						$("<option></option>").attr("value", key).text(value)
					);
				});

				// $("#JobCardNo option:eq(1)").prop("selected", true);
			},
		});
	});

	$("#Shift_Closing_container").hide();

   $("#JobCardNo").on("change", function () {
    var Date = $("#Date").val();
    var Department = $("#Department").val();
    var Shift = $("#Shift").val();
    var Sub_Department = $("#sub_Department").val();
    var JobCardNo = $("#JobCardNo").val();

    $.ajax({
        url: baseurl + "Work_Master/Shift_Employee",
        type: "POST",
        data: {
            Date: Date,
            Department: Department,
            Shift: Shift,
            Sub_Department: Sub_Department,
            JobCardNo: JobCardNo,
        },
        success: function (response) {
            var responseData = JSON.parse(response);

            // Clear the table body before appending new data
            $("#Shift_Employee_List").empty();

            if (responseData.Shift_Employee.length == 0) {
                $("#Shift_Closing_container").hide();
                swal({
                    title: "Error!",
                    text: "Details Not Found. Please check if the information exists in the database or try again later.",
                    icon: "error",
                    buttons: true,
                    className: "swal-small",
                });
            } else {
                $("#Shift_Closing_container").show();

                var Shift_Employee = responseData.Shift_Employee;

                // Append new rows to the table
                var table = $('#Tables').DataTable(); // Get DataTable instance
                table.clear(); // Clear previous rows

                $.each(Shift_Employee, function (index, item) {
                    var row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.Sub_Department}</td>
                            <td>${item.Job_Card_No}</td>
                            <td data-EmployeeId="${item.EmpNo}">${item.EmpNo}</td>
                            <td data-EmployeeName="${item.FirstName}">${item.FirstName}</td>
                            <td><input type="checkbox" class="OTEmployeeCheckbox" data-empno="${item.EmpNo}"></td>
                        </tr>
                    `;
                    // Add new row to DataTable
                    table.row.add($(row)).draw();
                });

                // If the table is not already initialized, initialize DataTable
                if (!$.fn.dataTable.isDataTable('#Tables')) {
                    $('#Tables').DataTable({
                        "paging": true,
                        "searching": true,
                        "ordering": true,
                        "info": true,
                        "responsive": true
                    });
                }

                // Handling Shift Employee List Update
                $("#Shift_Employee_List_Update").on("click", function () {
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
                        url: baseurl + "Work_Master/Shift_Closings",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify({
                            Date: Date,
                            Department: Department,
                            Shift: Shift,
                            Sub_Department: Sub_Department,
                            JobCardNo: JobCardNo,
                            Employees: employeesData,
                        }),
                        success: function (response) {
                            var responseData = JSON.parse(response);

                            if (responseData.status == "success") {
                                swal({
                                    title: "Success!",
                                    text: "Shift closing updated successfully.",
                                    icon: "success",
                                    buttons: true,
                                    className: "swal-small",
                                });
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("Error: ", status, error);
                        },
                    });
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error: " + status + " - " + error);
        },
    });
});



	// Shift Closing Report Download

	$("#Shift_Closing_Report").on("click", function () {
		var Date = $("#Date").val();
		var Department = $("#Department").val();
		var Shift = $("#Shift").val();
		var Sub_Department = $("#sub_Department").val();
		var JobCardNo = $("#JobCardNo").val();

		$.ajax({
			url: baseurl + "Reports/Shift_Closing_Report",
			type: "POST",
			data: {
				Date: Date,
				Department: Department,
				Shift: Shift,
				Work_Area: Sub_Department,
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
});
