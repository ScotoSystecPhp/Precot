<div class="main-container">
    <div class="pd-ltr-20 xs-pd-5-5">
        <div class="min-height-200px">
            <!-- Bootstrap TouchSpin Start -->
            <div class="card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Machinery Overview List</h4>
                </div>
                <div class="row py-2">
                    <div class="col-md-12 d-flex justify-content-end p-3">
                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                            <a href="<?php echo base_url('Upload_Format/Machine') ?>"
                                class="btn btn-warning btn-sm">Upload Format</a>&nbsp;
                            <button type="button" class="btn btn-primary btn-sm" data-toggle="modal"
                                data-target="#bulkupload">Bulk Upload</button>&nbsp;
                            <a href="<?php echo base_url('JobCard/Add_Machine') ?>" class="btn btn-info btn-sm">Add
                                New</a>
                        </div>
                    </div>
                </div>

                <div class="pb-5">
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover nowrap" id="Tables">
                            <thead style="background-color: #519352">
                                <tr>
                                    <th>S.No</th>
                                    <th>Department</th>
                                    <th>Work Area</th>
                                    <!-- <th>Job Card No</th> -->
                                    <th>Machine Id</th>
                                    <th>Machine Model</th>
                                    <th>Machine Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $i = 1;
                                foreach ($Machine_Master as $Data) { ?>
                                <tr>
                                    <td><?php echo $i; ?></td>
                                    <td><?php echo $Data->Department; ?></td>
                                    <td><?php echo $Data->WorkArea; ?></td>
                                    <!-- <td><?php echo $Data->JobCard_No; ?> </td> -->
                                    <td><?php echo $Data->Machine_Id; ?> </td>
                                    <td><?php echo $Data->Machine_Model; ?> </td>
                                    <td><?php echo $Data->Machine_Name; ?> </td>
                                    <td><?php $Status = $Data->Status;

                                            if ($Status == 'Active') {
                                                echo '<span class="badge badge-success" style="padding: 0.2rem 0.4rem; font-size: 0.9rem;">Running</span>';
                                            } else {
                                                echo '<span class="badge badge-danger" style="padding: 0.2rem 0.4rem; font-size: 0.9rem;">Not Running</span>';
                                            }






                                            ?> </td>
                                </tr>
                                <?php
                                    $i++;
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- The Job Card Upload Modal -->
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
                                action="<?php echo base_url('Upload/Machine_Upload'); ?>" enctype="multipart/form-data">
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
                    icon: alertData.type === 'success' ? 'success' : 'error',
                    showConfirmButton: true,
                    customClass: {
                        popup: "swal-small" // Apply the custom class for smaller alert
                    }
                });
                </script>
                <?php endif; ?>
            </div>
        </div>