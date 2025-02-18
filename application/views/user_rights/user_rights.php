<div class="main-container">
    <div class="pd-ltr-20 xs-pd-20-10">
        <div class="min-height-200px">
           

            <!-- Bootstrap TouchSpin Start -->
            <div class="pd-20 card-box mb-30">
                <form method="POST" enctype="multipart/form-data" id="userRightsForm">
                    <div class="row">
                        <div class="col-md-4">
                            <label for="Users" class="text-dark">User Type</label>
                            <select name="Users" class="form-control search" id="User_Type" required>
                                <option value="Select">Select</option>
                                <option value="HR">Super Admin</option>
                                <option value="Supervisor">Supervisor</option>
                            </select>
                        </div>
                    </div>
            </div>

            <div class="pd-20 card-box mb-30">
                <div class="row p-3" id="column" style="display: none;">
                    <div class="col-sm-12">
                        <!-- Material tab card start -->
                        <div class="card">
                            <div class="card-block">
                                <div class="col-lg-12 table-responsive">
                                    <table id="UserRights" class="table" style="width:100%">
                                        <thead>
                                            <tr>
                                                <th>Menus</th>
                                                <th class="thcol">ScreenPermission</th>
                                            </tr>
                                        </thead>
                                        <tbody id="good">
                                            <!-- Table content will be dynamically added here -->
                                        </tbody>
                                    </table>
                                    <button class="btn btn-danger btn-sm" type="button" id="Form-Update">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </form>
            </div>
        </div>

        <script src="<?php echo base_url('assets/Script/User_Rights.js') ?>"></script>