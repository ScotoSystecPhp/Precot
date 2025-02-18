<div class="main-container">
    <div class="pd-ltr-20 xs-pd-5-5">
        <div class="min-height-200px">
            <div class="card-box mb-30">
                <div class="pd-1">
                    <h4 class="text-black h5 text-center">Work Area Overview</h4>
                </div>
                <div class="row">
                    <div class="col-md-12 d-flex justify-content-end p-3">
                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                            <a href="<?php echo base_url('Master/Add_depart') ?>" class="btn btn-info btn-sm">Add
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
                                    <th>Company Code</th>
                                    <th>Location Code</th>
                                    <th>Department</th>
                                    <th>Work Area Name</th>
                                    <th>Created By</th>
                                    <th>Created Time</th>

                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $i = 1;
                                foreach ($Sub_Dep as $Data) {
                                ?>
                                <tr>
                                    <td><?php echo $i; ?></td>
                                    <td><?php echo $Data->Ccode; ?></td>
                                    <td><?php echo $Data->Lcode; ?></td>
                                    <td><?php echo $Data->Department; ?></td>
                                    <td><?php echo $Data->WorkArea; ?></td>
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
            </div>
        </div>