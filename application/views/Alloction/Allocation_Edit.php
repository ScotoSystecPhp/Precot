


<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">

            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-5 card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Employee Work Allocation Edit</h4>
                </div>
 <div class="row">
                    <div class="col-md-12 d-flex justify-content-end p-3">
                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                            <a href="<?php echo base_url('Allocation') ?>" class="btn btn-secondary btn-sm">Back</a>
                        </div>
                    </div>
                </div>

                <form method="POST" enctype="multipart/form-data">

                    <div class="row py-2">

                        <div class="col-md-2">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="text" class="form-control" id="Date" name="Date" value="<?php echo $Date; ?>">
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
                        <div class="col-md-2">
                            <div class="form-group">
                                <label>Shift</label>
                                <input type="text" class="form-control" name="Shift" id="Shift" value="<?php echo $Shift; ?>">


                                    <span class="text-danger"><?php echo form_error('Shift'); ?></span>

                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Work Area</label>
                                <select class="custom-select2 form-control" name="sub_Department" id="sub_Department">
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
                    </div>

                    <hr style="height:2px;border-width:0;color:gray;background-color:gray">

                    <div class="row py-2">
                        <div class="col-md-3 col-sm-12">
                            <div class="form-group">
                                <label>Employee Id</label>
                                <input type="text" class="form-control" id="Employee_Id" value="<?php echo $Employee_Id; ?>">

                            </div>
                        </div>

                        <div class="col-md-2 col-sm-12">
                            <div class="form-group">
                                <label>Machine Id</label>
                                <select class="custom-select2  form-control" id="Machine_Id">
                                    <option value="---Select--">---Select--</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-2" id="Frame_Col">
                            <div class="form-group">
                                <label for="FrameType">Frame Type</label>
                                <select class="custom-select2 form-control" name="FrameType" id="FrameType">
                                    <option value="All">All</option>
                                    <option value="Partial">Partial</option>
                                </select>
                                <span class="text-danger"><?php echo form_error('FrameType'); ?></span>
                            </div>
                        </div>

                         <div class="col-md-3">
                            <div class="form-group">
                                <label for="Frames">Frame</label>
                                <select class="custom-select2 form-control" data-size="5" name="Frame[]" multiple id="Frames">

                                </select>
                                <span class="text-danger"><?php echo form_error('Frame'); ?></span>
                            </div>
                        </div>


                        <div class="col-md-2" Id="OtherWork">
                            <div class="form-group">
                                <label>Work Type</label>
                                <select class="custom-select2  form-control" id="Others">
                                    <option value="-">---Select--</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Others">Others</option>

                                    <span class="text-danger"><?php echo form_error('Others'); ?></span>
                                </select>
                            </div>
                        </div>




                        <div class="col-md-3" Id="OtherWorks">
                            <div class="form-group">
                                <label>Description</label>
                                <input type="text" class="form-control" id="Description" name="Description">
                                <span class="text-danger"><?php echo form_error('Description'); ?></span>
                            </div>
                        </div>
                    </div>

                    <div class="row justify-content-end">
                        <div class="col-auto">

                            <button type="button" class="btn btn-danger btn-sm" id="Work_Allocation_Clear">Clear</button>
                            <button type="button" class="btn btn-info btn-sm" id="Work_Allocation">Add</button>
                        </div>
                    </div>
                </form>

                <div id="Allocation_Table_Container">
                <div class="pd-20">
                    <h4 class="text-black h5 text-center">Employee Allocation List</h4>
                </div>

                <div class="table-container" >
                    <table class="table table-responsive-lg" id="Allocation_Table">
                        <thead style="background-color: #519352">
                            <tr>
                                <th>Employee Id</th>
                                <th>Machine Id</th>
                                <th>Frame Method</th>
                                <th>Frame</th>
                                <th>Work Type</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody >

                        </tbody>
                    </table>
                    <div class="row justify-content-end py-5">
                        <div class="col-auto">
                            <button type="button" class="btn btn-success btn-sm" id="Work_Allocations">Update</button>
                        </div>
                    </div>
                </div>

            </div>
            </div>










            <script src="<?php echo base_url('assets/Script/Allocation_Edit.js') ?>"></script>


