<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">


            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-5 card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Shift Closing Process</h4>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    <div class="row py-2">

                        <div class="col-md-2">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="Date" class="form-control" id="Date" name="Date" value="">
                            </div>
                        </div>
                        <!-- <div class="col-md-3">
                            <div class="form-group">
                                <label>Department</label>
                                <select class="custom-select2 form-control" name="Department" id="Department">
                                    <span class="text-danger"><?php echo form_error('Department'); ?></span>

                                </select>
                            </div>
                        </div> -->
                        <div class="col-md-2">
                            <div class="form-group">
                                <label>Shift</label>
                                <select class="custom-select2 form-control" name="Shift" id="Shift">
                                </select>
                            </div>
                        </div>

                        <!-- <div class="col-md-3">
                            <div class="form-group">
                                <label>Work Area</label>
                                <select class="custom-select2 form-control" name="Work_Area" id="Work_Area">
                                    <span class="text-danger"><?php echo form_error('Work_Area'); ?></span>

                                </select>
                            </div>
                        </div> -->

                        <!-- <div class="col-md-2">
                            <div class="form-group">
                                <label name="job card no">Job Card No</label>
                                <select class="custom-select2 form-control" name="JobCardNo" id="JobCardNo">
                                </select>
                                <span class="text-danger"><?php echo form_error('job card no'); ?></span>
                            </div>
                        </div> -->
                    </div>

                    <div class="row justify-content-end" id="Shift_Closing_container">
                        <div class="col-auto">
                            <button type="button" class="btn btn-warning btn-sm"
                                id="Shift_Closing_Report">Download</button>

                        </div>
                    </div>
                     <!-- <div class="row justify-content-end" id="Shift_Closing_container_All">
                        <div class="col-auto">
                            <button type="button" class="btn btn-info btn-sm"
                                id="Shift_Closing_Report">Download</button>

                        </div>
                    </div> -->




                </form>

                <div class="table-container py-3" id="Shift_Closing_Section">
                    <table class="table table table-responsive-md" id="Shift_Employee_List">
                        <thead style="background-color: #519352">
                            <tr>
                                <th>#</th>
                                <th class="Department">Department</th>
                                <th class="WorkArea">Work Area</th>
                                <th class="JobCard">Job Card No</th>
                                <th class="Employee_Id">Employee Id</th>
                                <th class="Employee_Name">Employee Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>

                    <div class="row justify-content-end py-5">
                        <div class="col-auto">
                            <button type="button" class="btn btn-info btn-sm" id="Shift_Employee_List_Update">Shift
                                Closing</button>

                        </div>
                    </div>
                </div>
            </div>


            <script src="<?php echo base_url('assets/Script/Shift_Close.js') ?>"></script>