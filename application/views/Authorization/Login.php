<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Basic Page Info -->
    <meta charset="utf-8">
    <title>Procot Login Page</title>

    <!-- Site favicon -->
    <link rel="icon" type="image/png" href="<?php echo base_url('assets/Logo/Precot-App-Logo.png') ?>" sizes="16x16">
    <link rel="icon" type="image/png" href="<?php echo base_url('assets/Logo/Precot-App-Logo.png') ?>" sizes="32x32">
    <link rel="icon" type="image/png" href="<?php echo base_url('assets/Logo/Precot-App-Logo.png') ?>" sizes="64x64">

    <!-- Mobile Specific Metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

    <!-- CSS -->
    <link rel="stylesheet" type="text/css" href="<?php echo base_url('assets/vendors/styles/core.css') ?>">
    <link rel="stylesheet" type="text/css" href="<?php echo base_url('assets/vendors/styles/icon-font.min.css') ?>">
    <link rel="stylesheet" type="text/css" href="<?php echo base_url('assets/vendors/styles/style.css') ?>">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-119386393-1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'UA-119386393-1');
    </script>

    <style>
    body {
        background-image: url('<?php echo base_url('assets/Logo/background.jpg') ?>');
        /* Ensure this image exists */
        background-size: cover;
        background-position: center;
    }
    </style>
</head>

<body class="login-page">
    <div class="login-wrap d-flex align-items-center justify-content-center min-vh-100">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="login-box"
                        style="background-color: rgba(255, 255, 255, 0.5); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 16px;">
                        <div class="login-title text-center">
                            <a href="#">
                                <img src="<?php echo base_url('assets/Logo/precot.png') ?>" alt="Precot Logo"
                                    class="dark-logo" style="height: 60px; width: 140px;">
                            </a>
                        </div>
                        <form action="<?php echo base_url('Auth/Verify') ?>" method="POST">
                            <div class="input-group custom mb-3 py-2">
                                <input type="text" class="form-control form-control-lg" name="UserName" id="username"
                                    placeholder="Username" required>
                                <div class="input-group-append custom">
                                    <span class="input-group-text"><i class="icon-copy dw dw-user1"></i></span>
                                </div>
                            </div>
                            <div class="input-group custom mb-3 py-2">
                                <input type="password" class="form-control form-control-lg" name="Password" id="password"
                                    placeholder="Password" required>
                                <div class="input-group-append custom">
                                    <span class="input-group-text"><i class="dw dw-eye"></i></span>
                                </div>
                            </div>
                            <div class="row pb-30 py-4">
                                <div class="col-6">
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="customCheck1">
                                        <label class="custom-control-label" for="customCheck1">Remember</label>
                                    </div>
                                </div>

                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="input-group mb-0">
                                        <button type="submit" class="btn btn-success btn-lg btn-block btn-sm">Login</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- JS -->
    <script src="<?php echo base_url('assets/vendors/scripts/core.js') ?>"></script>
    <script src="<?php echo base_url('assets/vendors/scripts/script.min.js') ?>"></script>
    <script src="<?php echo base_url('assets/vendors/scripts/process.js') ?>"></script>
    <script src="<?php echo base_url('assets/vendors/scripts/layout-settings.js') ?>"></script>
    <script src="<?php echo base_url('assets/src/plugins/sweetalert2/sweetalert2.all.js') ?>"></script>
<script src="<?php echo base_url('assets/src/plugins/sweetalert2/sweet-alert.init.js') ?>"></script>
</body>

<script>

   $(document).ready(function(){

    var base_url = "<?php echo base_url()?>";


    $("#Save_Data").on("click",function(){


        var UserName = $("#username").val();
        var Password = $("#password").val();

        $.ajax({
            url : base_url + 'Auth/verify', // Your controller's method to handle login
            method : 'POST',
            data : {
                UserName: UserName,
                Password: Password
            },
            success:function(response){
                var Response_Data = JSON.parse(response); // Parse the JSON response

                if(Response_Data.status == "error"){ // Check if the status is error


                    swal(
                                        {
                                            type: 'warning',
                                            title: 'warning',
                                            text: Response_Data.message,
                                        }
                                    );
                } else if(Response_Data.status == "success"){
                    // Redirect to the home page or wherever needed
                    window.location.href = "<?php echo base_url(); ?>Home";
                }
            },
            error:function(xhr, status, error){


                swal(
                                        {
                                            type: 'warning',
                                            title: 'warning',
                                            text: 'An error occurred while processing your request.',
                                        }
                                    );
            }
        });
    });
});



</script>




</html>