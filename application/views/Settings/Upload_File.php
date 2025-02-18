<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">

            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-5 card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Employee Work Assignment</h4>
                </div>
                <div class="row justify-content-end btn-sm py-3">
                    <div class="col-auto">
                        <button type="button" class="btn btn-warning btn-sm" id="downloadBtn" style="display: none;">Download</button>
                        <a href="<?php echo base_url('Upload_Format/work_allocation_upload'); ?>" class="btn btn-info btn-sm">Upload Format</a>
                        <button type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#bulkupload">Bulk Upload</button>&nbsp;
                    </div>
                </div>
                <form method="POST" enctype="multipart/form-data">

                    <div class="row py-2">

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Users</label>
                                <select class="custom-select2 form-control" name="Users" id="Users">
                                    <option value=""></option>
                                    <option value="Admin">Admin</option>
                                    <option value="Supervisor">Supervisor</option>

                                    <span class="text-danger"><?php echo form_error('Users'); ?></span>

                                </select>
                            </div>
                        </div>

                             <div class="col-md-4">
                            <div class="form-group">
                                <label>Setting Type</label>
                                <select class="custom-select2 form-control" name="Setting_Type" id="Setting_Type">
                                    <option value=""></option>
                                    <option value="Job Card Bluk Upload">Bluk Upload</option>
                                    <option value="Machine Bluk Upload">Format Bluk Upload</option>

                                    <span class="text-danger"><?php echo form_error('Users'); ?></span>

                                </select>
                            </div>
                        </div>

                         <div class="col-md-4">
                            <div class="form-group">
                                <label>Setting</label>
                                <select class="custom-select2 form-control" name="Users" id="Users">
                                    <option value=""></option>
                                    <option value="Job Card Bluk Upload">Job Card Bluk Upload</option>
                                    <option value="Machine Bluk Upload">Machine Bluk Upload</option>
                                    <option value="Work Allocation Bluk Upload<">Work Allocation Bluk Upload</option>

                                    <span class="text-danger"><?php echo form_error('Users'); ?></span>

                                </select>
                            </div>
                        </div>


</div>
</div>
</div>





            <script src="<?php echo base_url('assets/Script/Master.js') ?>"></script>
            <script src="<?php echo base_url('assets/Script/Allocation.js') ?>"></script>

