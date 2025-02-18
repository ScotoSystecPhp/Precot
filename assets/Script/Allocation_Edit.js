$(document).ready(function () {




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
			$("#Department").empty().append($("<option></option>").attr("value", "").text("---Select---"));
            $("#sub_Department").empty().append($("<option></option>").attr("value", "").text(""));
			$("#JobCardNo").empty().append($("<option></option>").attr("value", "").text(""));
			$("#Employee_Id").empty().append($("<option></option>").attr("value", "").text(""));



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


				$("#sub_Department").empty().append($("<option></option>").attr("value", "").text("---Select---"));
                $("#JobCardNo").empty().append($("<option></option>").attr("value", "").text("---Select---"));


				$.each(DeptName, function (key, value) {
					$("#sub_Department").append(
						$("<option></option>").attr("value", key).text(value)
					);
				});
			},
		});
        });


    $("#sub_Department").on("change", function () {

    var Department = $("#Department").val();
    var sub_Department = $("#sub_Department").val();
    var Shift = $("#Shift").val();
    var Date = $("#Date").val();

    $.ajax({
        url: baseurl + "Allocation/Job_Card_Number",
        type: "POST",
        data: {
            Date: Date,
            Shift: Shift,
            Department: Department,
            sub_Department: sub_Department,
        },
        success: function (response) {
            var responseData = JSON.parse(response);
            var JobCardNo = responseData.Job_Card_No;
            var JobCard = {};

            $("#JobCardNo").empty();

            for (var i = 0; i < JobCardNo.length; i++) {
                var DName = JobCardNo[i];
                JobCard[DName.Job_Card_No] = DName.Job_Card_No;
            }

            $("#JobCardNo").append($("<option></option>").attr("value", "").text("Select this option"));

            $.each(JobCard, function (key, value) {
                $("#JobCardNo").append($("<option></option>").attr("value", key).text(value));
            });

			$("#JobCardNo option:eq(1)").prop("selected", true);



            $("#Allocation_Table tbody").empty();

        var Department = $("#Department").val();
        var sub_Department = $("#sub_Department").val();
        var Shift = $("#Shift").val();
        var Date = $("#Date").val();
        var Job_Card_No = $("#JobCardNo").val();


    $.ajax({
        url: baseurl + "Allocation/Asssigned_Employee_Lst",
        type: "POST",
        data: {
            Shift: Shift,
            Date: Date,
            JobCardNo: Job_Card_No,
            Department: Department,
            sub_Department: sub_Department,
        },
        success: function (response) {

},

        error: function () {
            console.error("Error fetching assigned employees.");
        }
    });


           var shift = $("#Shift").val();
                var date = $("#Date").val();
                var department = $("#Department").val();
                var subDepartment = $("#sub_Department").val();
				var JobCardNo = $("#JobCardNo").val();

				// alert('1')

                $.ajax({
                    url: baseurl + "Allocation/Machine_Ids",
                    type: "POST",
                    data: {
                        Shift: shift,
                        Date: date,
                        JobCardNo: JobCardNo,
                        Department: department,
                        sub_Department: subDepartment,
                    },
                    success: function (response) {
                        var responseData = JSON.parse(response);
                        var Machine_Id = responseData.Machine_Ids;
                        var MachineIds = {};

                        $("#Machine_Id").empty().append($("<option></option>").attr("value", "").text(""));
                        $("#Machine_Id").append($("<option></option>").attr("value", "NoWork").text("NoWork"))
                            .append($("<option></option>").attr("value", "Others").text("Others"));

                        for (var i = 0; i < Machine_Id.length; i++) {
                            var DName = Machine_Id[i];
                            MachineIds[DName.Machine_Id] = DName.Machine_Id;
                        }

                        $.each(MachineIds, function (key, value) {
                            $("#Machine_Id").append($("<option></option>").attr("value", key).text(value));
                        });

                    },
                    error: function () {
                        console.error("Error fetching machine IDs.");
                    }
                });
        },
    });


    });

    	$("#Machine_Id").on("change", function () {


		$('#Description').val('');
		$("#Others").val('-');

		var Machine_Id = $("#Machine_Id").val();

		if (Machine_Id == "NoWork") {
			$("#Frame_Col").hide();
			$("#Frame_Cols").hide();
			$("#OtherWork").hide();
			$("#OtherWorks").hide();
			$('#Description').val('');
			$("#OtherWork").hide();

		} else if (Machine_Id == "Others") {
			$("#OtherWork").show();
			// $("#OtherWorks").show();
			$("#Frame_Col").hide();
			$("#Frame_Cols").hide();
		} else if (Machine_Id == "") {
			$("#Frame_Col").hide();
			$("#Frame_Cols").hide();
			$("#OtherWork").hide();
			$("#OtherWorks").hide();
			$('#Description').val('');
			$("#OtherWork").hide();


		} else {
			$("#Frame_Col").show();
			$("#Frame_Cols").show();
			$('#Description').val('');
			$("#OtherWork").hide();


		}

        var shift = $("#Shift").val();
        var date = $("#Date").val();
        var department = $("#Department").val();
        var subDepartment = $("#sub_Department").val();
        var jobCardNo = $("#JobCardNo").val();
        var machineId = $("#Machine_Id").val();

        $.ajax({
            url: baseurl + "Allocation/Machine_Frames",
            type: "POST",
            data: {
                Shift: shift,
                Date: date,
                JobCardNo: jobCardNo,
                Department: department,
                sub_Department: subDepartment,
                Machine: machineId
            },
            success: function (response) {
                try {
                    var responseData = JSON.parse(response);
                    var framesData = responseData.Machine_Frames || [];
                    var frames = {};

                    $("#Frames").empty().append(
                        $("<option></option>").attr("value", "").text("")
                    );
                    framesData.forEach(function (frame) {
                        var cleanFrame = frame.Frame.replace("simple", "");
                        frames[cleanFrame] = cleanFrame;
                    });

                    $.each(frames, function (key, value) {
                        $("#Frames").append(
                            $("<option></option>").attr("value", key).text(value)
                        );
                    });

                    $("#FrameType").val("All").trigger("change");
                } catch (error) {
                    console.error("Error parsing machine frames response: ", error);
                }
            },
            error: function () {
                console.error("Error fetching machine frames.");
            }
        });

        if (machineId === "NoWork") {
            $("#Frame_Col, #Frame_Cols, #OtherWork, #OtherWorks").hide();
            $("#Description").val("");
        } else if (machineId === "Others") {
            $("#OtherWork").show();
            $("#Frame_Col, #Frame_Cols").hide();
        } else if (!machineId) {
            $("#Frame_Col, #Frame_Cols, #OtherWork, #OtherWorks").hide();
            $("#Description").val("");
        } else {
            $("#Frame_Col, #Frame_Cols").show();
            $("#Description").val("");
            $("#OtherWork").hide();
        }
    });

    $("#Frame_Col, #Frame_Cols, #OtherWork, #OtherWorks").hide();
    $("#Description").val("");

    $("#Others").on("change", function () {
        var othersValue = $(this).val();
        if (othersValue === "Others") {
            $("#OtherWorks").show();
        } else {
            $("#OtherWorks").hide();
        }
	});


    var frameType = $("#FrameType").val();
    // alert(frameType)
    handleFrameTypeChange(frameType);

$("#FrameType").on("change", function () {
    var selectedFrameType = $("#FrameType").val();
        // alert(selectedFrameType)

    handleFrameTypeChange(selectedFrameType);
});

function handleFrameTypeChange(frameType) {
    // Always hide the "x" button
    $(".badge .remove-button").hide();

    if (frameType == "All") {
        $("#Frame_Cols").show();
        $("#Frames").prop("disabled", false);

        var allValues = $("#Frames option")
            .map(function () {
                if ($(this).val() !== "") {
                    return $(this).val();
                }
            })
            .get();

        $("#Frames").val(allValues).trigger("change");
    }
    else if (frameType == "Partial") {
        $("#Frame_Cols").show();
        $("#Frames").prop("enable", false);

        $("#Frames").val([]).trigger("change");

        // If you want to disable the dropdown in "Partial", you can do it here:
        $("#Frames").prop("enable", true);
    }
    }

    	$("#Work_Allocation").on("click", function () {
		var Date = $("#Date").val();
		var Department = $("#Department").val();
		var Shift = $("#Shift").val();
		var Sub_Department = $("#sub_Department").val();
		var JobCardNo = $("#JobCardNo").val();
		var Employee_Id = $("#Employee_Id").val();
		var Machine_Id = $("#Machine_Id").val();
		var FrameType = $("#FrameType").val();
		var Frames = $("#Frames").val();
		var WorkType = $("#Others").val();
		var Description = $("#Description").val();

		$.ajax({
			type: "POST",
			url: "Edit_Check",
			data: {
				Date: Date,
				Department: Department,
				Shift: Shift,
				Sub_Department: Sub_Department,
				JobCardNo: JobCardNo,
				Employee_Id: Employee_Id,
				Machine_Id: Machine_Id,
				FrameType: FrameType,
				Frames: Frames,
				WorkType: WorkType,
				Description: Description,
			},
			success: function (response) {
				var responseData = JSON.parse(response);
				var Check_Duplicate = responseData.Check_Duplicate;

				if (
					Check_Duplicate &&
					Array.isArray(Check_Duplicate) &&
					Check_Duplicate.length > 0
				) {
					var duplicate = Check_Duplicate[0];

					swal({
						title: "Error!",
						text: `Employee ${duplicate.FirstName} (ID: ${duplicate.EmpNo}) is already assigned to Machine: ${duplicate.Machine_Id} with Frame: ${duplicate.Frame}.`,
						icon: "error",
						buttons: true,
						className: "swal-small",
					});


				} else if (responseData == "No") {
					if (!Employee_Id || !Machine_Id) {
						alert("Please select both Employee Id and Machine Id.");
						return;
					}

					var duplicateFound = false;
					var assignedMachine = null;
					var assignedFrames = [];
					var assignedWorkType = "";

					$("#Allocation_Table tbody tr").each(function () {
						var row = $(this);
						var rowEmployeeId = row.find("td:eq(0)").text();
						var rowMachineId = row.find("td:eq(1)").text();
						var rowFrame = row.find("td:eq(3)").text();
						var rowWorkType = row.find("td:eq(4)").text();

						if (rowEmployeeId === Employee_Id) {
							if (rowMachineId !== "NoWork" && rowMachineId !== "Others") {
								assignedMachine = rowMachineId;
								assignedFrames.push(rowFrame);
								assignedWorkType = rowWorkType;
							} else if (
								rowMachineId === "NoWork" ||
								rowMachineId === "Others"
							) {
								duplicateFound = true;
								return false;
							}
						}
					});


					if (Machine_Id === "NoWork" || Machine_Id === "Others") {
						var newRow = $("<tr>");
						newRow.append($("<td>").text(Employee_Id));
						newRow.append($("<td>").text(Machine_Id));
						newRow.append($("<td>").text("-"));
						newRow.append($("<td>").text("-"));
						newRow.append($("<td>").text(WorkType));
						newRow.append($("<td>").text(Description));

						var deleteIcon = $("<td>").html(
	                    `<i class="fa fa-trash" style="cursor: pointer; color: red; font-size: 20px; padding: 5px;"></i>`						);
						newRow.append(deleteIcon);



						$("#Allocation_Table_Container").show();
						// $("#Allocation_Table").DataTable()

						$("#Allocation_Table tbody").append(newRow);


					} else {
						if (
							!Array.isArray(Frames) ||
							Frames.length === 0 ||
							Frames[0] === "---Select--"
						) {
							alert("Please select at least one frame.");
							return;
						}

						for (var i = 0; i < Frames.length; i++) {
							var frame = Frames[i];

							var newRow = $("<tr>");
							newRow.append($("<td>").text(Employee_Id));
							newRow.append($("<td>").text(Machine_Id));
							newRow.append($("<td>").text(FrameType));
							newRow.append($("<td>").text(frame));
							newRow.append($("<td>").text(WorkType));
							newRow.append($("<td>").text(""));

							var deleteIcon = $("<td>").html(
	                               '<i class="fa fa-trash" style="cursor: pointer; color: red; font-size: 20px; padding: 5px;"></i>'							);
							newRow.append(deleteIcon);

							$("#Allocation_Table tbody").append(newRow);
						}

						$("#Machine_Id").empty();
						$("#Frame_Col").hide();
						$("#Frame_Cols").hide();
						$("#OtherWork").hide();
						$("#OtherWorks").hide();
						$("#Grades-col").hide();
						$('#Description').val('');
						$("#Frames").empty();

						$("#Allocation_Table_Container").show();
                        $("#Allocation_Table").DataTable()



						$("#Work_Allocation_Clear").on("click", function () {
							$("#Employee_Id").empty();
							$("#Machine_Id").empty();
							$("#Frame_Col").hide();
							$("#Frame_Cols").hide();
							$("#OtherWork").hide();
							$("#OtherWorks").hide();
							$("#Grades-col").hide();
							$('#Description').val('');
							// $("#Others").empty();



							fetchEmployeeData(Department, Shift, Date);
							fetchMachineData(Department, Sub_Department);
						});

						fetchMachineData(Department, Sub_Department);
					}

					// $(document).on("click", ".fa-trash", function () {
					// 	$(this).closest("tr").remove();
					// });
				}
			},
		}); fetchMachineData

		function fetchEmployeeData(Department, Shift, Date) {
			$.ajax({
				url: baseurl + "Allocation/Shift_Employee",
				type: "POST",
				data: {
					Department: Department,
					Shift: Shift,
					Date: Date,
				},
				success: function (response) {
					var responseData = JSON.parse(response);
					var Employee_Data = responseData.Employees_List;
					var Employee_Name = {};

					for (var i = 0; i < Employee_Data.length; i++) {
						var DName = Employee_Data[i];
						Employee_Name[DName.EmpNo] = DName.FirstName;
					}

					$("#Employee_Id")
						.empty()
						.append(
							$("<option></option>").attr("value", "").text("---Select--")
						);
					$.each(Employee_Name, function (key, value) {
						var displayText = key + " => " + value;
						$("#Employee_Id").append(
							$("<option></option>").attr("value", key).text(displayText)
						);
					});
				},
			});
		}

		function fetchMachineData(Department, Sub_Department) {

			// alert('Good')


			$.ajax({
				url: baseurl + "Allocation/Machine_Ids",
				type: "POST",
				data: {
					Department: Department,
					sub_Department: Sub_Department,
				},
				success: function (response) {
					var responseData = JSON.parse(response);
					var Machine_Id = responseData.Machine_Ids;
					var Machine_Ids = {};

					for (var i = 0; i < Machine_Id.length; i++) {
						var DName = Machine_Id[i];
						Machine_Ids[DName.Machine_Id] = DName.Machine_Id;
					}

					$("#Machine_Id")
						.empty()
						.append(
							$("<option></option>")
								.attr("value", "")
								.text("Select this option")
						)
						.append(
							$("<option></option>").attr("value", "NoWork").text("NoWork")
						)
						.append(
							$("<option></option>").attr("value", "Others").text("Others")
						);

					$.each(Machine_Ids, function (key, value) {
						$("#Machine_Id").append(
							$("<option></option>").attr("value", key).text(value)
						);
					});
				},
			});
		}

        });

    $(document).on("click", ".fa-trash", function () {
						$(this).closest("tr").remove();
					});

    		// Submit Work Allocations
$("#Work_Allocations").on("click", function () {
    var tableData = [];

    // Ensure all necessary fields are not empty before proceeding
    if (!$("#Department").val() || !$("#Shift").val() || !$("#Date").val()) {
        alert("Please fill in all the required fields.");
        return; // Stop if the form is incomplete
    }

    $("#Allocation_Table tbody tr").each(function () {
        var row = $(this);
        var rowData = {
            Date: $("#Date").val(),
            Department: $("#Department").val(),
            Shift: $("#Shift").val(),
            Sub_Department: $("#sub_Department").val(),
            JobCardNo: $("#JobCardNo").val(),
            Employee_Id: row.find("td:eq(0)").text(),
            Machine_Id: row.find("td:eq(1)").text(),
            FrameType: row.find("td:eq(2)").text(),
            Frame: row.find("td:eq(3)").text(),
            WorkType: row.find("td:eq(4)").text(),
            Description: row.find("td:eq(5)").text(),
        };
        tableData.push(rowData);
    });

    var formData = {
        Allocations: tableData,
    };

    $.ajax({
        url: baseurl + "Allocation/Edit_Assign",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            var responseData = JSON.parse(response);

            if (responseData.status === "success") {
                $("#Frames").empty();

                // Fetch Employee Data for the selected Department, Shift, Date
                $.ajax({
                    url: baseurl + "Allocation/Shift_Employee",
                    type: "POST",
                    data: {
                        Department: $("#Department").val(),
                        Shift: $("#Shift").val(),
                        Date: $("#Date").val(),
                    },
                    success: function (response) {
                        var responseData = JSON.parse(response);
                        var Employee_Data = responseData.Employees_List;
                        var Employee_Name = {};

                        // Create an Employee list mapping
                        for (var i = 0; i < Employee_Data.length; i++) {
                            var DName = Employee_Data[i];
                            Employee_Name[DName.EmpNo] = DName.FirstName;
                        }

                        // Update Employee Id dropdown
                        $("#Employee_Id").empty().append($("<option></option>").attr("value", "").text("---Select--"));
                        $.each(Employee_Name, function (key, value) {
                            var displayText = key + " => " + value;
                            $("#Employee_Id").append($("<option></option>").attr("value", key).text(displayText));
                        });
                    },
                    error: function () {
                        console.error("Error fetching employee data.");
                    },
                });

                // Fetch Machine IDs based on selected filters
                $.ajax({
                    url: baseurl + "Allocation/Machine_Ids",
                    type: "POST",
                    data: {
                        Shift: $("#Shift").val(),
                        Date: $("#Date").val(),
                        JobCardNo: $("#JobCardNo").val(),
                        Department: $("#Department").val(),
                        sub_Department: $("#sub_Department").val(),
                    },
                    success: function (response) {
                        var responseData = JSON.parse(response);
                        var Machine_Id = responseData.Machine_Ids;
                        var MachineIds = {};

                        $("#Machine_Id").empty().append($("<option></option>").attr("value", "").text(""));
                        $("#Machine_Id").append($("<option></option>").attr("value", "NoWork").text("NoWork"))
                            .append($("<option></option>").attr("value", "Others").text("Others"));

                        // Populate Machine Id dropdown
                        for (var i = 0; i < Machine_Id.length; i++) {
                            var DName = Machine_Id[i];
                            MachineIds[DName.Machine_Id] = DName.Machine_Id;
                        }

                        $.each(MachineIds, function (key, value) {
                            $("#Machine_Id").append($("<option></option>").attr("value", key).text(value));
                        });
                    },
                    error: function () {
                        console.error("Error fetching machine IDs.");
                    },
                });


                       $("#Allocation_Table tbody").empty();

        var Department = $("#Department").val();
        var sub_Department = $("#sub_Department").val();
        var Shift = $("#Shift").val();
        var Date = $("#Date").val();
                var Job_Card_No = $("#JobCardNo").val();
                var Employee_Id = $("#Employee_Id").val();


    $.ajax({
        url: baseurl + "Allocation/Edit_Asssigned_Employee_Lst",
        type: "POST",
        data: {
            Shift: Shift,
            Date: Date,
            JobCardNo: Job_Card_No,
            Department: Department,
            sub_Department: sub_Department,
            Employee_Id : Employee_Id
        },
        success: function (response) {
    if (!response || response.trim() === "") {
        console.error("Received empty response for assigned employees.");
        return;
    }

    try {
        var responseData = JSON.parse(response);
    } catch (error) {
        console.error("Error parsing JSON: ", error);
        return;
    }

    if (!responseData.Assigned_List || responseData.Assigned_List.length === 0) {
        console.log("No assigned employees found.");
        return;
			}

		$("#Allocation_Table_Container").show();


    var Assigned_Employees = responseData.Assigned_List;
    var rows = '';

    $.each(Assigned_Employees, function (index, data) {
        var row = `<tr>
                    <td>${data.EmpNo}</td>
                    <td>${data.Machine_Id}</td>
                    <td>${data.FrameType}</td>
                    <td>${data.Frame}</td>
                    <td>${data.Work_Type}</td>
                    <td>${data.Description}</td>
                    <td>
    <i class="fa fa-edit text-primary edit_btn" style="cursor: pointer; font-size: 20px; padding: 5px;"></i>
	<i class="fa fa-trash" style="cursor: pointer; color: red; font-size: 20px; padding: 5px;"></i>

</td>

                   </tr>`;
        rows += row;
    });

    $("#Allocation_Table tbody").append(rows);

    // Initialize the DataTable after appending rows
            $("#Allocation_Table").DataTable();



    $(document).on('click', '.edit_btn', function() {
    var Department = $("#Department").val();
    var sub_Department = $("#sub_Department").val();
    var Shift = $("#Shift").val();
    var Date = $("#Date").val();
    var Job_Card_No = $("#JobCardNo").val();
    var EmpNo = $(this).closest('tr').find('td').eq(0).text();
    window.location.href = `/Allocation/Edit?EmpNo=${EmpNo}&Department=${Department}&sub_Department=${sub_Department}&Shift=${Shift}&Date=${Date}&JobCardNo=${Job_Card_No}`;
});
        },


        error: function () {
            console.error("Error fetching assigned employees.");
        }
    });








                // Show success message
                swal({
                    title: "Success!",
                    text: "Employee Work Allocation Process Completed.",
                    icon: "success",
                    buttons: true,
                    className: "swal-small",
                });

            } else if (responseData.Allocation_Detail && responseData.Allocation_Detail.length > 0) {
                // Handle allocation errors
                responseData.Allocation_Detail.forEach(function (allocation) {
                    swal({
                        title: "Error!",
                        text: `Employee ${allocation.Employee_Name} (ID: ${allocation.Employee_Id}) is already assigned to Machine: ${allocation.Machine_Name} with Frame: ${allocation.Frame}.`,
                        icon: "error",
                        buttons: true,
                        className: "swal-small",
                    });
                });
            }
        },
        error: function (xhr, status, error) {
            alert("Error sending data: " + error);
        },
    });
});



})