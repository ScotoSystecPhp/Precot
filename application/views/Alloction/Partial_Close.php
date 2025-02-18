<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">


            <!-- Bootstrap TouchSpin Start -->
<div class="pd-5 card-box mb-30">
    <div class="pd-5">
        <h4 class="text-black h5 text-center">Employee Work Partial Close</h4>
    </div>
    <form method="POST" enctype="multipart/form-data">
        <div class="row py-2">
            <div class="col-md-2">
                <div class="form-group">
                    <label>Date</label>
                    <input type="Date" class="form-control" id="Date" name="Date" value="">
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
                    <label>Shift</label>
                    <select class="custom-select2 form-control" name="Shift" id="Shift">
                    </select>
                </div>
            </div>

             <div class="col-md-4">
                <div class="form-group">
                    <label>Employee</label>
                    <select class="custom-select2 form-control" name="Employee_Id" id="Employee_Id">
                        <span class="text-danger"><?php echo form_error('Employee_Id'); ?></span>
                    </select>
                </div>
            </div>


             <div class="col-md-5">
                <div class="form-group">
                    <label>Reason</label>
                    <input type="text" class="form-control" name="Reason" id="Reason">
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label>Work Duration</label>
                    <input type="number" class="form-control" name="Work_Timing" id="Work_Timing">
                </div>
            </div>

        </div>

        <div class="row justify-content-end py-2">
                        <div class="col-auto">
                            <button type="button" class="btn btn-info btn-sm" id="Partial_Close_Shift">Update</button>
                        </div>
                    </div>

    </form>

    <div id="Partial_Close_List_Container">
                        <table class="table table-responsive" id="Partial_Close_List_Table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Employee Id</th>
                                    <th>Employee Name</th>
                                    <th>Department</th>
                                    <th>Work Area</th>
                                    <th>Job Card No</th>
                                    <th>Reason</th>
                                    <th>Work Duration</th>

                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>

                    </div>

</div>


<script src="<?php echo base_url('assets/Script/Partial_Close.js') ?>"></script>