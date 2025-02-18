<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">

            <div class="pd-1 card-box mb-30">
                <div class="pd-1">
                    <h4 class="text-black h5 text-center">Employee Grade Check</h4>
                </div>
                <!-- Button Groups for Date Filters -->
                <div class="row py-3" id="Day_Wise_Visible">
                    <div class="col-md-12 d-flex justify-content-end p-3">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-secondary btn-sm" id="Last_30">Last 30
                                Days</button>&nbsp;
                            <button type="button" class="btn btn-warning btn-sm" id="Last_60">Last 60
                                Days</button>&nbsp;
                            <button type="button" class="btn btn-info btn-sm" id="Last_90">Last 90 Days</button>
                        </div>
                    </div>
                </div>
                <!-- Button Groups for OnRoll Date Filters -->
                <div class="row py-3" id="OnRoll_Day_Wise_Visible">
                    <div class="col-md-12 d-flex justify-content-end p-3">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-secondary btn-sm" id="On_Last_30">Last 30
                                Days</button>&nbsp;
                            <button type="button" class="btn btn-warning btn-sm" id="On_Last_60">Last 60
                                Days</button>&nbsp;
                            <button type="button" class="btn btn-info btn-sm" id="On_Last_90">Last 90 Days</button>
                        </div>
                    </div>
                </div>

                <!-- Filter Form -->
                <form method="POST" enctype="multipart/form-data">
                    <div class="row py-2">
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
                                <label>Type</label>
                                <select class="custom-select2 form-control" name="Employee_Status" id="Employee_Status">
                                    <option value="">---select---</option>
                                    <option value="Active">Active</option>
                                    <option value="InActive">In-Active</option>
                                    <option value="Traniee">Trainee</option>
                                    <option value="OnRoll">OnRoll</option>
                                    <span class="text-danger"><?php echo form_error('Type'); ?></span>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3" id="Inactive">
                            <div class="form-group">
                                <label>From Date</label>
                                <input type="date" class="form-control" name="Fdate" id="Fdate">
                                <span class="text-danger"><?php echo form_error('Fdate'); ?></span>
                            </div>
                        </div>
                        <div class="col-md-3" id="Inactive1">
                            <div class="form-group">
                                <label>To Date</label>
                                <input type="date" class="form-control" name="Tdate" id="Tdate">
                                <span class="text-danger"><?php echo form_error('Tdate'); ?></span>
                            </div>
                        </div>
                        <div class="col-md-3" id="Trainee">
                            <div class="form-group">
                                <label>Month</label>
                                <input type="number" class="form-control" name="TaineeMonth" id="TaineeMonth">
                                <span class="text-danger"><?php echo form_error('TaineeMonth'); ?></span>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-end py-3">
                        <div class="col-auto">
                            <button type="button" class="btn btn-info btn-sm" id="Employee_Statuss">View</button>
                        </div>
                    </div>
                </form>

            </div>

            <!-- Active Employees Section -->
            <div class="card-box mb-30" id="Card_Active">
                <div class="row py-3">
                    <div class="col-md-12 d-flex justify-content-end p-3">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-warning btn-sm"
                                id="Employee_Active_List_Download">Download</button>
                        </div>
                    </div>
                </div>
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Employee Active List</h4>
                </div>
                <div class="pb-5">
                    <table class="table table-bordered table-hover nowrap table-responsive">
                        <thead class="" style="background-color: #519352">
                            <tr>
                                <th>S.No</th>
                                <th>Department</th>
                                <th>Joining Date</th>
                                <th>Employee Name</th>
                                <th>Employee Id</th>
                                <th>Experience</th>
                                <th>Mobile</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="Active_Employee">
                            <!-- Table content will be dynamically added here -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Inactive Employees Section -->
            <div class="card-box mb-30" id="Card_InActives">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Employee Inactive List</h4>
                </div>
                <div class="pb-5">
                    <table class="table table-bordered table-hover nowrap table-responsive">
                        <thead class="" style="background-color: #519352">
                            <tr>
                                <th>S.No</th>
                                <th>Department</th>
                                <th>Joining Date</th>
                                <th>Resign Date</th>
                                <th>Employee Name</th>
                                <th>Employee Id</th>
                                <th>Experience</th>
                                <th>Mobile</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="InActive_Employee">
                            <!-- Table content will be dynamically added here -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Trainee Employees Section -->
            <div class="card-box mb-30" id="Card_Traniee">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Employee Trainee List</h4>
                </div>
                <div class="pb-5">
                    <table class="table table-bordered table-hover nowrap table-responsive">
                        <thead class="" style="background-color: #519352">
                            <tr>
                                <th>S.No</th>
                                <th>Department</th>
                                <th>Joining Date</th>
                                <th>Employee Name</th>
                                <th>Employee Id</th>
                                <th>Experience</th>
                                <th>Mobile</th>
                                <th>Active Months</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="TraineeEmployee">
                            <!-- Table content will be dynamically added here -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- OnRoll Employees Section -->
            <div class="card-box mb-30" id="Card_OnRoll">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Employee OnRoll List</h4>
                </div>
                <div class="pb-">
                    <table class="table table-bordered table-hover nowrap table-responsive">
                        <thead class="" style="background-color: #519352">
                            <tr>
                                <th>S.No</th>
                                <th>Department</th>
                                <th>Joining Date</th>
                                <th>Employee Name</th>
                                <th>Employee Id</th>
                                <th>Experience</th>
                                <th>6 Months After DOJ</th>
                                <th>Mobile</th>
                                <th>Active Months</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="OnrollEmployee">
                            <!-- Table content will be dynamically added here -->
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <script src="<?php echo base_url('assets/Script/Master.js') ?>"></script>
        <script src="<?php echo base_url('assets/Script/Grade_Master.js') ?>"></script>
        <script src="<?php echo base_url('assets/Script/Reports.js') ?>"></script>