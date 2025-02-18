<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Upload extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->helper('file');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->model('Upload_Model');
    }

    public function Jobcard_Upload()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $config['upload_path'] = './uploads/jobcard/';
            $config['allowed_types'] = '*';
            $config['max_size'] = 10240;
            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('fileInput')) {
                echo json_encode(array("result" => $this->upload->display_errors(), "res" => 0));
                exit;
            }

            $file_data = $this->upload->data();
            $file_path = $file_data['full_path'];

            if (!is_readable($file_path)) {
                echo json_encode(array("result" => "File is not readable or does not exist.", "res" => 0));
                exit;
            }

            $file_content = file_get_contents($file_path);
            $lines = explode("\n", $file_content);
            $header = str_getcsv(array_shift($lines));
            $seen_rows = array();
            $errors = array();

            foreach ($lines as $line_number => $line) {
                if (trim($line) != "") {
                    $row = str_getcsv($line);

                    if (in_array("", $row)) {
                        $errors[] = "Cell values missing on row " . ($line_number + 2);
                        continue;
                    }

                    $row_key = implode("-", $row);
                    if (isset($seen_rows[$row_key])) {
                        $errors[] = "Duplicate row found on row " . ($line_number + 2);
                        continue;
                    }
                    $seen_rows[$row_key] = true;

                    list($Ccode, $Lcode, $Department, $Work_Area, $Job_Card_No) = $row;

                    // Check Validation For Department
                    $this->data['Check_Department'] = $Check_Department = $this->Upload_Model->Check_Department($Ccode, $Lcode, $Department);

                    if ($Check_Department == 0) {
                        $errors[] = "Invalid department entered on this row. Please verify and select a valid department. " . ($line_number + 2);
                        continue;
                    }

                    // Check Validation For Work Area
                    $this->data['Check_Work_Area'] = $Check_Work_Area =  $this->Upload_Model->Check_Work_Area($Ccode, $Lcode, $Department, $Work_Area);

                    if ($Check_Work_Area == 0) {
                        $errors[] = "Invalid work area detected on row. Please verify the input and try again." . ($line_number + 2);
                        continue;
                    }

                    // Check Validation For Job Card Number
                    $this->data['Check_Job_Card_No'] = $Check_Job_Card = $this->Upload_Model->Check_Job_Card($Ccode, $Lcode, $Department, $Work_Area, $Job_Card_No);

                    if ($Check_Job_Card == 1) {
                        $errors[] = "The job card number already exists on this row. Please check and enter a unique job card number." . ($line_number + 2);
                        continue;
                    }

                    $fields = array(
                        'Ccode' => $Ccode,
                        'Lcode' => $Lcode,
                        'Department' => $Department,
                        'Sub_Department' => $Work_Area,
                        'Job_Card_No' => $Job_Card_No,
                        'Created_By' =>  $Session['UserName'],
                        'Created_Time' => date('Y-m-d H:i:s'),
                        'Updated_By' => '-',
                        'Updated_Time' => '-',
                    );

                    $save_target = $this->db->insert('Web_Job_Card_Mst', $fields);
                    if ($save_target == 0) {
                        $errors[] = "Error saving data for row " . ($line_number + 2);
                        continue;
                    }
                }
            }

            if (!empty($errors)) {
                $result = implode('<br>', $errors);
                $res = 0;
            } else {
                $result = "All data successfully uploaded.";
                $res = 1;
            }

            // Handle Errors
            if (!empty($errors)) {
                $this->session->set_flashdata('alert', array('type' => 'error', 'message' => implode('<br>', $errors)));
                redirect('JobCard');
            } else {
                $this->session->set_flashdata('alert', array('type' => 'success', 'message' => 'All data successfully uploaded.'));
                redirect('JobCard');
            }

            exit;
        } else {
            echo 'Unauthorized access.';
            exit;
        }
    }


    public function Machine_Upload()
    {

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $config['upload_path'] = './uploads/jobcard/';
            $config['allowed_types'] = '*';
            $config['max_size'] = 10240;
            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('fileInput')) {
                echo json_encode(array("result" => $this->upload->display_errors(), "res" => 0));
                exit;
            }

            $file_data = $this->upload->data();
            $file_path = $file_data['full_path'];

            if (!is_readable($file_path)) {
                echo json_encode(array("result" => "File is not readable or does not exist.", "res" => 0));
                exit;
            }

            $file_content = file_get_contents($file_path);
            $lines = explode("\n", $file_content);
            $header = str_getcsv(array_shift($lines));
            $seen_rows = array();
            $errors = array();

            foreach ($lines as $line_number => $line) {
                if (trim($line) != "") {
                    $row = str_getcsv($line);

                    if (in_array("", $row)) {
                        $errors[] = "Cell values missing on row " . ($line_number + 2);
                        continue;
                    }

                    $row_key = implode("-", $row);
                    if (isset($seen_rows[$row_key])) {
                        $errors[] = "Duplicate row found on row " . ($line_number + 2);
                        continue;
                    }
                    $seen_rows[$row_key] = true;

                    $T =  list($Ccode, $Lcode, $Department, $DepartmentCode, $Work_Area, $Machine_Code, $Machine_Name, $Frame_Type, $Input_Method, $Frame, $Unit, $Machine_Model, $Machine_Id) = $row;


                    // Check Validation For Department
                    $this->data['Check_Department'] = $Check_Department = $this->Upload_Model->Check_Department($Ccode, $Lcode, $Department);

                    if ($Check_Department == 0) {
                        $errors[] = "Invalid department entered on this row. Please verify and select a valid department. " . ($line_number + 2);
                        continue;
                    }

                    // Check Validation For Work Area
                    $this->data['Check_Work_Area'] = $Check_Work_Area =  $this->Upload_Model->Check_Work_Area($Ccode, $Lcode, $Department, $Work_Area);

                    if ($Check_Work_Area == 0) {
                        $errors[] = "Invalid work area detected on row. Please verify the input and try again." . ($line_number + 2);
                        continue;
                    }

                    // Check Validation For Machine Id
                    $this->data['Check_Machine_Id'] = $Check_Machine_Id = $this->Upload_Model->Check_Machine_Id($Ccode, $Lcode, $Department, $Work_Area, $Machine_Id);

                    if ($Check_Machine_Id == 1) {
                        $errors[] = "The Machine number already exists on this row. Please check and enter a unique Machine number." . ($line_number + 2);
                        continue;
                    }

                    $fields = array(
                        'Ccode' => $Ccode,
                        'Lcode' => $Lcode,
                        'Department' => $Department,
                        'Sub_Department' => $Work_Area,
                        'Machine_Code' => $Machine_Code,
                        'Machine_Name' => $Machine_Name,
                        'Frame_Type' => $Frame_Type,
                        'Input_Method' => $Input_Method,
                        'Frame' => $Frame,
                        'Unit' => $Unit,
                        'Machine_Model' => $Machine_Model,
                        'Machine_Id' => $Machine_Id,
                        'Created_By' =>  $Session['UserName'],
                        'Created_Time' => date('Y-m-d H:i:s'),
                        'Updated_By' => '-',
                        'Updated_Time' => '-',
                    );

                    $save_target = $this->db->insert('Web_Machine_Mst', $fields);
                    if ($save_target == 0) {
                        $errors[] = "Error saving data for row " . ($line_number + 2);
                        continue;
                    }
                }
            }

            if (!empty($errors)) {
                $result = implode('<br>', $errors);
                $res = 0;
            } else {
                $result = "All data successfully uploaded.";
                $res = 1;
            }

            // Handle Errors
            if (!empty($errors)) {
                $this->session->set_flashdata('alert', array('type' => 'error', 'message' => implode('<br>', $errors)));
                redirect('JobCard/Machine');
            } else {
                $this->session->set_flashdata('alert', array('type' => 'success', 'message' => 'All data successfully uploaded.'));
                redirect('JobCard/Machine');
            }

            exit;
        } else {
            echo 'Unauthorized access.';
            exit;
        }
    }

    public function work_allocation_upload()
    {

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $Ccode =  $Session['Ccode'];
            $Lcode =  $Session['Lcode'];


            $config['upload_path'] = './uploads/Work Allocation/';
            $config['allowed_types'] = '*';
            $config['max_size'] = 10240;
            $this->load->library('upload', $config);

            if (!$this->upload->do_upload('fileInput')) {
                echo json_encode(array("result" => $this->upload->display_errors(), "res" => 0));
                exit;
            }

            $file_data = $this->upload->data();
            $file_path = $file_data['full_path'];

            if (!is_readable($file_path)) {
                echo json_encode(array("result" => "File is not readable or does not exist.", "res" => 0));
                exit;
            }

            $file_content = file_get_contents($file_path);
            $lines = explode("\n", $file_content);
            $header = str_getcsv(array_shift($lines));
            $seen_rows = array();
            $errors = array();

            foreach ($lines as $line_number => $line) {
                if (trim($line) != "") {
                    $row = str_getcsv($line);

                    if (in_array("", $row)) {
                        $errors[] = "Cell values missing on row " . ($line_number + 2);
                        continue;
                    }

                    $row_key = implode("-", $row);
                    if (isset($seen_rows[$row_key])) {
                        $errors[] = "Duplicate row found on row " . ($line_number + 2);
                        continue;
                    }
                    $seen_rows[$row_key] = true;

                    list($Date, $Shift, $Department, $EmployeeId, $EmployeeName, $Work_Area, $Jobcard, $Machine_Id, $Frame, $Others) = $row;

                    // Check Validation For Department
                    $this->data['Check_Department'] = $Check_Department = $this->Upload_Model->Check_Department($Ccode, $Lcode, $Department);
                    if ($Check_Department == 0) {
                        $errors[] = "Invalid department entered on this row. Please verify and select a valid department. " . ($line_number + 2);
                        continue;
                    }

                    // Check Employee Present or Not
                    $this->data['Check_Employee_Present'] = $Check_Employee_Present = $this->Upload_Model->Check_Present_Employee($Ccode, $Lcode, $Date, $Shift, $Department, $EmployeeId);
                    if ($Check_Employee_Present == 0) {
                        $errors[] = "this employee Details not found $EmployeeId  Not Present. " . ($line_number + 2);
                        continue;
                    }

                    // Check Validation For Work Area
                    $this->data['Check_Work_Area'] = $Check_Work_Area =  $this->Upload_Model->Check_Work_Area($Ccode, $Lcode, $Department, $Work_Area);
                    if ($Check_Work_Area == 0) {
                        $errors[] = "Invalid work area detected on row. Please verify the input and try again." . ($line_number + 2);
                        continue;
                    }

                    // Check Jobcard Present or Not
                    $this->data['Check_Jobcard'] = $Check_Jobcard = $this->Upload_Model->Check_Jobcard($Ccode, $Lcode, $Department, $Work_Area, $Jobcard);
                    if ($Check_Jobcard == 0) {
                        $errors[] = "Invalid Jocard detected on row. Please verify the input and try again." . ($line_number + 2);
                        continue;
                    }

                    // Check Validation For OtherWork
                    // if ($Machine_Id == '') {
                    //     continue;
                    // } else {
                    //     $this->data['Check_Machine_Id'] = $Check_Machine_Id = $this->Upload_Model->Check_Machine_Id($Ccode, $Lcode, $Department, $Work_Area, $Machine_Id);
                    //     if ($Check_Machine_Id == 0) {
                    //         $errors[] = "Machine ID not found. Please ensure the correct Machine ID is entered. Row: " . ($line_number + 2);
                    //         continue;
                    //     }
                    // }

                    // $this->data['Check_Machine_Id'] = $Check_Machine_Id = $this->Upload_Model->Check_Machine_Id($Ccode, $Lcode, $Department, $Work_Area, $Machine_Id);
                    // if ($Check_Machine_Id == 0) {
                    //     $errors[] = "Machine ID not found. Please ensure the correct Machine ID is entered. Row: " . ($line_number + 2);
                    //     continue;
                    // }

                    // Employee Check Already Assign
                    $this->data['Check_Employee_Work_Assign'] = $Check_Employee_Work_Assign = $this->Upload_Model->Check_Employee_Work_Assign($Ccode, $Lcode, $Date, $Shift, $Department, $Work_Area, $Machine_Id, $Frame);
                    if ($Check_Employee_Work_Assign == 1) {
                        $errors[] = "This Machine Id Already Allocated Frames. Row: " . ($line_number + 2);
                        continue;
                    }

                    // Deuplicated For Work Allocation For Employee Others
                    if ($Machine_Id == '-') {
                        $this->data['Others_Works_Type'] = $Others_Works_Type = $this->Upload_Model->Others_Works_Type($Ccode, $Lcode, $Date, $Shift, $Department, $Work_Area, $Others, $EmployeeId);
                        if ($Others_Works_Type == 1) {
                            $errors[] = "This Employee Already Work Allocated Others or NoWork. Employee ID: $EmployeeId, Row: " . ($line_number + 2);
                            continue;
                        }
                    }
                    $this->data['Duplicated_Work_Allocation'] = $Duplicated_Work_Allocation = $this->Upload_Model->Duplicate_Work_Allocation($Ccode, $Lcode, $Date, $Shift, $Department, $Work_Area, $Machine_Id, $Frame, $EmployeeId);
                    if ($Duplicated_Work_Allocation == 1) {
                        $errors[] = "This Employee Already Work Allocated Frames. Employee ID: $EmployeeId, Row: " . ($line_number + 2);
                        continue;
                    }

                    if ($Others == 'Others' || $Others == 'NoWork') {
                        $Work_Allocation = [
                            'Ccode' => $Ccode,
                            'Lcode' => $Lcode,
                            'Machine_Id' => $Others,
                            'Machine_Name' => '-',
                            'Machine_Model' => '-',
                            'FirstName' => $EmployeeName,
                            'EmpNo' => $EmployeeId,
                            'ExistingCode' => $EmployeeId,
                            'Shift' => $Shift,
                            'Date' => $Date,
                            'Job_Card_No' => $Jobcard,
                            'Work_Type' => '-',
                            'DeptName' => $Department,
                            'Sub_Department' => $Work_Area,
                            'Frame' => '-',
                            'FrameType' => '-',
                            'Description' => '-',
                            'Work_Start' => '-',
                            'Work_End' => '-',
                            'Work_Duration' => '-',
                            'Machine_EB_No' => '-',
                            'Work_Status' => '1',
                            'Assign_Status' => ($Others == 'NoWork') ? '0' : '1',
                            'Closing_Status' => '0',
                            'Created_By' =>  $Session['UserName'],
                            'Created_Time' => date('Y-m-d H:i:s'),
                            'Updated_By' => '-',
                            'Updated_Time' => '-',
                        ];

                        $save_target = $this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation);
                        if ($save_target == 0) {
                            $errors[] = "Error saving data for row " . ($line_number + 2);
                            continue;
                        }
                    } else {

                        $Work_Allocation = [
                            'Ccode' => $Ccode,
                            'Lcode' => $Lcode,
                            'Machine_Id' => $Machine_Id,
                            'Machine_Name' => '-',
                            'Machine_Model' => '-',
                            'FirstName' => $EmployeeName,
                            'EmpNo' => $EmployeeId,
                            'ExistingCode' => $EmployeeId,
                            'Shift' => $Shift,
                            'Date' => $Date,
                            'Job_Card_No' => $Jobcard,
                            'Work_Type' => '-',
                            'DeptName' => $Department,
                            'Sub_Department' => $Work_Area,
                            'Frame' => $Frame,
                            'FrameType' => '',
                            'Description' => '-',
                            'Work_Start' => '-',
                            'Work_End' => '-',
                            'Work_Duration' => '-',
                            'Machine_EB_No' => '-',
                            'Work_Status' => '1',
                            'Assign_Status' => ($Machine_Id == 'NoWork') ? '0' : '1',
                            'Closing_Status' => '0',
                            'Created_By' =>  $Session['UserName'],
                            'Created_Time' => date('Y-m-d H:i:s'),
                            'Updated_By' => '-',
                            'Updated_Time' => '-',
                        ];

                        $save_target = $this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation);
                        if ($save_target == 0) {
                            $errors[] = "Error saving data for row " . ($line_number + 2);
                            continue;
                        }
                    }
                }
            }

            if (!empty($errors)) {
                $result = implode('<br>', $errors);
                $res = 0;
            } else {
                $result = "All data successfully uploaded.";
                $res = 1;
            }

            // exit;


            // Handle Errors
            if (!empty($errors)) {
                $this->session->set_flashdata('alert', array('type' => 'error', 'message' => implode('<br>', $errors)));
                redirect('Allocation');
            } else {
                $this->session->set_flashdata('alert', array('type' => 'success', 'message' => 'All data successfully uploaded.'));
                redirect('Allocation');
            }

            exit;
        } else {
            redirect(base_url(), 'refresh');
            exit;
        }
    }
}