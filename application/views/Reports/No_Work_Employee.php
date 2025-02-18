<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">


            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-5 card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">No Work Employee Report</h4>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    <div class="row py-3">

                        <div class="col-md-3">
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
                                    <option value="SHIFT1">SHIFT I</option>
                                    <option value="SHIFT2">SHIFT II</option>
                                    <option value="SHIFT3">SHIFT III</option>
                                    <option value="SHIFT4">SHIFT IV</option>

                                    <span class="text-danger"><?php echo form_error('Shift'); ?></span>

                                </select>
                            </div>
                        </div>
                    </div>


                    <div class="row justify-content-end">
                        <div class="col-auto">
                            <button type="button" class="btn btn-warning btn-sm" id="No_Work_Employee_List_Down_Btn">Download</button>
                            <button type="button" class="btn btn-info btn-sm" id="No_Work_Employee_List_View">View</button>
                        </div>
                    </div>
                </form>

                <div class="table-container py-4" id="No_Work_Employee_Table_Conainer">


                    <table id="NoWork_Employee_Table" class="table table-responsive-lg">
                        <thead style="background-color: #519352; color: white;">
                            <tr>
                                <th class="text-center text-white">S.No</th>
                                <th class="text-center text-white">Department</th>
                                <th class="text-center text-white">WorkArea</th>
                                <th class="text-center text-white">Job Card</th>
                                <th class="text-center text-white">Employee Id</th>
                                <th class="text-center text-white">Employee Name</th>
                                <th class="text-center text-white">Status</th>
                                    <th>Created By</th>
                                     <th>Created Time</th>
                                    
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>


                </div>
            </div>






            <script src="<?php echo base_url('assets/Script/Reports.js') ?>"></script>