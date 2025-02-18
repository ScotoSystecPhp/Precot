<div class="main-container">

 <style>
    /* .custom-select2-container .select2-selection__rendered {
        font-size: 16px;
        padding: 12px 10px;
        height: auto;
    } */

    .custom-select2-container .select2-selection__rendered {
        line-height: 1.5;
    }
    .status {
            display: inline-block;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            border-radius: 5px;
            margin: 5px;
        }
        .green {
            background-color: #A7FEA5;
            color: black;
        }
        .orange {
            background-color: #FFE992;;
            color: black;
        }
        .white {
            background-color: white;
            color: black;
            border: 1px solid #ccc;
        }
    </style>


    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">

            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-5 card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Employee Work Assignment</h4>
                </div>
                <!-- <div class="row justify-content-end btn-sm py-1">
                    <div class="col-auto">
                        <button type="button" class="btn btn-primary btn-sm" id="downloadBtn"
                            style="display: none;">Download</button>
                        <a href="<?php echo base_url('Upload_Format/work_allocation_upload'); ?>"
                            class="btn btn-info btn-sm">Upload Format</a>
                        <button type="button" class="btn btn-warning btn-sm" data-toggle="modal"
                            data-target="#bulkupload">Bulk Upload</button>&nbsp;
                    </div>
                </div> -->


                <form method="POST" enctype="multipart/form-data">

                    <div class="row py-2">

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="Date" class="form-control" id="Date" name="Date">
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Shift</label>
                                <select class="custom-select2 form-control" name="Shift" id="Shift">
                                    <span class="text-danger"><?php echo form_error('Shift'); ?></span>
                                </select>
                            </div>

                            <input type="hidden" value="SHIFT" id="Type">


                        </div>




                </form>
                    </div>


                <div id="Allocation_Table_Container">
                    <div class="pd-20">
                        <h4 class="text-black h5 text-center">Employee Allocation List</h4>
                    </div>

                    <div class="row justify-content-end py-3">
                        <div class="col-auto">
                            <button type="button" class="btn btn-info btn-sm" id="Previous-Date-Allocation">Previous Allocation</button>
                        </div>
                    </div>

                    <div class="table-container">
                        <div class="row py-3">
                            <div class="status green">Allocated</div>
                            <div class="status white">Unallocated</div>
                            <div class="status orange">No Work</div>
                        </div>

                        <table class="table table-responsive w-70" id="Allocation_Table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Department</th>
                                    <th>Work Area</th>
                                    <th>Job Crad No</th>
                                    <th>Employee Id</th>
                                    <th>Employee Name</th>
                                    <th>Work</th>
                                    <th>Frame Method</th>
                                    <th>Frame</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>

                    </div>

                </div>
            </div>


            <!-- Work Allocation Upload Modal -->
            <div class="modal fade" id="bulkupload" tabindex="-1" aria-labelledby="bulkUploadLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="bulkUploadLabel">Bulk Upload</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>


                        <div class="modal-body">
                            <form id="bulkUploadForm" method="POST"
                                action="<?php echo base_url('Upload/work_allocation_upload'); ?>"
                                enctype="multipart/form-data">
                                <div class="form-group">
                                    <label for="fileInput">Choose File</label>
                                    <input type="file" name="fileInput" class="form-control" id="fileInput"
                                        accept=".csv, .xlsx" required>
                                </div>
                                <div class="form-group">
                                    <small class="form-text text-muted">
                                        Supported formats: CSV, Excel. Please ensure the file is properly formatted.
                                    </small>
                                </div>
                                <div id="uploadStatus" class="text-success" style="display: none;">File uploaded
                                    successfully!</div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" form="bulkUploadForm" class="btn btn-primary">Upload</button>
                        </div>
                    </div>
                </div>
            </div>






            <script src="<?php echo base_url('assets/Script/New_Allocation.js') ?>"></script>
