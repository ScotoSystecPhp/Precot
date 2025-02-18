$(document).ready(function () {
    $('#column').hide(); 
    $('#User_Type').on('change', function() {
        var selectedValue = $(this).val();
        if(selectedValue !== '') {
            $.ajax({
                type: "POST",
                url: baseurl + 'Auth/Get_Rights_Details',
                data: {selectedValue: selectedValue},
                success: function (response) {
                    var responseData = JSON.parse(response);
                    $('#good').empty(); 
                    responseData.forEach(item => {
                        $('#good').append(`
                            <tr>
                                <td>Home</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Home" ${item.Home == 1 ? 'checked' : ''}></td>
                            </tr>
                           
                            <tr>
                                <td>User_rights</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="User_rights" ${item.User_rights == 1 ? 'checked' : ''}></td>
                            </tr>
                                                                   

                            


                             <tr>
                                 <td style="color: ${item.Master == 1 ? '#ff5733' : '#000'}; font-weight: ${item.Master == 1 ? 'bold' : 'normal'};">Master</td>
                                 <td><input type="checkbox" class="ScreenPermission" data-screen="Master" ${item.Master == 1 ? 'checked' : ''}></td>
                             </tr>
                             <tr>
                                 <td style="color: ${item.Employee_Master == 1 ? '#ff5733' : '#000'}; font-weight: ${item.Employee_Master == 1 ? 'bold' : 'normal'};">Employee_Master</td>
                                 <td><input type="checkbox" class="ScreenPermission" data-screen="Employee_Master" ${item.Employee_Master == 1 ? 'checked' : ''}></td>
                             </tr>
                             <tr>
                                 <td style="color: ${item.Work_Allocation == 1 ? '#ff5733' : '#000'}; font-weight: ${item.Work_Allocation == 1 ? 'bold' : 'normal'};">Work_Allocation</td>
                                 <td><input type="checkbox" class="ScreenPermission" data-screen="Work_Allocation" ${item.Work_Allocation == 1 ? 'checked' : ''}></td>
                             </tr>
                             <tr>
                                 <td style="color: ${item.Production == 1 ? '#ff5733' : '#000'}; font-weight: ${item.Production == 1 ? 'bold' : 'normal'};">Production</td>
                                 <td><input type="checkbox" class="ScreenPermission" data-screen="Production" ${item.Production == 1 ? 'checked' : ''}></td>
                             </tr>


                            


                             <tr>
                                <td>Work_Area_Master</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Work_Area_Master" ${item.Work_Area_Master == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>Create_Job_Card</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Create_Job_Card" ${item.Create_Job_Card == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>Create_Machine_Master</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Create_Machine_Master" ${item.Create_Machine_Master == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>EB_Master</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="EB_Master" ${item.EB_Master == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>Employee_Status</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Employee_Status" ${item.Employee_Status == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>Employee_Attendance_Grade</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Employee_Attendance_Grade" ${item.Employee_Attendance_Grade == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>Employee_Work_Rating</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Employee_Work_Rating" ${item.Employee_Work_Rating == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>Employee_Assign</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Employee_Assign" ${item.Employee_Assign == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>Late_Employee_Assign</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Late_Employee_Assign" ${item.Late_Employee_Assign == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>Production_Entry</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Production_Entry" ${item.Production_Entry == 1 ? 'checked' : ''}></td>
                            </tr>
                            <tr>
                                <td>Power_Calculation</td>
                                <td><input type="checkbox" class="ScreenPermission" data-screen="Power_Calculation" ${item.Power_Calculation == 1 ? 'checked' : ''}></td>
                            </tr>
                        `);
                    });
                    $('#column').show(); 
                },
                error: function (xhr, status, error) {
                    console.error('AJAX Error:', error);
                }
            });
        } else {
            $('#column').hide(); 
        }
    });

    $('#Form-Update').click(function() {
        var usertype = $('#User_Type').val();
        var selectedRow = $('#UserRights tbody tr');
        var dataArray = [];

        selectedRow.each(function() {
            var screenName = $(this).find('td:eq(0)').text().trim();
            var checkboxValue = $(this).find('.ScreenPermission').is(':checked') ? 1 : 0;

            var rowData = {
                screenName: screenName,
                checkboxValue: checkboxValue,
            };

            dataArray.push(rowData);
        });

        $.ajax({
            url: baseurl + "Auth/Change_user_rights",
            type: 'POST',
            data: {dataArray :dataArray, usertype : usertype},
            success: function(response) {
               if(response == 1)  {
                    alert("User Rights Changed Successfully");
                    window.location.href = baseurl + "Auth/user_rights";
               } else {
                    alert("Problem In Assigning User Rights");
                    window.location.href = baseurl + "Auth/user_rights";
               }
            },
            error: function(error) {
                console.error('Error fetching data for first half:', error);
            }
        });
    });
});
