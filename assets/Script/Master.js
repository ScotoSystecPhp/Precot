$(document).ready(function () {

	var currentDate = new Date().toISOString().split("T")[0];
	$("#Date").val(currentDate);

    $("#Allocation_Table_Container").hide();


    //========================================================== Document Ready ======================================================//

    $.ajax({
        url: baseurl + "Work_Master/Depertments",
        type: "POST",
        success: function (response) {
            var responseData = JSON.parse(response);
            var Department_Data = responseData.Departments;

            var Department = {};

            for (var i = 0; i < Department_Data.length; i++) {
                var DName = Department_Data[i];
                Department[DName.Name] = DName.Name;
            }

            $.each(Department, function (key, value) {
                $("#Department").append($("<option></option>").attr("value", key).text(value));
            });

            $("#Department option:first").prop("selected", true);


            //-----------------------------------------------------------------Work_Areas----------------------------------------------------//

            var Department = $("#Department").val();

            $.ajax({
                url: baseurl + "Work_Master/Work_Areas",
                type: "POST",
                data:
                {
                    Department
                },

                success: function (response) {
                    var responseData = JSON.parse(response);
                    var Work_Areas = responseData.Work_Areas;

                    var Work_Area = {};

                    for (var i = 0; i < Work_Areas.length; i++) {
                        var DName = Work_Areas[i];
                        Work_Area[DName.WorkArea] = DName.WorkArea;
                    }

                    $.each(Work_Area, function (key, value) {
                        $("#Work_Area").append($("<option></option>").attr("value", key).text(value));
                    });

                    $("#Work_Area option:first").prop("selected", true);

                    //-----------------------------------------------------------------Job Card------------------------------------------------------//

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

                            $.each(JobCard, function (key, value) {
                                $("#JobCardNo").append($("<option></option>").attr("value", key).text(value));
                            });

                            $("#JobCardNo option:first").prop("selected", true);



                            //---------------------------------------------------------------Employee Type---------------------------------------------------//


                            var Department = $("#Department").val();

                            $.ajax({
                                url: baseurl + "Work_Master/Wages",
                                type: "POST",
                                data:
                                {
                                    Department,
                                },

                                success: function (response) {
                                    var responseData = JSON.parse(response);
                                    var Wages = responseData.Wages;

                                    var Wage = {};

                                    for (var i = 0; i < Wages.length; i++) {
                                        var DName = Wages[i];
                                        Wage[DName.wages] = DName.wage_category;
                                    }

                                    $.each(Wage, function (key, value) {
                                        $("#Employee_Type").append($("<option></option>").attr("value", key).text(value));
                                    });

                                    $("#Employee_Type option:first").prop("selected", true);


                                    //---------------------------------------------------------------Employee--------------------------------------------------------//

                                    var Date = $("#Date").val();
                                    var Department = $("#Department").val();
                                    var Shift = $("#Shift").val();
                                    var Work_Area = $("#Work_Area").val();
                                    var Employee_Type = $("#Employee_Type").val();
                                    var JobCardNo = $("#JobCardNo").val();


                                    $.ajax({
                                        url: baseurl + "Work_Master/Employee_List",
                                        type: "POST",
                                        data:
                                        {
                                            Date,
                                            Department,
                                            Shift,
                                            Employee_Type,
                                            Work_Area,
                                            JobCardNo
                                        },
                                        success: function (response) {

                                            var responseData = JSON.parse(response);
                                            var Employee_Data = responseData.Employee_List;
                                            var Machine_Data = responseData.Machines;

                                            // if (responseData.length > 0) {

                                                $("#Allocation_Table tbody").empty();
                                                $("#Allocation_Table_Container").show();

                                                // Create a set to track processed EmpNos to avoid duplication
                                                var processedEmpNos = new Set();

                                                // Create a map to hold the frames for each machine for easy access
                                                var machineFrames = {};

                                                Machine_Data.forEach(function (machine) {
                                                    if (!machineFrames[machine.Machine_Id]) {
                                                        machineFrames[machine.Machine_Id] = new Set();
                                                    }
                                                    machineFrames[machine.Machine_Id].add(machine.FrameType);
                                                });

                                                // Create a set to track unique machine IDs
                                                var uniqueMachineIds = new Set();

                                                // Filter out the unique machine IDs from Machine_Data
                                                var uniqueMachines = Machine_Data.filter(function (machine) {
                                                    if (uniqueMachineIds.has(machine.Machine_Id)) {
                                                        return false;
                                                    } else {
                                                        uniqueMachineIds.add(machine.Machine_Id);
                                                        return true;
                                                    }
                                                });

                                                // Render Employee rows in the Allocation Table
                                                Employee_Data.forEach(function (Employee, i) {
                                                    if (processedEmpNos.has(Employee.EmpNo)) {
                                                        return;
                                                    }

                                                    processedEmpNos.add(Employee.EmpNo);

                                                    // Initialize assignedMachineIds as an empty array
                                                    var assignedMachineIds = [];

                                                    // Collect all assigned machine IDs for this employee (grouping them together)
                                                    Employee_Data.forEach(function (emp) {
                                                        if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                                            assignedMachineIds.push(emp.Machine_Id);
                                                        }
                                                    });

                                                    // Create the machine options dropdown, including only unique machines
                                                    var allMachineOptions = uniqueMachines.map(function (machine) {
                                                        return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                                                    }).join("");

                                                    // Add "NoWork" and "Others" options manually at the end
                                                    allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                                                    // Create WorkType options dropdown
                                                    var workTypeOptions = "<option value=''>Select Work Type</option>";

                                                    var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                                                    var employeeRowHtml =
                                                        "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                                        "<td>" + Employee.EmpNo + "</td>" +
                                                        "<td>" + Employee.FirstName + "</td>" +
                                                        "<td>" +
                                                        "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                                        allMachineOptions +
                                                        "</select>" +
                                                        "</td>" +
                                                        "<td>" +
                                                        "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                                        "</select>" +
                                                        "</td>" +
                                                        "<td>" +
                                                        "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                                        "</select>" +
                                                        "</td>" +
                                                        "<td>" +
                                                        "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                                        workTypeOptions +
                                                        "</select>" +
                                                        "</td>" +
                                                        "<td>" +
                                                        "<select class='custom-select2 form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                                        +'<option value="">Workers</option>'+
                                                        +"</select>"+
                                                        "</td>" +
                                                        "<td>" +
                                                        "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                                        "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                                        "</td>" +
                                                        "</tr>";

                                                    // Append the row to the table
                                                    $("#Allocation_Table tbody").append(employeeRowHtml);

                                                    $("#Edit_Allocation_" + i).hide();


                                                    // Preselect Machine IDs for the employee (multiple selected)
                                                    if (selectedMachineIds.length > 0) {

                                                        var selectedMachineOptions = "";
                                                        selectedMachineIds.forEach(function (machineId) {
                                                            selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                                        });

                                                        // Combine the selected machines with all available machine options
                                                        var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                                        $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                                        $("#Edit_Allocation_" + i).show();

                                                    }

                                                    // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                                                    var frameOptions = '';

                                                    assignedMachineIds.forEach(function (machineId) {
                                                        var framesForMachine = Employee_Data.filter(function (emp) {
                                                            return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                                        }).map(function (emp) {
                                                            return emp.Frame;
                                                        });

                                                        framesForMachine.forEach(function (frame) {
                                                            frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                                        });
                                                    });

                                                    // Prepopulate the Frames dropdown with the correct frames for the specific employee
                                                    var frameOptions = '';

                                                    assignedMachineIds.forEach(function (machineId) {
                                                        var framesForEmployee = Employee_Data.filter(function (emp) {
                                                            return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                                        }).map(function (emp) {
                                                            return emp.Frame;
                                                        });

                                                        framesForEmployee.forEach(function (frame) {
                                                            if (!frameOptions.includes(frame)) {
                                                                frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                                            }
                                                        });
                                                    });

                                                    if (!frameOptions) {
                                                        frameOptions = "<option value=''>Select Frame</option>";
                                                    }

                                                    $("#Frames_" + i).html(frameOptions);

                                                    // Preselect FrameType if available from Employee_Data and not equal to '-'
                                                    var frameOptionsType = '';
                                                    if (Employee.FrameType && Employee.FrameType !== '-') {
                                                        frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                                                    }

                                                    if (frameOptionsType) {
                                                        $("#Frame_Method_" + i).html(frameOptionsType);
                                                    }

                                                    // Prepopulate the WorkType dropdown if available
                                                    var Work_Type = '';
                                                    if (Employee.Work_Type) {
                                                        Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                                                    }
                                                    $("#WorkType_" + i).html(Work_Type);

                                                    // Prepopulate the Description input if available
                                                    if (Employee.Description) {
                                                        $("#Description_" + i).val(Employee.Description);
                                                    }

                                                     $("#Allocation_Table tbody").on("change", ".Machine_Id", function () {
                                                var Machine_Id = $(this).val();
                                                var currentRow = $(this).closest("tr");

                                                $("#Allocation_" + i).show();



                                                var frameMethodSelect = currentRow.find(".Frame_Method");
                                                var framesSelect = currentRow.find(".Frames");
                                                var workTypeSelect = currentRow.find(".WorkType");
                                                var descriptionInput = currentRow.find(".Description");
                                                var allocationButton = currentRow.find(".Allocation");
                                                var editButton = currentRow.find(".Edit_Allocation");

                                                allocationButton.show();
                                                editButton.show();

                                                var Work_Area = $("#Work_Area").val();

                                                framesSelect.empty().prop("disabled", true);
                                                workTypeSelect.empty().prop("disabled", true);
                                                descriptionInput.prop("disabled", true).val("");
                                                frameMethodSelect.empty().prop("disabled", true);

                                                if (Machine_Id == "NoWork") {
                                                    frameMethodSelect.prop("disabled", true);
                                                    framesSelect.prop("disabled", true);
                                                    workTypeSelect.prop("disabled", true).empty();
                                                    descriptionInput.prop("disabled", true);
                                                } else if (Machine_Id == "Others") {
                                                    frameMethodSelect.prop("disabled", true);
                                                    framesSelect.prop("disabled", true);
                                                    workTypeSelect.prop("disabled", false).empty().append("<option value=''></option><option value='Others'>Others</option></option><option value=" + Work_Area + "'>" + Work_Area + "</option>");
                                                    descriptionInput.prop("disabled", true);

                                                    workTypeSelect.on("change", function () {
                                                        var workType = $(this).val();

                                                        if (workType === "Others") {
                                                            descriptionInput.prop("disabled", false);
                                                        } else if (workType === "Cleaning") {
                                                            descriptionInput.prop("disabled", true);
                                                        }
                                                    });
                                                } else {
                                                    frameMethodSelect.prop("disabled", false);
                                                    framesSelect.prop("disabled", false);
                                                    workTypeSelect.prop("disabled", true).empty();
                                                    descriptionInput.prop("disabled", true);

                                                    allocationButton.show();

                                                    frameMethodSelect.append("<option value=''></option>");
                                                    frameMethodSelect.append("<option value='All'>All</option>");
                                                    frameMethodSelect.append("<option value='Partial'>Partial</option>");

                                                    var Work_Area = $("#Work_Area").val();
                                                    var JobCardNo = $("#JobCardNo").val();
                                                    var Department = $("#Department").val();
                                                    var Date = $("#Date").val();
                                                    var Shift = $("#Shift").val();

                                                    $.ajax({
                                                        url: baseurl + "Work_Master/Machine_Frames",
                                                        type: "POST",
                                                        data: {
                                                            Work_Area: Work_Area,
                                                            JobCardNo: JobCardNo,
                                                            Department: Department,
                                                            Machine_Id: Machine_Id,
                                                            Date,
                                                            Machine_Id,
                                                            Shift

                                                        },
                                                        success: function (response) {
                                                            var responseData = JSON.parse(response);
                                                            var Machine_Frames = responseData.Machine_Frames;

                                                            framesSelect.empty().prop("disabled", false);

                                                            $.each(Machine_Frames, function (index, value) {
                                                                framesSelect.append($("<option></option>").attr("value", value.Frame).text(value.Frame));
                                                            });

                                                            frameMethodSelect.on("change", function () {
                                                                var frameMethod = $(this).val();

                                                                framesSelect.empty();

                                                                if (frameMethod == "All") {
                                                                    $.each(Machine_Frames, function (index, value) {
                                                                        var option = $("<option></option>").attr("value", value.Frame).text(value.Frame);
                                                                        framesSelect.append(option);
                                                                    });

                                                                    framesSelect.val(Machine_Frames.map(function (frame) { return frame.Frame; })).trigger('change');
                                                                } else if (frameMethod == "Partial") {
                                                                    if (Machine_Frames.length > 0) {
                                                                        var firstFrame = Machine_Frames[0].Frame;
                                                                        var option = $("<option></option>").attr("value", firstFrame).text(firstFrame).prop("selected", true);
                                                                        framesSelect.append(option);
                                                                    }
                                                                }

                                                                framesSelect.trigger('change');
                                                            });
                                                        },
                                                        error: function (error) {
                                                            console.log("Error loading machine frames: ", error);
                                                        }
                                                    });
                                                }
                                            });

                                            // Edit Allocation
$("#Allocation_Table tbody").on("click", ".Edit_Allocation", function () {
    var currentRow = $(this).closest("tr");  // Capture the correct row context
    var i = currentRow.index();  // Use the row index to reference the correct element

    swal({
        title: 'Allocation Edit Reason',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Edit',
        showLoaderOnConfirm: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        preConfirm: function (reason) {
            return new Promise(function (resolve, reject) {
                if (reason && reason.trim() !== "") {
                    resolve(reason); // Resolve with the input value
                } else {
                    reject('Please provide a valid reason!');
                }
            });
        },
        allowOutsideClick: false
    }).then(function (result) {

        var Date = $("#Date").val();
        var Department = $("#Department").val();
        var Shift = $("#Shift").val();
        var Work_Area = $("#Work_Area").val();
        var JobCardNo = $("#JobCardNo").val();

        var EmployeeId = currentRow.find("td:nth-child(1)").text();
        var EmployeeName = currentRow.find("td:nth-child(2)").text();
        var MachineId = currentRow.find(".Machine_Id").val();
        var FrameMethod = currentRow.find(".Frame_Method").val();
        var Frames = currentRow.find(".Frames").val();
        var WorkType = currentRow.find(".WorkType").val();
        var Description = currentRow.find(".Description").val();

        var allocationData = {
            Date: Date,
            Department: Department,
            Shift: Shift,
            Work_Area: Work_Area,
            JobCardNo: JobCardNo,
            EmployeeId: EmployeeId,
            EmployeeName: EmployeeName,
            MachineId: MachineId,
            FrameMethod: FrameMethod,
            Frames: Frames,
            WorkType: WorkType,
            Description: Description,
            Reason: result
        };

        var formData = {
            Allocations: [allocationData]
        };

        // First AJAX request (to update allocation)
        $.ajax({
            url: baseurl + 'Allocation/Edit',
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
                var responseData = JSON.parse(response);

                if (responseData == 1) {

                    // Second AJAX request (to fetch updated employee list)
                    $.ajax({
                        url: baseurl + "Work_Master/Employee_List",
                        type: "POST",
                        data: {
                            Date: Date,
                            Department: Department,
                            Shift: Shift,
                            Employee_Type: Employee_Type,
                            Work_Area: Work_Area,
                            JobCardNo: JobCardNo
                        },
                        success: function (response) {
                            var responseData = JSON.parse(response);
                            var Employee_Data = responseData.Employee_List;
                            var Machine_Data = responseData.Machines;

                            $("#Allocation_Table tbody").empty();

                            var processedEmpNos = new Set();
                            var machineFrames = {};
                            Machine_Data.forEach(function (machine) {
                                if (!machineFrames[machine.Machine_Id]) {
                                    machineFrames[machine.Machine_Id] = new Set();
                                }
                                machineFrames[machine.Machine_Id].add(machine.FrameType);
                            });

                            var uniqueMachineIds = new Set();
                            var uniqueMachines = Machine_Data.filter(function (machine) {
                                if (uniqueMachineIds.has(machine.Machine_Id)) {
                                    return false;
                                } else {
                                    uniqueMachineIds.add(machine.Machine_Id);
                                    return true;
                                }
                            });

                            Employee_Data.forEach(function (Employee, i) {
                                if (processedEmpNos.has(Employee.EmpNo)) {
                                    return;
                                }

                                processedEmpNos.add(Employee.EmpNo);

                                var assignedMachineIds = [];

                                Employee_Data.forEach(function (emp) {
                                    if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && !assignedMachineIds.includes(emp.Machine_Id)) {
                                        assignedMachineIds.push(emp.Machine_Id);
                                    }
                                });

                                var allMachineOptions = uniqueMachines.map(function (machine) {
                                    return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                                }).join("");

                                allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                                var workTypeOptions = "<option value=''>Select Work Type</option>";

                                var selectedMachineIds = (Employee.Assign_Status !== "0") ? assignedMachineIds : [];

                                var employeeRowHtml =
                                    "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                    "<td>" + Employee.EmpNo + "</td>" +
                                    "<td>" + Employee.FirstName + "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                    allMachineOptions +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                    workTypeOptions +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                    "</td>" +
                                    "<td>" +
                                    "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                    "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                    "</td>" +
                                    "</tr>";

                                $("#Allocation_Table tbody").append(employeeRowHtml);

                                $("#Edit_Allocation_" + i).hide();

                                if (selectedMachineIds.length > 0) {
                                    var selectedMachineOptions = "";
                                    selectedMachineIds.forEach(function (machineId) {
                                        selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                    });

                                    var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                    $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                    $("#Edit_Allocation_" + i).show();
                                }

                                var frameOptions = '';
                                assignedMachineIds.forEach(function (machineId) {
                                    var framesForEmployee = Employee_Data.filter(function (emp) {
                                        return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                    }).map(function (emp) {
                                        return emp.Frame;
                                    });

                                    framesForEmployee.forEach(function (frame) {
                                        if (!frameOptions.includes(frame)) {
                                            frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                        }
                                    });
                                });

                                if (!frameOptions) {
                                    frameOptions = "<option value=''>Select Frame</option>";
                                }
                                $("#Frames_" + i).html(frameOptions);

                                var frameOptionsType = '';
                                if (Employee.FrameType && Employee.FrameType !== '-') {
                                    frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                                }

                                if (frameOptionsType) {
                                    $("#Frame_Method_" + i).html(frameOptionsType);
                                }

                                var Work_Type = '';
                                if (Employee.Work_Type) {
                                    Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                                }
                                $("#WorkType_" + i).html(Work_Type);

                                if (Employee.Description) {
                                    $("#Description_" + i).val(Employee.Description);
                                }
                            });

                            $("#Allocation_Table tbody .custom-select2").select2({
                                placeholder: "",
                                allowClear: true,
                                width: '140px',
                                dropdownCssClass: 'custom-select2-dropdown',
                                containerCssClass: 'custom-select2-container'
                            });

                            // Display success message after both AJAX requests are completed
                            swal({
                                type: 'success',
                                title: 'Allocation Edit Finished!',
                                html: 'Updated: ' + result.value
                            });

                        },
                        error: function (error) {
                            console.log(error);
                            swal({
                                title: "Error!",
                                text: "Error sending allocation data.",
                                icon: "error",
                                buttons: true,
                                className: "swal",
                            }).then((value) => { });
                        }
                    });

                } else {
                    swal({
                        type: 'warning',
                        title: 'Warning',
                        text: 'Allocation Edit Failed! Please edit correctly.'
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error in first AJAX request:", status, error);
                swal({
                    type: 'warning',
                    title: 'Warning',
                    text: 'Allocation Edit Failed! Edit correctly.'
                });
            }
        });

    }).catch(function (error) {
        swal({
            type: 'warning',
            title: 'Warning',
            text: error
        });
    });
});

                                                });



                                                $("#Allocation_Table tbody .custom-select2").select2({
                                                    placeholder: "",
                                                    allowClear: true,
                                                    width: '140px',
                                                    dropdownCssClass: 'custom-select2-dropdown',
                                                    containerCssClass: 'custom-select2-container'
                                                });

                                            // } else {

                                            //     swal(
                                            //         {
                                            //             type: 'warning',
                                            //             title: 'warning',
                                            //             text: 'Employee Details Not Found Server!',
                                            //         }
                                            //     );

                                            // }



                                        },


                                    });



                                },
                            });

                        },
                    });
                },
            });
        },
    });


    //--------------------------------------------------------------- Shifts ---------------------------------------------------------//

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


    //----------------------------------------------------------DEPARTMENT CHANGE ----------------------------------------------------//



    $("#Department").change(function () {

        var Department = $("#Department").val();

        $("#Allocation_Table_Container").hide();
        $("#Allocation_Table tbody").empty();

        $.ajax({
            url: baseurl + "Work_Master/Work_Areas",
            type: "POST",
            data: { Department },
            success: function (response) {
                var responseData = JSON.parse(response);
                var Work_Areas = responseData.Work_Areas;

                var Work_Area = {};
                for (var i = 0; i < Work_Areas.length; i++) {
                    var DName = Work_Areas[i];
                    Work_Area[DName.WorkArea] = DName.WorkArea;
                }

                $("#Work_Area").empty();
                $("#JobCardNo").empty();
                $("#Employee_Type").empty();

                $.each(Work_Area, function (key, value) {
                    $("#Work_Area").append($("<option></option>").attr("value", key).text(value));
                });

                $("#Work_Area option:first").prop("selected", true);


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

                        $.each(JobCard, function (key, value) {
                            $("#JobCardNo").append($("<option></option>").attr("value", key).text(value));
                        });

                        $("#JobCardNo option:first").prop("selected", true);



                        var Department = $("#Department").val();

                        $.ajax({
                            url: baseurl + "Work_Master/Wages",
                            type: "POST",
                            data:
                            {
                                Department,
                            },

                            success: function (response) {
                                var responseData = JSON.parse(response);
                                var Wages = responseData.Wages;

                                var Wagess = {};

                                for (var i = 0; i < Wages.length; i++) {
                                    var DName = Wages[i];
                                    Wagess[DName.wages] = DName.wage_category;
                                }

                                $.each(Wagess, function (key, value) {
                                    $("#Employee_Type").append($("<option></option>").attr("value", key).text(value));
                                });

                                $("#Employee_Type option:first").prop("selected", true);


                                var Date = $("#Date").val();
                                var Department = $("#Department").val();
                                var Shift = $("#Shift").val();
                                var Employee_Type = $("#Employee_Type").val();
                                var Work_Area = $("#Work_Area").val();
                                var JobCardNo = $("#JobCardNo").val();


                                $.ajax({
                                    url: baseurl + "Work_Master/Employee_List",
                                    type: "POST",
                                    data:
                                    {
                                        Date,
                                        Department,
                                        Shift,
                                        Employee_Type,
                                        Work_Area,
                                        JobCardNo

                                    },
                                    success: function (response) {

                                        var responseData = JSON.parse(response);
                                        var Employee_Data = responseData.Employee_List;
                                        var Machine_Data = responseData.Machines;

                                        // if (responseData.length > 0) {


                                            $("#Allocation_Table tbody").empty();
                                            $("#Allocation_Table_Container").show();

                                            // Create a set to track processed EmpNos to avoid duplication
                                            var processedEmpNos = new Set();

                                            // Create a map to hold the frames for each machine for easy access
                                            var machineFrames = {};

                                            Machine_Data.forEach(function (machine) {
                                                if (!machineFrames[machine.Machine_Id]) {
                                                    machineFrames[machine.Machine_Id] = new Set();
                                                }
                                                machineFrames[machine.Machine_Id].add(machine.FrameType);
                                            });

                                            // Create a set to track unique machine IDs
                                            var uniqueMachineIds = new Set();

                                            // Filter out the unique machine IDs from Machine_Data
                                            var uniqueMachines = Machine_Data.filter(function (machine) {
                                                if (uniqueMachineIds.has(machine.Machine_Id)) {
                                                    return false;
                                                } else {
                                                    uniqueMachineIds.add(machine.Machine_Id);
                                                    return true;
                                                }
                                            });

                                            // Render Employee rows in the Allocation Table
                                            Employee_Data.forEach(function (Employee, i) {
                                                if (processedEmpNos.has(Employee.EmpNo)) {
                                                    return;
                                                }

                                                processedEmpNos.add(Employee.EmpNo);

                                                // Initialize assignedMachineIds as an empty array
                                                var assignedMachineIds = [];

                                                // Collect all assigned machine IDs for this employee (grouping them together)
                                                Employee_Data.forEach(function (emp) {
                                                    if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                                        assignedMachineIds.push(emp.Machine_Id);
                                                    }
                                                });

                                                // Create the machine options dropdown, including only unique machines
                                                var allMachineOptions = uniqueMachines.map(function (machine) {
                                                    return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                                                }).join("");

                                                // Add "NoWork" and "Others" options manually at the end
                                                allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                                                // Create WorkType options dropdown
                                                var workTypeOptions = "<option value=''>Select Work Type</option>";

                                                var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                                                var employeeRowHtml =
                                                    "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                                    "<td>" + Employee.EmpNo + "</td>" +
                                                    "<td>" + Employee.FirstName + "</td>" +
                                                    "<td>" +
                                                    "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                                    allMachineOptions +
                                                    "</select>" +
                                                    "</td>" +
                                                    "<td>" +
                                                    "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                                    "</select>" +
                                                    "</td>" +
                                                    "<td>" +
                                                    "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                                    "</select>" +
                                                    "</td>" +
                                                    "<td>" +
                                                    "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                                    workTypeOptions +
                                                    "</select>" +
                                                    "</td>" +
                                                    "<td>" +
                                                    "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                                    "</td>" +
                                                    "<td>" +
                                                    "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                                    "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                                    "</td>" +
                                                    "</tr>";

                                                // Append the row to the table
                                                $("#Allocation_Table tbody").append(employeeRowHtml);

                                                $("#Edit_Allocation_" + i).hide();


                                                // Preselect Machine IDs for the employee (multiple selected)
                                                if (selectedMachineIds.length > 0) {

                                                    var selectedMachineOptions = "";
                                                    selectedMachineIds.forEach(function (machineId) {
                                                        selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                                    });

                                                    // Combine the selected machines with all available machine options
                                                    var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                                    $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                                    $("#Edit_Allocation_" + i).show();

                                                }

                                                // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                                                var frameOptions = '';

                                                assignedMachineIds.forEach(function (machineId) {
                                                    var framesForMachine = Employee_Data.filter(function (emp) {
                                                        return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                                    }).map(function (emp) {
                                                        return emp.Frame;
                                                    });

                                                    framesForMachine.forEach(function (frame) {
                                                        frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                                    });
                                                });

                                                // Prepopulate the Frames dropdown with the correct frames for the specific employee
                                                var frameOptions = '';

                                                assignedMachineIds.forEach(function (machineId) {
                                                    var framesForEmployee = Employee_Data.filter(function (emp) {
                                                        return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                                    }).map(function (emp) {
                                                        return emp.Frame;
                                                    });

                                                    framesForEmployee.forEach(function (frame) {
                                                        if (!frameOptions.includes(frame)) {
                                                            frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                                        }
                                                    });
                                                });

                                                if (!frameOptions) {
                                                    frameOptions = "<option value=''>Select Frame</option>";
                                                }

                                                $("#Frames_" + i).html(frameOptions);

                                                // Preselect FrameType if available from Employee_Data and not equal to '-'
                                                var frameOptionsType = '';
                                                if (Employee.FrameType && Employee.FrameType !== '-') {
                                                    frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                                                }

                                                if (frameOptionsType) {
                                                    $("#Frame_Method_" + i).html(frameOptionsType);
                                                }

                                                // Prepopulate the WorkType dropdown if available
                                                var Work_Type = '';
                                                if (Employee.Work_Type) {
                                                    Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                                                }
                                                $("#WorkType_" + i).html(Work_Type);

                                                // Prepopulate the Description input if available
                                                if (Employee.Description) {
                                                    $("#Description_" + i).val(Employee.Description);
                                                }
                                            });



                                            $("#Allocation_Table tbody .custom-select2").select2({
                                                placeholder: "",
                                                allowClear: true,
                                                width: '140px',
                                                dropdownCssClass: 'custom-select2-dropdown',
                                                containerCssClass: 'custom-select2-container'
                                            });

                                            $("#Allocation_Table tbody").on("change", ".Machine_Id", function () {
                                                var Machine_Id = $(this).val();
                                                var currentRow = $(this).closest("tr");

                                                $("#Allocation_" + i).show();



                                                var frameMethodSelect = currentRow.find(".Frame_Method");
                                                var framesSelect = currentRow.find(".Frames");
                                                var workTypeSelect = currentRow.find(".WorkType");
                                                var descriptionInput = currentRow.find(".Description");
                                                var allocationButton = currentRow.find(".Allocation");
                                                var editButton = currentRow.find(".Edit_Allocation");

                                                allocationButton.show();
                                                editButton.show();

                                                var Work_Area = $("#Work_Area").val();

                                                framesSelect.empty().prop("disabled", true);
                                                workTypeSelect.empty().prop("disabled", true);
                                                descriptionInput.prop("disabled", true).val("");
                                                frameMethodSelect.empty().prop("disabled", true);

                                                if (Machine_Id == "NoWork") {
                                                    frameMethodSelect.prop("disabled", true);
                                                    framesSelect.prop("disabled", true);
                                                    workTypeSelect.prop("disabled", true).empty();
                                                    descriptionInput.prop("disabled", true);
                                                } else if (Machine_Id == "Others") {
                                                    frameMethodSelect.prop("disabled", true);
                                                    framesSelect.prop("disabled", true);
                                                    workTypeSelect.prop("disabled", false).empty().append("<option value=''></option><option value='Others'>Others</option></option><option value=" + Work_Area + "'>" + Work_Area + "</option>");
                                                    descriptionInput.prop("disabled", true);

                                                    workTypeSelect.on("change", function () {
                                                        var workType = $(this).val();

                                                        if (workType === "Others") {
                                                            descriptionInput.prop("disabled", false);
                                                        } else if (workType === "Cleaning") {
                                                            descriptionInput.prop("disabled", true);
                                                        }
                                                    });
                                                } else {
                                                    frameMethodSelect.prop("disabled", false);
                                                    framesSelect.prop("disabled", false);
                                                    workTypeSelect.prop("disabled", true).empty();
                                                    descriptionInput.prop("disabled", true);

                                                    allocationButton.show();

                                                    frameMethodSelect.append("<option value=''></option>");
                                                    frameMethodSelect.append("<option value='All'>All</option>");
                                                    frameMethodSelect.append("<option value='Partial'>Partial</option>");

                                                    var Work_Area = $("#Work_Area").val();
                                                    var JobCardNo = $("#JobCardNo").val();
                                                    var Department = $("#Department").val();
                                                    var Date = $("#Date").val();
                                                    var Shift = $("#Shift").val();

                                                    $.ajax({
                                                        url: baseurl + "Work_Master/Machine_Frames",
                                                        type: "POST",
                                                        data: {
                                                            Work_Area: Work_Area,
                                                            JobCardNo: JobCardNo,
                                                            Department: Department,
                                                            Machine_Id: Machine_Id,
                                                            Date,
                                                            Machine_Id,
                                                            Shift

                                                        },
                                                        success: function (response) {
                                                            var responseData = JSON.parse(response);
                                                            var Machine_Frames = responseData.Machine_Frames;

                                                            framesSelect.empty().prop("disabled", false);

                                                            $.each(Machine_Frames, function (index, value) {
                                                                framesSelect.append($("<option></option>").attr("value", value.Frame).text(value.Frame));
                                                            });

                                                            frameMethodSelect.on("change", function () {
                                                                var frameMethod = $(this).val();

                                                                framesSelect.empty();

                                                                if (frameMethod == "All") {
                                                                    $.each(Machine_Frames, function (index, value) {
                                                                        var option = $("<option></option>").attr("value", value.Frame).text(value.Frame);
                                                                        framesSelect.append(option);
                                                                    });

                                                                    framesSelect.val(Machine_Frames.map(function (frame) { return frame.Frame; })).trigger('change');
                                                                } else if (frameMethod == "Partial") {
                                                                    if (Machine_Frames.length > 0) {
                                                                        var firstFrame = Machine_Frames[0].Frame;
                                                                        var option = $("<option></option>").attr("value", firstFrame).text(firstFrame).prop("selected", true);
                                                                        framesSelect.append(option);
                                                                    }
                                                                }

                                                                framesSelect.trigger('change');
                                                            });
                                                        },
                                                        error: function (error) {
                                                            console.log("Error loading machine frames: ", error);
                                                        }
                                                    });
                                                }
                                            });

                                            // Edit Allocation
$("#Allocation_Table tbody").on("click", ".Edit_Allocation", function () {
    var currentRow = $(this).closest("tr");  // Capture the correct row context
    var i = currentRow.index();  // Use the row index to reference the correct element

    swal({
        title: 'Allocation Edit Reason',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Edit',
        showLoaderOnConfirm: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        preConfirm: function (reason) {
            return new Promise(function (resolve, reject) {
                if (reason && reason.trim() !== "") {
                    resolve(reason); // Resolve with the input value
                } else {
                    reject('Please provide a valid reason!');
                }
            });
        },
        allowOutsideClick: false
    }).then(function (result) {

        var Date = $("#Date").val();
        var Department = $("#Department").val();
        var Shift = $("#Shift").val();
        var Work_Area = $("#Work_Area").val();
        var JobCardNo = $("#JobCardNo").val();

        var EmployeeId = currentRow.find("td:nth-child(1)").text();
        var EmployeeName = currentRow.find("td:nth-child(2)").text();
        var MachineId = currentRow.find(".Machine_Id").val();
        var FrameMethod = currentRow.find(".Frame_Method").val();
        var Frames = currentRow.find(".Frames").val();
        var WorkType = currentRow.find(".WorkType").val();
        var Description = currentRow.find(".Description").val();

        var allocationData = {
            Date: Date,
            Department: Department,
            Shift: Shift,
            Work_Area: Work_Area,
            JobCardNo: JobCardNo,
            EmployeeId: EmployeeId,
            EmployeeName: EmployeeName,
            MachineId: MachineId,
            FrameMethod: FrameMethod,
            Frames: Frames,
            WorkType: WorkType,
            Description: Description,
            Reason: result
        };

        var formData = {
            Allocations: [allocationData]
        };

        // First AJAX request (to update allocation)
        $.ajax({
            url: baseurl + 'Allocation/Edit',
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
                var responseData = JSON.parse(response);

                if (responseData == 1) {

                    // Second AJAX request (to fetch updated employee list)
                    $.ajax({
                        url: baseurl + "Work_Master/Employee_List",
                        type: "POST",
                        data: {
                            Date: Date,
                            Department: Department,
                            Shift: Shift,
                            Employee_Type: Employee_Type,
                            Work_Area: Work_Area,
                            JobCardNo: JobCardNo
                        },
                        success: function (response) {
                            var responseData = JSON.parse(response);
                            var Employee_Data = responseData.Employee_List;
                            var Machine_Data = responseData.Machines;

                            $("#Allocation_Table tbody").empty();

                            var processedEmpNos = new Set();
                            var machineFrames = {};
                            Machine_Data.forEach(function (machine) {
                                if (!machineFrames[machine.Machine_Id]) {
                                    machineFrames[machine.Machine_Id] = new Set();
                                }
                                machineFrames[machine.Machine_Id].add(machine.FrameType);
                            });

                            var uniqueMachineIds = new Set();
                            var uniqueMachines = Machine_Data.filter(function (machine) {
                                if (uniqueMachineIds.has(machine.Machine_Id)) {
                                    return false;
                                } else {
                                    uniqueMachineIds.add(machine.Machine_Id);
                                    return true;
                                }
                            });

                            Employee_Data.forEach(function (Employee, i) {
                                if (processedEmpNos.has(Employee.EmpNo)) {
                                    return;
                                }

                                processedEmpNos.add(Employee.EmpNo);

                                var assignedMachineIds = [];

                                Employee_Data.forEach(function (emp) {
                                    if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && !assignedMachineIds.includes(emp.Machine_Id)) {
                                        assignedMachineIds.push(emp.Machine_Id);
                                    }
                                });

                                var allMachineOptions = uniqueMachines.map(function (machine) {
                                    return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                                }).join("");

                                allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                                var workTypeOptions = "<option value=''>Select Work Type</option>";

                                var selectedMachineIds = (Employee.Assign_Status !== "0") ? assignedMachineIds : [];

                                var employeeRowHtml =
                                    "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                    "<td>" + Employee.EmpNo + "</td>" +
                                    "<td>" + Employee.FirstName + "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                    allMachineOptions +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                    workTypeOptions +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                    "</td>" +
                                    "<td>" +
                                    "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                    "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                    "</td>" +
                                    "</tr>";

                                $("#Allocation_Table tbody").append(employeeRowHtml);

                                $("#Edit_Allocation_" + i).hide();

                                if (selectedMachineIds.length > 0) {
                                    var selectedMachineOptions = "";
                                    selectedMachineIds.forEach(function (machineId) {
                                        selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                    });

                                    var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                    $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                    $("#Edit_Allocation_" + i).show();
                                }

                                var frameOptions = '';
                                assignedMachineIds.forEach(function (machineId) {
                                    var framesForEmployee = Employee_Data.filter(function (emp) {
                                        return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                    }).map(function (emp) {
                                        return emp.Frame;
                                    });

                                    framesForEmployee.forEach(function (frame) {
                                        if (!frameOptions.includes(frame)) {
                                            frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                        }
                                    });
                                });

                                if (!frameOptions) {
                                    frameOptions = "<option value=''>Select Frame</option>";
                                }
                                $("#Frames_" + i).html(frameOptions);

                                var frameOptionsType = '';
                                if (Employee.FrameType && Employee.FrameType !== '-') {
                                    frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                                }

                                if (frameOptionsType) {
                                    $("#Frame_Method_" + i).html(frameOptionsType);
                                }

                                var Work_Type = '';
                                if (Employee.Work_Type) {
                                    Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                                }
                                $("#WorkType_" + i).html(Work_Type);

                                if (Employee.Description) {
                                    $("#Description_" + i).val(Employee.Description);
                                }
                            });

                            $("#Allocation_Table tbody .custom-select2").select2({
                                placeholder: "",
                                allowClear: true,
                                width: '140px',
                                dropdownCssClass: 'custom-select2-dropdown',
                                containerCssClass: 'custom-select2-container'
                            });

                            // Display success message after both AJAX requests are completed
                            swal({
                                type: 'success',
                                title: 'Allocation Edit Finished!',
                                html: 'Updated: ' + result.value
                            });

                        },
                        error: function (error) {
                            console.log(error);
                            swal({
                                title: "Error!",
                                text: "Error sending allocation data.",
                                icon: "error",
                                buttons: true,
                                className: "swal",
                            }).then((value) => { });
                        }
                    });

                } else {
                    swal({
                        type: 'warning',
                        title: 'Warning',
                        text: 'Allocation Edit Failed! Please edit correctly.'
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error in first AJAX request:", status, error);
                swal({
                    type: 'warning',
                    title: 'Warning',
                    text: 'Allocation Edit Failed! Edit correctly.'
                });
            }
        });

    }).catch(function (error) {
        swal({
            type: 'warning',
            title: 'Warning',
            text: error
        });
    });
});






                                        // } else {

                                        //     swal(
                                        //         {
                                        //             type: 'warning',
                                        //             title: 'warning',
                                        //             text: 'Employee Details Not Found Server!',
                                        //         }
                                        //     );

                                        // }

                                    }
                                })


                            }

                        });

                    },
                    error: function () {
                        console.log("Error fetching work areas data.");
                    }
                });
            }
        })
    });


    // ================================================= DEPARTMENT CHANGE END =====================================================//


    // ================================================= WORK AREA CHANGE STRAT =====================================================//


    $("#Work_Area").on("change", function () {

        $("#JobCardNo").empty();
        $("#Employee_Type").empty();

        $("#Allocation_Table_Container").hide();
        $("#Allocation_Table tbody").empty();


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

                $.each(JobCard, function (key, value) {
                    $("#JobCardNo").append($("<option></option>").attr("value", key).text(value));
                });

                $("#JobCardNo option:first").prop("selected", true);

                var Department = $("#Department").val();

                $.ajax({
                    url: baseurl + "Work_Master/Wages",
                    type: "POST",
                    data:
                    {
                        Department,
                    },

                    success: function (response) {
                        var responseData = JSON.parse(response);
                        var Wages = responseData.Wages;

                        var Wagess = {};

                        for (var i = 0; i < Wages.length; i++) {
                            var DName = Wages[i];
                            Wagess[DName.wages] = DName.wage_category;
                        }

                        $.each(Wagess, function (key, value) {
                            $("#Employee_Type").append($("<option></option>").attr("value", key).text(value));
                        });

                        $("#Employee_Type option:first").prop("selected", true);


                        var Date = $("#Date").val();
                        var Department = $("#Department").val();
                        var Shift = $("#Shift").val();
                        var Employee_Type = $("#Employee_Type").val();
                        var Work_Area = $("#Work_Area").val();
                        var JobCardNo = $("#JobCardNo").val();


                        $.ajax({
                            url: baseurl + "Work_Master/Employee_List",
                            type: "POST",
                            data:
                            {
                                Date,
                                Department,
                                Shift,
                                Employee_Type,
                                Work_Area,
                                JobCardNo

                            },
                            success: function (response) {

                                var responseData = JSON.parse(response);
                                var Employee_Data = responseData.Employee_List;
                                var Machine_Data = responseData.Machines;

                                // if (responseData.length > 0) {

                                    $("#Allocation_Table tbody").empty();
                                    $("#Allocation_Table_Container").show();


                                    // Create a set to track processed EmpNos to avoid duplication
                                    var processedEmpNos = new Set();

                                    // Create a map to hold the frames for each machine for easy access
                                    var machineFrames = {};

                                    Machine_Data.forEach(function (machine) {
                                        if (!machineFrames[machine.Machine_Id]) {
                                            machineFrames[machine.Machine_Id] = new Set();
                                        }
                                        machineFrames[machine.Machine_Id].add(machine.FrameType);
                                    });

                                    // Create a set to track unique machine IDs
                                    var uniqueMachineIds = new Set();

                                    // Filter out the unique machine IDs from Machine_Data
                                    var uniqueMachines = Machine_Data.filter(function (machine) {
                                        if (uniqueMachineIds.has(machine.Machine_Id)) {
                                            return false;
                                        } else {
                                            uniqueMachineIds.add(machine.Machine_Id);
                                            return true;
                                        }
                                    });

                                    // Render Employee rows in the Allocation Table
                                    Employee_Data.forEach(function (Employee, i) {
                                        if (processedEmpNos.has(Employee.EmpNo)) {
                                            return;
                                        }

                                        processedEmpNos.add(Employee.EmpNo);

                                        // Initialize assignedMachineIds as an empty array
                                        var assignedMachineIds = [];

                                        // Collect all assigned machine IDs for this employee (grouping them together)
                                        Employee_Data.forEach(function (emp) {
                                            if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                                assignedMachineIds.push(emp.Machine_Id);
                                            }
                                        });

                                        // Create the machine options dropdown, including only unique machines
                                        var allMachineOptions = uniqueMachines.map(function (machine) {
                                            return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                                        }).join("");

                                        // Add "NoWork" and "Others" options manually at the end
                                        allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                                        // Create WorkType options dropdown
                                        var workTypeOptions = "<option value=''>Select Work Type</option>";

                                        var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                                        var employeeRowHtml =
                                            "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                            "<td>" + Employee.EmpNo + "</td>" +
                                            "<td>" + Employee.FirstName + "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                            allMachineOptions +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                            workTypeOptions +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                            "</td>" +
                                            "<td>" +
                                            "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                            "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                            "</td>" +
                                            "</tr>";

                                        // Append the row to the table
                                        $("#Allocation_Table tbody").append(employeeRowHtml);

                                        $("#Edit_Allocation_" + i).hide();


                                        // Preselect Machine IDs for the employee (multiple selected)
                                        if (selectedMachineIds.length > 0) {

                                            var selectedMachineOptions = "";
                                            selectedMachineIds.forEach(function (machineId) {
                                                selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                            });

                                            // Combine the selected machines with all available machine options
                                            var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                            $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                            $("#Edit_Allocation_" + i).show();

                                        }

                                        // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                                        var frameOptions = '';

                                        assignedMachineIds.forEach(function (machineId) {
                                            var framesForMachine = Employee_Data.filter(function (emp) {
                                                return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                            }).map(function (emp) {
                                                return emp.Frame;
                                            });

                                            framesForMachine.forEach(function (frame) {
                                                frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                            });
                                        });

                                        // Prepopulate the Frames dropdown with the correct frames for the specific employee
                                        var frameOptions = '';

                                        assignedMachineIds.forEach(function (machineId) {
                                            var framesForEmployee = Employee_Data.filter(function (emp) {
                                                return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                            }).map(function (emp) {
                                                return emp.Frame;
                                            });

                                            framesForEmployee.forEach(function (frame) {
                                                if (!frameOptions.includes(frame)) {
                                                    frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                                }
                                            });
                                        });

                                        if (!frameOptions) {
                                            frameOptions = "<option value=''>Select Frame</option>";
                                        }

                                        $("#Frames_" + i).html(frameOptions);

                                        // Preselect FrameType if available from Employee_Data and not equal to '-'
                                        var frameOptionsType = '';
                                        if (Employee.FrameType && Employee.FrameType !== '-') {
                                            frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                                        }

                                        if (frameOptionsType) {
                                            $("#Frame_Method_" + i).html(frameOptionsType);
                                        }

                                        // Prepopulate the WorkType dropdown if available
                                        var Work_Type = '';
                                        if (Employee.Work_Type) {
                                            Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                                        }
                                        $("#WorkType_" + i).html(Work_Type);

                                        // Prepopulate the Description input if available
                                        if (Employee.Description) {
                                            $("#Description_" + i).val(Employee.Description);
                                        }
                                    });


                                    $("#Allocation_Table tbody .custom-select2").select2({
                                        placeholder: "",
                                        allowClear: true,
                                        width: '140px',
                                        dropdownCssClass: 'custom-select2-dropdown',
                                        containerCssClass: 'custom-select2-container'
                                    });



    // $("#Allocation_Table tbody").on("change", ".Machine_Id", function () {
    //     var Machine_Id = $(this).val();
    //     var currentRow = $(this).closest("tr");

    //     $("#Allocation_" + i).show();



    //     var frameMethodSelect = currentRow.find(".Frame_Method");
    //     var framesSelect = currentRow.find(".Frames");
    //     var workTypeSelect = currentRow.find(".WorkType");
    //     var descriptionInput = currentRow.find(".Description");
    //     var allocationButton = currentRow.find(".Allocation");
    //     var editButton = currentRow.find(".Edit_Allocation");

    //     allocationButton.show();
    //     editButton.show();

    //     var Work_Area = $("#Work_Area").val();

    //     framesSelect.empty().prop("disabled", true);
    //     workTypeSelect.empty().prop("disabled", true);
    //     descriptionInput.prop("disabled", true).val("");
    //     frameMethodSelect.empty().prop("disabled", true);

    //     if (Machine_Id == "NoWork") {
    //         frameMethodSelect.prop("disabled", true);
    //         framesSelect.prop("disabled", true);
    //         workTypeSelect.prop("disabled", true).empty();
    //         descriptionInput.prop("disabled", true);
    //     } else if (Machine_Id == "Others") {
    //         frameMethodSelect.prop("disabled", true);
    //         framesSelect.prop("disabled", true);
    //         workTypeSelect.prop("disabled", false).empty().append("<option value=''></option><option value='Others'>Others</option></option><option value=" + Work_Area + "'>" + Work_Area + "</option>");
    //         descriptionInput.prop("disabled", true);

    //         workTypeSelect.on("change", function () {
    //             var workType = $(this).val();

    //             if (workType === "Others") {
    //                 descriptionInput.prop("disabled", false);
    //             } else if (workType === "Cleaning") {
    //                 descriptionInput.prop("disabled", true);
    //             }
    //         });
    //     } else {
    //         frameMethodSelect.prop("disabled", false);
    //         framesSelect.prop("disabled", false);
    //         workTypeSelect.prop("disabled", true).empty();
    //         descriptionInput.prop("disabled", true);

    //         allocationButton.show();

    //         frameMethodSelect.append("<option value=''></option>");
    //         frameMethodSelect.append("<option value='All'>All</option>");
    //         frameMethodSelect.append("<option value='Partial'>Partial</option>");

    //         var Work_Area = $("#Work_Area").val();
    //         var JobCardNo = $("#JobCardNo").val();
    //         var Department = $("#Department").val();
    //         var Date = $("#Date").val();
    //         var Shift = $("#Shift").val();

    //         $.ajax({
    //             url: baseurl + "Work_Master/Machine_Frames",
    //             type: "POST",
    //             data: {
    //                 Work_Area: Work_Area,
    //                 JobCardNo: JobCardNo,
    //                 Department: Department,
    //                 Machine_Id: Machine_Id,
    //                 Date,
    //                 Machine_Id,
    //                 Shift

    //             },
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);
    //                 var Machine_Frames = responseData.Machine_Frames;

    //                 framesSelect.empty().prop("disabled", false);

    //                 $.each(Machine_Frames, function (index, value) {
    //                     framesSelect.append($("<option></option>").attr("value", value.Frame).text(value.Frame));
    //                 });

    //                 frameMethodSelect.on("change", function () {
    //                     var frameMethod = $(this).val();

    //                     framesSelect.empty();

    //                     if (frameMethod == "All") {
    //                         $.each(Machine_Frames, function (index, value) {
    //                             var option = $("<option></option>").attr("value", value.Frame).text(value.Frame);
    //                             framesSelect.append(option);
    //                         });

    //                         framesSelect.val(Machine_Frames.map(function (frame) { return frame.Frame; })).trigger('change');
    //                     } else if (frameMethod == "Partial") {
    //                         if (Machine_Frames.length > 0) {
    //                             var firstFrame = Machine_Frames[0].Frame;
    //                             var option = $("<option></option>").attr("value", firstFrame).text(firstFrame).prop("selected", true);
    //                             framesSelect.append(option);
    //                         }
    //                     }

    //                     framesSelect.trigger('change');
    //                 });
    //             },
    //             error: function (error) {
    //                 console.log("Error loading machine frames: ", error);
    //             }
    //         });
    //     }
    // });




    //    // Allocation button click event
    // $("#Allocation_Table tbody").on("click", ".Allocation", function () {

    //     var currentRow = $(this).closest("tr");

    //     var tableData = [];

    //     var Date = $("#Date").val();
    //     var Department = $("#Department").val();
    //     var Shift = $("#Shift").val();
    //     var Work_Area = $("#Work_Area").val();
    //     var JobCardNo = $("#JobCardNo").val();

    //     var EmployeeId = currentRow.find("td:nth-child(1)").text();
    //     var EmployeeName = currentRow.find("td:nth-child(2)").text();
    //     var MachineId = currentRow.find(".Machine_Id").val();
    //     var FrameMethod = currentRow.find(".Frame_Method").val();
    //     var Frames = currentRow.find(".Frames").val();
    //     var WorkType = currentRow.find(".WorkType").val();
    //     var Description = currentRow.find(".Description").val();

    //     // Check if MachineId is not empty
    //     if (MachineId && MachineId !== "NoWork" && MachineId !== "Others") {
    //         var allocationData = {
    //             Date: Date,
    //             Department: Department,
    //             Shift: Shift,
    //             Work_Area: Work_Area,
    //             JobCardNo: JobCardNo,
    //             EmployeeId: EmployeeId,
    //             EmployeeName: EmployeeName,
    //             MachineId: MachineId,
    //             FrameMethod: FrameMethod,
    //             Frames: Frames,
    //             WorkType: WorkType,
    //             Description: Description
    //         };

    //         tableData.push(allocationData);

    //         var formData = {
    //             Allocations: tableData
    //         };

    //         $.ajax({
    //             url: baseurl + 'Allocation/Assign',
    //             type: 'POST',
    //             data: JSON.stringify(formData),
    //             contentType: 'application/json',
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);

    //                 $.ajax({
    //                     url: baseurl + "Work_Master/Employee_List",
    //                     type: "POST",
    //                     data: {
    //                         Date: Date,
    //                         Department: Department,
    //                         Shift: Shift,
    //                         Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
    //                         Work_Area: Work_Area,
    //                         JobCardNo: JobCardNo
    //                     },
    //                     success: function (response) {

    //                         var responseData = JSON.parse(response);
    //                         var Employee_Data = responseData.Employee_List;
    //                         var Machine_Data = responseData.Machines;

    //                         $("#Allocation_Table tbody").empty();

    //                         // Create a set to track processed EmpNos to avoid duplication
    //                         var processedEmpNos = new Set();

    //                         // Create a map to hold the frames for each machine for easy access
    //                         var machineFrames = {};

    //                         Machine_Data.forEach(function (machine) {
    //                             if (!machineFrames[machine.Machine_Id]) {
    //                                 machineFrames[machine.Machine_Id] = new Set();
    //                             }
    //                             machineFrames[machine.Machine_Id].add(machine.FrameType);
    //                         });

    //                         // Create a set to track unique machine IDs
    //                         var uniqueMachineIds = new Set();

    //                         // Filter out the unique machine IDs from Machine_Data
    //                         var uniqueMachines = Machine_Data.filter(function (machine) {
    //                             if (uniqueMachineIds.has(machine.Machine_Id)) {
    //                                 return false;
    //                             } else {
    //                                 uniqueMachineIds.add(machine.Machine_Id);
    //                                 return true;
    //                             }
    //                         });

    //                         // Render Employee rows in the Allocation Table
    //                         Employee_Data.forEach(function (Employee, i) {
    //                             if (processedEmpNos.has(Employee.EmpNo)) {
    //                                 return;
    //                             }

    //                             processedEmpNos.add(Employee.EmpNo);

    //                             // Initialize assignedMachineIds as an empty array
    //                             var assignedMachineIds = [];

    //                             // Collect all assigned machine IDs for this employee (grouping them together)
    //                             Employee_Data.forEach(function (emp) {
    //                                 if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
    //                                     assignedMachineIds.push(emp.Machine_Id);
    //                                 }
    //                             });

    //                             // Create the machine options dropdown, including only unique machines
    //                             var allMachineOptions = uniqueMachines.map(function (machine) {
    //                                 return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
    //                             }).join("");

    //                             // Add "NoWork" and "Others" options manually at the end
    //                             allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

    //                             // Create WorkType options dropdown
    //                             var workTypeOptions = "<option value=''>Select Work Type</option>";

    //                             var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

    //                             var employeeRowHtml =
    //                                 "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
    //                                 "<td>" + Employee.EmpNo + "</td>" +
    //                                 "<td>" + Employee.FirstName + "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
    //                                 allMachineOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
    //                                 workTypeOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
    //                                 "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
    //                                 "</td>" +
    //                                 "</tr>";

    //                             // Append the row to the table
    //                             $("#Allocation_Table tbody").append(employeeRowHtml);

    //                             $("#Edit_Allocation_" + i).hide();


    //                             // Preselect Machine IDs for the employee (multiple selected)
    //                             if (selectedMachineIds.length > 0) {

    //                                 var selectedMachineOptions = "";
    //                                 selectedMachineIds.forEach(function (machineId) {
    //                                     selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
    //                                 });

    //                                 // Combine the selected machines with all available machine options
    //                                 var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
    //                                 $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
    //                                 $("#Edit_Allocation_" + i).show();

    //                             }

    //                             // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForMachine = Employee_Data.filter(function (emp) {
    //                                     return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForMachine.forEach(function (frame) {
    //                                     frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                 });
    //                             });

    //                             // Prepopulate the Frames dropdown with the correct frames for the specific employee
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForEmployee = Employee_Data.filter(function (emp) {
    //                                     return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForEmployee.forEach(function (frame) {
    //                                     if (!frameOptions.includes(frame)) {
    //                                         frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                     }
    //                                 });
    //                             });

    //                             if (!frameOptions) {
    //                                 frameOptions = "<option value=''>Select Frame</option>";
    //                             }

    //                             $("#Frames_" + i).html(frameOptions);

    //                             // Preselect FrameType if available from Employee_Data and not equal to '-'
    //                             var frameOptionsType = '';
    //                             if (Employee.FrameType && Employee.FrameType !== '-') {
    //                                 frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
    //                             }

    //                             if (frameOptionsType) {
    //                                 $("#Frame_Method_" + i).html(frameOptionsType);
    //                             }

    //                             // Prepopulate the WorkType dropdown if available
    //                             var Work_Type = '';
    //                             if (Employee.Work_Type) {
    //                                 Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
    //                             }
    //                             $("#WorkType_" + i).html(Work_Type);

    //                             // Prepopulate the Description input if available
    //                             if (Employee.Description) {
    //                                 $("#Description_" + i).val(Employee.Description);
    //                             }
    //                         });
    //                         // Initialize Select2 for all dropdowns
    //                         $("#Allocation_Table tbody .custom-select2").select2({
    //                             placeholder: "",
    //                             allowClear: true,
    //                             width: '140px',
    //                             dropdownCssClass: 'custom-select2-dropdown',
    //                             containerCssClass: 'custom-select2-container'
    //                         });
    //                     },
    //                     error: function (error) {
    //                         swal({
    //                             title: "Error!",
    //                             text: "Error sending allocation data.",
    //                             icon: "error",
    //                             buttons: true,
    //                             className: "swal",
    //                         }).then((value) => { });
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });




    //  // Edit Allocation
    // $("#Allocation_Table tbody").on("click", ".Edit_Allocation", function () {
    //     var currentRow = $(this).closest("tr");  // Capture the correct row context
    //     var i = currentRow.index();  // Use the row index to reference the correct element

    //     swal({
    //         title: 'Allocation Edit Reason',
    //         input: 'text',
    //         showCancelButton: true,
    //         confirmButtonText: 'Edit',
    //         showLoaderOnConfirm: true,
    //         confirmButtonClass: 'btn btn-success',
    //         cancelButtonClass: 'btn btn-danger',
    //         preConfirm: function (reason) {
    //             return new Promise(function (resolve, reject) {
    //                 if (reason && reason.trim() !== "") {
    //                     resolve(reason); // Resolve with the input value
    //                 } else {
    //                     reject('Please provide a valid reason!');
    //                 }
    //             });
    //         },
    //         allowOutsideClick: false
    //     }).then(function (result) {

    //         var Date = $("#Date").val();
    //         var Department = $("#Department").val();
    //         var Shift = $("#Shift").val();
    //         var Work_Area = $("#Work_Area").val();
    //         var JobCardNo = $("#JobCardNo").val();

    //         var EmployeeId = currentRow.find("td:nth-child(1)").text();
    //         var EmployeeName = currentRow.find("td:nth-child(2)").text();
    //         var MachineId = currentRow.find(".Machine_Id").val();
    //         var FrameMethod = currentRow.find(".Frame_Method").val();
    //         var Frames = currentRow.find(".Frames").val();
    //         var WorkType = currentRow.find(".WorkType").val();
    //         var Description = currentRow.find(".Description").val();


    //         var allocationData = {
    //             Date: Date,
    //             Department: Department,
    //             Shift: Shift,
    //             Work_Area: Work_Area,
    //             JobCardNo: JobCardNo,
    //             EmployeeId: EmployeeId,
    //             EmployeeName: EmployeeName,
    //             MachineId: MachineId,
    //             FrameMethod: FrameMethod,
    //             Frames: Frames,
    //             WorkType: WorkType,
    //             Description: Description,
    //             Reason: result
    //         };

    //         var formData = {
    //             Allocations: [allocationData]
    //         };

    //         // First AJAX request (to update allocation)
    //         $.ajax({
    //             url: baseurl + 'Allocation/Edit',
    //             type: 'POST',
    //             data: JSON.stringify(formData),
    //             contentType: 'application/json',
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);
    //                 // Second AJAX request (to get updated employee list)
    //                 $.ajax({
    //                     url: baseurl + "Work_Master/Employee_List",
    //                     type: "POST",
    //                     data: {
    //                         Date: Date,
    //                         Department: Department,
    //                         Shift: Shift,
    //                         Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
    //                         Work_Area: Work_Area,
    //                         JobCardNo: JobCardNo
    //                     },
    //                     success: function (response) {
    //                         var responseData = JSON.parse(response);
    //                         var Employee_Data = responseData.Employee_List;
    //                         var Machine_Data = responseData.Machines;

    //                         $("#Allocation_Table tbody").empty();

    //                         // Create a set to track processed EmpNos to avoid duplication
    //                         var processedEmpNos = new Set();

    //                         // Create a map to hold the frames for each machine for easy access
    //                         var machineFrames = {};

    //                         Machine_Data.forEach(function (machine) {
    //                             if (!machineFrames[machine.Machine_Id]) {
    //                                 machineFrames[machine.Machine_Id] = new Set();
    //                             }
    //                             machineFrames[machine.Machine_Id].add(machine.FrameType);
    //                         });

    //                         // Create a set to track unique machine IDs
    //                         var uniqueMachineIds = new Set();

    //                         // Filter out the unique machine IDs from Machine_Data
    //                         var uniqueMachines = Machine_Data.filter(function (machine) {
    //                             if (uniqueMachineIds.has(machine.Machine_Id)) {
    //                                 return false;
    //                             } else {
    //                                 uniqueMachineIds.add(machine.Machine_Id);
    //                                 return true;
    //                             }
    //                         });

    //                         // Render Employee rows in the Allocation Table
    //                         Employee_Data.forEach(function (Employee, i) {
    //                             if (processedEmpNos.has(Employee.EmpNo)) {
    //                                 return;
    //                             }

    //                             processedEmpNos.add(Employee.EmpNo);

    //                             // Initialize assignedMachineIds as an empty array
    //                             var assignedMachineIds = [];

    //                             // Collect all assigned machine IDs for this employee (grouping them together)
    //                             Employee_Data.forEach(function (emp) {
    //                                 if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
    //                                     assignedMachineIds.push(emp.Machine_Id);
    //                                 }
    //                             });

    //                             // Create the machine options dropdown, including only unique machines
    //                             var allMachineOptions = uniqueMachines.map(function (machine) {
    //                                 return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
    //                             }).join("");

    //                             // Add "NoWork" and "Others" options manually at the end
    //                             allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

    //                             // Create WorkType options dropdown
    //                             var workTypeOptions = "<option value=''>Select Work Type</option>";

    //                             var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

    //                             var employeeRowHtml =
    //                                 "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
    //                                 "<td>" + Employee.EmpNo + "</td>" +
    //                                 "<td>" + Employee.FirstName + "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
    //                                 allMachineOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
    //                                 workTypeOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
    //                                 "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
    //                                 "</td>" +
    //                                 "</tr>";

    //                             // Append the row to the table
    //                             $("#Allocation_Table tbody").append(employeeRowHtml);

    //                             $("#Edit_Allocation_" + i).hide();


    //                             // Preselect Machine IDs for the employee (multiple selected)
    //                             if (selectedMachineIds.length > 0) {

    //                                 var selectedMachineOptions = "";
    //                                 selectedMachineIds.forEach(function (machineId) {
    //                                     selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
    //                                 });

    //                                 // Combine the selected machines with all available machine options
    //                                 var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
    //                                 $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
    //                                 $("#Edit_Allocation_" + i).show();

    //                             }

    //                             // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForMachine = Employee_Data.filter(function (emp) {
    //                                     return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForMachine.forEach(function (frame) {
    //                                     frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                 });
    //                             });

    //                             // Prepopulate the Frames dropdown with the correct frames for the specific employee
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForEmployee = Employee_Data.filter(function (emp) {
    //                                     return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForEmployee.forEach(function (frame) {
    //                                     if (!frameOptions.includes(frame)) {
    //                                         frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                     }
    //                                 });
    //                             });

    //                             if (!frameOptions) {
    //                                 frameOptions = "<option value=''>Select Frame</option>";
    //                             }

    //                             $("#Frames_" + i).html(frameOptions);

    //                             // Preselect FrameType if available from Employee_Data and not equal to '-'
    //                             var frameOptionsType = '';
    //                             if (Employee.FrameType && Employee.FrameType !== '-') {
    //                                 frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
    //                             }

    //                             if (frameOptionsType) {
    //                                 $("#Frame_Method_" + i).html(frameOptionsType);
    //                             }

    //                             // Prepopulate the WorkType dropdown if available
    //                             var Work_Type = '';
    //                             if (Employee.Work_Type) {
    //                                 Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
    //                             }
    //                             $("#WorkType_" + i).html(Work_Type);

    //                             // Prepopulate the Description input if available
    //                             if (Employee.Description) {
    //                                 $("#Description_" + i).val(Employee.Description);
    //                             }
    //                         });

    //                         // Reinitialize Select2 for new rows
    //                         $("#Allocation_Table tbody .custom-select2").select2({
    //                             placeholder: "",
    //                             allowClear: true,
    //                             width: '140px',
    //                             dropdownCssClass: 'custom-select2-dropdown',
    //                             containerCssClass: 'custom-select2-container'
    //                         });

    //                     },
    //                     error: function (xhr, status, error) {
    //                         console.error("Error in second AJAX request:", status, error);
    //                         swal({
    //                             title: "Error!",
    //                             text: "Error sending allocation data.",
    //                             icon: "error",
    //                             buttons: true,
    //                             className: "swal"
    //                         });
    //                     }
    //                 });
    //             },
    //             error: function (xhr, status, error) {
    //                 console.error("Error in first AJAX request:", status, error);
    //                 swal({
    //                     type: 'warning',
    //                     title: 'Warning',
    //                     text: 'Allocation Edit Failed! Edit Correctly.'
    //                 });
    //             }
    //         });

    //         // Display success message
    //         swal({
    //             type: 'success',
    //             title: 'Allocation Edit Finished!',
    //             html: 'Updated: ' + result.value // Access the 'value' property of the result object
    //         });

    //     }).catch(function (error) {
    //         swal({
    //             type: 'warning',
    //             title: 'Warning',
    //             text: error
    //         });
    //     });
    // });








                                // } else {

                                //     swal(
                                //         {
                                //             type: 'warning',
                                //             title: 'warning',
                                //             text: 'Employee Details Not Found Server!',
                                //         }
                                //     );

                                // }
                            }





                        })
                    }

                })
            }
        })
    })


    // ================================================= WORK AREA CHANGE END =====================================================//


 // ================================================= JOBCARD CHANGE STRAT =====================================================//


    $("#JobCardNo").on("change", function () {

        $("#Allocation_Table_Container").hide();
        $("#Allocation_Table tbody").empty();


                var Department = $("#Department").val();

                $.ajax({
                    url: baseurl + "Work_Master/Wages",
                    type: "POST",
                    data:
                    {
                        Department,
                    },

                    success: function (response) {
                        var responseData = JSON.parse(response);
                        var Wages = responseData.Wages;

                        var Wagess = {};

                        for (var i = 0; i < Wages.length; i++) {
                            var DName = Wages[i];
                            Wagess[DName.wages] = DName.wage_category;
                        }

                        $.each(Wagess, function (key, value) {
                            $("#Employee_Type").append($("<option></option>").attr("value", key).text(value));
                        });

                        $("#Employee_Type option:first").prop("selected", true);


                        var Date = $("#Date").val();
                        var Department = $("#Department").val();
                        var Shift = $("#Shift").val();
                        var Employee_Type = $("#Employee_Type").val();
                        var Work_Area = $("#Work_Area").val();
                        var JobCardNo = $("#JobCardNo").val();


                        $.ajax({
                            url: baseurl + "Work_Master/Employee_List",
                            type: "POST",
                            data:
                            {
                                Date,
                                Department,
                                Shift,
                                Employee_Type,
                                Work_Area,
                                JobCardNo

                            },
                            success: function (response) {

                                var responseData = JSON.parse(response);
                                var Employee_Data = responseData.Employee_List;
                                var Machine_Data = responseData.Machines;

                                // if (responseData.length > 0) {


                                    $("#Allocation_Table_Container").show();
                                    $("#Allocation_Table tbody").empty();

                                    // Create a set to track processed EmpNos to avoid duplication
                                    var processedEmpNos = new Set();

                                    // Create a map to hold the frames for each machine for easy access
                                    var machineFrames = {};

                                    Machine_Data.forEach(function (machine) {
                                        if (!machineFrames[machine.Machine_Id]) {
                                            machineFrames[machine.Machine_Id] = new Set();
                                        }
                                        machineFrames[machine.Machine_Id].add(machine.FrameType);
                                    });

                                    // Create a set to track unique machine IDs
                                    var uniqueMachineIds = new Set();

                                    // Filter out the unique machine IDs from Machine_Data
                                    var uniqueMachines = Machine_Data.filter(function (machine) {
                                        if (uniqueMachineIds.has(machine.Machine_Id)) {
                                            return false;
                                        } else {
                                            uniqueMachineIds.add(machine.Machine_Id);
                                            return true;
                                        }
                                    });

                                    // Render Employee rows in the Allocation Table
                                    Employee_Data.forEach(function (Employee, i) {
                                        if (processedEmpNos.has(Employee.EmpNo)) {
                                            return;
                                        }

                                        processedEmpNos.add(Employee.EmpNo);

                                        // Initialize assignedMachineIds as an empty array
                                        var assignedMachineIds = [];

                                        // Collect all assigned machine IDs for this employee (grouping them together)
                                        Employee_Data.forEach(function (emp) {
                                            if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                                assignedMachineIds.push(emp.Machine_Id);
                                            }
                                        });

                                        // Create the machine options dropdown, including only unique machines
                                        var allMachineOptions = uniqueMachines.map(function (machine) {
                                            return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                                        }).join("");

                                        // Add "NoWork" and "Others" options manually at the end
                                        allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                                        // Create WorkType options dropdown
                                        var workTypeOptions = "<option value=''>Select Work Type</option>";

                                        var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                                        var employeeRowHtml =
                                            "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                            "<td>" + Employee.EmpNo + "</td>" +
                                            "<td>" + Employee.FirstName + "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                            allMachineOptions +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                            workTypeOptions +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                            "</td>" +
                                            "<td>" +
                                            "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                            "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                            "</td>" +
                                            "</tr>";

                                        // Append the row to the table
                                        $("#Allocation_Table tbody").append(employeeRowHtml);

                                        $("#Edit_Allocation_" + i).hide();


                                        // Preselect Machine IDs for the employee (multiple selected)
                                        if (selectedMachineIds.length > 0) {

                                            var selectedMachineOptions = "";
                                            selectedMachineIds.forEach(function (machineId) {
                                                selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                            });

                                            // Combine the selected machines with all available machine options
                                            var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                            $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                            $("#Edit_Allocation_" + i).show();

                                        }

                                        // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                                        var frameOptions = '';

                                        assignedMachineIds.forEach(function (machineId) {
                                            var framesForMachine = Employee_Data.filter(function (emp) {
                                                return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                            }).map(function (emp) {
                                                return emp.Frame;
                                            });

                                            framesForMachine.forEach(function (frame) {
                                                frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                            });
                                        });

                                        // Prepopulate the Frames dropdown with the correct frames for the specific employee
                                        var frameOptions = '';

                                        assignedMachineIds.forEach(function (machineId) {
                                            var framesForEmployee = Employee_Data.filter(function (emp) {
                                                return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                            }).map(function (emp) {
                                                return emp.Frame;
                                            });

                                            framesForEmployee.forEach(function (frame) {
                                                if (!frameOptions.includes(frame)) {
                                                    frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                                }
                                            });
                                        });

                                        if (!frameOptions) {
                                            frameOptions = "<option value=''>Select Frame</option>";
                                        }

                                        $("#Frames_" + i).html(frameOptions);

                                        // Preselect FrameType if available from Employee_Data and not equal to '-'
                                        var frameOptionsType = '';
                                        if (Employee.FrameType && Employee.FrameType !== '-') {
                                            frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                                        }

                                        if (frameOptionsType) {
                                            $("#Frame_Method_" + i).html(frameOptionsType);
                                        }

                                        // Prepopulate the WorkType dropdown if available
                                        var Work_Type = '';
                                        if (Employee.Work_Type) {
                                            Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                                        }
                                        $("#WorkType_" + i).html(Work_Type);

                                        // Prepopulate the Description input if available
                                        if (Employee.Description) {
                                            $("#Description_" + i).val(Employee.Description);
                                        }
                                    });


                                    $("#Allocation_Table tbody .custom-select2").select2({
                                        placeholder: "",
                                        allowClear: true,
                                        width: '140px',
                                        dropdownCssClass: 'custom-select2-dropdown',
                                        containerCssClass: 'custom-select2-container'
                                    });



//  $("#Allocation_Table tbody").on("change", ".Machine_Id", function () {
//         var Machine_Id = $(this).val();
//         var currentRow = $(this).closest("tr");

//         $("#Allocation_" + i).show();



//         var frameMethodSelect = currentRow.find(".Frame_Method");
//         var framesSelect = currentRow.find(".Frames");
//         var workTypeSelect = currentRow.find(".WorkType");
//         var descriptionInput = currentRow.find(".Description");
//         var allocationButton = currentRow.find(".Allocation");
//         var editButton = currentRow.find(".Edit_Allocation");

//         allocationButton.show();
//         editButton.show();

//         var Work_Area = $("#Work_Area").val();

//         framesSelect.empty().prop("disabled", true);
//         workTypeSelect.empty().prop("disabled", true);
//         descriptionInput.prop("disabled", true).val("");
//         frameMethodSelect.empty().prop("disabled", true);

//         if (Machine_Id == "NoWork") {
//             frameMethodSelect.prop("disabled", true);
//             framesSelect.prop("disabled", true);
//             workTypeSelect.prop("disabled", true).empty();
//             descriptionInput.prop("disabled", true);
//         } else if (Machine_Id == "Others") {
//             frameMethodSelect.prop("disabled", true);
//             framesSelect.prop("disabled", true);
//             workTypeSelect.prop("disabled", false).empty().append("<option value=''></option><option value='Others'>Others</option></option><option value=" + Work_Area + "'>" + Work_Area + "</option>");
//             descriptionInput.prop("disabled", true);

//             workTypeSelect.on("change", function () {
//                 var workType = $(this).val();

//                 if (workType === "Others") {
//                     descriptionInput.prop("disabled", false);
//                 } else if (workType === "Cleaning") {
//                     descriptionInput.prop("disabled", true);
//                 }
//             });
//         } else {
//             frameMethodSelect.prop("disabled", false);
//             framesSelect.prop("disabled", false);
//             workTypeSelect.prop("disabled", true).empty();
//             descriptionInput.prop("disabled", true);

//             allocationButton.show();

//             frameMethodSelect.append("<option value=''></option>");
//             frameMethodSelect.append("<option value='All'>All</option>");
//             frameMethodSelect.append("<option value='Partial'>Partial</option>");

//             var Work_Area = $("#Work_Area").val();
//             var JobCardNo = $("#JobCardNo").val();
//             var Department = $("#Department").val();
//             var Date = $("#Date").val();
//             var Shift = $("#Shift").val();

//             $.ajax({
//                 url: baseurl + "Work_Master/Machine_Frames",
//                 type: "POST",
//                 data: {
//                     Work_Area: Work_Area,
//                     JobCardNo: JobCardNo,
//                     Department: Department,
//                     Machine_Id: Machine_Id,
//                     Date,
//                     Machine_Id,
//                     Shift

//                 },
//                 success: function (response) {
//                     var responseData = JSON.parse(response);
//                     var Machine_Frames = responseData.Machine_Frames;

//                     framesSelect.empty().prop("disabled", false);

//                     $.each(Machine_Frames, function (index, value) {
//                         framesSelect.append($("<option></option>").attr("value", value.Frame).text(value.Frame));
//                     });

//                     frameMethodSelect.on("change", function () {
//                         var frameMethod = $(this).val();

//                         framesSelect.empty();

//                         if (frameMethod == "All") {
//                             $.each(Machine_Frames, function (index, value) {
//                                 var option = $("<option></option>").attr("value", value.Frame).text(value.Frame);
//                                 framesSelect.append(option);
//                             });

//                             framesSelect.val(Machine_Frames.map(function (frame) { return frame.Frame; })).trigger('change');
//                         } else if (frameMethod == "Partial") {
//                             if (Machine_Frames.length > 0) {
//                                 var firstFrame = Machine_Frames[0].Frame;
//                                 var option = $("<option></option>").attr("value", firstFrame).text(firstFrame).prop("selected", true);
//                                 framesSelect.append(option);
//                             }
//                         }

//                         framesSelect.trigger('change');
//                     });
//                 },
//                 error: function (error) {
//                     console.log("Error loading machine frames: ", error);
//                 }
//             });
//         }
//     });




//        // Allocation button click event
//     $("#Allocation_Table tbody").on("click", ".Allocation", function () {

//         var currentRow = $(this).closest("tr");

//         var tableData = [];

//         var Date = $("#Date").val();
//         var Department = $("#Department").val();
//         var Shift = $("#Shift").val();
//         var Work_Area = $("#Work_Area").val();
//         var JobCardNo = $("#JobCardNo").val();

//         var EmployeeId = currentRow.find("td:nth-child(1)").text();
//         var EmployeeName = currentRow.find("td:nth-child(2)").text();
//         var MachineId = currentRow.find(".Machine_Id").val();
//         var FrameMethod = currentRow.find(".Frame_Method").val();
//         var Frames = currentRow.find(".Frames").val();
//         var WorkType = currentRow.find(".WorkType").val();
//         var Description = currentRow.find(".Description").val();

//         // Check if MachineId is not empty
//         if (MachineId && MachineId !== "NoWork" && MachineId !== "Others") {
//             var allocationData = {
//                 Date: Date,
//                 Department: Department,
//                 Shift: Shift,
//                 Work_Area: Work_Area,
//                 JobCardNo: JobCardNo,
//                 EmployeeId: EmployeeId,
//                 EmployeeName: EmployeeName,
//                 MachineId: MachineId,
//                 FrameMethod: FrameMethod,
//                 Frames: Frames,
//                 WorkType: WorkType,
//                 Description: Description
//             };

//             tableData.push(allocationData);

//             var formData = {
//                 Allocations: tableData
//             };

//             $.ajax({
//                 url: baseurl + 'Allocation/Assign',
//                 type: 'POST',
//                 data: JSON.stringify(formData),
//                 contentType: 'application/json',
//                 success: function (response) {
//                     var responseData = JSON.parse(response);

//                     $.ajax({
//                         url: baseurl + "Work_Master/Employee_List",
//                         type: "POST",
//                         data: {
//                             Date: Date,
//                             Department: Department,
//                             Shift: Shift,
//                             Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
//                             Work_Area: Work_Area,
//                             JobCardNo: JobCardNo
//                         },
//                         success: function (response) {

//                             var responseData = JSON.parse(response);
//                             var Employee_Data = responseData.Employee_List;
//                             var Machine_Data = responseData.Machines;

//                             $("#Allocation_Table tbody").empty();

//                             // Create a set to track processed EmpNos to avoid duplication
//                             var processedEmpNos = new Set();

//                             // Create a map to hold the frames for each machine for easy access
//                             var machineFrames = {};

//                             Machine_Data.forEach(function (machine) {
//                                 if (!machineFrames[machine.Machine_Id]) {
//                                     machineFrames[machine.Machine_Id] = new Set();
//                                 }
//                                 machineFrames[machine.Machine_Id].add(machine.FrameType);
//                             });

//                             // Create a set to track unique machine IDs
//                             var uniqueMachineIds = new Set();

//                             // Filter out the unique machine IDs from Machine_Data
//                             var uniqueMachines = Machine_Data.filter(function (machine) {
//                                 if (uniqueMachineIds.has(machine.Machine_Id)) {
//                                     return false;
//                                 } else {
//                                     uniqueMachineIds.add(machine.Machine_Id);
//                                     return true;
//                                 }
//                             });

//                             // Render Employee rows in the Allocation Table
//                             Employee_Data.forEach(function (Employee, i) {
//                                 if (processedEmpNos.has(Employee.EmpNo)) {
//                                     return;
//                                 }

//                                 processedEmpNos.add(Employee.EmpNo);

//                                 // Initialize assignedMachineIds as an empty array
//                                 var assignedMachineIds = [];

//                                 // Collect all assigned machine IDs for this employee (grouping them together)
//                                 Employee_Data.forEach(function (emp) {
//                                     if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
//                                         assignedMachineIds.push(emp.Machine_Id);
//                                     }
//                                 });

//                                 // Create the machine options dropdown, including only unique machines
//                                 var allMachineOptions = uniqueMachines.map(function (machine) {
//                                     return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
//                                 }).join("");

//                                 // Add "NoWork" and "Others" options manually at the end
//                                 allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

//                                 // Create WorkType options dropdown
//                                 var workTypeOptions = "<option value=''>Select Work Type</option>";

//                                 var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

//                                 var employeeRowHtml =
//                                     "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
//                                     "<td>" + Employee.EmpNo + "</td>" +
//                                     "<td>" + Employee.FirstName + "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
//                                     allMachineOptions +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
//                                     workTypeOptions +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
//                                     "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
//                                     "</td>" +
//                                     "</tr>";

//                                 // Append the row to the table
//                                 $("#Allocation_Table tbody").append(employeeRowHtml);

//                                 $("#Edit_Allocation_" + i).hide();


//                                 // Preselect Machine IDs for the employee (multiple selected)
//                                 if (selectedMachineIds.length > 0) {

//                                     var selectedMachineOptions = "";
//                                     selectedMachineIds.forEach(function (machineId) {
//                                         selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
//                                     });

//                                     // Combine the selected machines with all available machine options
//                                     var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
//                                     $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
//                                     $("#Edit_Allocation_" + i).show();

//                                 }

//                                 // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
//                                 var frameOptions = '';

//                                 assignedMachineIds.forEach(function (machineId) {
//                                     var framesForMachine = Employee_Data.filter(function (emp) {
//                                         return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
//                                     }).map(function (emp) {
//                                         return emp.Frame;
//                                     });

//                                     framesForMachine.forEach(function (frame) {
//                                         frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
//                                     });
//                                 });

//                                 // Prepopulate the Frames dropdown with the correct frames for the specific employee
//                                 var frameOptions = '';

//                                 assignedMachineIds.forEach(function (machineId) {
//                                     var framesForEmployee = Employee_Data.filter(function (emp) {
//                                         return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
//                                     }).map(function (emp) {
//                                         return emp.Frame;
//                                     });

//                                     framesForEmployee.forEach(function (frame) {
//                                         if (!frameOptions.includes(frame)) {
//                                             frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
//                                         }
//                                     });
//                                 });

//                                 if (!frameOptions) {
//                                     frameOptions = "<option value=''>Select Frame</option>";
//                                 }

//                                 $("#Frames_" + i).html(frameOptions);

//                                 // Preselect FrameType if available from Employee_Data and not equal to '-'
//                                 var frameOptionsType = '';
//                                 if (Employee.FrameType && Employee.FrameType !== '-') {
//                                     frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
//                                 }

//                                 if (frameOptionsType) {
//                                     $("#Frame_Method_" + i).html(frameOptionsType);
//                                 }

//                                 // Prepopulate the WorkType dropdown if available
//                                 var Work_Type = '';
//                                 if (Employee.Work_Type) {
//                                     Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
//                                 }
//                                 $("#WorkType_" + i).html(Work_Type);

//                                 // Prepopulate the Description input if available
//                                 if (Employee.Description) {
//                                     $("#Description_" + i).val(Employee.Description);
//                                 }
//                             });
//                             // Initialize Select2 for all dropdowns
//                             $("#Allocation_Table tbody .custom-select2").select2({
//                                 placeholder: "",
//                                 allowClear: true,
//                                 width: '140px',
//                                 dropdownCssClass: 'custom-select2-dropdown',
//                                 containerCssClass: 'custom-select2-container'
//                             });
//                         },
//                         error: function (error) {
//                             swal({
//                                 title: "Error!",
//                                 text: "Error sending allocation data.",
//                                 icon: "error",
//                                 buttons: true,
//                                 className: "swal",
//                             }).then((value) => { });
//                         }
//                     });
//                 }
//             });
//         }
//     });




//      // Edit Allocation
//     $("#Allocation_Table tbody").on("click", ".Edit_Allocation", function () {
//         var currentRow = $(this).closest("tr");  // Capture the correct row context
//         var i = currentRow.index();  // Use the row index to reference the correct element

//         swal({
//             title: 'Allocation Edit Reason',
//             input: 'text',
//             showCancelButton: true,
//             confirmButtonText: 'Edit',
//             showLoaderOnConfirm: true,
//             confirmButtonClass: 'btn btn-success',
//             cancelButtonClass: 'btn btn-danger',
//             preConfirm: function (reason) {
//                 return new Promise(function (resolve, reject) {
//                     if (reason && reason.trim() !== "") {
//                         resolve(reason); // Resolve with the input value
//                     } else {
//                         reject('Please provide a valid reason!');
//                     }
//                 });
//             },
//             allowOutsideClick: false
//         }).then(function (result) {

//             var Date = $("#Date").val();
//             var Department = $("#Department").val();
//             var Shift = $("#Shift").val();
//             var Work_Area = $("#Work_Area").val();
//             var JobCardNo = $("#JobCardNo").val();

//             var EmployeeId = currentRow.find("td:nth-child(1)").text();
//             var EmployeeName = currentRow.find("td:nth-child(2)").text();
//             var MachineId = currentRow.find(".Machine_Id").val();
//             var FrameMethod = currentRow.find(".Frame_Method").val();
//             var Frames = currentRow.find(".Frames").val();
//             var WorkType = currentRow.find(".WorkType").val();
//             var Description = currentRow.find(".Description").val();


//             var allocationData = {
//                 Date: Date,
//                 Department: Department,
//                 Shift: Shift,
//                 Work_Area: Work_Area,
//                 JobCardNo: JobCardNo,
//                 EmployeeId: EmployeeId,
//                 EmployeeName: EmployeeName,
//                 MachineId: MachineId,
//                 FrameMethod: FrameMethod,
//                 Frames: Frames,
//                 WorkType: WorkType,
//                 Description: Description,
//                 Reason: result
//             };

//             var formData = {
//                 Allocations: [allocationData]
//             };

//             // First AJAX request (to update allocation)
//             $.ajax({
//                 url: baseurl + 'Allocation/Edit',
//                 type: 'POST',
//                 data: JSON.stringify(formData),
//                 contentType: 'application/json',
//                 success: function (response) {
//                     var responseData = JSON.parse(response);
//                     // Second AJAX request (to get updated employee list)
//                     $.ajax({
//                         url: baseurl + "Work_Master/Employee_List",
//                         type: "POST",
//                         data: {
//                             Date: Date,
//                             Department: Department,
//                             Shift: Shift,
//                             Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
//                             Work_Area: Work_Area,
//                             JobCardNo: JobCardNo
//                         },
//                         success: function (response) {
//                             var responseData = JSON.parse(response);
//                             var Employee_Data = responseData.Employee_List;
//                             var Machine_Data = responseData.Machines;

//                             $("#Allocation_Table tbody").empty();

//                             // Create a set to track processed EmpNos to avoid duplication
//                             var processedEmpNos = new Set();

//                             // Create a map to hold the frames for each machine for easy access
//                             var machineFrames = {};

//                             Machine_Data.forEach(function (machine) {
//                                 if (!machineFrames[machine.Machine_Id]) {
//                                     machineFrames[machine.Machine_Id] = new Set();
//                                 }
//                                 machineFrames[machine.Machine_Id].add(machine.FrameType);
//                             });

//                             // Create a set to track unique machine IDs
//                             var uniqueMachineIds = new Set();

//                             // Filter out the unique machine IDs from Machine_Data
//                             var uniqueMachines = Machine_Data.filter(function (machine) {
//                                 if (uniqueMachineIds.has(machine.Machine_Id)) {
//                                     return false;
//                                 } else {
//                                     uniqueMachineIds.add(machine.Machine_Id);
//                                     return true;
//                                 }
//                             });

//                             // Render Employee rows in the Allocation Table
//                             Employee_Data.forEach(function (Employee, i) {
//                                 if (processedEmpNos.has(Employee.EmpNo)) {
//                                     return;
//                                 }

//                                 processedEmpNos.add(Employee.EmpNo);

//                                 // Initialize assignedMachineIds as an empty array
//                                 var assignedMachineIds = [];

//                                 // Collect all assigned machine IDs for this employee (grouping them together)
//                                 Employee_Data.forEach(function (emp) {
//                                     if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
//                                         assignedMachineIds.push(emp.Machine_Id);
//                                     }
//                                 });

//                                 // Create the machine options dropdown, including only unique machines
//                                 var allMachineOptions = uniqueMachines.map(function (machine) {
//                                     return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
//                                 }).join("");

//                                 // Add "NoWork" and "Others" options manually at the end
//                                 allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

//                                 // Create WorkType options dropdown
//                                 var workTypeOptions = "<option value=''>Select Work Type</option>";

//                                 var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

//                                 var employeeRowHtml =
//                                     "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
//                                     "<td>" + Employee.EmpNo + "</td>" +
//                                     "<td>" + Employee.FirstName + "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
//                                     allMachineOptions +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
//                                     workTypeOptions +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
//                                     "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
//                                     "</td>" +
//                                     "</tr>";

//                                 // Append the row to the table
//                                 $("#Allocation_Table tbody").append(employeeRowHtml);

//                                 $("#Edit_Allocation_" + i).hide();


//                                 // Preselect Machine IDs for the employee (multiple selected)
//                                 if (selectedMachineIds.length > 0) {

//                                     var selectedMachineOptions = "";
//                                     selectedMachineIds.forEach(function (machineId) {
//                                         selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
//                                     });

//                                     // Combine the selected machines with all available machine options
//                                     var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
//                                     $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
//                                     $("#Edit_Allocation_" + i).show();

//                                 }

//                                 // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
//                                 var frameOptions = '';

//                                 assignedMachineIds.forEach(function (machineId) {
//                                     var framesForMachine = Employee_Data.filter(function (emp) {
//                                         return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
//                                     }).map(function (emp) {
//                                         return emp.Frame;
//                                     });

//                                     framesForMachine.forEach(function (frame) {
//                                         frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
//                                     });
//                                 });

//                                 // Prepopulate the Frames dropdown with the correct frames for the specific employee
//                                 var frameOptions = '';

//                                 assignedMachineIds.forEach(function (machineId) {
//                                     var framesForEmployee = Employee_Data.filter(function (emp) {
//                                         return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
//                                     }).map(function (emp) {
//                                         return emp.Frame;
//                                     });

//                                     framesForEmployee.forEach(function (frame) {
//                                         if (!frameOptions.includes(frame)) {
//                                             frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
//                                         }
//                                     });
//                                 });

//                                 if (!frameOptions) {
//                                     frameOptions = "<option value=''>Select Frame</option>";
//                                 }

//                                 $("#Frames_" + i).html(frameOptions);

//                                 // Preselect FrameType if available from Employee_Data and not equal to '-'
//                                 var frameOptionsType = '';
//                                 if (Employee.FrameType && Employee.FrameType !== '-') {
//                                     frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
//                                 }

//                                 if (frameOptionsType) {
//                                     $("#Frame_Method_" + i).html(frameOptionsType);
//                                 }

//                                 // Prepopulate the WorkType dropdown if available
//                                 var Work_Type = '';
//                                 if (Employee.Work_Type) {
//                                     Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
//                                 }
//                                 $("#WorkType_" + i).html(Work_Type);

//                                 // Prepopulate the Description input if available
//                                 if (Employee.Description) {
//                                     $("#Description_" + i).val(Employee.Description);
//                                 }
//                             });

//                             // Reinitialize Select2 for new rows
//                             $("#Allocation_Table tbody .custom-select2").select2({
//                                 placeholder: "",
//                                 allowClear: true,
//                                 width: '140px',
//                                 dropdownCssClass: 'custom-select2-dropdown',
//                                 containerCssClass: 'custom-select2-container'
//                             });

//                         },
//                         error: function (xhr, status, error) {
//                             console.error("Error in second AJAX request:", status, error);
//                             swal({
//                                 title: "Error!",
//                                 text: "Error sending allocation data.",
//                                 icon: "error",
//                                 buttons: true,
//                                 className: "swal"
//                             });
//                         }
//                     });
//                 },
//                 error: function (xhr, status, error) {
//                     console.error("Error in first AJAX request:", status, error);
//                     swal({
//                         type: 'warning',
//                         title: 'Warning',
//                         text: 'Allocation Edit Failed! Edit Correctly.'
//                     });
//                 }
//             });

//             // Display success message
//             swal({
//                 type: 'success',
//                 title: 'Allocation Edit Finished!',
//                 html: 'Updated: ' + result.value // Access the 'value' property of the result object
//             });

//         }).catch(function (error) {
//             swal({
//                 type: 'warning',
//                 title: 'Warning',
//                 text: error
//             });
//         });
//     });




                                // } else {

                                //      swal(
                                //         {
                                //             type: 'warning',
                                //             title: 'warning',
                                //             text: 'Employee Details Not Found Server!',
                                //         }
                                //     );


                                // }

                            }





                        })
                    }

                })


    })


// ================================================= JOBCARD CHANGE END =====================================================//




 // ================================================= EMPLOYEE TYPE CHANGE STRAT =====================================================//


    $("#JobCardNo").on("change", function () {

                $("#Allocation_Table_Container").hide();
                $("#Allocation_Table tbody").empty();

                        var Date = $("#Date").val();
                        var Department = $("#Department").val();
                        var Shift = $("#Shift").val();
                        var Employee_Type = $("#Employee_Type").val();
                        var Work_Area = $("#Work_Area").val();
                        var JobCardNo = $("#JobCardNo").val();


                        $.ajax({
                            url: baseurl + "Work_Master/Employee_List",
                            type: "POST",
                            data:
                            {
                                Date,
                                Department,
                                Shift,
                                Employee_Type,
                                Work_Area,
                                JobCardNo

                            },
                            success: function (response) {

                                var responseData = JSON.parse(response);
                                var Employee_Data = responseData.Employee_List;
                                var Machine_Data = responseData.Machines;

                                // if (responseData.length > 0) {

                                    $("#Allocation_Table tbody").empty();
                                    $("#Allocation_Table_Container").show();

                                    // Create a set to track processed EmpNos to avoid duplication
                                    var processedEmpNos = new Set();

                                    // Create a map to hold the frames for each machine for easy access
                                    var machineFrames = {};

                                    Machine_Data.forEach(function (machine) {
                                        if (!machineFrames[machine.Machine_Id]) {
                                            machineFrames[machine.Machine_Id] = new Set();
                                        }
                                        machineFrames[machine.Machine_Id].add(machine.FrameType);
                                    });

                                    // Create a set to track unique machine IDs
                                    var uniqueMachineIds = new Set();

                                    // Filter out the unique machine IDs from Machine_Data
                                    var uniqueMachines = Machine_Data.filter(function (machine) {
                                        if (uniqueMachineIds.has(machine.Machine_Id)) {
                                            return false;
                                        } else {
                                            uniqueMachineIds.add(machine.Machine_Id);
                                            return true;
                                        }
                                    });

                                    // Render Employee rows in the Allocation Table
                                    Employee_Data.forEach(function (Employee, i) {
                                        if (processedEmpNos.has(Employee.EmpNo)) {
                                            return;
                                        }

                                        processedEmpNos.add(Employee.EmpNo);

                                        // Initialize assignedMachineIds as an empty array
                                        var assignedMachineIds = [];

                                        // Collect all assigned machine IDs for this employee (grouping them together)
                                        Employee_Data.forEach(function (emp) {
                                            if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                                assignedMachineIds.push(emp.Machine_Id);
                                            }
                                        });

                                        // Create the machine options dropdown, including only unique machines
                                        var allMachineOptions = uniqueMachines.map(function (machine) {
                                            return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                                        }).join("");

                                        // Add "NoWork" and "Others" options manually at the end
                                        allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                                        // Create WorkType options dropdown
                                        var workTypeOptions = "<option value=''>Select Work Type</option>";

                                        var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                                        var employeeRowHtml =
                                            "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                            "<td>" + Employee.EmpNo + "</td>" +
                                            "<td>" + Employee.FirstName + "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                            allMachineOptions +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                            workTypeOptions +
                                            "</select>" +
                                            "</td>" +
                                            "<td>" +
                                            "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                            "</td>" +
                                            "<td>" +
                                            "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                            "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                            "</td>" +
                                            "</tr>";

                                        // Append the row to the table
                                        $("#Allocation_Table tbody").append(employeeRowHtml);

                                        $("#Edit_Allocation_" + i).hide();


                                        // Preselect Machine IDs for the employee (multiple selected)
                                        if (selectedMachineIds.length > 0) {

                                            var selectedMachineOptions = "";
                                            selectedMachineIds.forEach(function (machineId) {
                                                selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                            });

                                            // Combine the selected machines with all available machine options
                                            var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                            $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                            $("#Edit_Allocation_" + i).show();

                                        }

                                        // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                                        var frameOptions = '';

                                        assignedMachineIds.forEach(function (machineId) {
                                            var framesForMachine = Employee_Data.filter(function (emp) {
                                                return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                            }).map(function (emp) {
                                                return emp.Frame;
                                            });

                                            framesForMachine.forEach(function (frame) {
                                                frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                            });
                                        });

                                        // Prepopulate the Frames dropdown with the correct frames for the specific employee
                                        var frameOptions = '';

                                        assignedMachineIds.forEach(function (machineId) {
                                            var framesForEmployee = Employee_Data.filter(function (emp) {
                                                return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                            }).map(function (emp) {
                                                return emp.Frame;
                                            });

                                            framesForEmployee.forEach(function (frame) {
                                                if (!frameOptions.includes(frame)) {
                                                    frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                                }
                                            });
                                        });

                                        if (!frameOptions) {
                                            frameOptions = "<option value=''>Select Frame</option>";
                                        }

                                        $("#Frames_" + i).html(frameOptions);

                                        // Preselect FrameType if available from Employee_Data and not equal to '-'
                                        var frameOptionsType = '';
                                        if (Employee.FrameType && Employee.FrameType !== '-') {
                                            frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                                        }

                                        if (frameOptionsType) {
                                            $("#Frame_Method_" + i).html(frameOptionsType);
                                        }

                                        // Prepopulate the WorkType dropdown if available
                                        var Work_Type = '';
                                        if (Employee.Work_Type) {
                                            Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                                        }
                                        $("#WorkType_" + i).html(Work_Type);

                                        // Prepopulate the Description input if available
                                        if (Employee.Description) {
                                            $("#Description_" + i).val(Employee.Description);
                                        }
                                    });


                                    $("#Allocation_Table tbody .custom-select2").select2({
                                        placeholder: "",
                                        allowClear: true,
                                        width: '140px',
                                        dropdownCssClass: 'custom-select2-dropdown',
                                        containerCssClass: 'custom-select2-container'
                                    });




    // $("#Allocation_Table tbody").on("change", ".Machine_Id", function () {
    //     var Machine_Id = $(this).val();
    //     var currentRow = $(this).closest("tr");

    //     $("#Allocation_" + i).show();



    //     var frameMethodSelect = currentRow.find(".Frame_Method");
    //     var framesSelect = currentRow.find(".Frames");
    //     var workTypeSelect = currentRow.find(".WorkType");
    //     var descriptionInput = currentRow.find(".Description");
    //     var allocationButton = currentRow.find(".Allocation");
    //     var editButton = currentRow.find(".Edit_Allocation");

    //     allocationButton.show();
    //     editButton.show();

    //     var Work_Area = $("#Work_Area").val();

    //     framesSelect.empty().prop("disabled", true);
    //     workTypeSelect.empty().prop("disabled", true);
    //     descriptionInput.prop("disabled", true).val("");
    //     frameMethodSelect.empty().prop("disabled", true);

    //     if (Machine_Id == "NoWork") {
    //         frameMethodSelect.prop("disabled", true);
    //         framesSelect.prop("disabled", true);
    //         workTypeSelect.prop("disabled", true).empty();
    //         descriptionInput.prop("disabled", true);
    //     } else if (Machine_Id == "Others") {
    //         frameMethodSelect.prop("disabled", true);
    //         framesSelect.prop("disabled", true);
    //         workTypeSelect.prop("disabled", false).empty().append("<option value=''></option><option value='Others'>Others</option></option><option value=" + Work_Area + "'>" + Work_Area + "</option>");
    //         descriptionInput.prop("disabled", true);

    //         workTypeSelect.on("change", function () {
    //             var workType = $(this).val();

    //             if (workType === "Others") {
    //                 descriptionInput.prop("disabled", false);
    //             } else if (workType === "Cleaning") {
    //                 descriptionInput.prop("disabled", true);
    //             }
    //         });
    //     } else {
    //         frameMethodSelect.prop("disabled", false);
    //         framesSelect.prop("disabled", false);
    //         workTypeSelect.prop("disabled", true).empty();
    //         descriptionInput.prop("disabled", true);

    //         allocationButton.show();

    //         frameMethodSelect.append("<option value=''></option>");
    //         frameMethodSelect.append("<option value='All'>All</option>");
    //         frameMethodSelect.append("<option value='Partial'>Partial</option>");

    //         var Work_Area = $("#Work_Area").val();
    //         var JobCardNo = $("#JobCardNo").val();
    //         var Department = $("#Department").val();
    //         var Date = $("#Date").val();
    //         var Shift = $("#Shift").val();

    //         $.ajax({
    //             url: baseurl + "Work_Master/Machine_Frames",
    //             type: "POST",
    //             data: {
    //                 Work_Area: Work_Area,
    //                 JobCardNo: JobCardNo,
    //                 Department: Department,
    //                 Machine_Id: Machine_Id,
    //                 Date,
    //                 Machine_Id,
    //                 Shift

    //             },
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);
    //                 var Machine_Frames = responseData.Machine_Frames;

    //                 framesSelect.empty().prop("disabled", false);

    //                 $.each(Machine_Frames, function (index, value) {
    //                     framesSelect.append($("<option></option>").attr("value", value.Frame).text(value.Frame));
    //                 });

    //                 frameMethodSelect.on("change", function () {
    //                     var frameMethod = $(this).val();

    //                     framesSelect.empty();

    //                     if (frameMethod == "All") {
    //                         $.each(Machine_Frames, function (index, value) {
    //                             var option = $("<option></option>").attr("value", value.Frame).text(value.Frame);
    //                             framesSelect.append(option);
    //                         });

    //                         framesSelect.val(Machine_Frames.map(function (frame) { return frame.Frame; })).trigger('change');
    //                     } else if (frameMethod == "Partial") {
    //                         if (Machine_Frames.length > 0) {
    //                             var firstFrame = Machine_Frames[0].Frame;
    //                             var option = $("<option></option>").attr("value", firstFrame).text(firstFrame).prop("selected", true);
    //                             framesSelect.append(option);
    //                         }
    //                     }

    //                     framesSelect.trigger('change');
    //                 });
    //             },
    //             error: function (error) {
    //                 console.log("Error loading machine frames: ", error);
    //             }
    //         });
    //     }
    // });




    //    // Allocation button click event
    // $("#Allocation_Table tbody").on("click", ".Allocation", function () {

    //     var currentRow = $(this).closest("tr");

    //     var tableData = [];

    //     var Date = $("#Date").val();
    //     var Department = $("#Department").val();
    //     var Shift = $("#Shift").val();
    //     var Work_Area = $("#Work_Area").val();
    //     var JobCardNo = $("#JobCardNo").val();

    //     var EmployeeId = currentRow.find("td:nth-child(1)").text();
    //     var EmployeeName = currentRow.find("td:nth-child(2)").text();
    //     var MachineId = currentRow.find(".Machine_Id").val();
    //     var FrameMethod = currentRow.find(".Frame_Method").val();
    //     var Frames = currentRow.find(".Frames").val();
    //     var WorkType = currentRow.find(".WorkType").val();
    //     var Description = currentRow.find(".Description").val();

    //     // Check if MachineId is not empty
    //     if (MachineId && MachineId !== "NoWork" && MachineId !== "Others") {
    //         var allocationData = {
    //             Date: Date,
    //             Department: Department,
    //             Shift: Shift,
    //             Work_Area: Work_Area,
    //             JobCardNo: JobCardNo,
    //             EmployeeId: EmployeeId,
    //             EmployeeName: EmployeeName,
    //             MachineId: MachineId,
    //             FrameMethod: FrameMethod,
    //             Frames: Frames,
    //             WorkType: WorkType,
    //             Description: Description
    //         };

    //         tableData.push(allocationData);

    //         var formData = {
    //             Allocations: tableData
    //         };

    //         $.ajax({
    //             url: baseurl + 'Allocation/Assign',
    //             type: 'POST',
    //             data: JSON.stringify(formData),
    //             contentType: 'application/json',
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);

    //                 $.ajax({
    //                     url: baseurl + "Work_Master/Employee_List",
    //                     type: "POST",
    //                     data: {
    //                         Date: Date,
    //                         Department: Department,
    //                         Shift: Shift,
    //                         Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
    //                         Work_Area: Work_Area,
    //                         JobCardNo: JobCardNo
    //                     },
    //                     success: function (response) {

    //                         var responseData = JSON.parse(response);
    //                         var Employee_Data = responseData.Employee_List;
    //                         var Machine_Data = responseData.Machines;

    //                         $("#Allocation_Table tbody").empty();

    //                         // Create a set to track processed EmpNos to avoid duplication
    //                         var processedEmpNos = new Set();

    //                         // Create a map to hold the frames for each machine for easy access
    //                         var machineFrames = {};

    //                         Machine_Data.forEach(function (machine) {
    //                             if (!machineFrames[machine.Machine_Id]) {
    //                                 machineFrames[machine.Machine_Id] = new Set();
    //                             }
    //                             machineFrames[machine.Machine_Id].add(machine.FrameType);
    //                         });

    //                         // Create a set to track unique machine IDs
    //                         var uniqueMachineIds = new Set();

    //                         // Filter out the unique machine IDs from Machine_Data
    //                         var uniqueMachines = Machine_Data.filter(function (machine) {
    //                             if (uniqueMachineIds.has(machine.Machine_Id)) {
    //                                 return false;
    //                             } else {
    //                                 uniqueMachineIds.add(machine.Machine_Id);
    //                                 return true;
    //                             }
    //                         });

    //                         // Render Employee rows in the Allocation Table
    //                         Employee_Data.forEach(function (Employee, i) {
    //                             if (processedEmpNos.has(Employee.EmpNo)) {
    //                                 return;
    //                             }

    //                             processedEmpNos.add(Employee.EmpNo);

    //                             // Initialize assignedMachineIds as an empty array
    //                             var assignedMachineIds = [];

    //                             // Collect all assigned machine IDs for this employee (grouping them together)
    //                             Employee_Data.forEach(function (emp) {
    //                                 if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
    //                                     assignedMachineIds.push(emp.Machine_Id);
    //                                 }
    //                             });

    //                             // Create the machine options dropdown, including only unique machines
    //                             var allMachineOptions = uniqueMachines.map(function (machine) {
    //                                 return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
    //                             }).join("");

    //                             // Add "NoWork" and "Others" options manually at the end
    //                             allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

    //                             // Create WorkType options dropdown
    //                             var workTypeOptions = "<option value=''>Select Work Type</option>";

    //                             var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

    //                             var employeeRowHtml =
    //                                 "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
    //                                 "<td>" + Employee.EmpNo + "</td>" +
    //                                 "<td>" + Employee.FirstName + "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
    //                                 allMachineOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
    //                                 workTypeOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
    //                                 "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
    //                                 "</td>" +
    //                                 "</tr>";

    //                             // Append the row to the table
    //                             $("#Allocation_Table tbody").append(employeeRowHtml);

    //                             $("#Edit_Allocation_" + i).hide();


    //                             // Preselect Machine IDs for the employee (multiple selected)
    //                             if (selectedMachineIds.length > 0) {

    //                                 var selectedMachineOptions = "";
    //                                 selectedMachineIds.forEach(function (machineId) {
    //                                     selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
    //                                 });

    //                                 // Combine the selected machines with all available machine options
    //                                 var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
    //                                 $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
    //                                 $("#Edit_Allocation_" + i).show();

    //                             }

    //                             // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForMachine = Employee_Data.filter(function (emp) {
    //                                     return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForMachine.forEach(function (frame) {
    //                                     frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                 });
    //                             });

    //                             // Prepopulate the Frames dropdown with the correct frames for the specific employee
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForEmployee = Employee_Data.filter(function (emp) {
    //                                     return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForEmployee.forEach(function (frame) {
    //                                     if (!frameOptions.includes(frame)) {
    //                                         frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                     }
    //                                 });
    //                             });

    //                             if (!frameOptions) {
    //                                 frameOptions = "<option value=''>Select Frame</option>";
    //                             }

    //                             $("#Frames_" + i).html(frameOptions);

    //                             // Preselect FrameType if available from Employee_Data and not equal to '-'
    //                             var frameOptionsType = '';
    //                             if (Employee.FrameType && Employee.FrameType !== '-') {
    //                                 frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
    //                             }

    //                             if (frameOptionsType) {
    //                                 $("#Frame_Method_" + i).html(frameOptionsType);
    //                             }

    //                             // Prepopulate the WorkType dropdown if available
    //                             var Work_Type = '';
    //                             if (Employee.Work_Type) {
    //                                 Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
    //                             }
    //                             $("#WorkType_" + i).html(Work_Type);

    //                             // Prepopulate the Description input if available
    //                             if (Employee.Description) {
    //                                 $("#Description_" + i).val(Employee.Description);
    //                             }
    //                         });
    //                         // Initialize Select2 for all dropdowns
    //                         $("#Allocation_Table tbody .custom-select2").select2({
    //                             placeholder: "",
    //                             allowClear: true,
    //                             width: '140px',
    //                             dropdownCssClass: 'custom-select2-dropdown',
    //                             containerCssClass: 'custom-select2-container'
    //                         });
    //                     },
    //                     error: function (error) {
    //                         swal({
    //                             title: "Error!",
    //                             text: "Error sending allocation data.",
    //                             icon: "error",
    //                             buttons: true,
    //                             className: "swal",
    //                         }).then((value) => { });
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });




    //  // Edit Allocation
    // $("#Allocation_Table tbody").on("click", ".Edit_Allocation", function () {
    //     var currentRow = $(this).closest("tr");  // Capture the correct row context
    //     var i = currentRow.index();  // Use the row index to reference the correct element

    //     swal({
    //         title: 'Allocation Edit Reason',
    //         input: 'text',
    //         showCancelButton: true,
    //         confirmButtonText: 'Edit',
    //         showLoaderOnConfirm: true,
    //         confirmButtonClass: 'btn btn-success',
    //         cancelButtonClass: 'btn btn-danger',
    //         preConfirm: function (reason) {
    //             return new Promise(function (resolve, reject) {
    //                 if (reason && reason.trim() !== "") {
    //                     resolve(reason); // Resolve with the input value
    //                 } else {
    //                     reject('Please provide a valid reason!');
    //                 }
    //             });
    //         },
    //         allowOutsideClick: false
    //     }).then(function (result) {

    //         var Date = $("#Date").val();
    //         var Department = $("#Department").val();
    //         var Shift = $("#Shift").val();
    //         var Work_Area = $("#Work_Area").val();
    //         var JobCardNo = $("#JobCardNo").val();

    //         var EmployeeId = currentRow.find("td:nth-child(1)").text();
    //         var EmployeeName = currentRow.find("td:nth-child(2)").text();
    //         var MachineId = currentRow.find(".Machine_Id").val();
    //         var FrameMethod = currentRow.find(".Frame_Method").val();
    //         var Frames = currentRow.find(".Frames").val();
    //         var WorkType = currentRow.find(".WorkType").val();
    //         var Description = currentRow.find(".Description").val();


    //         var allocationData = {
    //             Date: Date,
    //             Department: Department,
    //             Shift: Shift,
    //             Work_Area: Work_Area,
    //             JobCardNo: JobCardNo,
    //             EmployeeId: EmployeeId,
    //             EmployeeName: EmployeeName,
    //             MachineId: MachineId,
    //             FrameMethod: FrameMethod,
    //             Frames: Frames,
    //             WorkType: WorkType,
    //             Description: Description,
    //             Reason: result
    //         };

    //         var formData = {
    //             Allocations: [allocationData]
    //         };

    //         // First AJAX request (to update allocation)
    //         $.ajax({
    //             url: baseurl + 'Allocation/Edit',
    //             type: 'POST',
    //             data: JSON.stringify(formData),
    //             contentType: 'application/json',
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);
    //                 // Second AJAX request (to get updated employee list)
    //                 $.ajax({
    //                     url: baseurl + "Work_Master/Employee_List",
    //                     type: "POST",
    //                     data: {
    //                         Date: Date,
    //                         Department: Department,
    //                         Shift: Shift,
    //                         Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
    //                         Work_Area: Work_Area,
    //                         JobCardNo: JobCardNo
    //                     },
    //                     success: function (response) {
    //                         var responseData = JSON.parse(response);
    //                         var Employee_Data = responseData.Employee_List;
    //                         var Machine_Data = responseData.Machines;

    //                         $("#Allocation_Table tbody").empty();

    //                         // Create a set to track processed EmpNos to avoid duplication
    //                         var processedEmpNos = new Set();

    //                         // Create a map to hold the frames for each machine for easy access
    //                         var machineFrames = {};

    //                         Machine_Data.forEach(function (machine) {
    //                             if (!machineFrames[machine.Machine_Id]) {
    //                                 machineFrames[machine.Machine_Id] = new Set();
    //                             }
    //                             machineFrames[machine.Machine_Id].add(machine.FrameType);
    //                         });

    //                         // Create a set to track unique machine IDs
    //                         var uniqueMachineIds = new Set();

    //                         // Filter out the unique machine IDs from Machine_Data
    //                         var uniqueMachines = Machine_Data.filter(function (machine) {
    //                             if (uniqueMachineIds.has(machine.Machine_Id)) {
    //                                 return false;
    //                             } else {
    //                                 uniqueMachineIds.add(machine.Machine_Id);
    //                                 return true;
    //                             }
    //                         });

    //                         // Render Employee rows in the Allocation Table
    //                         Employee_Data.forEach(function (Employee, i) {
    //                             if (processedEmpNos.has(Employee.EmpNo)) {
    //                                 return;
    //                             }

    //                             processedEmpNos.add(Employee.EmpNo);

    //                             // Initialize assignedMachineIds as an empty array
    //                             var assignedMachineIds = [];

    //                             // Collect all assigned machine IDs for this employee (grouping them together)
    //                             Employee_Data.forEach(function (emp) {
    //                                 if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
    //                                     assignedMachineIds.push(emp.Machine_Id);
    //                                 }
    //                             });

    //                             // Create the machine options dropdown, including only unique machines
    //                             var allMachineOptions = uniqueMachines.map(function (machine) {
    //                                 return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
    //                             }).join("");

    //                             // Add "NoWork" and "Others" options manually at the end
    //                             allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

    //                             // Create WorkType options dropdown
    //                             var workTypeOptions = "<option value=''>Select Work Type</option>";

    //                             var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

    //                             var employeeRowHtml =
    //                                 "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
    //                                 "<td>" + Employee.EmpNo + "</td>" +
    //                                 "<td>" + Employee.FirstName + "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
    //                                 allMachineOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
    //                                 workTypeOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
    //                                 "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
    //                                 "</td>" +
    //                                 "</tr>";

    //                             // Append the row to the table
    //                             $("#Allocation_Table tbody").append(employeeRowHtml);

    //                             $("#Edit_Allocation_" + i).hide();


    //                             // Preselect Machine IDs for the employee (multiple selected)
    //                             if (selectedMachineIds.length > 0) {

    //                                 var selectedMachineOptions = "";
    //                                 selectedMachineIds.forEach(function (machineId) {
    //                                     selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
    //                                 });

    //                                 // Combine the selected machines with all available machine options
    //                                 var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
    //                                 $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
    //                                 $("#Edit_Allocation_" + i).show();

    //                             }

    //                             // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForMachine = Employee_Data.filter(function (emp) {
    //                                     return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForMachine.forEach(function (frame) {
    //                                     frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                 });
    //                             });

    //                             // Prepopulate the Frames dropdown with the correct frames for the specific employee
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForEmployee = Employee_Data.filter(function (emp) {
    //                                     return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForEmployee.forEach(function (frame) {
    //                                     if (!frameOptions.includes(frame)) {
    //                                         frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                     }
    //                                 });
    //                             });

    //                             if (!frameOptions) {
    //                                 frameOptions = "<option value=''>Select Frame</option>";
    //                             }

    //                             $("#Frames_" + i).html(frameOptions);

    //                             // Preselect FrameType if available from Employee_Data and not equal to '-'
    //                             var frameOptionsType = '';
    //                             if (Employee.FrameType && Employee.FrameType !== '-') {
    //                                 frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
    //                             }

    //                             if (frameOptionsType) {
    //                                 $("#Frame_Method_" + i).html(frameOptionsType);
    //                             }

    //                             // Prepopulate the WorkType dropdown if available
    //                             var Work_Type = '';
    //                             if (Employee.Work_Type) {
    //                                 Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
    //                             }
    //                             $("#WorkType_" + i).html(Work_Type);

    //                             // Prepopulate the Description input if available
    //                             if (Employee.Description) {
    //                                 $("#Description_" + i).val(Employee.Description);
    //                             }
    //                         });

    //                         // Reinitialize Select2 for new rows
    //                         $("#Allocation_Table tbody .custom-select2").select2({
    //                             placeholder: "",
    //                             allowClear: true,
    //                             width: '140px',
    //                             dropdownCssClass: 'custom-select2-dropdown',
    //                             containerCssClass: 'custom-select2-container'
    //                         });

    //                     },
    //                     error: function (xhr, status, error) {
    //                         console.error("Error in second AJAX request:", status, error);
    //                         swal({
    //                             title: "Error!",
    //                             text: "Error sending allocation data.",
    //                             icon: "error",
    //                             buttons: true,
    //                             className: "swal"
    //                         });
    //                     }
    //                 });
    //             },
    //             error: function (xhr, status, error) {
    //                 console.error("Error in first AJAX request:", status, error);
    //                 swal({
    //                     type: 'warning',
    //                     title: 'Warning',
    //                     text: 'Allocation Edit Failed! Edit Correctly.'
    //                 });
    //             }
    //         });

    //         // Display success message
    //         swal({
    //             type: 'success',
    //             title: 'Allocation Edit Finished!',
    //             html: 'Updated: ' + result.value // Access the 'value' property of the result object
    //         });

    //     }).catch(function (error) {
    //         swal({
    //             type: 'warning',
    //             title: 'Warning',
    //             text: error
    //         });
    //     });
    // });

                                // } else {

                                //      swal(
                                //         {
                                //             type: 'warning',
                                //             title: 'warning',
                                //             text: 'Employee Details Not Found Server!',
                                //         }
                                //     );

                                // }

                            }

                        })


    })


// ================================================= JOBCARD CHANGE END =====================================================//



    $("#Employee_Type").on("change", function () {

        $("#Allocation_Table_Container").hide();
        $("#Allocation_Table tbody").empty();

        var Date = $("#Date").val();
        var Department = $("#Department").val();
        var Shift = $("#Shift").val();
        var Employee_Type = $("#Employee_Type").val();
        var Work_Area = $("#Work_Area").val();
        var JobCardNo = $("#JobCardNo").val();

        $.ajax({
            url: baseurl + "Work_Master/Employee_List",
            type: "POST",
            data:
            {
                Date,
                Department,
                Shift,
                Employee_Type,
                Work_Area,
                JobCardNo

            },
            success: function (response) {

                var responseData = JSON.parse(response);
                var Employee_Data = responseData.Employee_List;
                var Machine_Data = responseData.Machines;

                // if (responseData.length > 0) {

                    $("#Allocation_Table_Container").show();
                    $("#Allocation_Table tbody").empty();


                    // Create a set to track processed EmpNos to avoid duplication
                    var processedEmpNos = new Set();

                    // Create a map to hold the frames for each machine for easy access
                    var machineFrames = {};

                    Machine_Data.forEach(function (machine) {
                        if (!machineFrames[machine.Machine_Id]) {
                            machineFrames[machine.Machine_Id] = new Set();
                        }
                        machineFrames[machine.Machine_Id].add(machine.FrameType);
                    });

                    // Create a set to track unique machine IDs
                    var uniqueMachineIds = new Set();

                    // Filter out the unique machine IDs from Machine_Data
                    var uniqueMachines = Machine_Data.filter(function (machine) {
                        if (uniqueMachineIds.has(machine.Machine_Id)) {
                            return false;
                        } else {
                            uniqueMachineIds.add(machine.Machine_Id);
                            return true;
                        }
                    });

                    // Render Employee rows in the Allocation Table
                    Employee_Data.forEach(function (Employee, i) {
                        if (processedEmpNos.has(Employee.EmpNo)) {
                            return;
                        }

                        processedEmpNos.add(Employee.EmpNo);

                        // Initialize assignedMachineIds as an empty array
                        var assignedMachineIds = [];

                        // Collect all assigned machine IDs for this employee (grouping them together)
                        Employee_Data.forEach(function (emp) {
                            if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                assignedMachineIds.push(emp.Machine_Id);
                            }
                        });

                        // Create the machine options dropdown, including only unique machines
                        var allMachineOptions = uniqueMachines.map(function (machine) {
                            return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                        }).join("");

                        // Add "NoWork" and "Others" options manually at the end
                        allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                        // Create WorkType options dropdown
                        var workTypeOptions = "<option value=''>Select Work Type</option>";

                        var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                        var employeeRowHtml =
                            "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                            "<td>" + Employee.EmpNo + "</td>" +
                            "<td>" + Employee.FirstName + "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                            allMachineOptions +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                            workTypeOptions +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                            "</td>" +
                            "<td>" +
                            "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                            "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                            "</td>" +
                            "</tr>";

                        // Append the row to the table
                        $("#Allocation_Table tbody").append(employeeRowHtml);

                        $("#Edit_Allocation_" + i).hide();


                        // Preselect Machine IDs for the employee (multiple selected)
                        if (selectedMachineIds.length > 0) {

                            var selectedMachineOptions = "";
                            selectedMachineIds.forEach(function (machineId) {
                                selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                            });

                            // Combine the selected machines with all available machine options
                            var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                            $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                            $("#Edit_Allocation_" + i).show();

                        }

                        // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                        var frameOptions = '';

                        assignedMachineIds.forEach(function (machineId) {
                            var framesForMachine = Employee_Data.filter(function (emp) {
                                return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                            }).map(function (emp) {
                                return emp.Frame;
                            });

                            framesForMachine.forEach(function (frame) {
                                frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                            });
                        });

                        // Prepopulate the Frames dropdown with the correct frames for the specific employee
                        var frameOptions = '';

                        assignedMachineIds.forEach(function (machineId) {
                            var framesForEmployee = Employee_Data.filter(function (emp) {
                                return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                            }).map(function (emp) {
                                return emp.Frame;
                            });

                            framesForEmployee.forEach(function (frame) {
                                if (!frameOptions.includes(frame)) {
                                    frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                }
                            });
                        });

                        if (!frameOptions) {
                            frameOptions = "<option value=''>Select Frame</option>";
                        }

                        $("#Frames_" + i).html(frameOptions);

                        // Preselect FrameType if available from Employee_Data and not equal to '-'
                        var frameOptionsType = '';
                        if (Employee.FrameType && Employee.FrameType !== '-') {
                            frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                        }

                        if (frameOptionsType) {
                            $("#Frame_Method_" + i).html(frameOptionsType);
                        }

                        // Prepopulate the WorkType dropdown if available
                        var Work_Type = '';
                        if (Employee.Work_Type) {
                            Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                        }
                        $("#WorkType_" + i).html(Work_Type);

                        // Prepopulate the Description input if available
                        if (Employee.Description) {
                            $("#Description_" + i).val(Employee.Description);
                        }
                    });


                    $("#Allocation_Table tbody .custom-select2").select2({
                        placeholder: "",
                        allowClear: true,
                        width: '140px',
                        dropdownCssClass: 'custom-select2-dropdown',
                        containerCssClass: 'custom-select2-container'
                    });


    // $("#Allocation_Table tbody").on("change", ".Machine_Id", function () {
    //     var Machine_Id = $(this).val();
    //     var currentRow = $(this).closest("tr");

    //     $("#Allocation_" + i).show();



    //     var frameMethodSelect = currentRow.find(".Frame_Method");
    //     var framesSelect = currentRow.find(".Frames");
    //     var workTypeSelect = currentRow.find(".WorkType");
    //     var descriptionInput = currentRow.find(".Description");
    //     var allocationButton = currentRow.find(".Allocation");
    //     var editButton = currentRow.find(".Edit_Allocation");

    //     allocationButton.show();
    //     editButton.show();

    //     var Work_Area = $("#Work_Area").val();

    //     framesSelect.empty().prop("disabled", true);
    //     workTypeSelect.empty().prop("disabled", true);
    //     descriptionInput.prop("disabled", true).val("");
    //     frameMethodSelect.empty().prop("disabled", true);

    //     if (Machine_Id == "NoWork") {
    //         frameMethodSelect.prop("disabled", true);
    //         framesSelect.prop("disabled", true);
    //         workTypeSelect.prop("disabled", true).empty();
    //         descriptionInput.prop("disabled", true);
    //     } else if (Machine_Id == "Others") {
    //         frameMethodSelect.prop("disabled", true);
    //         framesSelect.prop("disabled", true);
    //         workTypeSelect.prop("disabled", false).empty().append("<option value=''></option><option value='Others'>Others</option></option><option value=" + Work_Area + "'>" + Work_Area + "</option>");
    //         descriptionInput.prop("disabled", true);

    //         workTypeSelect.on("change", function () {
    //             var workType = $(this).val();

    //             if (workType === "Others") {
    //                 descriptionInput.prop("disabled", false);
    //             } else if (workType === "Cleaning") {
    //                 descriptionInput.prop("disabled", true);
    //             }
    //         });
    //     } else {
    //         frameMethodSelect.prop("disabled", false);
    //         framesSelect.prop("disabled", false);
    //         workTypeSelect.prop("disabled", true).empty();
    //         descriptionInput.prop("disabled", true);

    //         allocationButton.show();

    //         frameMethodSelect.append("<option value=''></option>");
    //         frameMethodSelect.append("<option value='All'>All</option>");
    //         frameMethodSelect.append("<option value='Partial'>Partial</option>");

    //         var Work_Area = $("#Work_Area").val();
    //         var JobCardNo = $("#JobCardNo").val();
    //         var Department = $("#Department").val();
    //         var Date = $("#Date").val();
    //         var Shift = $("#Shift").val();

    //         $.ajax({
    //             url: baseurl + "Work_Master/Machine_Frames",
    //             type: "POST",
    //             data: {
    //                 Work_Area: Work_Area,
    //                 JobCardNo: JobCardNo,
    //                 Department: Department,
    //                 Machine_Id: Machine_Id,
    //                 Date,
    //                 Machine_Id,
    //                 Shift

    //             },
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);
    //                 var Machine_Frames = responseData.Machine_Frames;

    //                 framesSelect.empty().prop("disabled", false);

    //                 $.each(Machine_Frames, function (index, value) {
    //                     framesSelect.append($("<option></option>").attr("value", value.Frame).text(value.Frame));
    //                 });

    //                 frameMethodSelect.on("change", function () {
    //                     var frameMethod = $(this).val();

    //                     framesSelect.empty();

    //                     if (frameMethod == "All") {
    //                         $.each(Machine_Frames, function (index, value) {
    //                             var option = $("<option></option>").attr("value", value.Frame).text(value.Frame);
    //                             framesSelect.append(option);
    //                         });

    //                         framesSelect.val(Machine_Frames.map(function (frame) { return frame.Frame; })).trigger('change');
    //                     } else if (frameMethod == "Partial") {
    //                         if (Machine_Frames.length > 0) {
    //                             var firstFrame = Machine_Frames[0].Frame;
    //                             var option = $("<option></option>").attr("value", firstFrame).text(firstFrame).prop("selected", true);
    //                             framesSelect.append(option);
    //                         }
    //                     }

    //                     framesSelect.trigger('change');
    //                 });
    //             },
    //             error: function (error) {
    //                 console.log("Error loading machine frames: ", error);
    //             }
    //         });
    //     }
    // });

    //    // Allocation button click event
    // $("#Allocation_Table tbody").on("click", ".Allocation", function () {

    //     var currentRow = $(this).closest("tr");

    //     var tableData = [];

    //     var Date = $("#Date").val();
    //     var Department = $("#Department").val();
    //     var Shift = $("#Shift").val();
    //     var Work_Area = $("#Work_Area").val();
    //     var JobCardNo = $("#JobCardNo").val();

    //     var EmployeeId = currentRow.find("td:nth-child(1)").text();
    //     var EmployeeName = currentRow.find("td:nth-child(2)").text();
    //     var MachineId = currentRow.find(".Machine_Id").val();
    //     var FrameMethod = currentRow.find(".Frame_Method").val();
    //     var Frames = currentRow.find(".Frames").val();
    //     var WorkType = currentRow.find(".WorkType").val();
    //     var Description = currentRow.find(".Description").val();

    //     // Check if MachineId is not empty
    //     if (MachineId && MachineId !== "NoWork" && MachineId !== "Others") {
    //         var allocationData = {
    //             Date: Date,
    //             Department: Department,
    //             Shift: Shift,
    //             Work_Area: Work_Area,
    //             JobCardNo: JobCardNo,
    //             EmployeeId: EmployeeId,
    //             EmployeeName: EmployeeName,
    //             MachineId: MachineId,
    //             FrameMethod: FrameMethod,
    //             Frames: Frames,
    //             WorkType: WorkType,
    //             Description: Description
    //         };

    //         tableData.push(allocationData);

    //         var formData = {
    //             Allocations: tableData
    //         };

    //         $.ajax({
    //             url: baseurl + 'Allocation/Assign',
    //             type: 'POST',
    //             data: JSON.stringify(formData),
    //             contentType: 'application/json',
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);

    //                 $.ajax({
    //                     url: baseurl + "Work_Master/Employee_List",
    //                     type: "POST",
    //                     data: {
    //                         Date: Date,
    //                         Department: Department,
    //                         Shift: Shift,
    //                         Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
    //                         Work_Area: Work_Area,
    //                         JobCardNo: JobCardNo
    //                     },
    //                     success: function (response) {

    //                         var responseData = JSON.parse(response);
    //                         var Employee_Data = responseData.Employee_List;
    //                         var Machine_Data = responseData.Machines;

    //                         $("#Allocation_Table tbody").empty();

    //                         // Create a set to track processed EmpNos to avoid duplication
    //                         var processedEmpNos = new Set();

    //                         // Create a map to hold the frames for each machine for easy access
    //                         var machineFrames = {};

    //                         Machine_Data.forEach(function (machine) {
    //                             if (!machineFrames[machine.Machine_Id]) {
    //                                 machineFrames[machine.Machine_Id] = new Set();
    //                             }
    //                             machineFrames[machine.Machine_Id].add(machine.FrameType);
    //                         });

    //                         // Create a set to track unique machine IDs
    //                         var uniqueMachineIds = new Set();

    //                         // Filter out the unique machine IDs from Machine_Data
    //                         var uniqueMachines = Machine_Data.filter(function (machine) {
    //                             if (uniqueMachineIds.has(machine.Machine_Id)) {
    //                                 return false;
    //                             } else {
    //                                 uniqueMachineIds.add(machine.Machine_Id);
    //                                 return true;
    //                             }
    //                         });

    //                         // Render Employee rows in the Allocation Table
    //                         Employee_Data.forEach(function (Employee, i) {
    //                             if (processedEmpNos.has(Employee.EmpNo)) {
    //                                 return;
    //                             }

    //                             processedEmpNos.add(Employee.EmpNo);

    //                             // Initialize assignedMachineIds as an empty array
    //                             var assignedMachineIds = [];

    //                             // Collect all assigned machine IDs for this employee (grouping them together)
    //                             Employee_Data.forEach(function (emp) {
    //                                 if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
    //                                     assignedMachineIds.push(emp.Machine_Id);
    //                                 }
    //                             });

    //                             // Create the machine options dropdown, including only unique machines
    //                             var allMachineOptions = uniqueMachines.map(function (machine) {
    //                                 return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
    //                             }).join("");

    //                             // Add "NoWork" and "Others" options manually at the end
    //                             allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

    //                             // Create WorkType options dropdown
    //                             var workTypeOptions = "<option value=''>Select Work Type</option>";

    //                             var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

    //                             var employeeRowHtml =
    //                                 "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
    //                                 "<td>" + Employee.EmpNo + "</td>" +
    //                                 "<td>" + Employee.FirstName + "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
    //                                 allMachineOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
    //                                 workTypeOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
    //                                 "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
    //                                 "</td>" +
    //                                 "</tr>";

    //                             // Append the row to the table
    //                             $("#Allocation_Table tbody").append(employeeRowHtml);

    //                             $("#Edit_Allocation_" + i).hide();


    //                             // Preselect Machine IDs for the employee (multiple selected)
    //                             if (selectedMachineIds.length > 0) {

    //                                 var selectedMachineOptions = "";
    //                                 selectedMachineIds.forEach(function (machineId) {
    //                                     selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
    //                                 });

    //                                 // Combine the selected machines with all available machine options
    //                                 var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
    //                                 $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
    //                                 $("#Edit_Allocation_" + i).show();

    //                             }

    //                             // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForMachine = Employee_Data.filter(function (emp) {
    //                                     return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForMachine.forEach(function (frame) {
    //                                     frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                 });
    //                             });

    //                             // Prepopulate the Frames dropdown with the correct frames for the specific employee
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForEmployee = Employee_Data.filter(function (emp) {
    //                                     return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForEmployee.forEach(function (frame) {
    //                                     if (!frameOptions.includes(frame)) {
    //                                         frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                     }
    //                                 });
    //                             });

    //                             if (!frameOptions) {
    //                                 frameOptions = "<option value=''>Select Frame</option>";
    //                             }

    //                             $("#Frames_" + i).html(frameOptions);

    //                             // Preselect FrameType if available from Employee_Data and not equal to '-'
    //                             var frameOptionsType = '';
    //                             if (Employee.FrameType && Employee.FrameType !== '-') {
    //                                 frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
    //                             }

    //                             if (frameOptionsType) {
    //                                 $("#Frame_Method_" + i).html(frameOptionsType);
    //                             }

    //                             // Prepopulate the WorkType dropdown if available
    //                             var Work_Type = '';
    //                             if (Employee.Work_Type) {
    //                                 Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
    //                             }
    //                             $("#WorkType_" + i).html(Work_Type);

    //                             // Prepopulate the Description input if available
    //                             if (Employee.Description) {
    //                                 $("#Description_" + i).val(Employee.Description);
    //                             }
    //                         });
    //                         // Initialize Select2 for all dropdowns
    //                         $("#Allocation_Table tbody .custom-select2").select2({
    //                             placeholder: "",
    //                             allowClear: true,
    //                             width: '140px',
    //                             dropdownCssClass: 'custom-select2-dropdown',
    //                             containerCssClass: 'custom-select2-container'
    //                         });
    //                     },
    //                     error: function (error) {
    //                         swal({
    //                             title: "Error!",
    //                             text: "Error sending allocation data.",
    //                             icon: "error",
    //                             buttons: true,
    //                             className: "swal",
    //                         }).then((value) => { });
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });

    //  // Edit Allocation
    // $("#Allocation_Table tbody").on("click", ".Edit_Allocation", function () {
    //     var currentRow = $(this).closest("tr");  // Capture the correct row context
    //     var i = currentRow.index();  // Use the row index to reference the correct element

    //     swal({
    //         title: 'Allocation Edit Reason',
    //         input: 'text',
    //         showCancelButton: true,
    //         confirmButtonText: 'Edit',
    //         showLoaderOnConfirm: true,
    //         confirmButtonClass: 'btn btn-success',
    //         cancelButtonClass: 'btn btn-danger',
    //         preConfirm: function (reason) {
    //             return new Promise(function (resolve, reject) {
    //                 if (reason && reason.trim() !== "") {
    //                     resolve(reason); // Resolve with the input value
    //                 } else {
    //                     reject('Please provide a valid reason!');
    //                 }
    //             });
    //         },
    //         allowOutsideClick: false
    //     }).then(function (result) {

    //         var Date = $("#Date").val();
    //         var Department = $("#Department").val();
    //         var Shift = $("#Shift").val();
    //         var Work_Area = $("#Work_Area").val();
    //         var JobCardNo = $("#JobCardNo").val();

    //         var EmployeeId = currentRow.find("td:nth-child(1)").text();
    //         var EmployeeName = currentRow.find("td:nth-child(2)").text();
    //         var MachineId = currentRow.find(".Machine_Id").val();
    //         var FrameMethod = currentRow.find(".Frame_Method").val();
    //         var Frames = currentRow.find(".Frames").val();
    //         var WorkType = currentRow.find(".WorkType").val();
    //         var Description = currentRow.find(".Description").val();


    //         var allocationData = {
    //             Date: Date,
    //             Department: Department,
    //             Shift: Shift,
    //             Work_Area: Work_Area,
    //             JobCardNo: JobCardNo,
    //             EmployeeId: EmployeeId,
    //             EmployeeName: EmployeeName,
    //             MachineId: MachineId,
    //             FrameMethod: FrameMethod,
    //             Frames: Frames,
    //             WorkType: WorkType,
    //             Description: Description,
    //             Reason: result
    //         };

    //         var formData = {
    //             Allocations: [allocationData]
    //         };

    //         // First AJAX request (to update allocation)
    //         $.ajax({
    //             url: baseurl + 'Allocation/Edit',
    //             type: 'POST',
    //             data: JSON.stringify(formData),
    //             contentType: 'application/json',
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);
    //                 // Second AJAX request (to get updated employee list)
    //                 $.ajax({
    //                     url: baseurl + "Work_Master/Employee_List",
    //                     type: "POST",
    //                     data: {
    //                         Date: Date,
    //                         Department: Department,
    //                         Shift: Shift,
    //                         Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
    //                         Work_Area: Work_Area,
    //                         JobCardNo: JobCardNo
    //                     },
    //                     success: function (response) {
    //                         var responseData = JSON.parse(response);
    //                         var Employee_Data = responseData.Employee_List;
    //                         var Machine_Data = responseData.Machines;

    //                         $("#Allocation_Table tbody").empty();

    //                         // Create a set to track processed EmpNos to avoid duplication
    //                         var processedEmpNos = new Set();

    //                         // Create a map to hold the frames for each machine for easy access
    //                         var machineFrames = {};

    //                         Machine_Data.forEach(function (machine) {
    //                             if (!machineFrames[machine.Machine_Id]) {
    //                                 machineFrames[machine.Machine_Id] = new Set();
    //                             }
    //                             machineFrames[machine.Machine_Id].add(machine.FrameType);
    //                         });

    //                         // Create a set to track unique machine IDs
    //                         var uniqueMachineIds = new Set();

    //                         // Filter out the unique machine IDs from Machine_Data
    //                         var uniqueMachines = Machine_Data.filter(function (machine) {
    //                             if (uniqueMachineIds.has(machine.Machine_Id)) {
    //                                 return false;
    //                             } else {
    //                                 uniqueMachineIds.add(machine.Machine_Id);
    //                                 return true;
    //                             }
    //                         });

    //                         // Render Employee rows in the Allocation Table
    //                         Employee_Data.forEach(function (Employee, i) {
    //                             if (processedEmpNos.has(Employee.EmpNo)) {
    //                                 return;
    //                             }

    //                             processedEmpNos.add(Employee.EmpNo);

    //                             // Initialize assignedMachineIds as an empty array
    //                             var assignedMachineIds = [];

    //                             // Collect all assigned machine IDs for this employee (grouping them together)
    //                             Employee_Data.forEach(function (emp) {
    //                                 if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
    //                                     assignedMachineIds.push(emp.Machine_Id);
    //                                 }
    //                             });

    //                             // Create the machine options dropdown, including only unique machines
    //                             var allMachineOptions = uniqueMachines.map(function (machine) {
    //                                 return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
    //                             }).join("");

    //                             // Add "NoWork" and "Others" options manually at the end
    //                             allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

    //                             // Create WorkType options dropdown
    //                             var workTypeOptions = "<option value=''>Select Work Type</option>";

    //                             var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

    //                             var employeeRowHtml =
    //                                 "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
    //                                 "<td>" + Employee.EmpNo + "</td>" +
    //                                 "<td>" + Employee.FirstName + "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
    //                                 allMachineOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
    //                                 workTypeOptions +
    //                                 "</select>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
    //                                 "</td>" +
    //                                 "<td>" +
    //                                 "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
    //                                 "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
    //                                 "</td>" +
    //                                 "</tr>";

    //                             // Append the row to the table
    //                             $("#Allocation_Table tbody").append(employeeRowHtml);

    //                             $("#Edit_Allocation_" + i).hide();


    //                             // Preselect Machine IDs for the employee (multiple selected)
    //                             if (selectedMachineIds.length > 0) {

    //                                 var selectedMachineOptions = "";
    //                                 selectedMachineIds.forEach(function (machineId) {
    //                                     selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
    //                                 });

    //                                 // Combine the selected machines with all available machine options
    //                                 var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
    //                                 $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
    //                                 $("#Edit_Allocation_" + i).show();

    //                             }

    //                             // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForMachine = Employee_Data.filter(function (emp) {
    //                                     return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForMachine.forEach(function (frame) {
    //                                     frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                 });
    //                             });

    //                             // Prepopulate the Frames dropdown with the correct frames for the specific employee
    //                             var frameOptions = '';

    //                             assignedMachineIds.forEach(function (machineId) {
    //                                 var framesForEmployee = Employee_Data.filter(function (emp) {
    //                                     return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
    //                                 }).map(function (emp) {
    //                                     return emp.Frame;
    //                                 });

    //                                 framesForEmployee.forEach(function (frame) {
    //                                     if (!frameOptions.includes(frame)) {
    //                                         frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
    //                                     }
    //                                 });
    //                             });

    //                             if (!frameOptions) {
    //                                 frameOptions = "<option value=''>Select Frame</option>";
    //                             }

    //                             $("#Frames_" + i).html(frameOptions);

    //                             // Preselect FrameType if available from Employee_Data and not equal to '-'
    //                             var frameOptionsType = '';
    //                             if (Employee.FrameType && Employee.FrameType !== '-') {
    //                                 frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
    //                             }

    //                             if (frameOptionsType) {
    //                                 $("#Frame_Method_" + i).html(frameOptionsType);
    //                             }

    //                             // Prepopulate the WorkType dropdown if available
    //                             var Work_Type = '';
    //                             if (Employee.Work_Type) {
    //                                 Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
    //                             }
    //                             $("#WorkType_" + i).html(Work_Type);

    //                             // Prepopulate the Description input if available
    //                             if (Employee.Description) {
    //                                 $("#Description_" + i).val(Employee.Description);
    //                             }
    //                         });

    //                         // Reinitialize Select2 for new rows
    //                         $("#Allocation_Table tbody .custom-select2").select2({
    //                             placeholder: "",
    //                             allowClear: true,
    //                             width: '140px',
    //                             dropdownCssClass: 'custom-select2-dropdown',
    //                             containerCssClass: 'custom-select2-container'
    //                         });

    //                     },
    //                     error: function (xhr, status, error) {
    //                         console.error("Error in second AJAX request:", status, error);
    //                         swal({
    //                             title: "Error!",
    //                             text: "Error sending allocation data.",
    //                             icon: "error",
    //                             buttons: true,
    //                             className: "swal"
    //                         });
    //                     }
    //                 });
    //             },
    //             error: function (xhr, status, error) {
    //                 console.error("Error in first AJAX request:", status, error);
    //                 swal({
    //                     type: 'warning',
    //                     title: 'Warning',
    //                     text: 'Allocation Edit Failed! Edit Correctly.'
    //                 });
    //             }
    //         });

    //         // Display success message
    //         swal({
    //             type: 'success',
    //             title: 'Allocation Edit Finished!',
    //             html: 'Updated: ' + result.value // Access the 'value' property of the result object
    //         });

    //     }).catch(function (error) {
    //         swal({
    //             type: 'warning',
    //             title: 'Warning',
    //             text: error
    //         });
    //     });
    // });




                // } else {


                //     swal(
                //         {
                //             type: 'warning',
                //             title: 'warning',
                //             text: 'Employee Details Not Found Server!',
                //         }
                //     );

                // }


            }

        })

    });


//================================================PREVIOUS DAY ASSIGN========================================================//





    $("#Date").on("change", function () {

        $("#Allocation_Table_Container").hide();
        $("#Allocation_Table tbody").empty();

        var Date = $("#Date").val();
        var Department = $("#Department").val();
        var Shift = $("#Shift").val();
        var Employee_Type = $("#Employee_Type").val();
        var Work_Area = $("#Work_Area").val();
        var JobCardNo = $("#JobCardNo").val();

        $.ajax({
            url: baseurl + "Work_Master/Employee_List",
            type: "POST",
            data:
            {
                Date,
                Department,
                Shift,
                Employee_Type,
                Work_Area,
                JobCardNo

            },
            success: function (response) {

                var responseData = JSON.parse(response);
                var Employee_Data = responseData.Employee_List;
                var Machine_Data = responseData.Machines;

                // if (responseData.length > 0) {

                    $("#Allocation_Table_Container").show();
                    $("#Allocation_Table tbody").empty();


                    // Create a set to track processed EmpNos to avoid duplication
                    var processedEmpNos = new Set();

                    // Create a map to hold the frames for each machine for easy access
                    var machineFrames = {};

                    Machine_Data.forEach(function (machine) {
                        if (!machineFrames[machine.Machine_Id]) {
                            machineFrames[machine.Machine_Id] = new Set();
                        }
                        machineFrames[machine.Machine_Id].add(machine.FrameType);
                    });

                    // Create a set to track unique machine IDs
                    var uniqueMachineIds = new Set();

                    // Filter out the unique machine IDs from Machine_Data
                    var uniqueMachines = Machine_Data.filter(function (machine) {
                        if (uniqueMachineIds.has(machine.Machine_Id)) {
                            return false;
                        } else {
                            uniqueMachineIds.add(machine.Machine_Id);
                            return true;
                        }
                    });

                    // Render Employee rows in the Allocation Table
                    Employee_Data.forEach(function (Employee, i) {
                        if (processedEmpNos.has(Employee.EmpNo)) {
                            return;
                        }

                        processedEmpNos.add(Employee.EmpNo);

                        // Initialize assignedMachineIds as an empty array
                        var assignedMachineIds = [];

                        // Collect all assigned machine IDs for this employee (grouping them together)
                        Employee_Data.forEach(function (emp) {
                            if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                assignedMachineIds.push(emp.Machine_Id);
                            }
                        });

                        // Create the machine options dropdown, including only unique machines
                        var allMachineOptions = uniqueMachines.map(function (machine) {
                            return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                        }).join("");

                        // Add "NoWork" and "Others" options manually at the end
                        allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                        // Create WorkType options dropdown
                        var workTypeOptions = "<option value=''>Select Work Type</option>";

                        var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                        var employeeRowHtml =
                            "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                            "<td>" + Employee.EmpNo + "</td>" +
                            "<td>" + Employee.FirstName + "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                            allMachineOptions +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                            workTypeOptions +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                            +'<option value="">Workers</option>'+
                            +"</select>"+
                            "</td>" +
                            "<td>" +
                            "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                            "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                            "</td>" +
                            "</tr>";

                        // Append the row to the table
                        $("#Allocation_Table tbody").append(employeeRowHtml);

                        $("#Edit_Allocation_" + i).hide();


                        // Preselect Machine IDs for the employee (multiple selected)
                        if (selectedMachineIds.length > 0) {

                            var selectedMachineOptions = "";
                            selectedMachineIds.forEach(function (machineId) {
                                selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                            });

                            // Combine the selected machines with all available machine options
                            var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                            $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                            $("#Edit_Allocation_" + i).show();

                        }

                        // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                        var frameOptions = '';

                        assignedMachineIds.forEach(function (machineId) {
                            var framesForMachine = Employee_Data.filter(function (emp) {
                                return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                            }).map(function (emp) {
                                return emp.Frame;
                            });

                            framesForMachine.forEach(function (frame) {
                                frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                            });
                        });

                        // Prepopulate the Frames dropdown with the correct frames for the specific employee
                        var frameOptions = '';

                        assignedMachineIds.forEach(function (machineId) {
                            var framesForEmployee = Employee_Data.filter(function (emp) {
                                return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                            }).map(function (emp) {
                                return emp.Frame;
                            });

                            framesForEmployee.forEach(function (frame) {
                                if (!frameOptions.includes(frame)) {
                                    frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                }
                            });
                        });

                        if (!frameOptions) {
                            frameOptions = "<option value=''>Select Frame</option>";
                        }

                        $("#Frames_" + i).html(frameOptions);

                        // Preselect FrameType if available from Employee_Data and not equal to '-'
                        var frameOptionsType = '';
                        if (Employee.FrameType && Employee.FrameType !== '-') {
                            frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                        }

                        if (frameOptionsType) {
                            $("#Frame_Method_" + i).html(frameOptionsType);
                        }

                        // Prepopulate the WorkType dropdown if available
                        var Work_Type = '';
                        if (Employee.Work_Type) {
                            Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                        }
                        $("#WorkType_" + i).html(Work_Type);

                        // Prepopulate the Description input if available
                        if (Employee.Description) {
                            $("#Description_" + i).val(Employee.Description);
                        }




                            $("#Allocation_Table tbody").on("change", ".Machine_Id", function () {
        var Machine_Id = $(this).val();
        var currentRow = $(this).closest("tr");

        $("#Allocation_" + i).show();



        var frameMethodSelect = currentRow.find(".Frame_Method");
        var framesSelect = currentRow.find(".Frames");
        var workTypeSelect = currentRow.find(".WorkType");
        var descriptionInput = currentRow.find(".Description");
        var allocationButton = currentRow.find(".Allocation");
        var editButton = currentRow.find(".Edit_Allocation");

        allocationButton.show();
        editButton.show();

        var Work_Area = $("#Work_Area").val();

        framesSelect.empty().prop("disabled", true);
        workTypeSelect.empty().prop("disabled", true);
        descriptionInput.prop("disabled", true).val("");
        frameMethodSelect.empty().prop("disabled", true);

        if (Machine_Id == "NoWork") {
            frameMethodSelect.prop("disabled", true);
            framesSelect.prop("disabled", true);
            workTypeSelect.prop("disabled", true).empty();
            descriptionInput.prop("disabled", true);
        } else if (Machine_Id == "Others") {
            frameMethodSelect.prop("disabled", true);
            framesSelect.prop("disabled", true);
            workTypeSelect.prop("disabled", false).empty().append("<option value=''></option><option value='Others'>Others</option></option><option value=" + Work_Area + "'>" + Work_Area + "</option>");
            descriptionInput.prop("disabled", true);

            workTypeSelect.on("change", function () {
                var workType = $(this).val();

                if (workType === "Others") {
                    descriptionInput.prop("disabled", false);
                } else if (workType === "Cleaning") {
                    descriptionInput.prop("disabled", true);
                }
            });
        } else {
            frameMethodSelect.prop("disabled", false);
            framesSelect.prop("disabled", false);
            workTypeSelect.prop("disabled", true).empty();
            descriptionInput.prop("disabled", true);

            allocationButton.show();

            frameMethodSelect.append("<option value=''></option>");
            frameMethodSelect.append("<option value='All'>All</option>");
            frameMethodSelect.append("<option value='Partial'>Partial</option>");

            var Work_Area = $("#Work_Area").val();
            var JobCardNo = $("#JobCardNo").val();
            var Department = $("#Department").val();
            var Date = $("#Date").val();
            var Shift = $("#Shift").val();

            $.ajax({
                url: baseurl + "Work_Master/Machine_Frames",
                type: "POST",
                data: {
                    Work_Area: Work_Area,
                    JobCardNo: JobCardNo,
                    Department: Department,
                    Machine_Id: Machine_Id,
                    Date,
                    Machine_Id,
                    Shift

                },
                success: function (response) {
                    var responseData = JSON.parse(response);
                    var Machine_Frames = responseData.Machine_Frames;

                    framesSelect.empty().prop("disabled", false);

                    $.each(Machine_Frames, function (index, value) {
                        framesSelect.append($("<option></option>").attr("value", value.Frame).text(value.Frame));
                    });

                    frameMethodSelect.on("change", function () {
                        var frameMethod = $(this).val();

                        framesSelect.empty();

                        if (frameMethod == "All") {
                            $.each(Machine_Frames, function (index, value) {
                                var option = $("<option></option>").attr("value", value.Frame).text(value.Frame);
                                framesSelect.append(option);
                            });

                            framesSelect.val(Machine_Frames.map(function (frame) { return frame.Frame; })).trigger('change');
                        } else if (frameMethod == "Partial") {
                            if (Machine_Frames.length > 0) {
                                var firstFrame = Machine_Frames[0].Frame;
                                var option = $("<option></option>").attr("value", firstFrame).text(firstFrame).prop("selected", true);
                                framesSelect.append(option);
                            }
                        }

                        framesSelect.trigger('change');
                    });
                },
                error: function (error) {
                    console.log("Error loading machine frames: ", error);
                }
            });
        }
    });

                    });


                    $("#Allocation_Table tbody .custom-select2").select2({
                        placeholder: "",
                        allowClear: true,
                        width: '140px',
                        dropdownCssClass: 'custom-select2-dropdown',
                        containerCssClass: 'custom-select2-container'
                    });



       // Allocation button click event
    $("#Allocation_Table tbody").on("click", ".Allocation", function () {

        var currentRow = $(this).closest("tr");

        var tableData = [];

        var Date = $("#Date").val();
        var Department = $("#Department").val();
        var Shift = $("#Shift").val();
        var Work_Area = $("#Work_Area").val();
        var JobCardNo = $("#JobCardNo").val();

        var EmployeeId = currentRow.find("td:nth-child(1)").text();
        var EmployeeName = currentRow.find("td:nth-child(2)").text();
        var MachineId = currentRow.find(".Machine_Id").val();
        var FrameMethod = currentRow.find(".Frame_Method").val();
        var Frames = currentRow.find(".Frames").val();
        var WorkType = currentRow.find(".WorkType").val();
        var Description = currentRow.find(".Description").val();

        // Check if MachineId is not empty
        if (MachineId && MachineId !== "NoWork" && MachineId !== "Others") {
            var allocationData = {
                Date: Date,
                Department: Department,
                Shift: Shift,
                Work_Area: Work_Area,
                JobCardNo: JobCardNo,
                EmployeeId: EmployeeId,
                EmployeeName: EmployeeName,
                MachineId: MachineId,
                FrameMethod: FrameMethod,
                Frames: Frames,
                WorkType: WorkType,
                Description: Description
            };

            tableData.push(allocationData);

            var formData = {
                Allocations: tableData
            };

            $.ajax({
                url: baseurl + 'Allocation/Assign',
                type: 'POST',
                data: JSON.stringify(formData),
                contentType: 'application/json',
                success: function (response) {
                    var responseData = JSON.parse(response);

                    $.ajax({
                        url: baseurl + "Work_Master/Employee_List",
                        type: "POST",
                        data: {
                            Date: Date,
                            Department: Department,
                            Shift: Shift,
                            Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
                            Work_Area: Work_Area,
                            JobCardNo: JobCardNo
                        },
                        success: function (response) {

                            var responseData = JSON.parse(response);
                            var Employee_Data = responseData.Employee_List;
                            var Machine_Data = responseData.Machines;

                            $("#Allocation_Table tbody").empty();

                            // Create a set to track processed EmpNos to avoid duplication
                            var processedEmpNos = new Set();

                            // Create a map to hold the frames for each machine for easy access
                            var machineFrames = {};

                            Machine_Data.forEach(function (machine) {
                                if (!machineFrames[machine.Machine_Id]) {
                                    machineFrames[machine.Machine_Id] = new Set();
                                }
                                machineFrames[machine.Machine_Id].add(machine.FrameType);
                            });

                            // Create a set to track unique machine IDs
                            var uniqueMachineIds = new Set();

                            // Filter out the unique machine IDs from Machine_Data
                            var uniqueMachines = Machine_Data.filter(function (machine) {
                                if (uniqueMachineIds.has(machine.Machine_Id)) {
                                    return false;
                                } else {
                                    uniqueMachineIds.add(machine.Machine_Id);
                                    return true;
                                }
                            });

                            // Render Employee rows in the Allocation Table
                            Employee_Data.forEach(function (Employee, i) {
                                if (processedEmpNos.has(Employee.EmpNo)) {
                                    return;
                                }

                                processedEmpNos.add(Employee.EmpNo);

                                // Initialize assignedMachineIds as an empty array
                                var assignedMachineIds = [];

                                // Collect all assigned machine IDs for this employee (grouping them together)
                                Employee_Data.forEach(function (emp) {
                                    if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                        assignedMachineIds.push(emp.Machine_Id);
                                    }
                                });

                                // Create the machine options dropdown, including only unique machines
                                var allMachineOptions = uniqueMachines.map(function (machine) {
                                    return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                                }).join("");

                                // Add "NoWork" and "Others" options manually at the end
                                allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                                // Create WorkType options dropdown
                                var workTypeOptions = "<option value=''>Select Work Type</option>";

                                var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                                var employeeRowHtml =
                                    "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                    "<td>" + Employee.EmpNo + "</td>" +
                                    "<td>" + Employee.FirstName + "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                    allMachineOptions +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                    workTypeOptions +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                    "</td>" +
                                    "<td>" +
                                    "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                    "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                    "</td>" +
                                    "</tr>";

                                // Append the row to the table
                                $("#Allocation_Table tbody").append(employeeRowHtml);

                                $("#Edit_Allocation_" + i).hide();


                                // Preselect Machine IDs for the employee (multiple selected)
                                if (selectedMachineIds.length > 0) {

                                    var selectedMachineOptions = "";
                                    selectedMachineIds.forEach(function (machineId) {
                                        selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                    });

                                    // Combine the selected machines with all available machine options
                                    var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                    $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                    $("#Edit_Allocation_" + i).show();

                                }

                                // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                                var frameOptions = '';

                                assignedMachineIds.forEach(function (machineId) {
                                    var framesForMachine = Employee_Data.filter(function (emp) {
                                        return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                    }).map(function (emp) {
                                        return emp.Frame;
                                    });

                                    framesForMachine.forEach(function (frame) {
                                        frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                    });
                                });

                                // Prepopulate the Frames dropdown with the correct frames for the specific employee
                                var frameOptions = '';

                                assignedMachineIds.forEach(function (machineId) {
                                    var framesForEmployee = Employee_Data.filter(function (emp) {
                                        return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                    }).map(function (emp) {
                                        return emp.Frame;
                                    });

                                    framesForEmployee.forEach(function (frame) {
                                        if (!frameOptions.includes(frame)) {
                                            frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                        }
                                    });
                                });

                                if (!frameOptions) {
                                    frameOptions = "<option value=''>Select Frame</option>";
                                }

                                $("#Frames_" + i).html(frameOptions);

                                // Preselect FrameType if available from Employee_Data and not equal to '-'
                                var frameOptionsType = '';
                                if (Employee.FrameType && Employee.FrameType !== '-') {
                                    frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                                }

                                if (frameOptionsType) {
                                    $("#Frame_Method_" + i).html(frameOptionsType);
                                }

                                // Prepopulate the WorkType dropdown if available
                                var Work_Type = '';
                                if (Employee.Work_Type) {
                                    Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                                }
                                $("#WorkType_" + i).html(Work_Type);

                                // Prepopulate the Description input if available
                                if (Employee.Description) {
                                    $("#Description_" + i).val(Employee.Description);
                                }
                            });
                            // Initialize Select2 for all dropdowns
                            $("#Allocation_Table tbody .custom-select2").select2({
                                placeholder: "",
                                allowClear: true,
                                width: '140px',
                                dropdownCssClass: 'custom-select2-dropdown',
                                containerCssClass: 'custom-select2-container'
                            });
                        },
                        error: function (error) {
                            swal({
                                title: "Error!",
                                text: "Error sending allocation data.",
                                icon: "error",
                                buttons: true,
                                className: "swal",
                            }).then((value) => { });
                        }
                    });
                }
            });
        }
    });

     // Edit Allocation
    $("#Allocation_Table tbody").on("click", ".Edit_Allocation", function () {
        var currentRow = $(this).closest("tr");  // Capture the correct row context
        var i = currentRow.index();  // Use the row index to reference the correct element

        swal({
            title: 'Allocation Edit Reason',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Edit',
            showLoaderOnConfirm: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            preConfirm: function (reason) {
                return new Promise(function (resolve, reject) {
                    if (reason && reason.trim() !== "") {
                        resolve(reason); // Resolve with the input value
                    } else {
                        reject('Please provide a valid reason!');
                    }
                });
            },
            allowOutsideClick: false
        }).then(function (result) {

            var Date = $("#Date").val();
            var Department = $("#Department").val();
            var Shift = $("#Shift").val();
            var Work_Area = $("#Work_Area").val();
            var JobCardNo = $("#JobCardNo").val();

            var EmployeeId = currentRow.find("td:nth-child(1)").text();
            var EmployeeName = currentRow.find("td:nth-child(2)").text();
            var MachineId = currentRow.find(".Machine_Id").val();
            var FrameMethod = currentRow.find(".Frame_Method").val();
            var Frames = currentRow.find(".Frames").val();
            var WorkType = currentRow.find(".WorkType").val();
            var Description = currentRow.find(".Description").val();


            var allocationData = {
                Date: Date,
                Department: Department,
                Shift: Shift,
                Work_Area: Work_Area,
                JobCardNo: JobCardNo,
                EmployeeId: EmployeeId,
                EmployeeName: EmployeeName,
                MachineId: MachineId,
                FrameMethod: FrameMethod,
                Frames: Frames,
                WorkType: WorkType,
                Description: Description,
                Reason: result
            };

            var formData = {
                Allocations: [allocationData]
            };

            // First AJAX request (to update allocation)
            $.ajax({
                url: baseurl + 'Allocation/Edit',
                type: 'POST',
                data: JSON.stringify(formData),
                contentType: 'application/json',
                success: function (response) {
                    var responseData = JSON.parse(response);
                    // Second AJAX request (to get updated employee list)
                    $.ajax({
                        url: baseurl + "Work_Master/Employee_List",
                        type: "POST",
                        data: {
                            Date: Date,
                            Department: Department,
                            Shift: Shift,
                            Employee_Type: Employee_Type, // Assuming Employee_Type is defined somewhere
                            Work_Area: Work_Area,
                            JobCardNo: JobCardNo
                        },
                        success: function (response) {
                            var responseData = JSON.parse(response);
                            var Employee_Data = responseData.Employee_List;
                            var Machine_Data = responseData.Machines;

                            $("#Allocation_Table tbody").empty();

                            // Create a set to track processed EmpNos to avoid duplication
                            var processedEmpNos = new Set();

                            // Create a map to hold the frames for each machine for easy access
                            var machineFrames = {};

                            Machine_Data.forEach(function (machine) {
                                if (!machineFrames[machine.Machine_Id]) {
                                    machineFrames[machine.Machine_Id] = new Set();
                                }
                                machineFrames[machine.Machine_Id].add(machine.FrameType);
                            });

                            // Create a set to track unique machine IDs
                            var uniqueMachineIds = new Set();

                            // Filter out the unique machine IDs from Machine_Data
                            var uniqueMachines = Machine_Data.filter(function (machine) {
                                if (uniqueMachineIds.has(machine.Machine_Id)) {
                                    return false;
                                } else {
                                    uniqueMachineIds.add(machine.Machine_Id);
                                    return true;
                                }
                            });

                            // Render Employee rows in the Allocation Table
                            Employee_Data.forEach(function (Employee, i) {
                                if (processedEmpNos.has(Employee.EmpNo)) {
                                    return;
                                }

                                processedEmpNos.add(Employee.EmpNo);

                                // Initialize assignedMachineIds as an empty array
                                var assignedMachineIds = [];

                                // Collect all assigned machine IDs for this employee (grouping them together)
                                Employee_Data.forEach(function (emp) {
                                    if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                        assignedMachineIds.push(emp.Machine_Id);
                                    }
                                });

                                // Create the machine options dropdown, including only unique machines
                                var allMachineOptions = uniqueMachines.map(function (machine) {
                                    return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                                }).join("");

                                // Add "NoWork" and "Others" options manually at the end
                                allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                                // Create WorkType options dropdown
                                var workTypeOptions = "<option value=''>Select Work Type</option>";

                                var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                                var employeeRowHtml =
                                    "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                    "<td>" + Employee.EmpNo + "</td>" +
                                    "<td>" + Employee.FirstName + "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                    allMachineOptions +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                    workTypeOptions +
                                    "</select>" +
                                    "</td>" +
                                    "<td>" +
                                    "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                    "</td>" +
                                    "<td>" +
                                    "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                    "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                    "</td>" +
                                    "</tr>";

                                // Append the row to the table
                                $("#Allocation_Table tbody").append(employeeRowHtml);

                                $("#Edit_Allocation_" + i).hide();


                                // Preselect Machine IDs for the employee (multiple selected)
                                if (selectedMachineIds.length > 0) {

                                    var selectedMachineOptions = "";
                                    selectedMachineIds.forEach(function (machineId) {
                                        selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                    });

                                    // Combine the selected machines with all available machine options
                                    var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                    $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                    $("#Edit_Allocation_" + i).show();

                                }

                                // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                                var frameOptions = '';

                                assignedMachineIds.forEach(function (machineId) {
                                    var framesForMachine = Employee_Data.filter(function (emp) {
                                        return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                    }).map(function (emp) {
                                        return emp.Frame;
                                    });

                                    framesForMachine.forEach(function (frame) {
                                        frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                    });
                                });

                                // Prepopulate the Frames dropdown with the correct frames for the specific employee
                                var frameOptions = '';

                                assignedMachineIds.forEach(function (machineId) {
                                    var framesForEmployee = Employee_Data.filter(function (emp) {
                                        return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                    }).map(function (emp) {
                                        return emp.Frame;
                                    });

                                    framesForEmployee.forEach(function (frame) {
                                        if (!frameOptions.includes(frame)) {
                                            frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                        }
                                    });
                                });

                                if (!frameOptions) {
                                    frameOptions = "<option value=''>Select Frame</option>";
                                }

                                $("#Frames_" + i).html(frameOptions);

                                // Preselect FrameType if available from Employee_Data and not equal to '-'
                                var frameOptionsType = '';
                                if (Employee.FrameType && Employee.FrameType !== '-') {
                                    frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                                }

                                if (frameOptionsType) {
                                    $("#Frame_Method_" + i).html(frameOptionsType);
                                }

                                // Prepopulate the WorkType dropdown if available
                                var Work_Type = '';
                                if (Employee.Work_Type) {
                                    Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                                }
                                $("#WorkType_" + i).html(Work_Type);

                                // Prepopulate the Description input if available
                                if (Employee.Description) {
                                    $("#Description_" + i).val(Employee.Description);
                                }
                            });

                            // Reinitialize Select2 for new rows
                            $("#Allocation_Table tbody .custom-select2").select2({
                                placeholder: "",
                                allowClear: true,
                                width: '140px',
                                dropdownCssClass: 'custom-select2-dropdown',
                                containerCssClass: 'custom-select2-container'
                            });

                        },
                        error: function (xhr, status, error) {
                            console.error("Error in second AJAX request:", status, error);
                            swal({
                                title: "Error!",
                                text: "Error sending allocation data.",
                                icon: "error",
                                buttons: true,
                                className: "swal"
                            });
                        }
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Error in first AJAX request:", status, error);
                    swal({
                        type: 'warning',
                        title: 'Warning',
                        text: 'Allocation Edit Failed! Edit Correctly.'
                    });
                }
            });

            // Display success message
            swal({
                type: 'success',
                title: 'Allocation Edit Finished!',
                html: 'Updated: ' + result.value // Access the 'value' property of the result object
            });

        }).catch(function (error) {
            swal({
                type: 'warning',
                title: 'Warning',
                text: error
            });
        });
    });




                // } else {


                //     swal(
                //         {
                //             type: 'warning',
                //             title: 'warning',
                //             text: 'Employee Details Not Found Server!',
                //         }
                //     );

                // }


            }

        })

})





















    $("#PreviousdaydBtn").on("click", function () {

        var Current_Date = $("#Date").val();
        var dateObject = new Date(Current_Date);
        dateObject.setDate(dateObject.getDate() - 1);
        var previousDate = dateObject.toISOString().split("T")[0];

        var Department = $("#Department").val();
        var Shift = $("#Shift").val();
        var Work_Area = $("#Work_Area").val();
        var JobCardNo = $("#JobCardNo").val();


        $.ajax({
            url: baseurl + "Allocation/Previous_Day",
            type: "POST",
            data: {
                Date: previousDate,
                Department: Department,
                Shift: Shift,
                Work_Area: Work_Area,
                JobCardNo: JobCardNo,
            },
            success: function (response) {

                var responseData = JSON.parse(response);

                if (response.length > 0) {


                    var Employee_Data = responseData.Previous_Day_Work_Alloction;
                    var Machine_Data = responseData.Machines;

                    $("#Allocation_Table tbody").empty();

                    // Create a set to track processed EmpNos to avoid duplication
                    var processedEmpNos = new Set();

                    // Create a map to hold the frames for each machine for easy access
                    var machineFrames = {};

                    Machine_Data.forEach(function (machine) {
                        if (!machineFrames[machine.Machine_Id]) {
                            machineFrames[machine.Machine_Id] = new Set();
                        }
                        machineFrames[machine.Machine_Id].add(machine.FrameType);
                    });

                    // Create a set to track unique machine IDs
                    var uniqueMachineIds = new Set();

                    // Filter out the unique machine IDs from Machine_Data
                    var uniqueMachines = Machine_Data.filter(function (machine) {
                        if (uniqueMachineIds.has(machine.Machine_Id)) {
                            return false;
                        } else {
                            uniqueMachineIds.add(machine.Machine_Id);
                            return true;
                        }
                    });

                    // Render Employee rows in the Allocation Table
                    Employee_Data.forEach(function (Employee, i) {
                        if (processedEmpNos.has(Employee.EmpNo)) {
                            return;
                        }

                        processedEmpNos.add(Employee.EmpNo);

                        // Initialize assignedMachineIds as an empty array
                        var assignedMachineIds = [];

                        // Collect all assigned machine IDs for this employee (grouping them together)
                        Employee_Data.forEach(function (emp) {
                            if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && assignedMachineIds.indexOf(emp.Machine_Id) == -1) {
                                assignedMachineIds.push(emp.Machine_Id);
                            }
                        });

                        // Create the machine options dropdown, including only unique machines
                        var allMachineOptions = uniqueMachines.map(function (machine) {
                            return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                        }).join("");

                        // Add "NoWork" and "Others" options manually at the end
                        allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                        // Create WorkType options dropdown
                        var workTypeOptions = "<option value=''>Select Work Type</option>";

                        var selectedMachineIds = Employee.Assign_Status !== "0" ? assignedMachineIds : [];

                        var employeeRowHtml =
                            "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                            "<td>" + Employee.EmpNo + "</td>" +
                            "<td>" + Employee.FirstName + "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                            allMachineOptions +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                            workTypeOptions +
                            "</select>" +
                            "</td>" +
                            "<td>" +
                            "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                            "</td>" +
                            "<td>" +
                            "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                            "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                            "</td>" +
                            "</tr>";

                        // Append the row to the table
                        $("#Allocation_Table tbody").append(employeeRowHtml);

                        $("#Edit_Allocation_" + i).hide();


                        // Preselect Machine IDs for the employee (multiple selected)
                        if (selectedMachineIds.length > 0) {

                            var selectedMachineOptions = "";
                            selectedMachineIds.forEach(function (machineId) {
                                selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                            });

                            // Combine the selected machines with all available machine options
                            var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                            $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                            $("#Edit_Allocation_" + i).show();

                        }

                        // Prepopulate the Frames dropdown with the correct frames using only Employee_Data
                        var frameOptions = '';

                        assignedMachineIds.forEach(function (machineId) {
                            var framesForMachine = Employee_Data.filter(function (emp) {
                                return emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                            }).map(function (emp) {
                                return emp.Frame;
                            });

                            framesForMachine.forEach(function (frame) {
                                frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                            });
                        });

                        // Prepopulate the Frames dropdown with the correct frames for the specific employee
                        var frameOptions = '';

                        assignedMachineIds.forEach(function (machineId) {
                            var framesForEmployee = Employee_Data.filter(function (emp) {
                                return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                            }).map(function (emp) {
                                return emp.Frame;
                            });

                            framesForEmployee.forEach(function (frame) {
                                if (!frameOptions.includes(frame)) {
                                    frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                }
                            });
                        });

                        if (!frameOptions) {
                            frameOptions = "<option value=''>Select Frame</option>";
                        }

                        $("#Frames_" + i).html(frameOptions);

                        // Preselect FrameType if available from Employee_Data and not equal to '-'
                        var frameOptionsType = '';
                        if (Employee.FrameType && Employee.FrameType !== '-') {
                            frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                        }

                        if (frameOptionsType) {
                            $("#Frame_Method_" + i).html(frameOptionsType);
                        }

                        // Prepopulate the WorkType dropdown if available
                        var Work_Type = '';
                        if (Employee.Work_Type) {
                            Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                        }
                        $("#WorkType_" + i).html(Work_Type);

                        // Prepopulate the Description input if available
                        if (Employee.Description) {
                            $("#Description_" + i).val(Employee.Description);
                        }
                    });


                    $("#Allocation_Table tbody .custom-select2").select2({
                        placeholder: "",
                        allowClear: true,
                        width: '140px',
                        dropdownCssClass: 'custom-select2-dropdown',
                        containerCssClass: 'custom-select2-container'
                    });




                } else {

                    swal(
                        {
                            type: 'warning',
                            title: 'warning',
                            text: 'Work Allocation Details Not Found Server!',
                        }
                    )

                }






            },
            error: function () {
                console.error("Error fetching assigned employees.");
            },
        });
    });




    //  // Handle change events for Machine ID to update other fields accordingly
    // $("#Allocation_Table tbody").on("change", ".Machine_Id", function () {
    //     var Machine_Id = $(this).val();
    //     var currentRow = $(this).closest("tr");

    //     $("#Allocation_" + i).show();



    //     var frameMethodSelect = currentRow.find(".Frame_Method");
    //     var framesSelect = currentRow.find(".Frames");
    //     var workTypeSelect = currentRow.find(".WorkType");
    //     var descriptionInput = currentRow.find(".Description");
    //     var allocationButton = currentRow.find(".Allocation");
    //     var editButton = currentRow.find(".Edit_Allocation");

    //     allocationButton.show();
    //     editButton.show();

    //     var Work_Area = $("#Work_Area").val();

    //     framesSelect.empty().prop("disabled", true);
    //     workTypeSelect.empty().prop("disabled", true);
    //     descriptionInput.prop("disabled", true).val("");
    //     frameMethodSelect.empty().prop("disabled", true);

    //     if (Machine_Id == "NoWork") {
    //         frameMethodSelect.prop("disabled", true);
    //         framesSelect.prop("disabled", true);
    //         workTypeSelect.prop("disabled", true).empty();
    //         descriptionInput.prop("disabled", true);
    //     } else if (Machine_Id == "Others") {
    //         frameMethodSelect.prop("disabled", true);
    //         framesSelect.prop("disabled", true);
    //         workTypeSelect.prop("disabled", false).empty().append("<option value=''></option><option value='Others'>Others</option></option><option value=" + Work_Area + "'>" + Work_Area + "</option>");
    //         descriptionInput.prop("disabled", true);

    //         workTypeSelect.on("change", function () {
    //             var workType = $(this).val();

    //             if (workType === "Others") {
    //                 descriptionInput.prop("disabled", false);
    //             } else if (workType === "Cleaning") {
    //                 descriptionInput.prop("disabled", true);
    //             }
    //         });
    //     } else {
    //         frameMethodSelect.prop("disabled", false);
    //         framesSelect.prop("disabled", false);
    //         workTypeSelect.prop("disabled", true).empty();
    //         descriptionInput.prop("disabled", true);

    //         allocationButton.show();

    //         frameMethodSelect.append("<option value=''></option>");
    //         frameMethodSelect.append("<option value='All'>All</option>");
    //         frameMethodSelect.append("<option value='Partial'>Partial</option>");

    //         var Work_Area = $("#Work_Area").val();
    //         var JobCardNo = $("#JobCardNo").val();
    //         var Department = $("#Department").val();
    //         var Date = $("#Date").val();
    //         var Shift = $("#Shift").val();

    //         $.ajax({
    //             url: baseurl + "Work_Master/Machine_Frames",
    //             type: "POST",
    //             data: {
    //                 Work_Area: Work_Area,
    //                 JobCardNo: JobCardNo,
    //                 Department: Department,
    //                 Machine_Id: Machine_Id,
    //                 Date,
    //                 Machine_Id,
    //                 Shift

    //             },
    //             success: function (response) {
    //                 var responseData = JSON.parse(response);
    //                 var Machine_Frames = responseData.Machine_Frames;

    //                 framesSelect.empty().prop("disabled", false);

    //                 $.each(Machine_Frames, function (index, value) {
    //                     framesSelect.append($("<option></option>").attr("value", value.Frame).text(value.Frame));
    //                 });

    //                 frameMethodSelect.on("change", function () {
    //                     var frameMethod = $(this).val();

    //                     framesSelect.empty();

    //                     if (frameMethod == "All") {
    //                         $.each(Machine_Frames, function (index, value) {
    //                             var option = $("<option></option>").attr("value", value.Frame).text(value.Frame);
    //                             framesSelect.append(option);
    //                         });

    //                         framesSelect.val(Machine_Frames.map(function (frame) { return frame.Frame; })).trigger('change');
    //                     } else if (frameMethod == "Partial") {
    //                         if (Machine_Frames.length > 0) {
    //                             var firstFrame = Machine_Frames[0].Frame;
    //                             var option = $("<option></option>").attr("value", firstFrame).text(firstFrame).prop("selected", true);
    //                             framesSelect.append(option);
    //                         }
    //                     }

    //                     framesSelect.trigger('change');
    //                 });
    //             },
    //             error: function (error) {
    //                 console.log("Error loading machine frames: ", error);
    //             }
    //         });
    //     }
    // });




// Allocation button click event
$("#Allocation_Table tbody").on("click", ".Allocation", function () {
    var currentRow = $(this).closest("tr");

    var Date = $("#Date").val();
    var Department = $("#Department").val();
    var Shift = $("#Shift").val();
    var Work_Area = $("#Work_Area").val();
    var JobCardNo = $("#JobCardNo").val();
    var Employee_Type = $("#Employee_Type").val();

    var EmployeeId = currentRow.find("td:nth-child(1)").text();
    var EmployeeName = currentRow.find("td:nth-child(2)").text();
    var MachineId = currentRow.find(".Machine_Id").val();
    var FrameMethod = currentRow.find(".Frame_Method").val();
    var Frames = currentRow.find(".Frames").val();
    var WorkType = currentRow.find(".WorkType").val();
    var Description = currentRow.find(".Description").val();

    var allocationData = {
        Date: Date,
        Department: Department,
        Shift: Shift,
        Work_Area: Work_Area,
        JobCardNo: JobCardNo,
        EmployeeId: EmployeeId,
        EmployeeName: EmployeeName,
        MachineId: MachineId,
        FrameMethod: FrameMethod,
        Frames: Frames,
        WorkType: WorkType,
        Description: Description
    };

    var formData = {
        Allocations: [allocationData]
    };

    $.ajax({
        url: baseurl + 'Allocation/Assign',
        type: 'POST',
        data: JSON.stringify(formData),
        contentType: 'application/json',
        success: function (response) {
            var responseData = JSON.parse(response);

            if (responseData == 1) {
                $.ajax({
                    url: baseurl + "Work_Master/Employee_List",
                    type: "POST",
                    data: {
                        Date: Date,
                        Department: Department,
                        Shift: Shift,
                        Employee_Type: Employee_Type,
                        Work_Area: Work_Area,
                        JobCardNo: JobCardNo
                    },
                    success: function (response) {
                        var responseData = JSON.parse(response);
                        var Employee_Data = responseData.Employee_List;
                        var Machine_Data = responseData.Machines;

                        $("#Allocation_Table tbody").empty();

                        var processedEmpNos = new Set();
                        var machineFrames = {};
                        Machine_Data.forEach(function (machine) {
                            if (!machineFrames[machine.Machine_Id]) {
                                machineFrames[machine.Machine_Id] = new Set();
                            }
                            machineFrames[machine.Machine_Id].add(machine.FrameType);
                        });

                        var uniqueMachineIds = new Set();
                        var uniqueMachines = Machine_Data.filter(function (machine) {
                            if (uniqueMachineIds.has(machine.Machine_Id)) {
                                return false;
                            } else {
                                uniqueMachineIds.add(machine.Machine_Id);
                                return true;
                            }
                        });

                        Employee_Data.forEach(function (Employee, i) {
                            if (processedEmpNos.has(Employee.EmpNo)) {
                                return;
                            }

                            processedEmpNos.add(Employee.EmpNo);

                            var assignedMachineIds = [];

                            Employee_Data.forEach(function (emp) {
                                if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && !assignedMachineIds.includes(emp.Machine_Id)) {
                                    assignedMachineIds.push(emp.Machine_Id);
                                }
                            });

                            var allMachineOptions = uniqueMachines.map(function (machine) {
                                return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
                            }).join("");

                            allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

                            var workTypeOptions = "<option value=''>Select Work Type</option>";

                            var selectedMachineIds = (Employee.Assign_Status !== "0") ? assignedMachineIds : [];

                            var employeeRowHtml =
                                "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
                                "<td>" + Employee.EmpNo + "</td>" +
                                "<td>" + Employee.FirstName + "</td>" +
                                "<td>" +
                                "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
                                allMachineOptions +
                                "</select>" +
                                "</td>" +
                                "<td>" +
                                "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
                                "</select>" +
                                "</td>" +
                                "<td>" +
                                "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
                                "</select>" +
                                "</td>" +
                                "<td>" +
                                "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
                                workTypeOptions +
                                "</select>" +
                                "</td>" +
                                "<td>" +
                                "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
                                "</td>" +
                                "<td>" +
                                "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
                                "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
                                "</td>" +
                                "</tr>";

                            $("#Allocation_Table tbody").append(employeeRowHtml);

                            $("#Edit_Allocation_" + i).hide();

                            if (selectedMachineIds.length > 0) {
                                var selectedMachineOptions = "";
                                selectedMachineIds.forEach(function (machineId) {
                                    selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
                                });

                                var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
                                $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
                                $("#Edit_Allocation_" + i).show();
                            }

                            var frameOptions = '';
                            assignedMachineIds.forEach(function (machineId) {
                                var framesForEmployee = Employee_Data.filter(function (emp) {
                                    return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
                                }).map(function (emp) {
                                    return emp.Frame;
                                });

                                framesForEmployee.forEach(function (frame) {
                                    if (!frameOptions.includes(frame)) {
                                        frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
                                    }
                                });
                            });

                            if (!frameOptions) {
                                frameOptions = "<option value=''>Select Frame</option>";
                            }
                            $("#Frames_" + i).html(frameOptions);

                            var frameOptionsType = '';
                            if (Employee.FrameType && Employee.FrameType !== '-') {
                                frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
                            }

                            if (frameOptionsType) {
                                $("#Frame_Method_" + i).html(frameOptionsType);
                            }

                            var Work_Type = '';
                            if (Employee.Work_Type) {
                                Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
                            }
                            $("#WorkType_" + i).html(Work_Type);

                            if (Employee.Description) {
                                $("#Description_" + i).val(Employee.Description);
                            }
                        });

                        $("#Allocation_Table tbody .custom-select2").select2({
                            placeholder: "",
                            allowClear: true,
                            width: '140px',
                            dropdownCssClass: 'custom-select2-dropdown',
                            containerCssClass: 'custom-select2-container'
                        });
                    },
                    error: function (error) {
                        console.log(error);
                        swal({
                            title: "Error!",
                            text: "Error sending allocation data.",
                            icon: "error",
                            buttons: true,
                            className: "swal",
                        }).then((value) => { });
                    }
                });
            } else {
                alert('mm');
            }
        }
    });
});





// Edit Allocation
// $("#Allocation_Table tbody").on("click", ".Edit_Allocation", function () {
//     var currentRow = $(this).closest("tr");  // Capture the correct row context
//     var i = currentRow.index();  // Use the row index to reference the correct element

//     swal({
//         title: 'Allocation Edit Reason',
//         input: 'text',
//         showCancelButton: true,
//         confirmButtonText: 'Edit',
//         showLoaderOnConfirm: true,
//         confirmButtonClass: 'btn btn-success',
//         cancelButtonClass: 'btn btn-danger',
//         preConfirm: function (reason) {
//             return new Promise(function (resolve, reject) {
//                 if (reason && reason.trim() !== "") {
//                     resolve(reason); // Resolve with the input value
//                 } else {
//                     reject('Please provide a valid reason!');
//                 }
//             });
//         },
//         allowOutsideClick: false
//     }).then(function (result) {

//         var Date = $("#Date").val();
//         var Department = $("#Department").val();
//         var Shift = $("#Shift").val();
//         var Work_Area = $("#Work_Area").val();
//         var JobCardNo = $("#JobCardNo").val();

//         var EmployeeId = currentRow.find("td:nth-child(1)").text();
//         var EmployeeName = currentRow.find("td:nth-child(2)").text();
//         var MachineId = currentRow.find(".Machine_Id").val();
//         var FrameMethod = currentRow.find(".Frame_Method").val();
//         var Frames = currentRow.find(".Frames").val();
//         var WorkType = currentRow.find(".WorkType").val();
//         var Description = currentRow.find(".Description").val();

//         var allocationData = {
//             Date: Date,
//             Department: Department,
//             Shift: Shift,
//             Work_Area: Work_Area,
//             JobCardNo: JobCardNo,
//             EmployeeId: EmployeeId,
//             EmployeeName: EmployeeName,
//             MachineId: MachineId,
//             FrameMethod: FrameMethod,
//             Frames: Frames,
//             WorkType: WorkType,
//             Description: Description,
//             Reason: result
//         };

//         var formData = {
//             Allocations: [allocationData]
//         };

//         // First AJAX request (to update allocation)
//         $.ajax({
//             url: baseurl + 'Allocation/Edit',
//             type: 'POST',
//             data: JSON.stringify(formData),
//             contentType: 'application/json',
//             success: function (response) {
//                 var responseData = JSON.parse(response);

//                 if (responseData == 1) {

//                     // Second AJAX request (to fetch updated employee list)
//                     $.ajax({
//                         url: baseurl + "Work_Master/Employee_List",
//                         type: "POST",
//                         data: {
//                             Date: Date,
//                             Department: Department,
//                             Shift: Shift,
//                             Employee_Type: Employee_Type,
//                             Work_Area: Work_Area,
//                             JobCardNo: JobCardNo
//                         },
//                         success: function (response) {
//                             var responseData = JSON.parse(response);
//                             var Employee_Data = responseData.Employee_List;
//                             var Machine_Data = responseData.Machines;

//                             $("#Allocation_Table tbody").empty();

//                             var processedEmpNos = new Set();
//                             var machineFrames = {};
//                             Machine_Data.forEach(function (machine) {
//                                 if (!machineFrames[machine.Machine_Id]) {
//                                     machineFrames[machine.Machine_Id] = new Set();
//                                 }
//                                 machineFrames[machine.Machine_Id].add(machine.FrameType);
//                             });

//                             var uniqueMachineIds = new Set();
//                             var uniqueMachines = Machine_Data.filter(function (machine) {
//                                 if (uniqueMachineIds.has(machine.Machine_Id)) {
//                                     return false;
//                                 } else {
//                                     uniqueMachineIds.add(machine.Machine_Id);
//                                     return true;
//                                 }
//                             });

//                             Employee_Data.forEach(function (Employee, i) {
//                                 if (processedEmpNos.has(Employee.EmpNo)) {
//                                     return;
//                                 }

//                                 processedEmpNos.add(Employee.EmpNo);

//                                 var assignedMachineIds = [];

//                                 Employee_Data.forEach(function (emp) {
//                                     if (emp.EmpNo == Employee.EmpNo && emp.Machine_Id && !assignedMachineIds.includes(emp.Machine_Id)) {
//                                         assignedMachineIds.push(emp.Machine_Id);
//                                     }
//                                 });

//                                 var allMachineOptions = uniqueMachines.map(function (machine) {
//                                     return "<option value='" + machine.Machine_Id + "'>" + machine.Machine_Id + "</option>";
//                                 }).join("");

//                                 allMachineOptions += "<option value='NoWork'>NoWork</option> <option value='Others'>Others</option>";

//                                 var workTypeOptions = "<option value=''>Select Work Type</option>";

//                                 var selectedMachineIds = (Employee.Assign_Status !== "0") ? assignedMachineIds : [];

//                                 var employeeRowHtml =
//                                     "<tr id='EmployeeRow_" + i + "' data-machine-id='" + selectedMachineIds.join(',') + "'>" +
//                                     "<td>" + Employee.EmpNo + "</td>" +
//                                     "<td>" + Employee.FirstName + "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control Machine_Id form-control-sm' multiple id='Machine_Id_" + i + "'>" +
//                                     allMachineOptions +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control Frame_Method form-control-sm' id='Frame_Method_" + i + "'>" +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control Frames form-control-sm' multiple id='Frames_" + i + "'>" +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<select class='custom-select2 form-control WorkType form-control-sm' id='WorkType_" + i + "'>" +
//                                     workTypeOptions +
//                                     "</select>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<input type='text' class='form-control Description form-control-sm' style='width: 150px;' id='Description_" + i + "' value=''>" +
//                                     "</td>" +
//                                     "<td>" +
//                                     "<button type='button' class='btn btn-success btn-sm Allocation form-control-sm' id='Allocation_" + i + "'>Assign</button> &nbsp" +
//                                     "<button type='button' class='btn btn-warning btn-sm Edit_Allocation form-control-sm' id='Edit_Allocation_" + i + "'>Edit</button>" +
//                                     "</td>" +
//                                     "</tr>";

//                                 $("#Allocation_Table tbody").append(employeeRowHtml);

//                                 $("#Edit_Allocation_" + i).hide();

//                                 if (selectedMachineIds.length > 0) {
//                                     var selectedMachineOptions = "";
//                                     selectedMachineIds.forEach(function (machineId) {
//                                         selectedMachineOptions += "<option value='" + machineId + "' selected>" + machineId + "</option>";
//                                     });

//                                     var allMachineOptionsWithSelected = selectedMachineOptions + allMachineOptions;
//                                     $("#Machine_Id_" + i).html(allMachineOptionsWithSelected);
//                                     $("#Edit_Allocation_" + i).show();
//                                 }

//                                 var frameOptions = '';
//                                 assignedMachineIds.forEach(function (machineId) {
//                                     var framesForEmployee = Employee_Data.filter(function (emp) {
//                                         return emp.EmpNo == Employee.EmpNo && emp.Machine_Id == machineId && emp.Frame && emp.Frame !== '-';
//                                     }).map(function (emp) {
//                                         return emp.Frame;
//                                     });

//                                     framesForEmployee.forEach(function (frame) {
//                                         if (!frameOptions.includes(frame)) {
//                                             frameOptions += "<option value='" + frame + "' selected>" + frame + "</option>";
//                                         }
//                                     });
//                                 });

//                                 if (!frameOptions) {
//                                     frameOptions = "<option value=''>Select Frame</option>";
//                                 }
//                                 $("#Frames_" + i).html(frameOptions);

//                                 var frameOptionsType = '';
//                                 if (Employee.FrameType && Employee.FrameType !== '-') {
//                                     frameOptionsType = "<option value='" + Employee.FrameType + "' selected>" + Employee.FrameType + "</option>";
//                                 }

//                                 if (frameOptionsType) {
//                                     $("#Frame_Method_" + i).html(frameOptionsType);
//                                 }

//                                 var Work_Type = '';
//                                 if (Employee.Work_Type) {
//                                     Work_Type = "<option value='" + Employee.Work_Type + "' selected>" + Employee.Work_Type + "</option>";
//                                 }
//                                 $("#WorkType_" + i).html(Work_Type);

//                                 if (Employee.Description) {
//                                     $("#Description_" + i).val(Employee.Description);
//                                 }
//                             });

//                             $("#Allocation_Table tbody .custom-select2").select2({
//                                 placeholder: "",
//                                 allowClear: true,
//                                 width: '140px',
//                                 dropdownCssClass: 'custom-select2-dropdown',
//                                 containerCssClass: 'custom-select2-container'
//                             });

//                             // Display success message after both AJAX requests are completed
//                             swal({
//                                 type: 'success',
//                                 title: 'Allocation Edit Finished!',
//                                 html: 'Updated: ' + result.value
//                             });

//                         },
//                         error: function (error) {
//                             console.log(error);
//                             swal({
//                                 title: "Error!",
//                                 text: "Error sending allocation data.",
//                                 icon: "error",
//                                 buttons: true,
//                                 className: "swal",
//                             }).then((value) => { });
//                         }
//                     });

//                 } else {
//                     swal({
//                         type: 'warning',
//                         title: 'Warning',
//                         text: 'Allocation Edit Failed! Please edit correctly.'
//                     });
//                 }
//             },
//             error: function (xhr, status, error) {
//                 console.error("Error in first AJAX request:", status, error);
//                 swal({
//                     type: 'warning',
//                     title: 'Warning',
//                     text: 'Allocation Edit Failed! Edit correctly.'
//                 });
//             }
//         });

//     }).catch(function (error) {
//         swal({
//             type: 'warning',
//             title: 'Warning',
//             text: error
//         });
//     });
// });

















})










