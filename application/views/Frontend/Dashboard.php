<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">
            <!-- Bootstrap TouchSpin Start -->

            <div class="row">
                <div class="col-md-6 mb-30">
                    <div class="pd-20 card-box height-100-p">
                        <h4 class="h4 text-blue">Work Allocation Report</h4>
                        <div id="Worked_Data"></div>
                    </div>
                </div>
                <div class="col-md-6 mb-30">
                    <div class="pd-20 card-box height-100-p">
                        <h4 class="h4 text-blue">No Work Allocation Report</h4>
                        <div id="chart8"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="pd-5 card-box mb-30">


            <form method="POST" enctype="multipart/form-data">
                <div class="row py-2">




                    <input type="hidden" id="Default_Shift">


                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Department</label>
                            <select class="custom-select2 form-control" name="Department" id="Department">
                                <span class="text-danger"><?php echo form_error('Department'); ?></span>

                            </select>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-group">
                            <label>Shift</label>
                            <select class="custom-select2 form-control" name="Shift" id="Shift">



                                <span class="text-danger"><?php echo form_error('Shift'); ?></span>

                            </select>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Work Area</label>
                            <select class="custom-select2 form-control" name="Work_Area" id="Work_Area">
                                <span class="text-danger"><?php echo form_error('Department'); ?></span>

                            </select>
                        </div>
                    </div>





                </div>

                <div class="row justify-content-end">
                    <div class="col-auto">
                        <button type="button" class="btn btn-info btn-sm"
                            id="Employee_Work_Allocation_Details">View</button>
                    </div>
                </div>

                <div id="Work_List_FOR_Employee">
                    .
                    <div class="pd-20">
                        <h4 class="text-black h5 text-center">Employee Work Allocation List</h4>
                    </div>


                    <div class="table-container">
                        <div class="table-responsive">
                            <table class="table" id="Work_Allocation_List">
                                <thead style="background-color: #519352">
                                    <tr>
                                        <th>#</th>
                                        <th>Employee Name</th>
                                        <th>Employee Id</th>
                                        <th>Machine Id</th>
                                        <th>Machine Name</th>
                                        <th>Frame Type</th>
                                        <th>Frame</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Table rows here -->
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>
            </form>



        </div>

        <!-- <script src="<?php echo base_url('assets/Script/Shift_Closing.js') ?>"></script>
        <script src="<?php echo base_url('assets/Script/Reports.js') ?>"></script> -->
        <script src="<?php echo base_url('assets/Script/Charts.js') ?>"></script>