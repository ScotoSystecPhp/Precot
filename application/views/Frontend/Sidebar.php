<div class="left-side-bar">
    <div class="brand-logo" style="display: flex; justify-content: center;">
        <a href="#">
            <img src="<?php echo base_url('assets/Logo/precot.png') ?>" alt="" class="light-logo"
                style="height: 45px; width: 110px;">
        </a>
        <div class="close-sidebar" data-toggle="left-sidebar-close">
            <i class="ion-close-round"></i>
        </div>
    </div>
    <div class="menu-block customscroll">
        <div class="sidebar-menu">
            <ul id="accordion-menu">
                <?php
				$UserData = $this->session->userdata('sess_array');
				if (!empty($UserData) && isset($UserData['IsOnLogin']) && $UserData['IsOnLogin'] === TRUE) {

					$userRole = $UserData['Designation'];
					$LocationCode = $UserData['Lcode'];
					$CompanyCode = $UserData['Ccode'];

					$sql = "SELECT * FROM Web_UserPermission_Mst WHERE Lcode = '$LocationCode' AND Ccode = '$CompanyCode' AND UserRole = '$userRole' ";
					$query = $this->db->query($sql);
					$permissions = $query->row();

					// echo '<pre>';
					// print_r($sql);exit;

					// Extract permissions into variables
					$home = $permissions->Home;

					$User_rights = $permissions->User_rights;

					$Master = $permissions->Master;
					$Employee_Master = $permissions->Employee_Master;
					$Work_Allocation = $permissions->Work_Allocation;
					$Production = $permissions->Production;

					$Work_Area_Master = $permissions->Work_Area_Master;
					$jobCard = $permissions->Create_Job_Card;
					$machine = $permissions->Create_Machine_Master;
					$addEB = $permissions->EB_Master;

					$Employee_Status = $permissions->Employee_Status;
					$attendanceSheet = $permissions->Employee_Attendance_Grade;
					$rating = $permissions->Employee_Work_Rating;


					$Employee_Assign = $permissions->Employee_Assign;
					$Work_Allocation_Report = $permissions->Work_Allocation_Report;
					$lateEmployee = $permissions->Late_Employee_Assign;
					$No_Work_Employee = $permissions->No_Work_Employee;
                    $Partial_Close = $permissions->Partial_Close;


					$Production_Entry = $permissions->Production_Entry;
					$machineCalculation = $permissions->Power_Calculation;

					$Upload_Setting = $permissions->Setting;

                    $Late_Employee_Report = $permissions->Late_Employee_Report;
                    $Shift_Closing_Report = $permissions->Shift_Closing_Report;
                    $Monthly_Report = $permissions->Monthly_Report;

					// User rights permission
				?>

                <!-- Home Section -->
                <?php if ($home == 1) { ?>
                <li class="dropdown">
                    <a href="<?php echo base_url('Home') ?>" class="dropdown-toggle">
                        <span class="micon dw dw-house-1"></span><span class="mtext">Home</span>
                    </a>
                </li>
                <?php }

					// Master Section
					if ($User_rights == 1) { ?>
                <li class="dropdown">
                    <a href="javascript:;" class="dropdown-toggle">
                        <span class="micon dw dw-shield"></span><span class="mtext">Privacy</span>
                    </a>
                    <ul class="submenu">
                        <?php if ($User_rights == 1) { ?>
                        <li><a href="<?php echo base_url('Auth/user_rights') ?>">User Screen Permission</a></li>
                        <?php }
									if($Upload_Setting == 1){ ?>
                        <!-- <li><a href="<?php echo base_url('Settings') ?>">Upload Setting</a></li> -->


                    </ul>

                </li>
                <?php }
					}

								// Master Section
								if ($Master == 1) { ?>
                <li class="dropdown">
                    <a href="javascript:;" class="dropdown-toggle">
                        <span class="micon dw dw-settings"></span><span class="mtext">Master</span>
                    </a>
                    <ul class="submenu">
                        <?php
									if ($Work_Area_Master == 1) { ?>
                        <li><a href="<?php echo base_url('Master') ?>">Work Area Master</a></li>
                        <?php }
									if ($jobCard == 1) { ?>
                        <li><a href="<?php echo base_url('JobCard') ?>">Create Job Card</a></li>
                        <?php }
									if ($machine == 1) { ?>
                        <li><a href="<?php echo base_url('JobCard/Machine') ?>">Create Machine Master</a></li>
                        <?php }
									if ($addEB == 1) { ?>
                        <li><a href="<?php echo base_url('Master/Add_EB') ?>">EB Master</a></li>
                        <?php } ?>
                    </ul>
                </li>
                <?php }

								// Employee Master Section
				if ($Employee_Master == 1) { ?>
                <li class="dropdown">
                    <a href="javascript:;" class="dropdown-toggle">
                        <span class="micon fa fa-users"></span><span class="mtext">Employee Master</span>
                    </a>
                    <ul class="submenu">
                        <?php
									if ($Employee_Status == 1) { ?>
                        <li><a href="<?php echo base_url('Grade_Master') ?>">Employee Status</a></li>
                        <?php }
									if ($attendanceSheet == 1) { ?>
                        <li><a href="<?php echo base_url('Grade_Master/Attendance_Sheet') ?>">Employee Attendance
                                Grade</a></li>
                        <?php }
									if ($rating == 0) { ?>
                        <li><a href="<?php echo base_url('Grade_Master/Rating') ?>">Employee Work Rating</a></li>
                        <?php } ?>
                    </ul>
                </li>
                <?php }

								// Work Allocation Section
								if ($Work_Allocation == 1) { ?>
                <li class="dropdown">
                    <a href="javascript:;" class="dropdown-toggle">
                        <span class="micon fa fa-briefcase"></span><span class="mtext">Work Allocation</span>
                    </a>
                    <ul class="submenu">
                        <?php if ($lateEmployee == 1) { ?>
                        <li><a href="<?php echo base_url('Work_Master/Shift_Closing') ?>">Shift Closing</a></li>

                        <?php }
									if ($Employee_Assign == 1) { ?>
                        <li><a href="<?php echo base_url('Allocation') ?>">Employee Assign</a></li>
                        <?php }
								if ($lateEmployee == 1) { ?>
                        <li><a href="<?php echo base_url('Allocation/Work_Assign') ?>">Late Employee Assign</a></li>

                         <?php } if ($Partial_Close == 1) { ?>
                        <li><a href="<?php echo base_url('Allocation/Partial_Close') ?>">Partial Close</a></li>


                    </ul>
                </li>

                <?php } }

                    				// Employee Master Section
				if ($Work_Allocation   == 1) { ?>
                <li class="dropdown">
                    <a href="javascript:;" class="dropdown-toggle">
                        <span class="micon fa fa-book"></span><span class="mtext">Reports</span>
                    </a>
                    <ul class="submenu">
                        <?php
									if ($Work_Allocation_Report == 1) { ?>
                        <li><a href="<?php echo base_url('Reports/Assigned') ?>">Work Allocation Report</a></li>
                         <?php } if ($No_Work_Employee == 1) {?>
                        <li><a href="<?php echo base_url('Reports/No_Work_Emloyee') ?>">No Work Employee Report</a>
                        <?php }if ($Late_Employee_Report == 1) {?>
                        <li><a href="<?php echo base_url('Reports/Late_Report') ?>">Late Employee Report</a>
                        <?php } if ($Shift_Closing_Report == 1) {?>
                        <li><a href="<?php echo base_url('Reports/Shift_Closing_Reports') ?>">Shift Report</a>
                        <?php } if ($Shift_Closing_Report == 1) {?>
                        <li><a href="<?php echo base_url('Reports/Monthly_Report') ?>">Monthly Report</a>
                        <?php } ?>


                    </ul>
                </li>
                <?php } } ?>

            </ul>
        </div>
    </div>
</div>

<!-- js -->
<script src="<?php echo base_url('assets/vendors/scripts/core.js') ?>"></script>
<script src="<?php echo base_url('assets/vendors/scripts/script.min.js') ?>"></script>
<script src="<?php echo base_url('assets/vendors/scripts/process.js') ?>"></script>
<script src="<?php echo base_url('assets/vendors/scripts/layout-settings.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/jquery.dataTables.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/dataTables.bootstrap4.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/dataTables.responsive.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/responsive.bootstrap4.min.js') ?>"></script>
<!-- buttons for Export datatable -->
<script src="<?php echo base_url('assets/src/plugins/datatables/js/dataTables.buttons.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/buttons.bootstrap4.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/buttons.print.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/buttons.html5.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/buttons.html5.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/buttons.flash.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/pdfmake.min.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/datatables/js/vfs_fonts.js') ?>"></script>


<script src="<?php echo base_url('assets/src/plugins/apexcharts/apexcharts.min.js')?>"></script>
<script src="<?php echo base_url('assets/vendors/scripts/apexcharts-setting.js')?>"></script>






</body>


<!-- DataTables JS (via CDN) -->
<script src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js"></script>

<!-- DataTables Bootstrap Integration JS (via CDN) -->
<script src="https://cdn.datatables.net/1.10.24/js/dataTables.bootstrap4.min.js"></script>




<script>
$(document).ready(function() {

    $('#Tables').DataTable();

    var currentURL = window.location.href;

    $('.submenu a').each(function() {
        if (this.href === currentURL) {
            $(this).closest('li.dropdown').addClass('active');
            $(this).closest('.submenu').css('display', 'block');
            $(this).closest('ul.submenu').addClass('active-submenu');
            $(this).addClass('active-item');
        }
    });

    $('.dropdown-toggle').off('click').on('click', function(e) {
        e.stopPropagation();
        var parent = $(this).parent('li');

        if (parent.hasClass('active')) {
            parent.removeClass('active').find('.submenu').stop(true, true).slideUp();
            parent.find('ul.submenu').removeClass('active-submenu');
            parent.find('ul.submenu li a').removeClass('active-item');
        } else {
            $('.dropdown').removeClass('active').find('.submenu').slideUp();
            parent.addClass('active').find('.submenu').stop(true, true).slideDown();
        }
    });

    $('.submenu a').on('click', function(e) {
        e.stopPropagation();
        $('.submenu').removeClass('active-submenu');
        $('.submenu a').removeClass('active-item');

        $(this).closest('ul.submenu').addClass('active-submenu');
        $(this).addClass('active-item');
    });
});
</script>


<style>
ul.submenu.active-submenu {
    /* background-color: #2596be; Light yellow background for the active submenu */
}

.active-item {
    background-color: rgb(165, 38, 185);
    color: white;
}

ul.submenu li a:hover {}
</style>