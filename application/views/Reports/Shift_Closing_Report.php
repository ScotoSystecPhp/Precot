<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">


            <!-- Bootstrap TouchSpin Start -->
<div class="pd-5 card-box mb-30 py-5">
    <div class="pd-5">
        <h4 class="text-black h5 text-center">Employee Shift Closing Report</h4>
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
                    <label>Shift</label>
                    <select class="custom-select2 form-control" name="Shift" id="Shift">
                    </select>
                </div>
            </div>
</div>
             <div class="row justify-content-end py-2">
                        <div class="col-auto">
                            <button type="button" class="btn btn-warning btn-sm" id="Shift_Closing_Report_Down_Btn">Download</button>
                            <button type="button" class="btn btn-info btn-sm" id="Shift_Closing_Report_View">View</button>
                        </div>
                    </div>

                        <div id="Shift_Closing_List_Table_Container">
                        <table class="table table-responsive" id="Shift_Closing_List_Table">
                            <thead>
                                <tr>
                                    <th>S.No</th>

                                    <th>Department</th>
                                    <th>Work Area</th>
                                    <th>Job Card No</th>
                                     <th>Employee Id</th>
                                    <th>Employee Name</th>
                                    <th>Closing Status</th>
                                    <th>Created By</th>
                                     <th>Created Time</th>
                                     <th>Updated By</th>
                                     <th>Updated Time</th>




                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>

                    </div>

</div>

        </div>

</form>




<script src="<?php echo base_url('assets/Script/Reports.js') ?>"></script>