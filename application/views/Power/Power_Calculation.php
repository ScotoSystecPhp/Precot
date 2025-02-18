

<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">
           
            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-20 card-box mb-30">
                <form method="POST" enctype="multipart/form-data">
                    <div class="row py-3">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Company Code</label>
                                <input type="text" class="form-control" id="Ccode" value="<?php echo $Ccode ?>" name="Ccode" readonly>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Location Code</label>
                                <input type="text" class="form-control" id="Lcode" name="Lcode" value="<?php echo $Lcode ?>" readonly>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="Date" class="form-control" id="Date" name="Date" value="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Shift</label>
                                <select class="custom-select2 form-control" name="Shift" id="Shift">

                                    <option value=""></option>
                                    <option value="GENERAL">GENTRAL</option>
                                    <option value="SHIFT1">SHIFT I</option>
                                    <option value="SHIFT2">SHIFT II</option>
                                    <option value="SHIFT3">SHIFT III</option>
                                    <option value="SHIFT4">SHIFT IV</option>

                                    <span class="text-danger"><?php echo form_error('Shift'); ?></span>

                                </select>
                            </div>
                        </div>



                    </div>
                    <div class="row py-3">
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
                                <label name="job card no">Job Card No</label>
                                <select class="custom-select2 form-control" name="JobCardNo" id="JobCardNo">
                                </select>
                                <span class="text-danger"><?php echo form_error('job card no'); ?></span>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="form-group">
                                <label name="Machine Name">Machine Name</label>
                                <select class="custom-select2 form-control" name="Machine" id="Machine">
                                </select>
                                <span class="text-danger"><?php echo form_error('Machine'); ?></span>

                            </div>
                        </div>


                    </div>
                    <div class="row justify-content-end">
                        <div class="col-auto">
                            <button type="button" class="btn btn-outline-info btn-sm" id="Get_Power_Employee">View</button>
                        </div>
                    </div>
                </form>
            </div>


            <div class="card-box mb-30">
               
                <div class="pd-20">
                    <h4 class="text-black h5 text-center">Machine Master List</h4>
                </div>
             
                <div class="table-container">
                <table class="table" id="Tables">
                <thead  style="background-color: #519352">
                            <tr>
                                <th>S.No</th>
                                <th>Date</th>
                                <th>Employee Id</th>
                                <th>Employee Name</th>
                                <th>Machine Id</th>
                                <th>Last Unit</th>
                                <th>Current Unit</th>
                                <th>Using Power</th>
                            </tr>
                        </thead>
                        <tbody id="Employee_Power_Table">
                          

                        </tbody>
                    </table>
                    <div class="row justify-content-end">
                        <div class="col-auto">
                            <button type="button" class="btn btn-outline-success btn-sm" id="Power_Selected_Rows">Update</button>
                        </div>
                    </div>
                </div>
                
            </div>

            <script src="<?php echo base_url('assets/Script/EB.js') ?>"></script>
