<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class  Allocation_Model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

public function Assign($input_data, $CompanyCode, $LocationCode)
{
    $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        $success = true;
        $allocation_details = [];

        foreach ($input_data['Allocations'] as $row) {
            $Date = $row['Date'];
            $Department = $row['Department'];
            $Shift = $row['Shift'];
            $Work_Area = $row['Work_Area'];
            $Employee_Id = $row['EmployeeId'];
            $Frame = $row['Frames'];
            $FrameType = $row['FrameMethod'];
            $Machine_Id = $row['MachineId'];
            $Job_Card_No = $row['JobCardNo'];
            $Work_Type = $row['WorkType'];
            $Description = $row['Description'];
            $Allocation_Type = $row['Allocation_Type'];

            $Employee_Data = $this->db->query("SELECT FirstName, ExistingCode,wages FROM Employee_Mst WHERE CompCode = '$CompanyCode' AND LocCode = '$LocationCode'  AND ExistingCode = '$Employee_Id'")->result();



            // print_r($Employee_Data);exit;
            if (empty($Employee_Data)) {
                $success = false;
                $allocation_details[] = ['status' => 'error', 'message' => "Employee $Employee_Id not found"];
                break;
            }

            $Employee_Name = $Employee_Data[0]->FirstName;
            $ExistingCode = $Employee_Data[0]->ExistingCode;
             $Wages = $Employee_Data[0]->wages;

            $existing_allocations = $this->db->query("SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id' AND Assign_Status = '1' AND Work_Status = '1'");



            if ($existing_allocations->num_rows() == 0) {

                foreach ($Machine_Id as $Machine_Data) {
                    $Work_Allocation = [
                        'Ccode' => $CompanyCode,
                        'Lcode' => $LocationCode,
                        'Machine_Id' => $Machine_Data,
                        'FirstName' => $Employee_Name,
                        'Wages' =>  $Wages ,
                        'EmpNo' => $Employee_Id,
                        'ExistingCode' => $ExistingCode,
                        'Shift' => $Shift,
                        'Date' => $Date,
                        'Job_Card_No' => $Job_Card_No,
                        'Work_Type' => $Work_Type,
                        'Department' => $Department,
                        'WorkArea' => $Work_Area,
                        'Frame' => '-',
                        'FrameType' => $FrameType,
                        'Description' => $Description,
                        'Type' => $Allocation_Type,
                        'Work_Status' => '1',
                        'Assign_Status' => ($Machine_Data == 'NoWork') ? '0' : '1',
                        'Closing_Status' => '0',
                        'IsWork' => ($Machine_Data == 'NoWork') ? '1' : '0',
                        'Created_By' => $Session['UserName'],
                        'Created_Time' => date('Y-m-d H:i:s'),
                    ];

                    $this->delete_existing_allocation($Shift, $Date, $Employee_Id);

                    if ($this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation)) {
                        $allocation_details[] = ['status' => 'success', 'message' => 'Allocation assigned successfully'];
                    } else {
                        $allocation_details[] = ['status' => 'error', 'message' => 'Error assigning allocation'];
                        $success = false;
                    }
                }
            } else {

                foreach ($Machine_Id as $Machine_Data) {
                    foreach ($Frame as $FrameData) {
                        $machine_data = $this->db->query("SELECT Machine_Name, Machine_Model FROM Web_Machine_Mst WHERE CCode = '$CompanyCode' AND LCode = '$LocationCode' AND WorkArea = '$Work_Area' AND Machine_Id = '$Machine_Data'")->result();

                        if (empty($machine_data)) continue;

                        $Machine_Name = $machine_data[0]->Machine_Name;
                        $Machine_Model = $machine_data[0]->Machine_Model;

                        $existing_combination = $this->db->query("SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id' AND Machine_Id = '$Machine_Data' AND Frame = '$FrameData' AND Assign_Status = '1'");

                        if ($existing_combination->num_rows() > 0) {
                            $allocation_details[] = ['status' => 'skip', 'message' => 'Duplicate allocation found, skipping insertion'];
                            continue;
                        }



                        $Work_Allocation = [
                            'Ccode' => $CompanyCode,
                            'Lcode' => $LocationCode,
                            'Wages' =>  $Wages ,
                            'Machine_Id' => $Machine_Data,
                            'Machine_Name' => $Machine_Name,
                            'Machine_Model' => $Machine_Model,
                            'FirstName' => $Employee_Name,
                            'EmpNo' => $Employee_Id,
                            'ExistingCode' => $ExistingCode,
                            'Shift' => $Shift,
                            'Date' => $Date,
                            'Job_Card_No' => $Job_Card_No,
                            'Work_Type' => $Work_Type,
                            'Department' => $Department,
                            'WorkArea' => $Work_Area,
                            'Frame' => $FrameData,
                            'FrameType' => $FrameType,
                            'Description' => $Description,
                            'Type' => $Allocation_Type,
                            'Work_Status' => '1',
                            'Assign_Status' => '1',
                            'Closing_Status' => '0',
                            'IsWork' => '0',
                            'Created_By' => $Session['UserName'],
                            'Created_Time' => date('Y-m-d H:i:s'),
                        ];

                        $this->delete_existing_allocation($Shift, $Date, $Employee_Id);

                        if ($this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation)) {
                            $allocation_details[] = ['status' => 'success', 'message' => 'Allocation assigned successfully'];
                        } else {
                            $allocation_details[] = ['status' => 'error', 'message' => 'Error assigning allocation'];
                            $success = false;
                        }
                    }
                }
            }
        }

        return $success ? ['status' => 'success', 'message' => 'All allocations processed successfully'] : ['status' => 'error', 'message' => 'Error occurred while processing allocations'];

    } else {
        redirect(base_url(), 'refresh');
    }
}


private function delete_existing_allocation($Shift, $Date, $Employee_Id)
{
    $sql_check_existing = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id' AND  Work_Status = '1' AND Assign_Status = '0' ";
    $Query = $this->db->query($sql_check_existing);
    // print_r($sql_check_existing);exit;
    if ($Query->num_rows() > 0) {
        // Delete existing allocation
        $sql_delete = "DELETE FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id'AND Work_Status = '1' AND Assign_Status = '0' ";
        $this->db->query($sql_delete);
    }
}


private function Edits_delete_existing_allocation($Shift, $Date, $Employee_Id)
{
    $sql_check_existing = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id' AND Assign_Status = '0' AND Work_Status = '1' ";
    $Query = $this->db->query($sql_check_existing);
    if ($Query->num_rows() > 0) {
        // Delete existing allocation
        $sql_delete = "DELETE FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id' AND Assign_Status = '0' AND Work_Status = '1' ";
        $this->db->query($sql_delete);
    }
}


// public function Edit($input_data, $CompanyCode, $LocationCode)
// {
//      $Session = $this->session->userdata('sess_array');

//     if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {
//         $success = true;
//         $allocation_details = [];

//         foreach ($input_data['Allocations'] as $row) {
//             $Date = $row['Date'];
//             $Department = $row['Department'];
//             $Shift = $row['Shift'];
//             $Work_Area = $row['Work_Area'];
//             $Employee_Id = $row['EmployeeId'];
//             $Frame = $row['Frames'];
//             $FrameType = $row['FrameMethod'];
//             $Machine_Id = $row['MachineId'];
//             $Job_Card_No = $row['JobCardNo'];
//             $Work_Type = $row['WorkType'];
//             $Description = $row['Description'];
//             $Reason = $row['Reason'];

//             // Check if employee exists
//             $sql = "SELECT FirstName, ExistingCode
//                     FROM Employee_Mst
//                     WHERE CompCode = '$CompanyCode'
//                     AND LocCode = '$LocationCode'
//                     AND DeptName = '$Department'
//                     AND ExistingCode = '$Employee_Id'";
//             $query = $this->db->query($sql);
//             $Employee_Data = $query->result();

//             if (empty($Employee_Data)) {
//                 $success = false;
//                 $allocation_details[] = ['status' => 'error', 'message' => "Employee $Employee_Id not found"];
//                 break;
//             }

//             $Employee_Name = $Employee_Data[0]->FirstName;
//             $ExistingCode = $Employee_Data[0]->ExistingCode;

//             // Check if the employee already has an allocation on this shift and date
//             $sql_check_existing = "SELECT *
//                                    FROM Web_Employee_Work_Allocation_Mst
//                                    WHERE Shift = '$Shift'
//                                    AND Date = '$Date'
//                                    AND EmpNo = '$Employee_Id'
//                                    AND Assign_Status = '1'
//                                    AND Work_Status = '1'";
//             $Query = $this->db->query($sql_check_existing);

//             if ($Query->num_rows() > 0) {
//                 // If allocations exist, delete the old data first
//                 foreach ($Reason as $Edit_Reason) {
//                     foreach ($Machine_Id as $Machine_Data) {
//                         // Delete existing allocation before re-assigning
//                         $this->Edit_delete_existing_allocation($Shift, $Date, $Employee_Id, $Machine_Data);
//                         $this->allocate_work($CompanyCode, $LocationCode, $Machine_Data, $Employee_Name, $Employee_Id, $ExistingCode, $Shift, $Date, $Job_Card_No, $Work_Type, $Department, $Work_Area, $Frame, $FrameType, $Description, $Edit_Reason, $Machine_Id);
//                     }
//                 }
//             } else {
//                 // If no allocation exists, just assign the new work allocation
//                 foreach ($Reason as $Edit_Reason) {
//                     foreach ($Machine_Id as $Machine_Data) {
//                         $this->allocate_work($CompanyCode, $LocationCode, $Machine_Data, $Employee_Name, $Employee_Id, $ExistingCode, $Shift, $Date, $Job_Card_No, $Work_Type, $Department, $Work_Area, $Frame, $FrameType, $Description, $Edit_Reason, $Machine_Id);
//                     }
//                 }
//             }
//         }

//         // Return final success or error message
//         if ($success) {
//             return ['status' => 'success', 'message' => 'All allocations processed successfully'];
//         } else {
//             return ['status' => 'error', 'message' => 'Error occurred while processing allocations'];
//         }
//     } else {
//         redirect(base_url(), 'refresh');
//     }
// }

// private function Edit_delete_existing_allocation($Shift, $Date, $Employee_Id, $Machine_Data)
// {
//     // Delete existing allocation with matching Shift, Date, EmpNo, and Machine_Data
//     $Edit_sql_check_existing = "SELECT *
//                                 FROM Web_Employee_Work_Allocation_Mst
//                                 WHERE Shift = '$Shift'
//                                 AND Date = '$Date'
//                                 AND EmpNo = '$Employee_Id'
//                                 AND Assign_Status = '1'
//                                 AND Work_Status = '1'";
//     $Query = $this->db->query($Edit_sql_check_existing);

//     if ($Query->num_rows() > 0) {
//         // Delete the previous allocation data
//         $Already_sql_delete = "DELETE FROM Web_Employee_Work_Allocation_Mst
//                                WHERE Shift = '$Shift'
//                                AND Date = '$Date'
//                                AND EmpNo = '$Employee_Id'
//                                AND Assign_Status = '1'
//                                AND Work_Status = '1'";
//         $this->db->query($Already_sql_delete);
//     }
// }

// private function allocate_work($CompanyCode, $LocationCode, $Machine_Data, $Employee_Name, $Employee_Id, $ExistingCode, $Shift, $Date, $Job_Card_No, $Work_Type, $Department, $Work_Area, $Frame, $FrameType, $Description, $Edit_Reason, $Machine_Id)
// {

//      $Session = $this->session->userdata('sess_array');
//     if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

//     if ($Machine_Data == 'Others' || $Machine_Data == 'NoWork') {


//         $this->Edits_delete_existing_allocation($Shift, $Date, $Employee_Id);


//         $Work_Allocation = [
//             'Ccode' => $CompanyCode,
//             'Lcode' => $LocationCode,
//             'Machine_Id' => $Machine_Data,
//             'Machine_Name' => '-',
//             'Machine_Model' => '-',
//             'FirstName' => $Employee_Name,
//             'EmpNo' => $Employee_Id,
//             'ExistingCode' => $ExistingCode,
//             'Shift' => $Shift,
//             'Date' => $Date,
//             'Job_Card_No' => $Job_Card_No,
//             'Work_Type' => $Work_Type,
//             'Department' => $Department,
//             'WorkArea' => $Work_Area,
//             'Frame' => '-',
//             'FrameType' => $FrameType,
//             'Description' => $Description,
//             'Edit_Reason' => $Edit_Reason,
//             'Work_Start' => '-',
//             'Work_End' => '-',
//             'Work_Duration' => '-',
//             'Machine_EB_No' => '-',
//             'Work_Status' => '1',
//             'Assign_Status' => ($Machine_Data == 'NoWork') ? '0' : '1',
//             'Closing_Status' => '0',
//             'Created_By' =>  $Session['UserName'],
//             'Created_Time' => date('Y-m-d H:i:s'),
//             'Updated_By' => '-',
//             'Updated_Time' => '-',
//         ];
//     } else {
//         foreach ($Frame as $FrameData) {
//             // Get machine details from Web_Machine_Mst
//             $sql_machine = "SELECT Machine_Name, Machine_Model
//                             FROM Web_Machine_Mst
//                             WHERE CCode = '$CompanyCode'
//                             AND LCode = '$LocationCode'
//                             AND Department = '$Department'
//                             AND WorkArea = '$Work_Area'
//                             AND Machine_Id = '$Machine_Data'";
//             $query_machine = $this->db->query($sql_machine);
//             $machine_data = $query_machine->result();

//             if (!empty($machine_data)) {
//                 $Machine_Name = $machine_data[0]->Machine_Name;
//                 $Machine_Model = $machine_data[0]->Machine_Model;

//                 $Work_Allocation = [
//                     'Ccode' => $CompanyCode,
//                     'Lcode' => $LocationCode,
//                     'Machine_Id' => $Machine_Data,
//                     'Machine_Name' => $Machine_Name,
//                     'Machine_Model' => $Machine_Model,
//                     'FirstName' => $Employee_Name,
//                     'EmpNo' => $Employee_Id,
//                     'ExistingCode' => $ExistingCode,
//                     'Shift' => $Shift,
//                     'Date' => $Date,
//                     'Job_Card_No' => $Job_Card_No,
//                     'Work_Type' => $Work_Type,
//                     'Department' => $Department,
//                     'WorkArea' => $Work_Area,
//                     'Frame' => $FrameData,
//                     'FrameType' => $FrameType,
//                     'Description' => $Description,
//                     'Edit_Reason' => $Edit_Reason,
//                     'Work_Start' => '-',
//                     'Work_End' => '-',
//                     'Work_Duration' => '-',
//                     'Machine_EB_No' => '-',
//                     'Work_Status' => '1',
//                     'Assign_Status' => '1',
//                     'Closing_Status' => '0',
//                     'Created_By' =>  $Session['UserName'],
//                     'Created_Time' => date('Y-m-d H:i:s'),
//                     'Updated_By' => '-',
//                     'Updated_Time' => '-',
//                 ];
//             }
//                 $this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation);

//         }
//     }



// } else {
//     redirect(base_url(), 'refresh');
// }

// }



// public function Edit($input_data, $CompanyCode, $LocationCode)
// {
//     $Session = $this->session->userdata('sess_array');

//     if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {
//         $success = true;
//         $allocation_details = [];

//         foreach ($input_data['Allocations'] as $row) {
//             $Date = $row['Date'];
//             $Department = $row['Department'];
//             $Shift = $row['Shift'];
//             $Work_Area = $row['Work_Area'];
//             $Employee_Id = $row['EmployeeId'];
//             $Frame = $row['Frames'];
//             $FrameType = $row['FrameMethod'];
//             $Machine_Id = $row['MachineId'];
//             $Job_Card_No = $row['JobCardNo'];
//             $Work_Type = $row['WorkType'];
//             $Description = $row['Description'];
//             $Reason = $row['Reason'];


//             $sql1 = "SELECT * FROM web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode'  AND EmpNo = '$Employee_Id'";
//             $query1 = $this->db->query($sql1);
//             $Employee_Data = $query1->result();

//             $Assigned_Work_Type = $Employee_Data->Machine_Id;
//             $IsWork = $Employee_Data->IsWork;


//             if($Assigned_Work_Type == 'NoWork' && $IsWork == '1'){

//                  foreach ($Frame as $FrameData) {
//                                 // Get machine details from Web_Machine_Mst
//                                 $sql_machine = "SELECT Machine_Name, Machine_Model
//                                                 FROM Web_Machine_Mst
//                                                 WHERE CCode = '$CompanyCode'
//                                                 AND LCode = '$LocationCode'
//                                                 AND Department = '$Department'
//                                                 AND WorkArea = '$Work_Area'
//                                                 AND Machine_Id = '$Machine_Data'";
//                                 $query_machine = $this->db->query($sql_machine);
//                                 $machine_data = $query_machine->result();

//                                 if (!empty($machine_data)) {
//                                     $Machine_Name = $machine_data[0]->Machine_Name;
//                                     $Machine_Model = $machine_data[0]->Machine_Model;

//                                     $Work_Allocation = [
//                                         'Machine_Id' => $Machine_Data,
//                                         'Machine_Name' => $Machine_Name,
//                                         'Machine_Model' => $Machine_Model,
//                                         'FirstName' => $Employee_Name,
//                                         'EmpNo' => $Employee_Id,
//                                         'ExistingCode' => $ExistingCode,
//                                         'Job_Card_No' => $Job_Card_No,
//                                         'Work_Type' => $Work_Type,
//                                         'Department' => $Department,
//                                         'WorkArea' => $Work_Area,
//                                         'Frame' => $FrameData,
//                                         'FrameType' => $FrameType,
//                                         'Description' => $Description,
//                                         'Edit_Reason' => $Edit_Reason,
//                                         'Work_Start' => '-',
//                                         'Work_End' => '-',
//                                         'Work_Duration' => '-',
//                                         'Machine_EB_No' => '-',
//                                         'Work_Status' => '1',
//                                         'Assign_Status' => '1',
//                                         'Closing_Status' => '0',
//                                         'IsWork' => '0',
//                                         'Updated_By' =>  $Session['UserName'],
//                                         'Updated_Time' => date('Y-m-d H:i:s'),
//                                     ];
//                                 }
//                                 $this->db->insert('Web_Employee_Work_Allocation',$Work_Allocation);
//                             }

//             }

//             // Check if employee exists
//             $sql = "SELECT FirstName, ExistingCode
//                     FROM Employee_Mst
//                     WHERE CompCode = '$CompanyCode'
//                     AND LocCode = '$LocationCode'
//                     AND DeptName = '$Department'
//                     AND ExistingCode = '$Employee_Id'";
//             $query = $this->db->query($sql);
//             $Employee_Data = $query->result();

//             if (empty($Employee_Data)) {
//                 $success = false;
//                 $allocation_details[] = ['status' => 'error', 'message' => "Employee $Employee_Id not found"];
//                 break;
//             }

//             $Employee_Name = $Employee_Data[0]->FirstName;
//             $ExistingCode = $Employee_Data[0]->ExistingCode;

//             // Check if the employee already has an allocation on this shift and date
//             $sql_check_existing = "SELECT *
//                                    FROM Web_Employee_Work_Allocation_Mst
//                                    WHERE Shift = '$Shift'
//                                    AND Date = '$Date'
//                                    AND EmpNo = '$Employee_Id'
//                                    AND Assign_Status = '1'
//                                    AND Work_Status = '1'";
//             $Query = $this->db->query($sql_check_existing);

//             // Update the existing allocation if found
//             if ($Query->num_rows() > 0) {
//                 // Existing allocation found, we now update the record
//                 foreach ($Reason as $Edit_Reason) {
//                     foreach ($Machine_Id as $Machine_Data) {
//                         if ($Machine_Data == 'Others' || $Machine_Data == 'NoWork') {
//                             $Work_Allocation = [
//                                 'Machine_Id' => $Machine_Data,
//                                 'Machine_Name' => '-',
//                                 'Machine_Model' => '-',
//                                 'FirstName' => $Employee_Name,
//                                 'EmpNo' => $Employee_Id,
//                                 'ExistingCode' => $ExistingCode,
//                                 'Job_Card_No' => $Job_Card_No,
//                                 'Work_Type' => $Work_Type,
//                                 'Department' => $Department,
//                                 'WorkArea' => $Work_Area,
//                                 'Frame' => '-',
//                                 'FrameType' => $FrameType,
//                                 'Description' => $Description,
//                                 'Edit_Reason' => $Edit_Reason,
//                                 'Work_Start' => '-',
//                                 'Work_End' => '-',
//                                 'Work_Duration' => '-',
//                                 'Machine_EB_No' => '-',
//                                 'Work_Status' => '1',
//                                 'IsWork' => '0',
//                                 'Assign_Status' => ($Machine_Data == 'NoWork') ? '0' : '1',
//                                 'Closing_Status' => '0',
//                                 'Updated_By' =>  $Session['UserName'],
//                                 'Updated_Time' => date('Y-m-d H:i:s'),
//                             ];
//                         } else {
//                             foreach ($Frame as $FrameData) {
//                                 // Get machine details from Web_Machine_Mst
//                                 $sql_machine = "SELECT Machine_Name, Machine_Model
//                                                 FROM Web_Machine_Mst
//                                                 WHERE CCode = '$CompanyCode'
//                                                 AND LCode = '$LocationCode'
//                                                 AND Department = '$Department'
//                                                 AND WorkArea = '$Work_Area'
//                                                 AND Machine_Id = '$Machine_Data'";
//                                 $query_machine = $this->db->query($sql_machine);
//                                 $machine_data = $query_machine->result();

//                                 if (!empty($machine_data)) {
//                                     $Machine_Name = $machine_data[0]->Machine_Name;
//                                     $Machine_Model = $machine_data[0]->Machine_Model;

//                                     $Work_Allocation = [
//                                         'Machine_Id' => $Machine_Data,
//                                         'Machine_Name' => $Machine_Name,
//                                         'Machine_Model' => $Machine_Model,
//                                         'FirstName' => $Employee_Name,
//                                         'EmpNo' => $Employee_Id,
//                                         'ExistingCode' => $ExistingCode,
//                                         'Job_Card_No' => $Job_Card_No,
//                                         'Work_Type' => $Work_Type,
//                                         'Department' => $Department,
//                                         'WorkArea' => $Work_Area,
//                                         'Frame' => $FrameData,
//                                         'FrameType' => $FrameType,
//                                         'Description' => $Description,
//                                         'Edit_Reason' => $Edit_Reason,
//                                         'Work_Start' => '-',
//                                         'Work_End' => '-',
//                                         'Work_Duration' => '-',
//                                         'Machine_EB_No' => '-',
//                                         'Work_Status' => '1',
//                                         'Assign_Status' => '1',
//                                         'Closing_Status' => '0',
//                                         'IsWork' => '0',
//                                         'Updated_By' =>  $Session['UserName'],
//                                         'Updated_Time' => date('Y-m-d H:i:s'),
//                                     ];
//                                 }
//                             }
//                         }

//                         // Update the allocation in the database
//                         $this->db->where('Shift', $Shift);
//                         $this->db->where('Date', $Date);
//                         $this->db->where('EmpNo', $Employee_Id);
//                         $this->db->where('Assign_Status', '1');
//                         $this->db->where('Work_Status', '1');
//                         $this->db->update('Web_Employee_Work_Allocation_Mst', $Work_Allocation);
//                     }
//                 }
//             } else {
//                 // If no existing allocation, insert new allocation
//                 foreach ($Reason as $Edit_Reason) {
//                     foreach ($Machine_Id as $Machine_Data) {
//                         if ($Machine_Data == 'Others' || $Machine_Data == 'NoWork') {
//                             $Work_Allocation = [
//                                 'Ccode' => $CompanyCode,
//                                 'Lcode' => $LocationCode,
//                                 'Machine_Id' => $Machine_Data,
//                                 'Machine_Name' => '-',
//                                 'Machine_Model' => '-',
//                                 'FirstName' => $Employee_Name,
//                                 'EmpNo' => $Employee_Id,
//                                 'ExistingCode' => $ExistingCode,
//                                 'Shift' => $Shift,
//                                 'Date' => $Date,
//                                 'Job_Card_No' => $Job_Card_No,
//                                 'Work_Type' => $Work_Type,
//                                 'Department' => $Department,
//                                 'WorkArea' => $Work_Area,
//                                 'Frame' => '-',
//                                 'FrameType' => $FrameType,
//                                 'Description' => $Description,
//                                 'Edit_Reason' => $Edit_Reason,
//                                 'Work_Start' => '-',
//                                 'Work_End' => '-',
//                                 'Work_Duration' => '-',
//                                 'Machine_EB_No' => '-',
//                                 'Work_Status' => '1',
//                                 'Assign_Status' => ($Machine_Data == 'NoWork') ? '0' : '1',
//                                 'Closing_Status' => '0',
//                                 'Created_By' =>  $Session['UserName'],
//                                 'Created_Time' => date('Y-m-d H:i:s'),
//                                 'Updated_By' => '-',
//                                 'Updated_Time' => '-',
//                             ];
//                         } else {
//                             foreach ($Frame as $FrameData) {
//                                 // Get machine details from Web_Machine_Mst
//                                 $sql_machine = "SELECT Machine_Name, Machine_Model
//                                                 FROM Web_Machine_Mst
//                                                 WHERE CCode = '$CompanyCode'
//                                                 AND LCode = '$LocationCode'
//                                                 AND Department = '$Department'
//                                                 AND WorkArea = '$Work_Area'
//                                                 AND Machine_Id = '$Machine_Data'";
//                                 $query_machine = $this->db->query($sql_machine);
//                                 $machine_data = $query_machine->result();

//                                 if (!empty($machine_data)) {
//                                     $Machine_Name = $machine_data[0]->Machine_Name;
//                                     $Machine_Model = $machine_data[0]->Machine_Model;

//                                     $Work_Allocation = [
//                                         'Ccode' => $CompanyCode,
//                                         'Lcode' => $LocationCode,
//                                         'Machine_Id' => $Machine_Data,
//                                         'Machine_Name' => $Machine_Name,
//                                         'Machine_Model' => $Machine_Model,
//                                         'FirstName' => $Employee_Name,
//                                         'EmpNo' => $Employee_Id,
//                                         'ExistingCode' => $ExistingCode,
//                                         'Shift' => $Shift,
//                                         'Date' => $Date,
//                                         'Job_Card_No' => $Job_Card_No,
//                                         'Work_Type' => $Work_Type,
//                                         'Department' => $Department,
//                                         'WorkArea' => $Work_Area,
//                                         'Frame' => $FrameData,
//                                         'FrameType' => $FrameType,
//                                         'Description' => $Description,
//                                         'Edit_Reason' => $Edit_Reason,
//                                         'Work_Start' => '-',
//                                         'Work_End' => '-',
//                                         'Work_Duration' => '-',
//                                         'Machine_EB_No' => '-',
//                                         'Work_Status' => '1',
//                                         'Assign_Status' => '1',
//                                         'Closing_Status' => '0',
//                                         'IsWork' => '0',
//                                         'Created_By' =>  $Session['UserName'],
//                                         'Created_Time' => date('Y-m-d H:i:s'),
//                                         'Updated_By' => '-',
//                                         'Updated_Time' => '-',
//                                     ];
//                                 }
//                             }
//                         }

//                         // Insert the allocation into the database
//                         $this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation);
//                     }
//                 }
//             }
//         }

//         // Return final success or error message
//         if ($success) {
//             return ['status' => 'success', 'message' => 'All allocations processed successfully'];
//         } else {
//             return ['status' => 'error', 'message' => 'Error occurred while processing allocations'];
//         }
//     } else {
//         redirect(base_url(), 'refresh');
//     }
// }



public function Edit($input_data, $CompanyCode, $LocationCode)
{
    $username = $this->session->userdata('sess_array');

    if (!empty($username) && isset($username['IsOnLogin']) && $username['IsOnLogin'] === TRUE) {
        $success = true;
        $allocation_details = [];

        foreach ($input_data['Allocations'] as $row) {
            $Date = $row['Date'];
            $Department = $row['Department'];
            $Shift = $row['Shift'];
            $Work_Area = $row['Work_Area'];
            $Employee_Id = $row['EmployeeId'];
            $Frame = $row['Frames'];
            $FrameType = $row['FrameMethod'];
            $Machine_Id = $row['MachineId'];
            $Job_Card_No = $row['JobCardNo'];
            $Work_Type = $row['WorkType'];
            $Description = $row['Description'];
            $Reason = $row['Reason'];

            // Check if employee exists
            $sql = "SELECT FirstName, ExistingCode
                    FROM Employee_Mst
                    WHERE CompCode = '$CompanyCode'
                    AND LocCode = '$LocationCode'
                    AND DeptName = '$Department'
                    AND ExistingCode = '$Employee_Id'";
            $query = $this->db->query($sql);
            $Employee_Data = $query->result();

            if (empty($Employee_Data)) {
                $success = false;
                $allocation_details[] = ['status' => 'error', 'message' => "Employee $Employee_Id not found"];
                break;
            }

            $Employee_Name = $Employee_Data[0]->FirstName;
            $ExistingCode = $Employee_Data[0]->ExistingCode;

            // Check if the employee already has an allocation on this shift and date
            $sql_check_existing = "SELECT *
                                   FROM Web_Employee_Work_Allocation_Mst
                                   WHERE Shift = '$Shift'
                                   AND Date = '$Date'
                                   AND EmpNo = '$Employee_Id'
                                   AND Assign_Status = '1'
                                   AND Work_Status = '1'";
            $Query = $this->db->query($sql_check_existing);

            if ($Query->num_rows() > 0) {
                // If allocations exist, delete the old data first
                foreach ($Reason as $Edit_Reason) {
                    foreach ($Machine_Id as $Machine_Data) {
                        // Delete existing allocation before re-assigning
                        $this->Edit_delete_existing_allocation($Shift, $Date, $Employee_Id, $Machine_Data);
                        $this->allocate_work($CompanyCode, $LocationCode, $Machine_Data, $Employee_Name, $Employee_Id, $ExistingCode, $Shift, $Date, $Job_Card_No, $Work_Type, $Department, $Work_Area, $Frame, $FrameType, $Description, $Edit_Reason, $Machine_Id);
                    }
                }
            } else {
                // If no allocation exists, just assign the new work allocation
                foreach ($Reason as $Edit_Reason) {
                    foreach ($Machine_Id as $Machine_Data) {
                        $this->allocate_work($CompanyCode, $LocationCode, $Machine_Data, $Employee_Name, $Employee_Id, $ExistingCode, $Shift, $Date, $Job_Card_No, $Work_Type, $Department, $Work_Area, $Frame, $FrameType, $Description, $Edit_Reason, $Machine_Id);
                    }
                }
            }
        }

        // Return final success or error message
        if ($success) {
            return ['status' => 'success', 'message' => 'All allocations processed successfully'];
        } else {
            return ['status' => 'error', 'message' => 'Error occurred while processing allocations'];
        }
    } else {
        redirect('Auth', 'refresh');
    }
}

private function Edit_delete_existing_allocation($Shift, $Date, $Employee_Id, $Machine_Data)
{
    // Delete existing allocation with matching Shift, Date, EmpNo, and Machine_Data
    $Edit_sql_check_existing = "SELECT *
                                FROM Web_Employee_Work_Allocation_Mst
                                WHERE Shift = '$Shift'
                                AND Date = '$Date'
                                AND EmpNo = '$Employee_Id'
                                AND Assign_Status = '1'
                                AND Work_Status = '1'";
    $Query = $this->db->query($Edit_sql_check_existing);

    if ($Query->num_rows() > 0) {
        // Delete the previous allocation data
        $Already_sql_delete = "DELETE FROM Web_Employee_Work_Allocation_Mst
                               WHERE Shift = '$Shift'
                               AND Date = '$Date'
                               AND EmpNo = '$Employee_Id'
                               AND Assign_Status = '1'
                               AND Work_Status = '1'";
        $this->db->query($Already_sql_delete);
    }
}

private function allocate_work($CompanyCode, $LocationCode, $Machine_Data, $Employee_Name, $Employee_Id, $ExistingCode, $Shift, $Date, $Job_Card_No, $Work_Type, $Department, $Work_Area, $Frame, $FrameType, $Description, $Edit_Reason, $Machine_Id)
{

    $username = $this->session->userdata('sess_array');
    if (!empty($username) && isset($username['IsOnLogin']) && $username['IsOnLogin'] === TRUE) {

    if ($Machine_Data == 'Others' || $Machine_Data == 'NoWork') {


        $this->Edits_delete_existing_allocation($Shift, $Date, $Employee_Id);


        $Work_Allocation = [
            'Ccode' => $CompanyCode,
            'Lcode' => $LocationCode,
            'Machine_Id' => $Machine_Data,
            'Machine_Name' => '-',
            'Machine_Model' => '-',
            'FirstName' => $Employee_Name,
            'EmpNo' => $Employee_Id,
            'ExistingCode' => $ExistingCode,
            'Shift' => $Shift,
            'Date' => $Date,
            'Job_Card_No' => $Job_Card_No,
            'Work_Type' => $Work_Type,
            'Department' => $Department,
            'WorkArea' => $Work_Area,
            'Frame' => '-',
            'FrameType' => $FrameType,
            'Description' => $Description,
            'Edit_Reason' => $Edit_Reason,
            'Work_Start' => '-',
            'Work_End' => '-',
            'Work_Duration' => '-',
            'Machine_EB_No' => '-',
            'Work_Status' => '1',
            'Assign_Status' => ($Machine_Data == 'NoWork') ? '0' : '1',
            'Closing_Status' => '0',
            'Created_By' => $username['UserName'],
            'Created_Time' => date('Y-m-d H:i:s'),
            'Updated_By' => '-',
            'Updated_Time' => '-',
        ];
    } else {
        foreach ($Frame as $FrameData) {
            // Get machine details from Web_Machine_Mst
            $sql_machine = "SELECT Machine_Name, Machine_Model
                            FROM Web_Machine_Mst
                            WHERE CCode = '$CompanyCode'
                            AND LCode = '$LocationCode'
                            AND Department = '$Department'
                            AND WorkArea = '$Work_Area'
                            AND Machine_Id = '$Machine_Data'";
            $query_machine = $this->db->query($sql_machine);
            $machine_data = $query_machine->result();

            if (!empty($machine_data)) {
                $Machine_Name = $machine_data[0]->Machine_Name;
                $Machine_Model = $machine_data[0]->Machine_Model;

                $Work_Allocation = [
                    'Ccode' => $CompanyCode,
                    'Lcode' => $LocationCode,
                    'Machine_Id' => $Machine_Data,
                    'Machine_Name' => $Machine_Name,
                    'Machine_Model' => $Machine_Model,
                    'FirstName' => $Employee_Name,
                    'EmpNo' => $Employee_Id,
                    'ExistingCode' => $ExistingCode,
                    'Shift' => $Shift,
                    'Date' => $Date,
                    'Job_Card_No' => $Job_Card_No,
                    'Work_Type' => $Work_Type,
                    'Department' => $Department,
                    'WorkArea' => $Work_Area,
                    'Frame' => $FrameData,
                    'FrameType' => $FrameType,
                    'Description' => $Description,
                    'Edit_Reason' => $Edit_Reason,
                    'Work_Start' => '-',
                    'Work_End' => '-',
                    'Work_Duration' => '-',
                    'Machine_EB_No' => '-',
                    'Work_Status' => '1',
                    'Assign_Status' => '1',
                    'Closing_Status' => '0',
                    'Created_By' => $username['UserName'],
                    'Created_Time' => date('Y-m-d H:i:s'),
                    'Updated_By' => '-',
                    'Updated_Time' => '-',
                ];
            }
        }
    }

    // Insert the work allocation record into the database
    if ($this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation)) {
        $allocation_details[] = ['status' => 'success', 'message' => 'Allocation assigned successfully'];
    } else {
        $allocation_details[] = ['status' => 'error', 'message' => 'Error assigning allocation'];
        $success = false;
    }

} else {
    redirect('Auth', 'refresh');
}

}


    public function Previous_Day_Work_Alloction($Date, $Department, $Shift, $Sub_Department, $JobCardNo)
    {

        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst
                WHERE Date = '$Date'
                AND Department = '$Department'
                AND Shift = '$Shift'
                AND WorkArea = '$Sub_Department'
                AND Job_Card_No = '$JobCardNo'
                AND Work_Status = '1'
                AND Assign_Status = '1'";

        $query = $this->db->query($sql);
        $results = $query->result();

        if (empty($results)) {
            log_message('error', "No data found for the query: " . $sql);
            return [];
        }

        $existingCodes = array_column($results, 'ExistingCode');
        if (empty($existingCodes)) {
            log_message('error', "No ExistingCode values found in Web_Employee_Work_Allocation_Mst.");
            return [];
        }

        $nextDay = date('Y-m-d', strtotime($Date . ' +1 day'));

        $sql_log = "SELECT * FROM LogTime_IN
                    WHERE CONVERT(DATE, TimeIN) = '$nextDay'
                    AND MachineID IN (" . implode(',', array_map('intval', $existingCodes)) . ")";



        $logQuery = $this->db->query($sql_log);
        $logResults = $logQuery->result();

        if (empty($logResults)) {
            log_message('error', "No matching data found in LogTime_IN for MachineIDs and TimeIN on $nextDay.");
            return [];
        }

        $matchingResults = array_filter($results, function ($row) use ($logResults) {
            foreach ($logResults as $logEntry) {
                if ($row->ExistingCode == $logEntry->MachineID) {
                    return true;
                }
            }
            return false;
        });

        if (empty($matchingResults)) {
            log_message('error', "No matching ExistingCode found in Web_Employee_Work_Allocation_Mst for the next day's MachineID.");
            return [];
        }

        return array_values($matchingResults);
    }


    public function Shift_Employee_Work_Details($CompanyCode, $LocationCode, $Date , $Shift ,$Department,$Work_Area,$JobCard){

        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard'  AND Work_Status = '1' AND Assign_Status = '1' ORDER BY  EmpNo ASC ";
        $query = $this->db->query($sql);
        $Data = $query->result();

        // print_r($sql);exit;


        if(isset($Data) && !empty($Data)){

            return $Data;
        } else {

            return FALSE;
        }
    }

    public function Employee_Shift_Closings($inputData){

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {



        $date = $inputData['Date'];
        $department = $inputData['Department'];
        $shift = $inputData['Shift'];
        $subDepartment = $inputData['Work_Area'];
        $jobCardNo = $inputData['JobCardNo'];
        $employees = $inputData['Employees'];
        $Remarks = $inputData['Remarks'];

        foreach($Remarks as $Remark){


        foreach ($employees as $employee) {
            $Employee_Id = $employee['EmployeeId'];
            $OTStatus = $employee['OTConfirm'];

            if ($OTStatus == 1) {
                $Employee_Work_Data = $this->Work_Master_Model->Employee_Work_Data($Employee_Id, $date, $department, $shift, $subDepartment, $jobCardNo);

                foreach ($Employee_Work_Data as $item) {
                    $currentShift = $item->Shift;
                    $NextShift = $this->NextShift($currentShift);

                    $this->db->where([
                        'Date' => $date,
                        'Shift' => $shift,
                        'Department' => $department,
                        'WorkArea' => $subDepartment,
                        'Job_Card_No' => $jobCardNo,
                        'Assign_Status' => '1',
                        'Work_Status' => '1',
                        'EmpNo' => $Employee_Id
                    ]);
                    $this->db->update('Web_Employee_Work_Allocation_Mst', [
                        'Closing_Status' => '1',
                        'Remarks' => $Remark,
                        'Updated_By' =>  $Session['UserName'],
                        'Updated_Time' => date('Y-m-d H:i:s'),
                    ]);

                    $this->db->where([
                        'Date' => $date,
                        'Shift' => $NextShift,
                        'Machine_Id' => $item->Machine_Id,
                        'Frame' => $item->Frame,
                        'EmpNo' => $item->EmpNo
                    ]);
                    $existingRecord = $this->db->get('Web_Employee_Work_Allocation_Mst')->num_rows();

                    if ($existingRecord == 0) {
                        $workAllocation = [
                            'Ccode' => $item->Ccode,
                            'Lcode' => $item->Lcode,
                            'Machine_Id' => $item->Machine_Id,
                            'Machine_Name' => $item->Machine_Name,
                            'Machine_Model' => $item->Machine_Model,
                            'FirstName' => $item->FirstName,
                            'EmpNo' => $item->EmpNo,
                            'ExistingCode' => $item->ExistingCode,
                            'Shift' => $NextShift,
                            'Date' => $item->Date,
                            'Job_Card_No' => $item->Job_Card_No,
                            'Work_Type' => $item->Work_Type,
                            'Department' => $item->DeptName,
                            'WorkArea' => $item->Sub_Department,
                            'Frame' => $item->Frame,
                            'FrameType' => $item->FrameType,
                            'Description' => $item->Description,
                            'Work_Start' => $item->Work_Start,
                            'Work_End' => $item->Work_End,
                            'Work_Duration' => $item->Work_Duration,
                            'Machine_EB_No' => $item->Machine_EB_No,
                            'Work_Status' => $item->Work_Status,
                            'Assign_Status' => $item->Assign_Status,
                            'Closing_Status' => '0',
                            'Remarks' => $Remark,
                            'Created_By' => $item->Created_By,
                            'Created_Time' => $item->Created_Time,
                            'Updated_By' => '-',
                            'Updated_Time' => '-',
                        ];

                        $this->db->insert('Web_Employee_Work_Allocation_Mst', $workAllocation);
                    }
                }
            } else {
                $this->db->where([
                    'Date' => $date,
                    'Shift' => $shift,
                    'Department' => $department,
                    'WorkArea' => $subDepartment,
                    'Job_Card_No' => $jobCardNo,
                    'Assign_Status' => '1',
                    'Work_Status' => '1',
                    'EmpNo' => $Employee_Id,

                ]);
                $this->db->update('Web_Employee_Work_Allocation_Mst', [
                    'Remarks' => $Remark,
                    'Closing_Status' => '1',
                    'Updated_By' =>  $Session['UserName'],
                    'Updated_Time' => date('Y-m-d H:i:s'),
                ]);
            }
        }
        }

        } else {

            redirect(base_url(), 'refresh');

        }


    }


    public function Assgined_Employee_Id($CompanyCode,$LocationCode,$Date,$Shift,$Department){

        $sql = "SELECT DISTINCT EmpNo, EmpNo, FirstName FROM Web_Employee_Work_Allocation_Mst Where Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND Work_Status = '1' AND Assign_Status = '1' AND Closing_Status = '0'";
        $query = $this->db->query($sql);
        $Assigned_Employees = $query->result();

        // print_r($sql);exit;

        if($query->num_rows() > 0){

            return $Assigned_Employees;

        } else {

            return FALSE;

        }
    }

   public function Partial_Close_Work($CompanyCode, $LocationCode, $Date, $Shift, $Department, $Employee_Id, $Reason,$Work_Time) {
    $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        try {
            $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND EmpNo = '$Employee_Id' AND Work_Status = '1' AND Assign_Status = '1' AND Closing_Status = '0'";
            $query = $this->db->query($sql);
            $Assigned_Employees = $query->result();

            if ($query->num_rows() > 0) {
                $Current_Time = date('Y-m-d H:i:s');
                $Login_User = $Session['UserName'];
                $Employee_Id = $Assigned_Employees[0]->EmpNo;

                $Work_Partial_Close = array(
                    'Ccode' => $Assigned_Employees[0]->Ccode,
                    'Lcode' => $Assigned_Employees[0]->Lcode,
                    'Department' => $Assigned_Employees[0]->Department,
                    'WorkArea' => $Assigned_Employees[0]->WorkArea,
                    'Job_Card_No' => $Assigned_Employees[0]->Job_Card_No,
                    'Date' => $Assigned_Employees[0]->Date,
                    'Shift' => $Assigned_Employees[0]->Shift,
                    'EmpNo' => $Assigned_Employees[0]->EmpNo,
                    'FirstName' => $Assigned_Employees[0]->FirstName,
                    'ExistingCode' => $Assigned_Employees[0]->ExistingCode,
                    'Reason' => $Reason,
                    'Closing_Status' => '1',
                    'Work_Start' => $Assigned_Employees[0]->Created_Time,
                    'Work_End' => $Current_Time,
                    'Work_Duration' => $Work_Time,
                    'Remarks' => '',
                    'Created_By' => $Login_User,
                    'Created_Time' => $Current_Time,
                    'Updated_By' => '-',
                    'Updated_Time' => '-'
                );

                $this->db->insert('Web_Work_Partial_Close_Mst', $Work_Partial_Close);

                if ($this->db->affected_rows() > 0) {
                    $sql1 = "UPDATE Web_Employee_Work_Allocation_Mst SET Assign_Status = '0', Closing_Status = '1', Updated_By = '$Login_User', Updated_Time = '$Current_Time' WHERE EmpNo = '$Employee_Id'";
                    $query1 = $this->db->query($sql1);
                }

                return TRUE;
            } else {
                return FALSE;
            }
        } catch (Exception $e) {
            return FALSE;
        }
    } else {
        return;
    }
}

public function Partial_Close_List($CompanyCode,$LocationCode,$UserName,$Date,$Shift){

      $sql = "SELECT  DISTINCT EmpNo, * FROM  Web_Work_Partial_Close_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND Date = '$Date' AND Shift = '$Shift'AND Closing_Status = '1'";
      $query = $this->db->query($sql);
      $Partial_Close_List = $query->result();

      if($query->num_rows() > 0){

        return $Partial_Close_List;

      } else {

        return FALSE;

      }
}

public function Late_Employee_List($CompanyCode,$LocationCode,$Date,$Login_User,$Shift,$Department,$Work_Area,$JobCard,$Employee_Type){

    $sql = "SELECT Distinct  A.Name ,B.FirstName,B.EmpNo from UserDetails_Det A inner join
            Employee_Mst B ON A.Lcode = B.LocCode AND Name = B.DeptName
            where A.UserID = '$Login_User'
            AND B.WorkArea = '$Work_Area'
            AND B.JobCardNo  ='$JobCard'
            AND B.DeptName = '$Department'
            AND B.wages = '$Employee_Type'
            AND B.FirstName  NOT IN (SELECT FirstName from Web_Employee_Work_Allocation_Mst
            where Assign_Status = '1'
            AND Ccode = '$CompanyCode'
            AND Lcode = '$LocationCode'
            AND WorkArea = '$Work_Area'
            AND Job_Card_No  ='$JobCard'
            AND Department = '$Department'
            AND Date = '$Date'
            AND Shift = '$Shift')";

                // print_r($sql); exit;
            $query = $this->db->query($sql);
            $Late_Employee_List = $query->result();

            if($query->num_rows() > 0){

                return $Late_Employee_List;

            } else {

                return FALSE;

            }




}







}