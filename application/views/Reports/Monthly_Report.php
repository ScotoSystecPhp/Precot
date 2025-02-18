<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">
            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-5 card-box mb-30">

                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Employee Monthly Work Assignment Report</h4>
                </div>

                <form method="POST" enctype="multipart/form-data">
                    <div class="row py-2">

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="month" class="form-control" id="Date" name="Date" value="">
                            </div>
                        </div>

                                           </div>



                    <div class="row justify-content-end">
                        <div class="col-auto">
                            <button type="button" class="btn btn-warning btn-sm" id="Work_Allocation_Report_Down_Btn">Download</button>
                            <button type="button" class="btn btn-info btn-sm" id="Month_Work_Allocation_View">View</button>
                        </div>
                    </div>
</form>



                    <div class="table-container py-5" id="Work_Allocation_List_Container">
                        <div class="table-responsive">
                            <table class="table" id="Work_Allocation_List">
                                <thead style="background-color: #519352">
                                    <tr>
                                        <th>S.No</th>
                                        <th>Department</th>
                                        <th>Work Area</th>
                                        <th>Job Card No</th>
                                        <th>Employee Name</th>
                                        <th>Employee Id</th>
                                        <th>Machine Id</th>
                                        <th>Machine Name</th>
                                        <th>Frame Type</th>
                                        <th>Frame</th>
                                        <th>Work</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Table rows here -->
                                </tbody>
                            </table>
                        </div>
                    </div>



            </div>

            <script src="<?php echo base_url('assets/Script/Reports.js') ?>"></script>