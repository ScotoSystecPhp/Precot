<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">



            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-20 card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Electrical Power Analysis</h4>
                </div>
                <form method="POST" enctype="multipart/form-data" id="eb-form">
                    <div class="row py-3">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" class="form-control" id="Date" name="Date"  required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Service Number</label>
                                <select class="custom-select2 form-control" name="Service_No" id="Service_No" required>
                                    <option value="">Select Service Number</option>
                                    <!-- Dynamically populate this dropdown using PHP or JS -->
                                </select>
                                <span class="text-danger"><?php echo form_error('Service_No'); ?></span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Service Name</label>
                                <input type="text" class="form-control" name="Service_Name" id="Service_Name" readonly>
                                <span class="text-danger"><?php echo form_error('Service_Name'); ?></span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Previous Unit</label>
                                <input type="number" class="form-control" name="Previous_Day_Unit" id="Previous_Day_Unit" readonly>
                                <span class="text-danger"><?php echo form_error('Previous_Day_Unit'); ?></span>
                            </div>
                        </div>
                    </div>
                    <div class="row py-3">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Current Unit</label>
                                <input type="number" class="form-control" name="Current_Day_Unit" id="Current_Day_Unit" required>
                                <span class="text-danger"><?php echo form_error('Current_Day_Unit'); ?></span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Actual Unit</label>
                                <input type="number" class="form-control" name="Actual_Unit" id="Actual_Unit" required>
                                <span class="text-danger"><?php echo form_error('Actual_Unit'); ?></span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Today Rate</label>
                                <input type="number" class="form-control" name="Rate_Amount" id="Rate_Amount" readonly>
                                <span class="text-danger"><?php echo form_error('Rate_Amount'); ?></span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Amount</label>
                                <input type="number" class="form-control" name="Unit_Amount" id="Unit_Amount" readonly>
                                <span class="text-danger"><?php echo form_error('Unit_Amount'); ?></span>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-end">
                        <div class="col-auto">
                            <button type="button" class="btn btn-info btn-sm" id="EB_Calculation_Save">Save</button>
                        </div>
                    </div>
                </form>
            </div>

            <div class="card-box mb-30" id="EB_List_Card">
                <div class="pd-20">
                    <h4 class="text-black h5 text-center">Electrical Power Computation Table</h4>
                </div>
                <div class="table-container">
                    <table class="table table-bordered table-hover nowrap table-responsive" id="EB_List">
                        <thead style="background-color: #519352">
                            <tr>
                                <th>S.No</th>
                                <th>Date</th>
                                <th>Service No</th>
                                <th>Previous Unit</th>
                                <th>Current Unit</th>
                                <th>Running Unit</th>
                                <th>Unit Rate</th>
                                <th>Running Unit Amount</th>
                            </tr>
                        </thead>
                        <tbody >
                            <!-- Dynamically populated rows will go here -->
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
 

<script src="<?php echo base_url('assets/Script/EB.js') ?>"></script>