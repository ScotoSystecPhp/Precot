

<style>
    /* Basic styling */
    canvas {
      max-width: 100%;
      height: 400px;
      margin: auto;
    }
  </style>

<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">



            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-5 card-box mb-30">
                <div class="pd-5">
                    <h4 class="text-black h5 text-center">Employee Attendance Grade</h4>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    <div class="row py-3">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label>Department</label>
                                <select class="custom-select2 form-control" name="Department" id="Department">
                                    <span class="text-danger"><?php echo form_error('Department'); ?></span>
                                </select>
                            </div>
                        </div>
</div>
                        <div class="row justify-content-end">
                        <div class="col-auto">
                            <button type="button" class="btn btn-info btn-sm" id="Attendance_Sheet_Tables">View</button>
                        </div>
                    </div>

                        <div style="width: 80%; margin: 0 auto;">
                        <h4 class="text-black h5 text-center">Employee Attendance Record Grade</h4>
                        <!-- Create a canvas where the chart will be displayed -->
                            <canvas id="myBarChart"></canvas>
                        </div>

                    </div>

                </form>
            </div>


            <div class="card-box mb-30" id="Employee_Attendance_List_Grade">
                <div class="pd-20">
                    <h4 class="text-black h5 text-center">Employee Attendance Grade</h4>
                </div>

                <div class="row justify-content-end py-3">
                    <div class="col-auto">
                        <button type="button" class="btn btn-success btn-sm" id="AGradeGroup">A Grade Group</button>
                        <button type="button" class="btn btn-warning btn-sm" id="BGradegroup">B Grade Group</button>
                        <button type="button" class="btn btn-danger btn-sm" id="CGradegroup">C Grade Group</button>
                        <button type="button" class="btn btn-secondary btn-sm" id="TraineGradegroup">Trainee Group</button>
                        <button type="button" class="btn btn-info btn-sm" id="NewGradegroup">New Group</button>
                        <button type="button" class="btn btn-info btn-sm" id="Default">Default</button>
                    </div>
                </div>
                <div class="table-container">
    <div class="table-responsive">
        <table class="table table-bordered table-hover" id="Attendance_Sheet_Table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Joining Date</th>
                    <th>Employee Id</th>
                    <th>Employee Name</th>
                    <th>Working Months</th>
                    <th>Status</th>
                    <th>Attendance Percentage</th>
                    <th>Employee Attendance Grade</th>
                </tr>
            </thead>
            <tbody>
                <!-- Table rows will be inserted here -->
            </tbody>
        </table>
    </div>
</div>

            </div>


            <script src="<?php echo base_url('assets/Script/Master.js') ?>"></script>
            <script src="<?php echo base_url('assets/Script/Grade_Master.js') ?>"></script>