<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">




            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-20 card-box mb-30">
            <div class="pd-1">
                    <h4 class="text-black h5 text-center">Work Area Add Section</h4>
                </div>
                 <div class="row">
                    <div class="col-md-12 d-flex justify-content-end p-3">
                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                            <a href="<?php echo base_url('Master') ?>" class="btn btn-secondary btn-sm">Back</a>
                        </div>
                    </div>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    <div class="row py-3">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Company Code</label>
                                <input type="text" class="form-control" id="Ccode" value="<?php echo $Ccode ?>" name="Ccode" readonly>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Location Code</label>
                                <input type="text" class="form-control" id="Lcode" name="Lcode" value="<?php echo $Lcode ?>" readonly>
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
                                <label>Work Area Name</label>
                                <input type="text" class="form-control" id="Sub_Depat" name="Sub_Depat">
                            </div>
                        </div>

                    </div>
                    <!-- <div class="row py-3">

                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Work Area Code</label>
                                <input type="text" class="form-control" id="Sub_Depat_Code" name="Sub_Depat_Code">
                            </div>
                        </div>


                    </div> -->
                    <div class="row justify-content-end">
                        <div class="col-auto">
                            <button type="submit" class="btn btn-info btn-sm">Save</button>
                        </div>
                    </div>
                </form>
            </div>

            <script src="<?php echo base_url('assets/Script/Master.js') ?>"></script>

            <script>
                <?php if ($this->session->flashdata('success')) : ?>
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: '<?php echo $this->session->flashdata('success'); ?>',
                    });
                <?php endif; ?>

                <?php if ($this->session->flashdata('error')) : ?>
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: '<?php echo $this->session->flashdata('error'); ?>',
                    });
                <?php endif; ?>
            </script>