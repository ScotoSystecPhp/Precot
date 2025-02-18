<!DOCTYPE html>
<html>

<head>
    <!-- Basic Page Info -->
    <meta charset="utf-8">
    <title><?php echo $Favicon;?></title>
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
    <link rel="stylesheet" type="text/css" href=" <?php echo base_url('assets/vendors/styles/icon-font.min.css') ?>">
    <link rel="stylesheet" type="text/css"
        href=" <?php echo base_url('assets/src/plugins/datatables/css/dataTables.bootstrap4.min.css') ?>">
    <link rel="stylesheet" type="text/css"
        href=" <?php echo base_url('assets/src/plugins/datatables/css/responsive.bootstrap4.min.css') ?>">
    <link rel="stylesheet" type="text/css" href=" <?php echo base_url('assets/vendors/styles/style.css') ?>">
    <link rel="stylesheet" type="text/css" href=" <?php echo base_url('assets/vendors/styles/preloader.css') ?>">





    <!-- jQuery CDN
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-119386393-1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }
    gtag(' js', new Date());
    gtag('config', 'UA-119386393-1');
    </script>
    <script>
    var baseurl = '<?php echo base_url() ?>';
    </script>



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
</head>

<body>
    <!-- <div class="pre-loader">
    <div class="pre-loader-box">
        <div class="loader-logo"></div>
        <div class='circle' id='circle'></div>
    </div>
</div> -->

    <div class="header">
        <div class="header-left">
            <div class="menu-icon dw dw-menu"></div>

        </div>

        <div class="header-right">

            <div class="dashboard-setting user-notification">
                <div class="dropdown">
                    <a class="dropdown-toggle no-arrow" href="javascript:;" data-toggle="right-sidebar">
                        <i class="dw dw-settings2"></i>
                    </a>
                </div>
            </div>
            <div class="user-notification">
                <div class="dropdown">
                    <a class="dropdown-toggle no-arrow" href="#" role="button" data-toggle="dropdown">
                        <i class="icon-copy dw dw-notification"></i>
                        <span class="badge notification-active"></span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <div class="notification-list mx-h-350 customscroll">
                            <ul>
                                <li>
                                    <a href="#">
                                        <img src="<?php echo base_url('assets/vendors/images/img.jpg') ?>">
                                        <h3>John Doe</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src="<?php echo base_url('assets/vendors/images/photo1.jpg') ?>">
                                        <h3>Lea R. Frith</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src="<?php echo base_url('assets/vendors/images/photo2.jpg') ?>">
                                        <h3>Erik L. Richards</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src="<?php echo base_url('assets/vendors/images/photo3.jpg') ?>">
                                        <h3>John Doe</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src="<?php echo base_url('assets/vendors/images/photo3.jpg') ?>">
                                        <h3>Renee I. Hansen</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src="<?php echo base_url('assets/vendors/images/img.jpg') ?>">
                                        <h3>Vicki M. Coleman</h3>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed...</p>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="user-info-dropdown">
                <div class="dropdown user-icon">
                    <a href="#" role="button" id="userDropdown">
                        <span>
                            <img src="<?php echo base_url('assets\Logo\avatar.webp'); ?>" alt="User Avatar">
                        </span>
                        <!-- <span class="user-name">
							<?php
							// Retrieve session data safely
							$userdata = $this->session->userdata('sess_array');

							// Check if session data exists
							if ($userdata && isset($userdata['UserName'])) {
								echo $userdata['UserName']; // Display the user's name
							} else {
								echo "Guest"; // Default fallback
							}
							?>
						</span> -->
                    </a>
                    <div class="dropdown-menu dropdown-menu-right dropdown-menu-icon-list" id="dropdownMenu">
                        <a class="dropdown-item">
                            <i class="bi bi-building"></i>
                            <?php
							// Check if session data exists and display user role
							if ($userdata && isset($userdata['Designation'])) {
								echo $userdata['Designation'];
							} else {
								echo "Unknown Role"; // Default fallback
							}
							?>
                        </a>
                        <a class="dropdown-item">
                            <i class="dw dw-user1"></i>
                            <?php
							// Check if session data exists and display user role
							if ($userdata && isset($userdata['UserName'])) {
								echo $userdata['UserName'];
							} else {
								echo "Unknown UserName"; // Default fallback
							}
							?>
                        </a>
                        <!-- <a class="dropdown-item" href="login.html">
							<i class="dw dw-logout"></i> Log Out
						</a> -->

                        <a class="dropdown-item text-black" href="<?php echo base_url('Auth/logout'); ?>">
                            <i class="dw dw-logout"></i> Log Out
                        </a>

                    </div>
                </div>
            </div>





        </div>
    </div>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

    <script>
    // JavaScript for dropdown functionality
    document.addEventListener("DOMContentLoaded", function() {
        const dropdownToggle = document.getElementById("userDropdown");
        const dropdownMenu = document.getElementById("dropdownMenu");

        // Toggle dropdown menu visibility on click
        dropdownToggle.addEventListener("click", function(e) {
            e.preventDefault();
            dropdownMenu.classList.toggle("show");
        });

        // Close the dropdown if clicked outside
        document.addEventListener("click", function(e) {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    });
    </script>

    <style>

    </style>