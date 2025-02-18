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

        var Department = { "": "", "All": "All" };
        for (var i = 0; i < Department_Data.length; i++) {
            var DName = Department_Data[i];
            Department[DName.Name] = DName.Name;
        }

        $("#Department").empty();
        $.each(Department, function (key, value) {
            $("#Department").append($("<option></option>").attr("value", key).text(value));
        });
    }
});

$("#Department").on("change", function () {
	var Department = $("#Department").val();

	if (Department != 'All') {

			$("#All_Department_Report").hide();

	}

    if (Department == "All") {
        $("#Work_Area").val("All");
        var Work_Area = { "All": "All" };
        $("#Work_Area").empty();
        $.each(Work_Area, function (key, value) {
            $("#Work_Area").append($("<option></option>").attr("value", key).text(value));
        });
    } else {
        var Work_Area = { "": "", "All": "All" };
        $("#Work_Area").empty();

        $.ajax({
            url: baseurl + "Work_Master/Work_Areas",
            type: "POST",
            data: {
                Department: Department
            },
            success: function (response) {
                var responseData = JSON.parse(response);
                var Work_Areas = responseData.Work_Areas;

                for (var i = 0; i < Work_Areas.length; i++) {
                    var DName = Work_Areas[i];
                    Work_Area[DName.WorkArea] = DName.WorkArea;
                }

                $.each(Work_Area, function (key, value) {
                    $("#Work_Area").append($("<option></option>").attr("value", key).text(value));
                });
            }
        });
    }
});





    $("#Work_Area").on("change", function () {


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



    $("#All_Department_Report").hide();

	$("#Shift").on("change", function () {

		var Department = $("#Department").val();
		var Work_Area = $("#Work_Area").val();

		if (Department != 'All') {

			$("#All_Department_Report").hide();

		}

		else if (Department == 'All' && Work_Area == 'All') {

			    $("#All_Department_Report").show();

		} else {

                $("#All_Department_Report").hide();

		}


	})


$("#All_Department_Report").on("click", function () {
    var Date = $("#Date").val();
    var Shift = $("#Shift").val();

    $.ajax({
        url: baseurl + 'Reports/All_Department_Report',
        type: 'POST',
        data: {
            Date,
            Shift,
        },
        success: function (response) {
            var responseData = JSON.parse(response);

            if (responseData.status === 'error') {
                // Trigger SweetAlert when error status is returned
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: responseData.message,
                });
            } else {
                if (responseData.file_url) {
                    var link = document.createElement("a");
                    link.href = responseData.file_url;
                    link.download = "Work_Allocation_Report.csv";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to generate the report.',
                    });
                }
            }
        }
    });
});








	$("#Assiged_Allocation_Report").on("click", function () {

		var Date = $("#Date").val();
		var Department = $("#Department").val();
		var Shift = $("#Shift").val();
		var Work_Area = $("#Work_Area").val();
		var JobCardNo = $("#JobCardNo").val();

		$.ajax({
			url: baseurl + "Reports/Work_Allocation_Report",
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
					link.download = "Work_Allocation_Report.csv";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				} else {
					alert("Failed to generate the report");
				}
			},
		});
	});



	$("#Employee_Active_List_Download").on("click", function () {

		var Department = $("#Department").val();
		var Employee_Status = $("#Employee_Status").val();

		$.ajax({
			url: baseurl + "Reports/Employee_Active_List_Download",
			type: "POST",
			data: {

				Department: Department,
				Employee_Status: Employee_Status

			},
			success: function (response) {
				var responseData = JSON.parse(response);

				if (responseData.file_url) {
					var link = document.createElement("a");
					link.href = responseData.file_url;
					link.download = "Work_Allocation_Report.csv";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				} else {
					alert("Failed to generate the report");
				}
			},
		});
	});


	$("#Reports_For_Allocation").hide();

		$("#Work_Allocation_List_Container").hide();
				$("#Work_Allocation_Report_Down_Btn").hide();



$("#Work_Allocation_Report_View").on("click", function () {

    var Date = $("#Date").val();
    var Shift = $("#Shift").val();

    $.ajax({
        url: baseurl + "Reports/Assigned",
        type: "POST",
        data: {
            Date: Date,
            Shift: Shift,
        },
        success: function (response) {

            var responseData = JSON.parse(response);
            var Allocation_Report = responseData.Assigned_List;

            // Check if any data is returned
			if (Allocation_Report.length > 0) {

				$("#Work_Allocation_List_Container").show();
				$("#Work_Allocation_Report_Down_Btn").show();


                var employeeData = {};

                $.each(Allocation_Report, function (index, item) {
                    var empNo = item.EmpNo;

                    // Initialize employee data if not already
                    if (!employeeData[empNo]) {
                        employeeData[empNo] = {
                            empNo: item.EmpNo,
                            firstName: item.FirstName,
                            Department: item.Department,
                            WorkArea: item.WorkArea,
                            Job_Card_No: item.Job_Card_No,
                            machines: [],
                        };
                    }

                    // Ensure frames are an array
                    var frames = Array.isArray(item.Frame) ? item.Frame.join(", ") : item.Frame;

                    // Add machine information for employee
                    employeeData[empNo].machines.push({
                        machineId: item.Machine_Id,
                        machineName: item.Machine_Name,
                        frameType: item.FrameType || "N/A",  // Set default frame type if undefined
                        frames: frames,
                        assignStatus: item.Assign_Status,
                    });
                });

                // Display the report table
                $("#Reports_For_Allocation").show();
                $("#Work_Allocation_List tbody").empty();

                // Check if employeeData is empty and display message
                if (Object.keys(employeeData).length === 0) {
                    $("#Work_Allocation_List").append("<tr><td colspan='12'>No data available</td></tr>");
                } else {
                    var serialNumber = 1;
                    var tableRows = [];

                    // Loop over employee data and group by machineId
                    $.each(employeeData, function (empNo, data) {
                        var machineGroups = {};

                        $.each(data.machines, function (index, machine) {
                            if (!machineGroups[machine.machineId]) {
                                machineGroups[machine.machineId] = {
                                    machineName: machine.machineName,
                                    frameType: machine.frameType,
                                    frames: [],
                                    assignStatus: machine.assignStatus // Correct assign status handling
                                };
                            }
                            machineGroups[machine.machineId].frames.push(machine.frames);
                        });

                        // Process each machine group
                        $.each(machineGroups, function (machineId, group) {
                            // Determine badge class and text based on allocation status
                            var badgeClass = group.assignStatus == 1 ? 'badge-success' : 'badge-danger';
                            var assignStatusText = group.assignStatus == 1 ? "Allocated" : "Not Allocated";
                            var description = '<span class="badge ' + badgeClass + '">' + assignStatusText + '</span>';

                            // Create table row data
                            var row = [
                                serialNumber,
                                data.Department,
                                data.WorkArea,
                                data.Job_Card_No,
                                data.firstName,
                                data.empNo,
                                machineId,
                                group.machineName,
                                group.frameType,
                                group.frames.join(", "),
                                description,

                            ];

                            tableRows.push(row);
                            serialNumber++;
                        });
                    });

                    // Append the table rows to the tbody
                    $("#Work_Allocation_List tbody").append(tableRows.map(function(row) {
                        return "<tr>" + row.map(function(cell) {
                            return "<td>" + cell + "</td>";
                        }).join('') + "</tr>";
                    }).join(''));
                }

			} else {

				$("#Work_Allocation_List_Container").hide();
				$("#Work_Allocation_Report_Down_Btn").hide();



                // Show warning if no data is returned
                swal({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Employee Data Not Found on Server!'
                });
            }
        }
    });
});











$("#Work_List_FOR_Employee").hide();

	$("#Employee_Work_Allocation_Details").on("click", function () {


		var Department = $("#Department").val();
		var Work_Area = $("#Work_Area").val();
		var Shift = $("#Shift").val();

		$.ajax({

			url: baseurl + "Reports/Shift_Work_Details",
			type: "POST",
			data: {

				Department: Department,
				Shift: Shift,
				Work_Area: Work_Area,
			},
			success: function (response) {
				var responseData = JSON.parse(response);

				var Shift_Work_Details = responseData.Shift_Work_Details;

				if (Shift_Work_Details.length > 0) {

					$.each(Shift_Work_Details, function (index, item) {

						$("#Work_List_FOR_Employee").show();

						var row = `<tr>
									<td>${index + 1}</td>
									<td>${item.FirstName}</td>
									<td>${item.EmpNo}</td>
									<td>${item.Machine_Id}</td>
									<td>${item.Machine_Name}</td>
									<td >${item.FrameType}</td>
									<td>${item.Frame}</td>
									<td>${item.Description}</td>


								</tr>`;

						$("#Work_Allocation_List").append(row);
					});

				} else {

					swal({
						icon: 'warning',
						title: 'Warning',
						text: 'Employee Datas Not Found Server!'
					});

				}



			}

		})

	})


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

            $("#Shift").empty();
            $.each(Shift, function (index, value) {
                $("#Shift").append($("<option></option>").attr("value", value).text(value));
            });

			$("#Shift option:first").prop("selected", true);








		 },



	 })



	$("#Late_Employee_Report").on("click", function () {

		$.ajax({

			url: baseurl + "Reports/Late_Employee_List",
			type: "POST",
			data: {
				Date: $("#Date").val(),
				Shift: $("#Shift").val(),
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				if (responseData.file_url) {
					var link = document.createElement("a");
					link.href = responseData.file_url;
					link.download = "Work_Allocation_Report.csv";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				} else {
					alert("Failed to generate the report");
				}
			}
		});
	});


	$("#Shift_Closing_Report_Down_Btn").hide();
	$("#Shift_Closing_List_Table_Container").hide();


$("#Shift_Closing_Report_View").on("click", function () {

    var Date = $("#Date").val();
    var Shift = $("#Shift").val();

    $.ajax({
        url: baseurl + "Reports/Shift_Closing_List",
        type: 'POST',
        data: {
            Date,
            Shift
        },
        success: function (response) {

            var response_Data = JSON.parse(response);

            if (response_Data.status == 'error') {

				$("#Shift_Closing_Report_Down_Btn").hide();
				$("#Shift_Closing_List_Table_Container").hide();

                swal({
                    icon: 'warning',
                    title: 'warning',
                    text: response_Data.message
                });

            } else {

                $("#Shift_Closing_Report_Down_Btn").show();
				$("#Shift_Closing_List_Table tbody").empty();
				$("#Shift_Closing_List_Table_Container").show();

                $.each(response_Data.Shift_Closing_Report_Download, function (index, item) {
                    var closingStatus = '';
                    var badgeClass = '';

                    // Check the Closing Status and set the badge class accordingly
                    if (item.Closing_Status == 1) {
                        closingStatus = 'CLOSED';
                        badgeClass = 'badge-success'; // Green for CLOSED
                    } else if (item.Closing_Status == 0) {
                        closingStatus = 'NOT CLOSED';
                        badgeClass = 'badge-warning'; // Orange for NOT CLOSED
                    }

                    var row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.Department}</td>
                            <td>${item.WorkArea}</td>
                            <td>${item.Job_Card_No}</td>
                            <td>${item.EmpNo}</td>
                            <td>${item.FirstName}</td>
                            <td><span class="badge ${badgeClass}">${closingStatus}</span></td>
                            <td>${item.Created_By}</td>
                            <td>${item.Created_Time}</td>
                            <td>${item.Updated_By}</td>
                            <td>${item.Updated_Time}</td>
                        </tr>
                    `;
                    $("#Shift_Closing_List_Table tbody").append(row);
                });

            }

        }
    });

});



	$("#Shift_Closing_Report_Down_Btn").on("click", function () {

		var Date = $("#Date").val();
		var Shift = $("#Shift").val();


			$.ajax({
				url: baseurl + "Reports/Shift_Closing_Report_Download",
				type: 'POST',
				data: {

					Date,
					Shift
				},
				success: function (response) {

					var response_Data = JSON.parse(response);

					if (response_Data.file_url) {
					var link = document.createElement("a");
					link.href = response_Data.file_url;
					link.download = "Shift_Closing_Report.csv";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				} else {
					alert("Failed to generate the report");
				}


				}
	})

	})



	$("#No_Work_Employee_Table_Conainer").hide();
	$("#No_Work_Employee_List_Down_Btn").hide();


	$("#No_Work_Employee_List_View").on("click", function () {


		var Date = $("#Date").val();
		var Shift = $("#Shift").val();


		$.ajax({
			url: baseurl + "Reports/NoWork_Employee_List",
			type: "POST",
			data: {
				Date,
				Shift
			},
			success: function (response) {

				var Response_Data = JSON.parse(response);

				$("#No_Work_Employee_Table_Conainer").hide();
				$("#No_Work_Employee_List_Down_Btn").hide();


				if (Response_Data.status == 'error') {

					swal({
						icon: 'warning',
						title: 'Warning',
						text: responseData.mesaage
					});

				} else {

					$("#No_Work_Employee_List_Down_Btn").show();
					$("#NoWork_Employee_Table tbody").empty();
					$("#No_Work_Employee_Table_Conainer").show();

					$.each(Response_Data.NoWork_Employee_List, function (index, item) {

						var row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.Department}</td>
                            <td>${item.WorkArea}</td>
                            <td>${item.Job_Card_No}</td>
                            <td>${item.EmpNo}</td>
                            <td>${item.FirstName}</td>
                            <td>No Work</td>
                            <td>${item.Created_By}</td>
                            <td>${item.Created_Time}</td>

                        </tr>
                    `;
						$("#NoWork_Employee_Table tbody").append(row);
					});



				}

			}
		})



	});


	$("#No_Work_Employee_List_Down_Btn").on("click", function () {

		var Date = $("#Date").val();
		var Shift = $("#Shift").val();


			$.ajax({
				url: baseurl + "Reports/No_Work_Report_Download",
				type: 'POST',
				data: {

					Date,
					Shift
				},
				success: function (response) {

					var response_Data = JSON.parse(response);

					if (response_Data.file_url) {
					var link = document.createElement("a");
					link.href = response_Data.file_url;
					link.download = "No_Work_Employee_Report.csv";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				} else {
					alert("Failed to generate the report");
				}


				}
	})


	})



    $("#Work_Allocation_Report_Down_Btn").on("click", function () {

        var Date = $("#Date").val();
        var Shift = $("#Shift").val();


        $.ajax({
            url: baseurl + "Reports/Work_Allocation_Report_Download",
            type: 'POST',
            data: {

                Date,
                Shift
            },
            success: function (response) {

                var response_Data = JSON.parse(response);

                if (response_Data.file_url) {
                    var link = document.createElement("a");
                    link.href = response_Data.file_url;
                    link.download = "Employee_Work_Allocation_Report.csv";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    alert("Failed to generate the report");
                }


            }
        })


    });


    $("#Month_Work_Allocation_View").on("click", function () {

        var Year_Month = $("#Date").val();

        $.ajax({
            url: baseurl + 'Report/Monthly_Reports',
            type: 'POST',
            data: {
                Year_Month
            },
            success: function (response) {

                var Response_Data = JSON.parse(response);

                
            }
        })



    })





});
