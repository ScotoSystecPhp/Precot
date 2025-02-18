$(document).ready(function () {

    var currentDate = new Date().toISOString().split("T")[0];
    $("#Date").val(currentDate);

    //Default Hide Sections
    $("#Allocation_Table_Container").hide();


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


            $.ajax({
                url: baseurl + 'Work/Shift_Employee_List',
                type: 'POST',
                data: {
                    Date: $("#Date").val(),
                    Shift: $("#Shift").val(),
                    Type: $("#Type").val(),
                },
                success: function (response) {
                    const Response_Data = JSON.parse(response);
                    const Shift_Employee_List = Response_Data.Shift_Employee_List;
                    const User_Department = Response_Data.User_Department;

                    $("#Allocation_Table_Container").show();
                    $("#Allocation_Table tbody").empty();

                    let groupedByWages = {};
                    $.each(Shift_Employee_List, function (index, item) {
                        const wage = item.Wages || 'NULL';
                        if (!groupedByWages[wage]) {
                            groupedByWages[wage] = [];
                        }
                        groupedByWages[wage].push(item);
                    });

                    let wageGroups = Object.keys(groupedByWages);
                    if (wageGroups.indexOf('A2') > -1) {
                        wageGroups = ['A2'].concat(wageGroups.filter(wage => wage !== 'A2'));
                    }

                    let continuousIndex = 1;
                    $.each(wageGroups, function (index, wage) {
                        const wageRow = `<tr><td colspan="10" class="wage-group"><strong>Wage Group: ${wage}</strong></td></tr>`;
                        $("#Allocation_Table tbody").append(wageRow);

                        $.each(groupedByWages[wage], function (index, item) {
                            let departmentOptions = '';
                            const selectedDepartment = item.Department || User_Department[0].Department;
                            $.each(User_Department, function (deptIndex, deptItem) {
                                departmentOptions += `<option value="${deptItem.Department}" ${deptItem.Department === selectedDepartment ? 'selected' : ''}>${deptItem.Department}</option>`;
                            });

                            const allMachineOptions = "<option value=''></option>";
                            const frameMethodOptions = "<option value=''></option><option value='All'>All</option><option value='Partial'>Partial</option>";
                            const workAreaOption = `<option value="${item.WorkArea}" selected>${item.WorkArea}</option>`;
                            const jobCardOption = `<option value="${item.Job_Card_No}" selected>${item.Job_Card_No}</option>`;

                            let machineOptions = allMachineOptions;
                            if (item.Machine_Id !== '-') {
                                machineOptions = `<option value="${item.Machine_Id}" selected>${item.Machine_Id}</option>`;
                            }

                            let frameOptions = '';
                            if (item.Frame !== '-') {
                                frameOptions = `<option value="${item.Frame}" selected>${item.Frame}</option>`;
                            }

                            let frameTypeOptions = frameMethodOptions;
                            if (item.FrameType !== '-') {
                                frameTypeOptions = `<option value="${item.FrameType}" selected>${item.FrameType}</option>`;
                            }

                            const description = item.Description || '';

                            // Determine the background color based on WorkType or Machine
                            let rowBackgroundColor = '';
                            if (item.Work_Type == 'Machine' || item.Work_Type == 'Others') {
                                rowBackgroundColor = 'background-color: #A7FEA5;';
                            } else if (item.Work_Type == 'NoWork') {
                                rowBackgroundColor = 'background-color: #FFE992;';
                            }

                            // Apply background color to specific columns (S.No to Description)
                            const row = `<tr>
                            <td style="${rowBackgroundColor}">${continuousIndex}</td>
                            <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Department form-control-sm' id='Department${continuousIndex}'>${departmentOptions}</select></td>
                            <td style="${rowBackgroundColor}"><select class='custom-select2 form-control WorkArea form-control-sm' id='WorkArea${continuousIndex}'>${workAreaOption}</select></td>
                            <td style="${rowBackgroundColor}"><select class='custom-select2 form-control JobCardNo form-control-sm' id='JobCardNo${continuousIndex}'>${jobCardOption}</select></td>
                            <td style="${rowBackgroundColor}" class="Employee_Id" value="${item.EmpNo}">${item.EmpNo}</td>
                            <td style="${rowBackgroundColor}">${item.FirstName}</td>
                            <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Machine_Id form-control-sm' multiple="multiple" id='Machine_Id${continuousIndex}'>${machineOptions}</select></td>
                            <td style="${rowBackgroundColor}"><select class='custom-select2 form-control FrameType form-control-sm' id='FrameType${continuousIndex}'>${frameTypeOptions}</select></td>
                            <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Frame form-control-sm' multiple="multiple" id='Frame${continuousIndex}'>${frameOptions}</select></td>
                            <td style="${rowBackgroundColor}"><input type="text" class='form-control Description form-control-sm' id='Description${continuousIndex}' value="${description}"></td>
                            <td><button type="button" class='button btn-info Assign-btn form-control-sm' id='Assign-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Assign</button>
                            <button type="button" class='button btn-warning Edit-btn form-control-sm' id='Edit-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Edit</button>
                            </td>
                        </tr>`;

                            $("#Allocation_Table tbody").append(row);
                            continuousIndex++;
                        });
                    });



                    $("#Allocation_Table tbody tr").each(function () {
                        const $row = $(this);
                        const Department = $row.find(".Department").val();
                        const WorkArea = $row.find(".WorkArea").val();
                        const JobCardNo = $row.find(".JobCardNo").val();
                        const Date = $("#Date").val();
                        const Shift = $("#Shift").val();

                        $.ajax({
                            url: baseurl + 'Work/Work_Type',
                            method: 'POST',
                            data: { Department, WorkArea, JobCardNo, Date, Shift },
                            success: function (response) {
                                const Response_Data = JSON.parse(response);
                                const Work_Type = Response_Data.Work_Type;
                                const machineSelect = $row.find(".Machine_Id");
                                const frameSelect = $row.find(".Frame");
                                const frameTypeSelect = $row.find(".FrameType");

                                // Clear previous machine options to avoid duplicates
                                // machineSelect.empty();
                                machineSelect.append("<option value=''></option>");

                                if (Work_Type) {
                                    $.each(Work_Type, function (index, work) {
                                        if (work.Machine_Id !== '-') {
                                            machineSelect.append(`<option value="${work.Machine_Id}">${work.Machine_Id}</option>`);
                                        }
                                    });
                                }

                                machineSelect.append("<option value=''></option>");
                                machineSelect.append("<option value='Others'>Others</option>");
                                machineSelect.append("<option value='NoWork'>NoWork</option>");
                                machineSelect.append("<option value='Multiple Trainee'>Multiple Trainee</option>");

                                const machineId = machineSelect.val();

                                // Pre-select Machine_Id from Shift_Employee_List
                                if (machineId !== '-') {
                                    $.each(Shift_Employee_List, function (index, item) {
                                        if (item.Machine_Id == machineId) {
                                            if (item.Machine_Id && !machineSelect.find(`option[value="${item.Machine_Id}"]`).prop("selected")) {
                                                machineSelect.val(item.Machine_Id).trigger('change');
                                            }

                                            // Prevent duplicate frame options
                                            if (item.Frame !== '-' && !frameSelect.find(`option[value="${item.Frame}"]`).length) {
                                                frameSelect.append(`<option value="${item.Frame}" selected>${item.Frame}</option>`);
                                            }

                                            // Prevent duplicate frameType options
                                            if (item.FrameType !== '-' && !frameTypeSelect.find(`option[value="${item.FrameType}"]`).length) {
                                                frameTypeSelect.append(`<option value="${item.FrameType}" selected>${item.FrameType}</option>`);
                                            }
                                        }
                                    });
                                }

                                frameTypeSelect.val(''); // Clear the selected FrameType if necessary
                            }
                        });
                    });


                    let selectedMachineIds = [];
                    $("#Allocation_Table tbody").on("change", ".Machine_Id", function () {

                        const $row = $(this).closest("tr");
                        const selectedMachine = $(this).val();
                        const machineSelect = $row.find(".Machine_Id");
                        const FrameType = $row.find(".FrameType");
                        const Frame = $row.find(".Frame");
                        const Description = $row.find(".Description");

                        if (selectedMachine && !selectedMachineIds.includes(selectedMachine)) {
                            selectedMachineIds.push(selectedMachine);
                        }

                        FrameType.empty();
                        FrameType.append("<option value=''></option>");
                        FrameType.append("<option value='All'>All</option>");
                        FrameType.append("<option value='Partial'>Partial</option>");

                        // Loop through and disable options based on selected machines
                        $("#Allocation_Table tbody .Machine_Id").each(function () {
                            const currentMachineId = $(this).val();

                            if (selectedMachineIds.includes(currentMachineId) && currentMachineId !== selectedMachine) {
                                $(this).find(`option[value="${currentMachineId}"]`).prop('disabled', true);
                            } else {
                                $(this).find(`option[value="${currentMachineId}"]`).prop('disabled', false);
                            }
                        });

                        // Handle behavior for "Others" and "NoWork"
                        if (selectedMachine == "Others") {
                            // If 'Others' is selected, disable FrameType and Frame, but not Description
                            FrameType.prop('disabled', true).val('');
                            Frame.prop('disabled', true).empty();
                        } else if (selectedMachine == "NoWork") {
                            // If 'NoWork' is selected, disable FrameType, Frame, and Description
                            FrameType.prop('disabled', true).val('');
                            Frame.prop('disabled', true).empty();
                            Description.prop('disabled', true).val('');
                        } else {
                            // Enable FrameType if the selectedMachine is not "Others" or "NoWork"
                            FrameType.prop('disabled', false);
                            Frame.prop('disabled', false);
                            Description.prop('disabled', true);
                        }
                    });


                    $("#Allocation_Table tbody").on("change", ".FrameType", function () {

                        const $row = $(this).closest("tr");
                        const frameSelect = $row.find(".Frame");
                        const selectedFrameMethod = $(this).val();
                        const machineSelect = $row.find(".Machine_Id");
                        const Department = $row.find(".Department").val();
                        const JobCardNo = $row.find(".JobCardNo").val();
                        const WorkArea = $row.find(".WorkArea").val();
                        const Date = $("#Date").val();
                        const Shift = $("#Shift").val();

                        frameSelect.empty();

                        if (selectedFrameMethod === 'All') {
                            $.ajax({
                                url: baseurl + 'Work/Frame',
                                method: 'POST',
                                data: { Department, WorkArea, JobCardNo, Machine_Id: machineSelect.val(), Date, Shift },
                                success: function (response) {
                                    const Response_Data = JSON.parse(response);
                                    const Frame = Response_Data.Frame;

                                    if (Frame && Frame.length) {
                                        $.each(Frame, function (index, frame) {
                                            frameSelect.append(`<option value="${frame.Frame}" selected>${frame.Frame}</option>`);
                                        });
                                    }

                                }
                            });
                        } else if (selectedFrameMethod === 'Partial') {
                            frameSelect.append("<option value='Partial' selected>Partial</option>");
                        }
                    });




                    $("#Allocation_Table tbody").on("change", ".Department", function () {
                        const $row = $(this).closest("tr");
                        const department = $(this).val();
                        const workAreaSelect = $row.find(".WorkArea");
                        const jobCardSelect = $row.find(".JobCardNo");
                        const machineSelect = $row.find(".Machine_Id");
                        const frameSelect = $row.find(".Frame");

                        $.ajax({
                            url: baseurl + 'Work/Work_Areas',
                            method: 'POST',
                            data: { Department: department },
                            success: function (response) {
                                const Response_Data = JSON.parse(response);
                                const Work_Areas = Response_Data.Work_Areas;

                                workAreaSelect.empty();
                                $.each(Work_Areas, function (index, workArea) {
                                    workAreaSelect.append(`<option value="${workArea.WorkArea}">${workArea.WorkArea}</option>`);
                                });

                                const workArea = workAreaSelect.val();
                                $.ajax({
                                    url: baseurl + 'Work/Job_Card_Nos',
                                    method: 'POST',
                                    data: { Department: department, WorkArea: workArea },
                                    success: function (response) {
                                        const Response_Data = JSON.parse(response);
                                        const Job_Card_Nos = Response_Data.Job_Card_Nos;

                                        jobCardSelect.empty();
                                        machineSelect.empty();
                                        frameSelect.empty();
                                        machineSelect.append("<option value='Others'>Others</option>");
                                        machineSelect.append("<option value='NoWork'>NoWork</option>");

                                        $.each(Job_Card_Nos, function (index, work) {
                                            jobCardSelect.append(`<option value="${work.JobCard_No}">${work.JobCard_No}</option>`);
                                        });
                                        jobCardSelect.trigger('change');

                                        const Date = $("#Date").val();
                                        const Shift = $("#Shift").val();

                                        const JobCardNo = jobCardSelect.val();
                                        $.ajax({
                                            url: baseurl + 'Work/Work_Type',
                                            method: 'POST',
                                            data: { Date, Shift, Department: department, WorkArea: workArea, JobCardNo: JobCardNo },
                                            success: function (response) {
                                                const Response_Data = JSON.parse(response);
                                                const Work_Type = Response_Data.Work_Type;
                                                const machineSelect = $row.find(".Machine_Id");
                                                const frameSelect = $row.find(".Frame");
                                                const frameMethodSelect = $row.find(".FrameType");

                                                machineSelect.empty();
                                                frameSelect.empty();
                                                machineSelect.append("<option value=''></option>");

                                                if (Work_Type) {
                                                    $.each(Work_Type, function (index, work) {
                                                        machineSelect.append(`<option value="${work.Machine_Id}">${work.Machine_Id}</option>`);
                                                    });
                                                }

                                                machineSelect.append("<option value=''></option>");
                                                machineSelect.append("<option value='Others'>Others</option>");
                                                machineSelect.append("<option value='NoWork'>NoWork</option>");
                                                machineSelect.append("<option value='Multiple Trainee'>Multiple Trainee</option>");


                                                frameMethodSelect.val('');
                                                frameMethodSelect.change(function () {
                                                    const selectedFrameMethod = $(this).val();
                                                    frameSelect.find('option').prop('selected', selectedFrameMethod === 'All');
                                                    if (selectedFrameMethod === 'Partial') {
                                                        frameSelect.find('option').prop('selected', false);
                                                        frameSelect.find('option:first').prop('selected', true);
                                                    }
                                                });

                                                frameMethodSelect.trigger('change');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });

                    $("#Allocation_Table tbody").on("change", ".WorkArea", function () {

                        const $row = $(this).closest("tr");
                        const department = $row.find(".Department").val();
                        const workArea = $(this).val();
                        const jobCardSelect = $row.find(".JobCardNo");
                        const machineSelect = $row.find(".Machine_Id");
                        const frameSelect = $row.find(".Frame");

                        $.ajax({
                            url: baseurl + 'Work/Job_Card_Nos',
                            method: 'POST',
                            data: { Department: department, WorkArea: workArea },
                            success: function (response) {
                                const Response_Data = JSON.parse(response);
                                const Job_Card_Nos = Response_Data.Job_Card_Nos;

                                jobCardSelect.empty();
                                machineSelect.empty();
                                frameSelect.empty();
                                machineSelect.append("<option value='Others'>Others</option>");
                                machineSelect.append("<option value='NoWork'>NoWork</option>");
                                machineSelect.append("<option value='Multiple Trainee'>Multiple Trainee</option>");


                                $.each(Job_Card_Nos, function (index, work) {
                                    jobCardSelect.append(`<option value="${work.JobCard_No}">${work.JobCard_No}</option>`);
                                });
                                jobCardSelect.trigger('change');

                                const JobCardNo = jobCardSelect.val();
                                const Date = $("#Date").val();
                                const Shift = $("#Shift").val();

                                $.ajax({
                                    url: baseurl + 'Work/Work_Type',
                                    method: 'POST',
                                    data: { Date, Shift, Department: department, WorkArea: workArea, JobCardNo: JobCardNo },
                                    success: function (response) {
                                        const Response_Data = JSON.parse(response);
                                        const Work_Type = Response_Data.Work_Type;
                                        const machineSelect = $row.find(".Machine_Id");
                                        const frameSelect = $row.find(".Frame");
                                        const frameMethodSelect = $row.find(".FrameType");

                                        machineSelect.empty();
                                        frameSelect.empty();
                                        machineSelect.append("<option value=''></option>");


                                        frameMethodSelect.empty();
                                        frameMethodSelect.append("<option value=''></option>");
                                        frameMethodSelect.append("<option value='All'>All</option>");
                                        frameMethodSelect.append("<option value='Partial'>Partial</option>");

                                        if (Work_Type) {
                                            $.each(Work_Type, function (index, work) {
                                                machineSelect.append(`<option value="${work.Machine_Id}">${work.Machine_Id}</option>`);
                                            });
                                        }

                                        machineSelect.append("<option value=''></option>");
                                        machineSelect.append("<option value='Others'>Others</option>");
                                        machineSelect.append("<option value='NoWork'>NoWork</option>");
                                        machineSelect.append("<option value='Multiple Trainee'>Multiple Trainee</option>");


                                        frameMethodSelect.val('');
                                        frameMethodSelect.change(function () {
                                            const selectedFrameMethod = $(this).val();
                                            frameSelect.find('option').prop('selected', selectedFrameMethod === 'All');
                                            if (selectedFrameMethod === 'Partial') {
                                                frameSelect.find('option').prop('selected', false);
                                                frameSelect.find('option:first').prop('selected', true);
                                            }
                                        });

                                        frameMethodSelect.trigger('change');
                                    }
                                });
                            }
                        });
                    });

                    $("#Allocation_Table tbody").on("click", ".Assign-btn", function () {

                        const $row = $(this).closest("tr");
                        const Frames = $row.find(".Frame").val();
                        const FrameType = $row.find(".FrameType").val();
                        const Machine_Id = $row.find(".Machine_Id").val();  // Get the value of Machine_Id (not the jQuery object)
                        const Department = $row.find(".Department").val();
                        const JobCardNo = $row.find(".JobCardNo").val();
                        const WorkArea = $row.find(".WorkArea").val();
                        const Date = $("#Date").val();
                        const Shift = $("#Shift").val();
                        const Description = $(".Description").val();
                        const EmployeeId = $row.find(".Employee_Id").text();
                        const Allocation_Type = $("#Type").val();

                        var allocationData = {
                            Date: Date,
                            Department: Department,
                            Shift: Shift,
                            Work_Area: WorkArea,
                            JobCardNo: JobCardNo,
                            EmployeeId: EmployeeId,
                            Machine_Id: Machine_Id, // Just the value
                            FrameType: FrameType,  // Just the value
                            Frames: Frames, // Just the value
                            Description: Description,
                            Allocation_Type: Allocation_Type
                        };

                        var Row_Data = {
                            Allocations: [allocationData]
                        };

                        $.ajax({
                            url: baseurl + 'Work/Save',
                            method: 'POST',
                            data: JSON.stringify(Row_Data), Date, Shift, Allocation_Type,
                            contentType: 'application/json',
                            success: function (response) {


                                const Response_Data = JSON.parse(response);
                                const Shift_Employee_List = Response_Data.Shift_Employee_List;
                                const User_Department = Response_Data.User_Department;

                                $("#Allocation_Table_Container").show();
                                $("#Allocation_Table tbody").empty();

                                let groupedByWages = {};
                                $.each(Shift_Employee_List, function (index, item) {
                                    const wage = item.Wages || 'NULL';
                                    if (!groupedByWages[wage]) {
                                        groupedByWages[wage] = [];
                                    }
                                    groupedByWages[wage].push(item);
                                });

                                let wageGroups = Object.keys(groupedByWages);
                                if (wageGroups.indexOf('A2') > -1) {
                                    wageGroups = ['A2'].concat(wageGroups.filter(wage => wage !== 'A2'));
                                }

                                let continuousIndex = 1;
                                $.each(wageGroups, function (index, wage) {
                                    const wageRow = `<tr><td colspan="10" class="wage-group"><strong>Wage Group: ${wage}</strong></td></tr>`;
                                    $("#Allocation_Table tbody").append(wageRow);

                                    $.each(groupedByWages[wage], function (index, item) {
                                        let departmentOptions = '';
                                        const selectedDepartment = item.Department || User_Department[0].Department;
                                        $.each(User_Department, function (deptIndex, deptItem) {
                                            departmentOptions += `<option value="${deptItem.Department}" ${deptItem.Department === selectedDepartment ? 'selected' : ''}>${deptItem.Department}</option>`;
                                        });

                                        const allMachineOptions = "<option value=''></option>";
                                        const frameMethodOptions = "<option value=''></option><option value='All'>All</option><option value='Partial'>Partial</option>";
                                        const workAreaOption = `<option value="${item.WorkArea}" selected>${item.WorkArea}</option>`;
                                        const jobCardOption = `<option value="${item.Job_Card_No}" selected>${item.Job_Card_No}</option>`;

                                        let machineOptions = allMachineOptions;
                                        if (item.Machine_Id !== '-') {
                                            machineOptions = `<option value="${item.Machine_Id}" selected>${item.Machine_Id}</option>`;
                                        }

                                        let frameOptions = '';
                                        if (item.Frame !== '-') {
                                            frameOptions = `<option value="${item.Frame}" selected>${item.Frame}</option>`;
                                        }

                                        let frameTypeOptions = frameMethodOptions;
                                        if (item.FrameType !== '-') {
                                            frameTypeOptions = `<option value="${item.FrameType}" selected>${item.FrameType}</option>`;
                                        }

                                        const description = item.Description || '';

                                        // Determine the background color based on WorkType or Machine
                                        let rowBackgroundColor = '';
                                        if (item.Work_Type == 'Machine' || item.Work_Type == 'Others') {
                                            rowBackgroundColor = 'background-color: #A7FEA5;';
                                        } else if (item.Work_Type == 'NoWork') {
                                            rowBackgroundColor = 'background-color: #FFE992;';
                                        }

                                        // Apply background color to specific columns (S.No to Description)
                                        const row = `<tr>
                                        <td style="${rowBackgroundColor}">${continuousIndex}</td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Department form-control-sm' id='Department${continuousIndex}'>${departmentOptions}</select></td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control WorkArea form-control-sm' id='WorkArea${continuousIndex}'>${workAreaOption}</select></td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control JobCardNo form-control-sm' id='JobCardNo${continuousIndex}'>${jobCardOption}</select></td>
                                        <td style="${rowBackgroundColor}" class="Employee_Id" value="${item.EmpNo}">${item.EmpNo}</td>
                                        <td style="${rowBackgroundColor}">${item.FirstName}</td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Machine_Id form-control-sm' multiple="multiple" id='Machine_Id${continuousIndex}'>${machineOptions}</select></td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control FrameType form-control-sm' id='FrameType${continuousIndex}'>${frameTypeOptions}</select></td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Frame form-control-sm' multiple="multiple" id='Frame${continuousIndex}'>${frameOptions}</select></td>
                                        <td style="${rowBackgroundColor}"><input type="text" class='form-control Description form-control-sm' id='Description${continuousIndex}' value="${description}"></td>
                                        <td><button type="button" class='button btn-info Assign-btn form-control-sm' id='Assign-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Assign</button>
                                        <button type="button" class='button btn-warning Edit-btn form-control-sm' id='Edit-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Edit</button>
                                        </td>
                                    </tr>`;

                                        $("#Allocation_Table tbody").append(row);
                                        continuousIndex++;
                                    });
                                });



                                $("#Allocation_Table tbody tr").each(function () {
                                    const $row = $(this);
                                    const Department = $row.find(".Department").val();
                                    const WorkArea = $row.find(".WorkArea").val();
                                    const JobCardNo = $row.find(".JobCardNo").val();
                                    const Date = $("#Date").val();
                                    const Shift = $("#Shift").val();

                                    $.ajax({
                                        url: baseurl + 'Work/Work_Type',
                                        method: 'POST',
                                        data: { Department, WorkArea, JobCardNo, Date, Shift },
                                        success: function (response) {
                                            const Response_Data = JSON.parse(response);
                                            const Work_Type = Response_Data.Work_Type;
                                            const machineSelect = $row.find(".Machine_Id");
                                            const frameSelect = $row.find(".Frame");
                                            const frameTypeSelect = $row.find(".FrameType");

                                            // Clear previous machine options to avoid duplicates
                                            // machineSelect.empty();
                                            machineSelect.append("<option value=''></option>");

                                            if (Work_Type) {
                                                $.each(Work_Type, function (index, work) {
                                                    if (work.Machine_Id !== '-') {
                                                        machineSelect.append(`<option value="${work.Machine_Id}">${work.Machine_Id}</option>`);
                                                    }
                                                });
                                            }

                                            machineSelect.append("<option value=''></option>");
                                            machineSelect.append("<option value='Others'>Others</option>");
                                            machineSelect.append("<option value='NoWork'>NoWork</option>");
                                            machineSelect.append("<option value='Multiple Trainee'>Multiple Trainee</option>");


                                            const machineId = machineSelect.val();

                                            // Pre-select Machine_Id from Shift_Employee_List
                                            if (machineId !== '-') {
                                                $.each(Shift_Employee_List, function (index, item) {
                                                    if (item.Machine_Id == machineId) {
                                                        if (item.Machine_Id && !machineSelect.find(`option[value="${item.Machine_Id}"]`).prop("selected")) {
                                                            machineSelect.val(item.Machine_Id).trigger('change');
                                                        }

                                                        // Prevent duplicate frame options
                                                        if (item.Frame !== '-' && !frameSelect.find(`option[value="${item.Frame}"]`).length) {
                                                            frameSelect.append(`<option value="${item.Frame}" selected>${item.Frame}</option>`);
                                                        }

                                                        // Prevent duplicate frameType options
                                                        if (item.FrameType !== '-' && !frameTypeSelect.find(`option[value="${item.FrameType}"]`).length) {
                                                            frameTypeSelect.append(`<option value="${item.FrameType}" selected>${item.FrameType}</option>`);
                                                        }
                                                    }
                                                });
                                            }

                                            frameTypeSelect.val(''); // Clear the selected FrameType if necessary
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


                            }
                        })


                    });



                    $("#Allocation_Table tbody").on("click", ".Edit-btn", function () {

                        const $row = $(this).closest("tr");
                        const Frames = $row.find(".Frame").val();
                        const FrameType = $row.find(".FrameType").val();
                        const Machine_Id = $row.find(".Machine_Id").val();  // Get the value of Machine_Id (not the jQuery object)
                        const Department = $row.find(".Department").val();
                        const JobCardNo = $row.find(".JobCardNo").val();
                        const WorkArea = $row.find(".WorkArea").val();
                        const Date = $("#Date").val();
                        const Shift = $("#Shift").val();
                        const Description = $(".Description").val();
                        const EmployeeId = $row.find(".Employee_Id").text();
                        const Allocation_Type = $("#Type").val();

                        var allocationData = {
                            Date: Date,
                            Department: Department,
                            Shift: Shift,
                            Work_Area: WorkArea,
                            JobCardNo: JobCardNo,
                            EmployeeId: EmployeeId,
                            Machine_Id: Machine_Id, // Just the value
                            FrameType: FrameType,  // Just the value
                            Frames: Frames, // Just the value
                            Description: Description,
                            Allocation_Type: Allocation_Type
                        };

                        var Row_Data = {
                            Allocations: [allocationData]
                        };

                        $.ajax({
                            url: baseurl + 'Work/Edit',
                            method: 'POST',
                            data: JSON.stringify(Row_Data), Date, Shift, Allocation_Type,
                            contentType: 'application/json',
                            success: function (response) {


                                const Response_Data = JSON.parse(response);
                                const Shift_Employee_List = Response_Data.Shift_Employee_List;
                                const User_Department = Response_Data.User_Department;

                                $("#Allocation_Table_Container").show();
                                $("#Allocation_Table tbody").empty();

                                let groupedByWages = {};
                                $.each(Shift_Employee_List, function (index, item) {
                                    const wage = item.Wages || 'NULL';
                                    if (!groupedByWages[wage]) {
                                        groupedByWages[wage] = [];
                                    }
                                    groupedByWages[wage].push(item);
                                });

                                let wageGroups = Object.keys(groupedByWages);
                                if (wageGroups.indexOf('A2') > -1) {
                                    wageGroups = ['A2'].concat(wageGroups.filter(wage => wage !== 'A2'));
                                }

                                let continuousIndex = 1;
                                $.each(wageGroups, function (index, wage) {
                                    const wageRow = `<tr><td colspan="10" class="wage-group"><strong>Wage Group: ${wage}</strong></td></tr>`;
                                    $("#Allocation_Table tbody").append(wageRow);

                                    $.each(groupedByWages[wage], function (index, item) {
                                        let departmentOptions = '';
                                        const selectedDepartment = item.Department || User_Department[0].Department;
                                        $.each(User_Department, function (deptIndex, deptItem) {
                                            departmentOptions += `<option value="${deptItem.Department}" ${deptItem.Department === selectedDepartment ? 'selected' : ''}>${deptItem.Department}</option>`;
                                        });

                                        const allMachineOptions = "<option value=''></option>";
                                        const frameMethodOptions = "<option value=''></option><option value='All'>All</option><option value='Partial'>Partial</option>";
                                        const workAreaOption = `<option value="${item.WorkArea}" selected>${item.WorkArea}</option>`;
                                        const jobCardOption = `<option value="${item.Job_Card_No}" selected>${item.Job_Card_No}</option>`;

                                        let machineOptions = allMachineOptions;
                                        if (item.Machine_Id !== '-') {
                                            machineOptions = `<option value="${item.Machine_Id}" selected>${item.Machine_Id}</option>`;
                                        }

                                        let frameOptions = '';
                                        if (item.Frame !== '-') {
                                            frameOptions = `<option value="${item.Frame}" selected>${item.Frame}</option>`;
                                        }

                                        let frameTypeOptions = frameMethodOptions;
                                        if (item.FrameType !== '-') {
                                            frameTypeOptions = `<option value="${item.FrameType}" selected>${item.FrameType}</option>`;
                                        }

                                        const description = item.Description || '';

                                        // Determine the background color based on WorkType or Machine
                                        let rowBackgroundColor = '';
                                        if (item.Work_Type == 'Machine' || item.Work_Type == 'Others') {
                                            rowBackgroundColor = 'background-color: #A7FEA5;';
                                        } else if (item.Work_Type == 'NoWork') {
                                            rowBackgroundColor = 'background-color: #FFE992;';
                                        }

                                        // Apply background color to specific columns (S.No to Description)
                                        const row = `<tr>
                                        <td style="${rowBackgroundColor}">${continuousIndex}</td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Department form-control-sm' id='Department${continuousIndex}'>${departmentOptions}</select></td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control WorkArea form-control-sm' id='WorkArea${continuousIndex}'>${workAreaOption}</select></td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control JobCardNo form-control-sm' id='JobCardNo${continuousIndex}'>${jobCardOption}</select></td>
                                        <td style="${rowBackgroundColor}" class="Employee_Id" value="${item.EmpNo}">${item.EmpNo}</td>
                                        <td style="${rowBackgroundColor}">${item.FirstName}</td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Machine_Id form-control-sm' multiple="multiple" id='Machine_Id${continuousIndex}'>${machineOptions}</select></td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control FrameType form-control-sm' id='FrameType${continuousIndex}'>${frameTypeOptions}</select></td>
                                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Frame form-control-sm' multiple="multiple" id='Frame${continuousIndex}'>${frameOptions}</select></td>
                                        <td style="${rowBackgroundColor}"><input type="text" class='form-control Description form-control-sm' id='Description${continuousIndex}' value="${description}"></td>
                                        <td><button type="button" class='button btn-info Assign-btn form-control-sm' id='Assign-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Assign</button>
                                        <button type="button" class='button btn-warning Edit-btn form-control-sm' id='Edit-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Edit</button>
                                        </td>
                                    </tr>`;

                                        $("#Allocation_Table tbody").append(row);
                                        continuousIndex++;
                                    });
                                });



                                $("#Allocation_Table tbody tr").each(function () {
                                    const $row = $(this);
                                    const Department = $row.find(".Department").val();
                                    const WorkArea = $row.find(".WorkArea").val();
                                    const JobCardNo = $row.find(".JobCardNo").val();
                                    const Date = $("#Date").val();
                                    const Shift = $("#Shift").val();

                                    $.ajax({
                                        url: baseurl + 'Work/Work_Type',
                                        method: 'POST',
                                        data: { Department, WorkArea, JobCardNo, Date, Shift },
                                        success: function (response) {
                                            const Response_Data = JSON.parse(response);
                                            const Work_Type = Response_Data.Work_Type;
                                            const machineSelect = $row.find(".Machine_Id");
                                            const frameSelect = $row.find(".Frame");
                                            const frameTypeSelect = $row.find(".FrameType");

                                            // Clear previous machine options to avoid duplicates
                                            // machineSelect.empty();
                                            machineSelect.append("<option value=''></option>");

                                            if (Work_Type) {
                                                $.each(Work_Type, function (index, work) {
                                                    if (work.Machine_Id !== '-') {
                                                        machineSelect.append(`<option value="${work.Machine_Id}">${work.Machine_Id}</option>`);
                                                    }
                                                });
                                            }

                                            machineSelect.append("<option value=''></option>");
                                            machineSelect.append("<option value='Others'>Others</option>");
                                            machineSelect.append("<option value='NoWork'>NoWork</option>");
                                            machineSelect.append("<option value='Multiple Trainee'>Multiple Trainee</option>");


                                            const machineId = machineSelect.val();

                                            // Pre-select Machine_Id from Shift_Employee_List
                                            if (machineId !== '-') {
                                                $.each(Shift_Employee_List, function (index, item) {
                                                    if (item.Machine_Id == machineId) {
                                                        if (item.Machine_Id && !machineSelect.find(`option[value="${item.Machine_Id}"]`).prop("selected")) {
                                                            machineSelect.val(item.Machine_Id).trigger('change');
                                                        }

                                                        // Prevent duplicate frame options
                                                        if (item.Frame !== '-' && !frameSelect.find(`option[value="${item.Frame}"]`).length) {
                                                            frameSelect.append(`<option value="${item.Frame}" selected>${item.Frame}</option>`);
                                                        }

                                                        // Prevent duplicate frameType options
                                                        if (item.FrameType !== '-' && !frameTypeSelect.find(`option[value="${item.FrameType}"]`).length) {
                                                            frameTypeSelect.append(`<option value="${item.FrameType}" selected>${item.FrameType}</option>`);
                                                        }
                                                    }
                                                });
                                            }

                                            frameTypeSelect.val(''); // Clear the selected FrameType if necessary
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


                            }
                        })


                    });


                    $("#Allocation_Table tbody .custom-select2").select2({
                        placeholder: "",
                        allowClear: true,
                        width: '140px',
                        dropdownCssClass: 'custom-select2-dropdown',
                        containerCssClass: 'custom-select2-container'
                    });
                }




            })
        },



    });



    $("#Date").on("change", function () {

        var Date = $("#Date").val();
        var Shift = $("#Shift").val();
        var Type = $("#Type").val();

        $.ajax({
            url: baseurl + 'Work/Shift_Employee_List',
            type: 'POST',
            data: {
                Date: $("#Date").val(),
                Shift: $("#Shift").val(),
                Type: $("#Type").val(),
            },
            success: function (response) {
                const Response_Data = JSON.parse(response);
                const Shift_Employee_List = Response_Data.Shift_Employee_List;
                const User_Department = Response_Data.User_Department;

                $("#Allocation_Table_Container").show();
                $("#Allocation_Table tbody").empty();

                let groupedByWages = {};
                $.each(Shift_Employee_List, function (index, item) {
                    const wage = item.Wages || 'NULL';
                    if (!groupedByWages[wage]) {
                        groupedByWages[wage] = [];
                    }
                    groupedByWages[wage].push(item);
                });

                let wageGroups = Object.keys(groupedByWages);
                if (wageGroups.indexOf('A2') > -1) {
                    wageGroups = ['A2'].concat(wageGroups.filter(wage => wage !== 'A2'));
                }

                let continuousIndex = 1;
                $.each(wageGroups, function (index, wage) {
                    const wageRow = `<tr><td colspan="10" class="wage-group"><strong>Wage Group: ${wage}</strong></td></tr>`;
                    $("#Allocation_Table tbody").append(wageRow);

                    $.each(groupedByWages[wage], function (index, item) {
                        let departmentOptions = '';
                        const selectedDepartment = item.Department || User_Department[0].Department;
                        $.each(User_Department, function (deptIndex, deptItem) {
                            departmentOptions += `<option value="${deptItem.Department}" ${deptItem.Department === selectedDepartment ? 'selected' : ''}>${deptItem.Department}</option>`;
                        });

                        const allMachineOptions = "<option value=''></option>";
                        const frameMethodOptions = "<option value=''></option><option value='All'>All</option><option value='Partial'>Partial</option>";
                        const workAreaOption = `<option value="${item.WorkArea}" selected>${item.WorkArea}</option>`;
                        const jobCardOption = `<option value="${item.Job_Card_No}" selected>${item.Job_Card_No}</option>`;

                        let machineOptions = allMachineOptions;
                        if (item.Machine_Id !== '-') {
                            machineOptions = `<option value="${item.Machine_Id}" selected>${item.Machine_Id}</option>`;
                        }

                        let frameOptions = '';
                        if (item.Frame !== '-') {
                            frameOptions = `<option value="${item.Frame}" selected>${item.Frame}</option>`;
                        }

                        let frameTypeOptions = frameMethodOptions;
                        if (item.FrameType !== '-') {
                            frameTypeOptions = `<option value="${item.FrameType}" selected>${item.FrameType}</option>`;
                        }

                        const description = item.Description || '';

                        // Determine the background color based on WorkType or Machine
                        let rowBackgroundColor = '';
                        if (item.Work_Type == 'Machine' || item.Work_Type == 'Others') {
                            rowBackgroundColor = 'background-color: #A7FEA5;';
                        } else if (item.Work_Type == 'NoWork') {
                            rowBackgroundColor = 'background-color: #FFE992;';
                        }

                        // Apply background color to specific columns (S.No to Description)
                        const row = `<tr>
                        <td style="${rowBackgroundColor}">${continuousIndex}</td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Department form-control-sm' id='Department${continuousIndex}'>${departmentOptions}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control WorkArea form-control-sm' id='WorkArea${continuousIndex}'>${workAreaOption}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control JobCardNo form-control-sm' id='JobCardNo${continuousIndex}'>${jobCardOption}</select></td>
                        <td style="${rowBackgroundColor}" class="Employee_Id" value="${item.EmpNo}">${item.EmpNo}</td>
                        <td style="${rowBackgroundColor}">${item.FirstName}</td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Machine_Id form-control-sm' multiple="multiple" id='Machine_Id${continuousIndex}'>${machineOptions}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control FrameType form-control-sm' id='FrameType${continuousIndex}'>${frameTypeOptions}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Frame form-control-sm' multiple="multiple" id='Frame${continuousIndex}'>${frameOptions}</select></td>
                        <td style="${rowBackgroundColor}"><input type="text" class='form-control Description form-control-sm' id='Description${continuousIndex}' value="${description}"></td>
                        <td><button type="button" class='button btn-info Assign-btn form-control-sm' id='Assign-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Assign</button>
                        <button type="button" class='button btn-warning Edit-btn form-control-sm' id='Edit-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Edit</button>
                        </td>
                    </tr>`;

                        $("#Allocation_Table tbody").append(row);
                        continuousIndex++;
                    });
                });



                $("#Allocation_Table tbody tr").each(function () {
                    const $row = $(this);
                    const Department = $row.find(".Department").val();
                    const WorkArea = $row.find(".WorkArea").val();
                    const JobCardNo = $row.find(".JobCardNo").val();
                    const Date = $("#Date").val();
                    const Shift = $("#Shift").val();

                    $.ajax({
                        url: baseurl + 'Work/Work_Type',
                        method: 'POST',
                        data: { Department, WorkArea, JobCardNo, Date, Shift },
                        success: function (response) {
                            const Response_Data = JSON.parse(response);
                            const Work_Type = Response_Data.Work_Type;
                            const machineSelect = $row.find(".Machine_Id");
                            const frameSelect = $row.find(".Frame");
                            const frameTypeSelect = $row.find(".FrameType");

                            // Clear previous machine options to avoid duplicates
                            // machineSelect.empty();
                            machineSelect.append("<option value=''></option>");

                            if (Work_Type) {
                                $.each(Work_Type, function (index, work) {
                                    if (work.Machine_Id !== '-') {
                                        machineSelect.append(`<option value="${work.Machine_Id}">${work.Machine_Id}</option>`);
                                    }
                                });
                            }

                            machineSelect.append("<option value=''></option>");
                            machineSelect.append("<option value='Others'>Others</option>");
                            machineSelect.append("<option value='NoWork'>NoWork</option>");
                            machineSelect.append("<option value='Multiple Trainee'>Multiple Trainee</option>");


                            const machineId = machineSelect.val();

                            // Pre-select Machine_Id from Shift_Employee_List
                            if (machineId !== '-') {
                                $.each(Shift_Employee_List, function (index, item) {
                                    if (item.Machine_Id == machineId) {
                                        if (item.Machine_Id && !machineSelect.find(`option[value="${item.Machine_Id}"]`).prop("selected")) {
                                            machineSelect.val(item.Machine_Id).trigger('change');
                                        }

                                        // Prevent duplicate frame options
                                        if (item.Frame !== '-' && !frameSelect.find(`option[value="${item.Frame}"]`).length) {
                                            frameSelect.append(`<option value="${item.Frame}" selected>${item.Frame}</option>`);
                                        }

                                        // Prevent duplicate frameType options
                                        if (item.FrameType !== '-' && !frameTypeSelect.find(`option[value="${item.FrameType}"]`).length) {
                                            frameTypeSelect.append(`<option value="${item.FrameType}" selected>${item.FrameType}</option>`);
                                        }
                                    }
                                });
                            }

                            frameTypeSelect.val(''); // Clear the selected FrameType if necessary
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
            }
        })


    });


    $("#Shift").on("change", function () {

        $.ajax({
            url: baseurl + 'Work/Shift_Employee_List',
            type: 'POST',
            data: {
                Date: $("#Date").val(),
                Shift: $("#Shift").val(),
                Type: $("#Type").val(),
            },
            success: function (response) {
                const Response_Data = JSON.parse(response);
                const Shift_Employee_List = Response_Data.Shift_Employee_List;
                const User_Department = Response_Data.User_Department;

                $("#Allocation_Table_Container").show();
                $("#Allocation_Table tbody").empty();

                let groupedByWages = {};
                $.each(Shift_Employee_List, function (index, item) {
                    const wage = item.Wages || 'NULL';
                    if (!groupedByWages[wage]) {
                        groupedByWages[wage] = [];
                    }
                    groupedByWages[wage].push(item);
                });

                let wageGroups = Object.keys(groupedByWages);
                if (wageGroups.indexOf('A2') > -1) {
                    wageGroups = ['A2'].concat(wageGroups.filter(wage => wage !== 'A2'));
                }

                let continuousIndex = 1;
                $.each(wageGroups, function (index, wage) {
                    const wageRow = `<tr><td colspan="10" class="wage-group"><strong>Wage Group: ${wage}</strong></td></tr>`;
                    $("#Allocation_Table tbody").append(wageRow);

                    $.each(groupedByWages[wage], function (index, item) {
                        let departmentOptions = '';
                        const selectedDepartment = item.Department || User_Department[0].Department;
                        $.each(User_Department, function (deptIndex, deptItem) {
                            departmentOptions += `<option value="${deptItem.Department}" ${deptItem.Department === selectedDepartment ? 'selected' : ''}>${deptItem.Department}</option>`;
                        });

                        const allMachineOptions = "<option value=''></option>";
                        const frameMethodOptions = "<option value=''></option><option value='All'>All</option><option value='Partial'>Partial</option>";
                        const workAreaOption = `<option value="${item.WorkArea}" selected>${item.WorkArea}</option>`;
                        const jobCardOption = `<option value="${item.Job_Card_No}" selected>${item.Job_Card_No}</option>`;

                        let machineOptions = allMachineOptions;
                        if (item.Machine_Id !== '-') {
                            machineOptions = `<option value="${item.Machine_Id}" selected>${item.Machine_Id}</option>`;
                        }

                        let frameOptions = '';
                        if (item.Frame !== '-') {
                            frameOptions = `<option value="${item.Frame}" selected>${item.Frame}</option>`;
                        }

                        let frameTypeOptions = frameMethodOptions;
                        if (item.FrameType !== '-') {
                            frameTypeOptions = `<option value="${item.FrameType}" selected>${item.FrameType}</option>`;
                        }

                        const description = item.Description || '';

                        // Determine the background color based on WorkType or Machine
                        let rowBackgroundColor = '';
                        if (item.Work_Type == 'Machine' || item.Work_Type == 'Others') {
                            rowBackgroundColor = 'background-color: #A7FEA5;';
                        } else if (item.Work_Type == 'NoWork') {
                            rowBackgroundColor = 'background-color: #FFE992;';
                        }

                        // Apply background color to specific columns (S.No to Description)
                        const row = `<tr>
                        <td style="${rowBackgroundColor}">${continuousIndex}</td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Department form-control-sm' id='Department${continuousIndex}'>${departmentOptions}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control WorkArea form-control-sm' id='WorkArea${continuousIndex}'>${workAreaOption}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control JobCardNo form-control-sm' id='JobCardNo${continuousIndex}'>${jobCardOption}</select></td>
                        <td style="${rowBackgroundColor}" class="Employee_Id" value="${item.EmpNo}">${item.EmpNo}</td>
                        <td style="${rowBackgroundColor}">${item.FirstName}</td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Machine_Id form-control-sm' multiple="multiple" id='Machine_Id${continuousIndex}'>${machineOptions}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control FrameType form-control-sm' id='FrameType${continuousIndex}'>${frameTypeOptions}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Frame form-control-sm' multiple="multiple" id='Frame${continuousIndex}'>${frameOptions}</select></td>
                        <td style="${rowBackgroundColor}"><input type="text" class='form-control Description form-control-sm' id='Description${continuousIndex}' value="${description}"></td>
                        <td><button type="button" class='button btn-info Assign-btn form-control-sm' id='Assign-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Assign</button>
                        <button type="button" class='button btn-warning Edit-btn form-control-sm' id='Edit-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Edit</button>
                        </td>
                    </tr>`;

                        $("#Allocation_Table tbody").append(row);
                        continuousIndex++;
                    });
                });



                $("#Allocation_Table tbody tr").each(function () {
                    const $row = $(this);
                    const Department = $row.find(".Department").val();
                    const WorkArea = $row.find(".WorkArea").val();
                    const JobCardNo = $row.find(".JobCardNo").val();
                    const Date = $("#Date").val();
                    const Shift = $("#Shift").val();

                    $.ajax({
                        url: baseurl + 'Work/Work_Type',
                        method: 'POST',
                        data: { Department, WorkArea, JobCardNo, Date, Shift },
                        success: function (response) {
                            const Response_Data = JSON.parse(response);
                            const Work_Type = Response_Data.Work_Type;
                            const machineSelect = $row.find(".Machine_Id");
                            const frameSelect = $row.find(".Frame");
                            const frameTypeSelect = $row.find(".FrameType");

                            // Clear previous machine options to avoid duplicates
                            // machineSelect.empty();
                            machineSelect.append("<option value=''></option>");

                            if (Work_Type) {
                                $.each(Work_Type, function (index, work) {
                                    if (work.Machine_Id !== '-') {
                                        machineSelect.append(`<option value="${work.Machine_Id}">${work.Machine_Id}</option>`);
                                    }
                                });
                            }

                            machineSelect.append("<option value=''></option>");
                            machineSelect.append("<option value='Others'>Others</option>");
                            machineSelect.append("<option value='NoWork'>NoWork</option>");

                            const machineId = machineSelect.val();

                            // Pre-select Machine_Id from Shift_Employee_List
                            if (machineId !== '-') {
                                $.each(Shift_Employee_List, function (index, item) {
                                    if (item.Machine_Id == machineId) {
                                        if (item.Machine_Id && !machineSelect.find(`option[value="${item.Machine_Id}"]`).prop("selected")) {
                                            machineSelect.val(item.Machine_Id).trigger('change');
                                        }

                                        // Prevent duplicate frame options
                                        if (item.Frame !== '-' && !frameSelect.find(`option[value="${item.Frame}"]`).length) {
                                            frameSelect.append(`<option value="${item.Frame}" selected>${item.Frame}</option>`);
                                        }

                                        // Prevent duplicate frameType options
                                        if (item.FrameType !== '-' && !frameTypeSelect.find(`option[value="${item.FrameType}"]`).length) {
                                            frameTypeSelect.append(`<option value="${item.FrameType}" selected>${item.FrameType}</option>`);
                                        }
                                    }
                                });
                            }

                            frameTypeSelect.val(''); // Clear the selected FrameType if necessary
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
            }
        })


    });




    $("#Previous-Date-Allocation").on("click", function () {


        var Date = $("#Date").val();
        var Shift = $("#Shift").val();
        var Type = $("#Type").val();

        $.ajax({

            url: baseurl + 'Work/Previous_Allocation',
            type: 'POST',
            data: {

                Date,
                Shift,
                Type

            },
            success: function (response) {
                const Response_Data = JSON.parse(response);
                const Shift_Employee_List = Response_Data.Shift_Employee_List;
                const User_Department = Response_Data.User_Department;

                $("#Allocation_Table_Container").show();
                $("#Allocation_Table tbody").empty();


                swal(
                    {
                        type: 'success',
                        title: 'Employee Work Allocation',
                        text: 'Work Allocation Completed!',
                    }
                )

                let groupedByWages = {};
                $.each(Shift_Employee_List, function (index, item) {
                    const wage = item.Wages || 'NULL';
                    if (!groupedByWages[wage]) {
                        groupedByWages[wage] = [];
                    }
                    groupedByWages[wage].push(item);
                });

                let wageGroups = Object.keys(groupedByWages);
                if (wageGroups.indexOf('A2') > -1) {
                    wageGroups = ['A2'].concat(wageGroups.filter(wage => wage !== 'A2'));
                }

                let continuousIndex = 1;
                $.each(wageGroups, function (index, wage) {
                    const wageRow = `<tr><td colspan="10" class="wage-group"><strong>Wage Group: ${wage}</strong></td></tr>`;
                    $("#Allocation_Table tbody").append(wageRow);

                    $.each(groupedByWages[wage], function (index, item) {
                        let departmentOptions = '';
                        const selectedDepartment = item.Department || User_Department[0].Department;
                        $.each(User_Department, function (deptIndex, deptItem) {
                            departmentOptions += `<option value="${deptItem.Department}" ${deptItem.Department === selectedDepartment ? 'selected' : ''}>${deptItem.Department}</option>`;
                        });

                        const allMachineOptions = "<option value=''></option>";
                        const frameMethodOptions = "<option value=''></option><option value='All'>All</option><option value='Partial'>Partial</option>";
                        const workAreaOption = `<option value="${item.WorkArea}" selected>${item.WorkArea}</option>`;
                        const jobCardOption = `<option value="${item.Job_Card_No}" selected>${item.Job_Card_No}</option>`;

                        let machineOptions = allMachineOptions;
                        if (item.Machine_Id !== '-') {
                            machineOptions = `<option value="${item.Machine_Id}" selected>${item.Machine_Id}</option>`;
                        }

                        let frameOptions = '';
                        if (item.Frame !== '-') {
                            frameOptions = `<option value="${item.Frame}" selected>${item.Frame}</option>`;
                        }

                        let frameTypeOptions = frameMethodOptions;
                        if (item.FrameType !== '-') {
                            frameTypeOptions = `<option value="${item.FrameType}" selected>${item.FrameType}</option>`;
                        }

                        const description = item.Description || '';

                        // Determine the background color based on WorkType or Machine
                        let rowBackgroundColor = '';
                        if (item.Work_Type == 'Machine' || item.Work_Type == 'Others') {
                            rowBackgroundColor = 'background-color: #A7FEA5;';
                        } else if (item.Work_Type == 'NoWork') {
                            rowBackgroundColor = 'background-color: #FFE992;';
                        }

                        // Apply background color to specific columns (S.No to Description)
                        const row = `<tr>
                        <td style="${rowBackgroundColor}">${continuousIndex}</td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Department form-control-sm' id='Department${continuousIndex}'>${departmentOptions}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control WorkArea form-control-sm' id='WorkArea${continuousIndex}'>${workAreaOption}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control JobCardNo form-control-sm' id='JobCardNo${continuousIndex}'>${jobCardOption}</select></td>
                        <td style="${rowBackgroundColor}" class="Employee_Id" value="${item.EmpNo}">${item.EmpNo}</td>
                        <td style="${rowBackgroundColor}">${item.FirstName}</td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Machine_Id form-control-sm' multiple="multiple" id='Machine_Id${continuousIndex}'>${machineOptions}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control FrameType form-control-sm' id='FrameType${continuousIndex}'>${frameTypeOptions}</select></td>
                        <td style="${rowBackgroundColor}"><select class='custom-select2 form-control Frame form-control-sm' multiple="multiple" id='Frame${continuousIndex}'>${frameOptions}</select></td>
                        <td style="${rowBackgroundColor}"><input type="text" class='form-control Description form-control-sm' id='Description${continuousIndex}' value="${description}"></td>
                        <td><button type="button" class='button btn-info Assign-btn form-control-sm' id='Assign-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Assign</button>
                        <button type="button" class='button btn-warning Edit-btn form-control-sm' id='Edit-btn${continuousIndex}' ${item.IsChecked ? 'checked' : ''}>Edit</button>
                        </td>
                    </tr>`;

                        $("#Allocation_Table tbody").append(row);
                        continuousIndex++;
                    });
                });



                $("#Allocation_Table tbody tr").each(function () {
                    const $row = $(this);
                    const Department = $row.find(".Department").val();
                    const WorkArea = $row.find(".WorkArea").val();
                    const JobCardNo = $row.find(".JobCardNo").val();
                    const Date = $("#Date").val();
                    const Shift = $("#Shift").val();

                    $.ajax({
                        url: baseurl + 'Work/Work_Type',
                        method: 'POST',
                        data: { Department, WorkArea, JobCardNo, Date, Shift },
                        success: function (response) {
                            const Response_Data = JSON.parse(response);
                            const Work_Type = Response_Data.Work_Type;
                            const machineSelect = $row.find(".Machine_Id");
                            const frameSelect = $row.find(".Frame");
                            const frameTypeSelect = $row.find(".FrameType");

                            // Clear previous machine options to avoid duplicates
                            // machineSelect.empty();
                            machineSelect.append("<option value=''></option>");

                            if (Work_Type) {
                                $.each(Work_Type, function (index, work) {
                                    if (work.Machine_Id !== '-') {
                                        machineSelect.append(`<option value="${work.Machine_Id}">${work.Machine_Id}</option>`);
                                    }
                                });
                            }

                            machineSelect.append("<option value=''></option>");
                            machineSelect.append("<option value='Others'>Others</option>");
                            machineSelect.append("<option value='NoWork'>NoWork</option>");
                            machineSelect.append("<option value='Multiple Trainee'>Multiple Trainee</option>");


                            const machineId = machineSelect.val();

                            // Pre-select Machine_Id from Shift_Employee_List
                            if (machineId !== '-') {
                                $.each(Shift_Employee_List, function (index, item) {
                                    if (item.Machine_Id == machineId) {
                                        if (item.Machine_Id && !machineSelect.find(`option[value="${item.Machine_Id}"]`).prop("selected")) {
                                            machineSelect.val(item.Machine_Id).trigger('change');
                                        }

                                        // Prevent duplicate frame options
                                        if (item.Frame !== '-' && !frameSelect.find(`option[value="${item.Frame}"]`).length) {
                                            frameSelect.append(`<option value="${item.Frame}" selected>${item.Frame}</option>`);
                                        }

                                        // Prevent duplicate frameType options
                                        if (item.FrameType !== '-' && !frameTypeSelect.find(`option[value="${item.FrameType}"]`).length) {
                                            frameTypeSelect.append(`<option value="${item.FrameType}" selected>${item.FrameType}</option>`);
                                        }
                                    }
                                });
                            }

                            frameTypeSelect.val(''); // Clear the selected FrameType if necessary
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
            }

        })



    })










});