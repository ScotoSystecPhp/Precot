<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">


            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-20 card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">New Machinery Add Section </h4>
                </div>
                <div class="row">
                    <div class="col-md-12 d-flex justify-content-end p-3">
                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                            <a href="<?php echo base_url('JobCard/Machine') ?>"
                                class="btn btn-secondary btn-sm">Back</a>
                        </div>
                    </div>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    <div class="row py-2">

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Department</label>
                                <select class="custom-select2 form-control" name="Department" id="Department">
                                    <option value="---Select--">---Select--</option>
                                    <span class="text-danger"><?php echo form_error('Department'); ?></span>

                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Work Area</label>
                                <select class="custom-select2 form-control" name="sub_Department" id="Work_Area">
                                    <option value="---Select--">---Select--</option>
                                    <span class="text-danger"><?php echo form_error('Department'); ?></span>

                                </select>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Input Method</label>
                                <select class="custom-select2 form-control" name="Input_Method" id="Input_Method">
                                    <option value="---Select--">---Select--</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Online">Online</option>
                                    <span class="text-danger"><?php echo form_error('Input_Method'); ?></span>

                                </select>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Frame Type</label>
                                <select class="custom-select2 form-control" name="FrameType" id="FrameType">
                                    <option value="---Select--">---Select--</option>
                                    <option value="Single">Single</option>
                                    <option value="Multiple">Multiple</option>
                                    <span class="text-danger"><?php echo form_error('FrameType'); ?></span>

                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row py-2">
                        <!-- <div class="col-md-3">
                            <div class="form-group">
                                <label name="job card no">Job Card No</label>
                                <select class="custom-select2 form-control" name="JobCardNo" id="JobCardNo">
                                    <option value="---Select--">---Select--</option>
                                    <span class="text-danger"><?php echo form_error('JobCardNo'); ?></span>
                                </select>
                                <span class="text-danger"><?php echo form_error('job card no'); ?></span>
                            </div>
                        </div> -->

                        <div class="col-md-3">
                            <div class="form-group">
                                <label name="Machine Name">Machine Name</label>
                                <input type="text" class="form-control" id="Machine" name="Machine">
                                <span class="text-danger"><?php echo form_error('Machine Name'); ?></span>

                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label name="Machine Model">Machine Model</label>
                                <input type="text" class="form-control" id="Machine_Model" name="Machine_Model">
                                <span class="text-danger"><?php echo form_error('Machine_Model'); ?></span>

                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label name="Machine Model_No">Machine Id</label>
                                <input type="text" class="form-control" id="Machine_Model_No" name="Machine_Model_No"
                                    readonly>
                                <span class="text-danger"><?php echo form_error('Machine_Model_No'); ?></span>

                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-end">
                        <div class="col-auto">
                            <button type="button" id="Machine_Allocate" class="btn btn-info btn-sm">Save</button>
                        </div>
                    </div>
            </div>


            <div class="row py-2">



            </div>



            </form>
        </div>

        <script src="<?php echo base_url('assets/Script/Masters.js') ?>"></script>