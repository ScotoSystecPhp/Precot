<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">
            <!-- Bootstrap TouchSpin Start -->
            <div class="card-box mb-30">
                <div class="pd-1">
                    <h4 class="text-black h5 text-center">Job Card Overview</h4>
                </div>
                <div class="row">
                    <div class="col-md-12 d-flex justify-content-end p-3">
                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                            <a href="<?php echo base_url('Upload_Format/Jobcard') ?>"
                                class="btn btn-warning btn-sm">Upload Format</a>&nbsp;
                            <button type="button" class="btn btn-primary btn-sm" data-toggle="modal"
                                data-target="#bulkupload">Bulk Upload</button>&nbsp;
                            <a href="<?php echo base_url('JobCard/add') ?>" class="btn btn-info btn-sm">Add
                                New</a>&nbsp;
                        </div>
                    </div>
                </div>

                <div class="pb-20">
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover nowrap" id="Tables">
                            <thead style="background-color: #519352">
                                <tr>
                                    <th>S.No</th>
                                    <th>Company Code</th>
                                    <th>Location Code</th>
                                    <th>Department</th>
                                    <th>Work Area</th>
                                    <th>Job Card No</th>
                                    <th>Created By</th>
                                    <th>Created Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $i = 1;
                                foreach ($Get_Job_Card as $Data) { ?>
                                <tr>
                                    <td><?php echo $i; ?></td>
                                    <td><?php echo $Data->Ccode; ?></td>
                                    <td><?php echo $Data->Lcode; ?></td>
                                    <td><?php echo $Data->Department; ?></td>
                                    <td><?php echo $Data->WorkArea; ?></td>
                                    <td><?php echo $Data->JobCard_No; ?></td>
                                    <td><?php echo $Data->CreatedBy; ?></td>
                                    <td><?php echo $Data->CreatedTime; ?></td>
                                </tr>
                                <?php
                                $i++;
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Job Card Upload Modal -->
                <div class="modal fade" id="bulkupload" tabindex="-1" aria-labelledby="bulkUploadLabel"
                    aria-hidden="true">
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
                                    action="<?php echo base_url('Upload/Jobcard_Upload'); ?>"
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


                    <!-- SweetAlert CDN -->
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
                    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

                    <!-- Sweet Alert -->
                    <?php if ($this->session->flashdata('alert')): ?>
                    <script>
                    const alertData = <?= json_encode($this->session->flashdata('alert')) ?>;

                    Swal.fire({
                        title: alertData.type === 'success' ? 'Success' : 'Error',
                        text: alertData.message,
                        buttons: true,
                        customClass: {
                            popup: "swal-small" // Apply the custom class for smaller alert
                        }
                    });
                    </script>
                    <?php endif; ?>
                </div>
            </div>
        </div>