<div class="main-container">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

    <style>
    .custom-select2-container .select2-selection__rendered {
        font-size: 16px;
        padding: 12px 10px;
        height: auto;
    }

    .custom-select2-container .select2-selection__rendered {
        line-height: 1.5;
    }
    </style>
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">


            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-5 card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Late Employee Work Assignment</h4>
                </div>


                <form method="POST" enctype="multipart/form-data">
                    <div class="row py-2">

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="Date" class="form-control" id="Date" name="Date">
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Allocation Type</label>
                                <select class="custom-select2 form-control" name="Allocation_Type" id="Allocation_Type">
                                    <option value=""></option>
                                    <option value="LATE">Late</option>
                                    <option value="EXTRA">Extra</option>
                                    <span class="text-danger"><?php echo form_error('Allocation_Type'); ?></span>

                                </select>
                            </div>
                        </div>


                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Department</label>
                                <select class="custom-select2 form-control" name="Department" id="Department">
                                    <span class="text-danger"><?php echo form_error('Department'); ?></span>

                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Shift Type</label>
                                <select class="custom-select2 form-control" name="Shift_Employee" id="Shift_Employee">

                                    <option value=""></option>
                                    <option value="GENERAL">GENTRAL</option>
                                    <option value="SHIFT">SHIFT</option>


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
                        <div class="col-md-2">
                            <div class="form-group">
                                <label name="job card no">Job Card No</label>
                                <select class="custom-select2 form-control" name="JobCardNo" id="JobCardNo">
                                </select>
                                <span class="text-danger"><?php echo form_error('job card no'); ?></span>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <label> Assign Shift</label>
                                <select class="custom-select2 form-control" name="Shift" id="Shift">

                                    <option value=""></option>
                                    <option value="SHIFT1">SHIFT I</option>
                                    <option value="SHIFT2">SHIFT II</option>
                                    <option value="SHIFT3">SHIFT III</option>
                                    <option value="SHIFT4">SHIFT IV</option>
                                </select>

                                <span class="text-danger"><?php echo form_error('Shift'); ?></span>


                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <label name="Type">Employee Type</label>
                                <select class="custom-select2 form-control" name="Type" id="Employee_Type">

                                </select>
                                <span class="text-danger"><?php echo form_error('job card no'); ?></span>
                            </div>
                        </div>
                         <div class="col-md-3">
                <div class="form-group">
                    <label>Employee</label>
                    <select class="custom-select2 form-control" name="Employee_Id" id="Employee_Id">
                        <span class="text-danger"><?php echo form_error('Employee_Id'); ?></span>
                    </select>
                </div>
            </div>
             <div class="col-md-3">
                <div class="form-group">
                    <label>Machine Id</label>
                    <select class="custom-select2 form-control" multiple="multiple" name="Machine_Id" id="Machine_Id">
                        <span class="text-danger"><?php echo form_error('Machine_Id'); ?></span>
                    </select>
                </div>
            </div>
             <div class="col-md-3" id="Frame_Type_Section">
                <div class="form-group">
                    <label>Frame Type</label>
                    <select class="custom-select2 form-control" name="Frame_Type" id="Frame_Type">
                        <option value="All">All</option>
                        <option value="Partial">Partial</option>
                        <span class="text-danger"><?php echo form_error('Frame_Type'); ?></span>
                    </select>
                </div>
            </div>
             <div class="col-md-3" id="Frame_Section">
                <div class="form-group">
                    <label>Frame</label>
                    <select class="custom-select2 form-control" multiple="multiple" name="Frame" id="Frame">
                        <span class="text-danger"><?php echo form_error('Employee_Id'); ?></span>
                    </select>
                </div>
            </div>
             <div class="col-md-3" id="Work_Type_Section">
                <div class="form-group">
                    <label>Work Type</label>
                    <select class="custom-select2 form-control" name="Work_Type" id="Work_Type">
                        <option value="Others">Others</option>

                        <span class="text-danger"><?php echo form_error('Work_Type'); ?></span>
                    </select>
                </div>
            </div>
             <div class="col-md-4" id="Description_Section">
                <div class="form-group">
                    <label>Description</label>
                     <input type="text" class="form-control" name="Description" id="Description">
                        <span class="text-danger"><?php echo form_error('Description'); ?></span>
                    </select>
                </div>
            </div>
</div>

                </form>
                 <div class="row justify-content-end py-2">
                        <div class="col-auto">
                            <button type="button" class="btn btn-info btn-sm" id="Other_Work_Allocation_Save">Save</button>
                        </div>
                    </div>

                    </div>



                <div id="Alloacation_Section">
                    <div class="pd-20">
                        <h4 class="text-black h5 text-center">Employee Allocation List</h4>
                    </div>

                    <div class="table-container">
                        <table class="table table-responsive" id="Allocation_Table">
                            <thead>
                                <tr>
                                    <th>Employee Id</th>
                                    <th>Employee Name</th>
                                    <th>Machine Id</th>
                                    <th>Frame Method</th>
                                    <th>Frame</th>
                                    <th>Work Type</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>

                    </div>

                </div>

            </div>


            <script src="<?php echo base_url('assets/Script/Allocation.js') ?>"></script>