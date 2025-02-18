<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class  Work_Model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }


   public function Shift_Employee_List($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Type) {
    $Session = $this->session->userdata('sess_array');

    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        // Step 1: Get Shift Data
        $sql1 = "SELECT * FROM Shift_Mst WHERE CompCode = '$CompanyCode' AND LocCode = '$LocationCode' AND ShiftDesc = '$Shift'";
        $query1 = $this->db->query($sql1);
        $shift_Data = $query1->num_rows();

        // Date is passed as a parameter, so no need to hardcode it
        // $Date = '2025-02-04'; // This line can be removed

        if ($shift_Data == 1) {
            $Shift_Row = $query1->result();
            $Shift_Pounch_Start = $Shift_Row[0]->StartIN;
            $Shift_Pounch_End = $Shift_Row[0]->EndIN;

            // Step 2: Get LogTime_IN Data
            $sql2 = "SELECT DISTINCT Time.MachineID, Emp.FirstName, Emp.Wages, Emp.WorkArea, Emp.JobCardNo, Emp.DeptName
                    FROM UserDetails_Det Log
                    INNER JOIN Employee_Mst Emp ON Log.Lcode = Emp.LocCode
                    INNER JOIN LogTime_IN Time ON Time.MachineID = Emp.MachineID
                    WHERE Log.UserID = '$Login_User'
                    AND CONVERT(DATE, Time.TimeIN) = '$Date'
                    AND Time.TimeIN >= '$Date $Shift_Pounch_Start'
                    AND Time.TimeIN <= '$Date $Shift_Pounch_End'
                    AND Emp.CatName != 'STAFF'
                    AND Time.CompCode = '$CompanyCode'
                    AND Time.LocCode = '$LocationCode'
                    AND Emp.WorkArea IS NOT NULL
                    AND Emp.IsActive = 'Yes'";

            $query2 = $this->db->query($sql2);
            $log_Data = $query2->result();

            // Step 3: Loop over Employee Data and check Work Allocation
            foreach ($log_Data as $Employee_Data) {
                $Employee_Id = $Employee_Data->MachineID;

                $sql3 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Date = '$Date' AND Shift = '$Shift' AND EmpNo = '$Employee_Id'";
                $query3 = $this->db->query($sql3);
                $Existing = $query3->num_rows();

                if ($Existing == 0) {
                    $Current_Time  = date('Y-m-d H:i:s');

                    $Work_Allocation = [
                        'Ccode' => $CompanyCode,
                        'Lcode' => $LocationCode,
                        'Wages' => $Employee_Data->Wages,
                        'FirstName' => $Employee_Data->FirstName,
                        'EmpNo' => $Employee_Data->MachineID,
                        'Shift' => $Shift,
                        'Date' => $Date,
                        'Job_Card_No' => $Employee_Data->JobCardNo,
                        'Department' => $Employee_Data->DeptName,
                        'WorkArea' => $Employee_Data->WorkArea,
                        'Machine_Id' => '-',
                        'Machine_Name' => '-',
                        'FrameType' => '-',
                        'Frame' => '-',
                        'Type' => $Type,
                        'Work_Type' => '-',
                        'Work_Start' => '-',
                        'Work_End' => '-',
                        'Work_Duration' => '-',
                        'Machine_EB_No' => '-',
                        'Work_Status' => '1',
                        'Assign_Status' => '0',
                        'Closing_Status' => '0',
                        'IsWork' => '0',
                        'Edit_Reason' => '-',
                        'Created_By' =>  $Login_User,
                        'Created_Time' =>  $Current_Time,
                        'Updated_By' => '-',
                        'Updated_Time' => '-',
                    ];

                    $this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation);
                }
            }
        }

        // Step 4: Get Unassigned Employee List
        $sql4 = "SELECT * from Web_Employee_Work_Allocation_Mst Work inner join UserDetails_Det Login ON Login.Lcode = Work.Lcode AND Login.Name =  Work.Department
                where login.UserID = '$Login_User'
                AND Work.Date = '$Date'
                AND Work.Shift = '$Shift'
                AND Work.WorK_Status = '1'
                AND Work.Assign_Status = '0'
                AND IsWork = '0'";

        $query4 = $this->db->query($sql4);
        $Un_Assigned_Data = $query4->result();

        // Step 5: Get Assigned Employee List
        $sql5 = "SELECT * FROM Web_Employee_Work_Allocation_Mst Work inner join UserDetails_Det Login ON Login.Lcode = Work.Lcode AND Login.Name =  Work.Department
                where login.UserID = '$Login_User'
                AND Work.Date = '$Date'
                AND Work.Shift = '$Shift'
                AND Work.WorK_Status = '1'
                AND Work.Assign_Status = '1'";

        $query5 = $this->db->query($sql5);
        $Assigned_Data = $query5->result();

        // Step 6: Get No Work Employee List
        $sql6 = "SELECT * from Web_Employee_Work_Allocation_Mst Work inner join UserDetails_Det Login ON Login.Lcode = Work.Lcode AND Login.Name =  Work.Department
                where login.UserID = '$Login_User'
                AND Work.Date = '$Date'
                AND Work.Shift = '$Shift'
                AND Work.WorK_Status = '1'
                AND Work.Assign_Status = '0'
                AND Work.Work_Type = 'NoWork'";

        $query6 = $this->db->query($sql6);
        $No_Work_Data = $query6->result();


        // print_r($sql4);
        // echo '<pre>';
        // print_r($sql5);
        // echo '<pre>';
        // print_r($sql6);exit;

        // Step 7: Merge all Employee Lists
        $All_Employee_List = array_merge($Assigned_Data, $Un_Assigned_Data, $No_Work_Data);

        return $All_Employee_List;

    } else {
        redirect(base_url(), 'refresh');
    }
}

public function User_Department($CompanyCode,$LocationCode,$Login_User){

    $sql = "SELECT Distinct Name AS Department from  UserDetails_Det where Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND UserID = '$Login_User'";
    $query = $this->db->query($sql);
    $User_Department = $query->result();

    if($query->num_rows() > 0){

    return $User_Department;

    } else {

        return 0;

    }


}


public function Work_Type($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Department,$Work_Area,$JobCard){

    // $sql =  "SELECT Machine_Id FROM Web_Machine_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND Department = '$Department' AND WorkArea = '$WorArea'";
    // $query = $this->db->query($sql);
    // $Work_Type = $query->result();

    // if($query->num_rows() > 0){

    // return $Work_Type;

    // } else {

    //     return 0;

    // }

//   $Date = '2025-02-04'; // This line can be removed

    $sql = "SELECT Machine_Id, Frame FROM Web_Machine_Mst WHERE CCode = '$CompanyCode' AND LCode = '$LocationCode' AND WorkArea = '$Work_Area'";
            $query = $this->db->query($sql);
            $Machine_Data = $query->result();


            if($Department == 'CARDING'){


            $sql1 = "SELECT Machine_Id, Frame FROM Web_Employee_Work_Allocation_Mst WHERE CCode = '$CompanyCode' AND LCode = '$LocationCode' AND Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard' AND Work_Status = '1' AND Assign_Status = '1'";
            $query1 = $this->db->query($sql1);
            $Assigned_Machine_Date = $query1->result();

            $assigned_machines = [];
            foreach ($Assigned_Machine_Date as $assigned) {
                $assigned_machines[] = $assigned->Machine_Id; // Only store Machine_Id
            }

            $Balance_Machines = [];
            foreach ($Machine_Data as $machine) {
                if (!in_array($machine->Machine_Id, $assigned_machines)) { // Only compare Machine_Id
                    $Balance_Machines[] = $machine;
                }
            }

            return $Balance_Machines;


            } else {

            $sql1 = "SELECT Machine_Id, Frame FROM Web_Employee_Work_Allocation_Mst WHERE CCode = '$CompanyCode' AND LCode = '$LocationCode' AND Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard' AND Work_Status = '1' AND Assign_Status = '1'";
            $query1 = $this->db->query($sql1);
            $Assigned_Machine_Date = $query1->result();

            $assigned_machines = [];
            foreach ($Assigned_Machine_Date as $assigned) {
                $assigned_machines[] = $assigned->Machine_Id . '-' . $assigned->Frame; // Combine Machine_Id and Frame for easy comparison
            }

            $Balance_Machines = [];
            foreach ($Machine_Data as $machine) {
                $machine_key = $machine->Machine_Id . '-' . $machine->Frame;
                if (!in_array($machine_key, $assigned_machines)) {
                    $Balance_Machines[] = $machine;
                }
            }

            return $Balance_Machines;

        }
}

public function Work_Areas($CompanyCode,$LocationCode,$Login_User,$Department){

    $sql = "SELECT WorkArea FROM Web_Work_Area_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND Department = '$Department'";
    $query = $this->db->query($sql);
    $Work_Areas = $query->result();

    if($query->num_rows() > 0){

    return $Work_Areas;

    } else {

        return 0;

    }

}


public function Job_Card_Nos($CompanyCode,$LocationCode,$Login_User,$Department,$WorkArea){

    $sql = "SELECT JobCard_No FROM Web_JobCard_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND Department = '$Department' AND WorkArea = '$WorkArea'";
    $query = $this->db->query($sql);
    $Job_Card_Nos = $query->result();

    if($query->num_rows() > 0){

    return $Job_Card_Nos;

    } else {

        return 0;

    }

}


public function Frame($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Department,$Work_Area,$JobCard,$Machine_Id){

    //  $sql = "SELECT Frame FROM Web_Machine_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND Department = '$Department' AND WorkArea = '$WorkArea' AND Machine_Id = '$Machine_Id'";
    // $query = $this->db->query($sql);
    // $Frame = $query->result();

    // if($query->num_rows() > 0){

    // return $Frame;

    // } else {

    //     return 0;

    // }



        // $Date = '2025-01-24';

    foreach($Machine_Id as $Machine_Ids){

        $sql = "SELECT Machine_Id, Frame FROM Web_Machine_Mst WHERE CCode = '$CompanyCode' AND LCode = '$LocationCode' AND WorkArea = '$Work_Area' AND Machine_Id = '$Machine_Ids'";
            $query = $this->db->query($sql);
            $Machine_Data = $query->result();

            //  print_r($sql);exit;

            $sql1 = "SELECT Machine_Id, Frame FROM Web_Employee_Work_Allocation_Mst WHERE CCode = '$CompanyCode' AND LCode = '$LocationCode' AND Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard' AND Machine_Id = '$Machine_Ids' AND Work_Status = '1' AND Assign_Status = '1'";
            $query1 = $this->db->query($sql1);
            $Assigned_Machine_Date = $query1->result();

            $assigned_machines = [];
            foreach ($Assigned_Machine_Date as $assigned) {
                $assigned_machines[] = $assigned->Machine_Id . '-' . $assigned->Frame; // Combine Machine_Id and Frame for easy comparison
            }

            $Balance_Machines = [];
            foreach ($Machine_Data as $machine) {
                $machine_key = $machine->Machine_Id . '-' . $machine->Frame;
                if (!in_array($machine_key, $assigned_machines)) {
                    $Balance_Machines[] = $machine;
                }
            }

            return $Balance_Machines;

    }


}


public function Assign($input_data, $CompanyCode, $LocationCode)
{
    $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        $success = true;
        $allocation_details = [];
        // $Date = '2025-02-04'; // This can be dynamic, depending on your use case

        foreach ($input_data['Allocations'] as $row) {
            $Department = $row['Department'];
            $Shift = $row['Shift'];
            $Date = $row['Date'];
            $Work_Area = $row['Work_Area'];
            $Employee_Id = $row['EmployeeId'];
            $Frame = $row['Frames'];
            $FrameType = $row['FrameType'];
            $Machine_Id = $row['Machine_Id'];
            $Job_Card_No = $row['JobCardNo'];
            $Description = $row['Description'];
            $Allocation_Type = $row['Allocation_Type'];

            // Fetch Employee Data
            $Employee_Data = $this->db->query("SELECT FirstName, ExistingCode, wages FROM Employee_Mst WHERE CompCode = '$CompanyCode' AND LocCode = '$LocationCode' AND ExistingCode = '$Employee_Id'")->result();
            if (empty($Employee_Data)) {
                $success = false;
                $allocation_details[] = ['status' => 'error', 'message' => "Employee $Employee_Id not found"];
                break;
            }

            $Employee_Name = $Employee_Data[0]->FirstName;
            $ExistingCode = $Employee_Data[0]->ExistingCode;
            $Wages = $Employee_Data[0]->wages;

            // Check for existing allocations
            $existing_allocations = $this->db->query("SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id' AND Assign_Status = '1' AND Work_Status = '1'");

            foreach ($Machine_Id as $Machine_Data) {

                if ($Machine_Data == 'NoWork') {
                    $Work_Allocation = [
                        'Ccode' => $CompanyCode,
                        'Lcode' => $LocationCode,
                        'Wages' => $Wages,
                        'Machine_Id' => $Machine_Data,
                        'FirstName' => $Employee_Name,
                        'EmpNo' => $Employee_Id,
                        'ExistingCode' => $ExistingCode,
                        'Shift' => $Shift,
                        'Date' => $Date,
                        'Job_Card_No' => $Job_Card_No,
                        'Work_Type' => 'NoWork',
                        'Department' => $Department,
                        'WorkArea' => $Work_Area,
                        'Frame' =>  '',
                        'FrameType' => $FrameType,
                        'Description' => $Description,
                        'Type' => $Allocation_Type,
                        'Work_Status' => '1',
                        'Assign_Status' => '0',
                        'Closing_Status' => '0',
                        'IsWork' => '1',
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

                } else if($Machine_Data == 'Others'){


                    $Work_Allocation = [
                        'Ccode' => $CompanyCode,
                        'Lcode' => $LocationCode,
                        'Wages' => $Wages,
                        'Machine_Id' => $Machine_Data,
                        'FirstName' => $Employee_Name,
                        'EmpNo' => $Employee_Id,
                        'ExistingCode' => $ExistingCode,
                        'Shift' => $Shift,
                        'Date' => $Date,
                        'Job_Card_No' => $Job_Card_No,
                        'Work_Type' => 'Others',
                        'Department' => $Department,
                        'WorkArea' => $Work_Area,
                        'Frame' =>  '',
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




                } else {
                    // Handle allocation for machines
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
                            'Wages' => $Wages,
                            'Machine_Id' => $Machine_Data,
                            'Machine_Name' => $Machine_Name,
                            'Machine_Model' => $Machine_Model,
                            'FirstName' => $Employee_Name,
                            'EmpNo' => $Employee_Id,
                            'ExistingCode' => $ExistingCode,
                            'Shift' => $Shift,
                            'Date' => $Date,
                            'Job_Card_No' => $Job_Card_No,
                            'Work_Type' => 'Machine',
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
    $sql_check_existing = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id' AND Work_Status = '1' AND Assign_Status = '0' ";
    $Query = $this->db->query($sql_check_existing);

    if ($Query->num_rows() > 0) {
        // Delete existing allocation
        $sql_delete = "DELETE FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id' AND Work_Status = '1' AND Assign_Status = '0' ";
        $this->db->query($sql_delete);
    }
}





public function Edit($input_data, $CompanyCode, $LocationCode)
{
    $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        $success = true;
        $allocation_details = [];
        // $Date = '2025-02-04'; // This can be dynamic, depending on your use case

        foreach ($input_data['Allocations'] as $row) {
            $Department = $row['Department'];
            $Shift = $row['Shift'];
            $Date = $row['Date'];
            $Work_Area = $row['Work_Area'];
            $Employee_Id = $row['EmployeeId'];
            $Frame = $row['Frames'];
            $FrameType = $row['FrameType'];
            $Machine_Id = $row['Machine_Id'];
            $Job_Card_No = $row['JobCardNo'];
            $Description = $row['Description'];
            $Allocation_Type = $row['Allocation_Type'];

            // Fetch Employee Data
            $Employee_Data = $this->db->query("SELECT FirstName, ExistingCode, wages FROM Employee_Mst WHERE CompCode = '$CompanyCode' AND LocCode = '$LocationCode' AND ExistingCode = '$Employee_Id'")->result();
            if (empty($Employee_Data)) {
                $success = false;
                $allocation_details[] = ['status' => 'error', 'message' => "Employee $Employee_Id not found"];
                break;
            }

            $Employee_Name = $Employee_Data[0]->FirstName;
            $ExistingCode = $Employee_Data[0]->ExistingCode;
            $Wages = $Employee_Data[0]->wages;

            // Check for existing allocations Machines/Others
            $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Date' AND EmpNo = '$Employee_Id' AND Assign_Status = '1' AND Work_Status = '1'";
            $query = $this->db->query($sql);
            $Existing_allocation_Rows = $query->num_rows();

            if($Existing_allocation_Rows > 0){

                $Existing_allocation = $query->result();


                $Update = "UPDATE Web_Employee_Work_Allocation_Mst SET Work_Status = '0',Assign_Status = '0' WHERE Date = '$Date' AND Shift = '$Shift' AND EmpNo = '$Employee_Id'";
                $Updated_Query = $this->db->query($Update);

                  foreach ($Machine_Id as $Machine_Data) {

                if ($Machine_Data == 'NoWork') {

                    $Work_Allocation = [
                        'Ccode' => $CompanyCode,
                        'Lcode' => $LocationCode,
                        'Wages' => $Wages,
                        'Machine_Id' => $Machine_Data,
                        'FirstName' => $Employee_Name,
                        'EmpNo' => $Employee_Id,
                        'ExistingCode' => $ExistingCode,
                        'Shift' => $Shift,
                        'Date' => $Date,
                        'Job_Card_No' => $Job_Card_No,
                        'Work_Type' => 'NoWork',
                        'Department' => $Department,
                        'WorkArea' => $Work_Area,
                        'Frame' =>  '',
                        'FrameType' => $FrameType,
                        'Description' => $Description,
                        'Type' => $Allocation_Type,
                        'Work_Status' => '1',
                        'Assign_Status' => '0',
                        'Closing_Status' => '0',
                        'IsWork' => '1',
                        'Created_By' => $Session['UserName'],
                        'Created_Time' => date('Y-m-d H:i:s'),
                    ];


                    if ($this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation)) {
                        $allocation_details[] = ['status' => 'success', 'message' => 'Allocation assigned successfully'];
                    } else {
                        $allocation_details[] = ['status' => 'error', 'message' => 'Error assigning allocation'];
                        $success = false;
                    }

                } else if($Machine_Data == 'Others'){


                    $Work_Allocation = [
                        'Ccode' => $CompanyCode,
                        'Lcode' => $LocationCode,
                        'Wages' => $Wages,
                        'Machine_Id' => $Machine_Data,
                        'FirstName' => $Employee_Name,
                        'EmpNo' => $Employee_Id,
                        'ExistingCode' => $ExistingCode,
                        'Shift' => $Shift,
                        'Date' => $Date,
                        'Job_Card_No' => $Job_Card_No,
                        'Work_Type' => 'Others',
                        'Department' => $Department,
                        'WorkArea' => $Work_Area,
                        'Frame' =>  '',
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


                    if ($this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation)) {
                        $allocation_details[] = ['status' => 'success', 'message' => 'Allocation assigned successfully'];
                    } else {
                        $allocation_details[] = ['status' => 'error', 'message' => 'Error assigning allocation'];
                        $success = false;
                    }


                } else {
                    // Handle allocation for machines
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
                            'Wages' => $Wages,
                            'Machine_Id' => $Machine_Data,
                            'Machine_Name' => $Machine_Name,
                            'Machine_Model' => $Machine_Model,
                            'FirstName' => $Employee_Name,
                            'EmpNo' => $Employee_Id,
                            'ExistingCode' => $ExistingCode,
                            'Shift' => $Shift,
                            'Date' => $Date,
                            'Job_Card_No' => $Job_Card_No,
                            'Work_Type' => 'Machine',
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


                        if ($this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation)) {
                            $allocation_details[] = ['status' => 'success', 'message' => 'Allocation assigned successfully'];
                        } else {
                            $allocation_details[] = ['status' => 'error', 'message' => 'Error assigning allocation'];
                            $success = false;
                        }
                    }
                }

                  }

            } else {

                $NoWork_Update = "UPDATE Web_Employee_Work_Allocation_Mst SET Work_Status = '0',Assign_Status = '0' WHERE Date = '$Date' AND Shift = '$Shift' AND EmpNo = '$Employee_Id'";
                $NoWork_Update_Query = $this->db->query($NoWork_Update);




                  foreach ($Machine_Id as $Machine_Data) {

                if ($Machine_Data == 'NoWork') {

                    $Work_Allocation = [
                        'Ccode' => $CompanyCode,
                        'Lcode' => $LocationCode,
                        'Wages' => $Wages,
                        'Machine_Id' => $Machine_Data,
                        'FirstName' => $Employee_Name,
                        'EmpNo' => $Employee_Id,
                        'ExistingCode' => $ExistingCode,
                        'Shift' => $Shift,
                        'Date' => $Date,
                        'Job_Card_No' => $Job_Card_No,
                        'Work_Type' => 'NoWork',
                        'Department' => $Department,
                        'WorkArea' => $Work_Area,
                        'Frame' =>  '',
                        'FrameType' => $FrameType,
                        'Description' => $Description,
                        'Type' => $Allocation_Type,
                        'Work_Status' => '1',
                        'Assign_Status' => '0',
                        'Closing_Status' => '0',
                        'IsWork' => '1',
                        'Created_By' => $Session['UserName'],
                        'Created_Time' => date('Y-m-d H:i:s'),
                    ];


                    if ($this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation)) {
                        $allocation_details[] = ['status' => 'success', 'message' => 'Allocation assigned successfully'];
                    } else {
                        $allocation_details[] = ['status' => 'error', 'message' => 'Error assigning allocation'];
                        $success = false;
                    }

                } else if($Machine_Data == 'Others'){


                    $Work_Allocation = [
                        'Ccode' => $CompanyCode,
                        'Lcode' => $LocationCode,
                        'Wages' => $Wages,
                        'Machine_Id' => $Machine_Data,
                        'FirstName' => $Employee_Name,
                        'EmpNo' => $Employee_Id,
                        'ExistingCode' => $ExistingCode,
                        'Shift' => $Shift,
                        'Date' => $Date,
                        'Job_Card_No' => $Job_Card_No,
                        'Work_Type' => 'Others',
                        'Department' => $Department,
                        'WorkArea' => $Work_Area,
                        'Frame' =>  '',
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


                    if ($this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation)) {
                        $allocation_details[] = ['status' => 'success', 'message' => 'Allocation assigned successfully'];
                    } else {
                        $allocation_details[] = ['status' => 'error', 'message' => 'Error assigning allocation'];
                        $success = false;
                    }


                } else {
                    // Handle allocation for machines
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
                            'Wages' => $Wages,
                            'Machine_Id' => $Machine_Data,
                            'Machine_Name' => $Machine_Name,
                            'Machine_Model' => $Machine_Model,
                            'FirstName' => $Employee_Name,
                            'EmpNo' => $Employee_Id,
                            'ExistingCode' => $ExistingCode,
                            'Shift' => $Shift,
                            'Date' => $Date,
                            'Job_Card_No' => $Job_Card_No,
                            'Work_Type' => 'Machine',
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

        }


    } else {
        redirect(base_url(), 'refresh');
    }
}

public function Previous_Allocation($CompanyCode, $LocationCode, $Login_User, $Current_Date, $Shift, $Type) {

    $sql1 = "SELECT * FROM Shift_Mst WHERE CompCode = '$CompanyCode' AND LocCode = '$LocationCode' AND ShiftDesc = '$Shift'";
    $query1 = $this->db->query($sql1);
    $shift_Data = $query1->num_rows();

    if ($shift_Data == 1) {
        $Shift_Row = $query1->result();
        $Shift_Pounch_Start = $Shift_Row[0]->StartIN;
        $Shift_Pounch_End = $Shift_Row[0]->EndIN;

        $sql2 = "SELECT DISTINCT Time.MachineID, Emp.FirstName, Emp.Wages, Emp.WorkArea, Emp.JobCardNo, Emp.DeptName, Emp.EmpNo
                FROM UserDetails_Det Log
                INNER JOIN Employee_Mst Emp ON Log.Lcode = Emp.LocCode
                INNER JOIN LogTime_IN Time ON Time.MachineID = Emp.MachineID
                WHERE Log.UserID = '$Login_User'
                AND CONVERT(DATE, Time.TimeIN) = '$Current_Date'
                AND Time.TimeIN >= '$Current_Date $Shift_Pounch_Start'
                AND Time.TimeIN <= '$Current_Date $Shift_Pounch_End'
                AND Emp.CatName != 'STAFF'
                AND Time.CompCode = '$CompanyCode'
                AND Time.LocCode = '$LocationCode'
                AND Emp.WorkArea IS NOT NULL
                AND Emp.IsActive = 'Yes'";

        $query2 = $this->db->query($sql2);
        $log_Data = $query2->result();

        $Pervious_Date = date('Y-m-d', strtotime($Current_Date . ' -1 days'));

        $sql3 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Date = '$Pervious_Date' AND Shift = '$Shift' AND Assign_Status = '1' AND Work_Status = '1'";
        $query3 = $this->db->query($sql3);
        $Previous_Day_Employee_List = $query3->result();

        if (!empty($log_Data)) {
            foreach ($log_Data as $Present_Employee_List) {

                if (isset($Present_Employee_List->MachineID)) {

                    $Present_Day_Employee = $Present_Employee_List->MachineID;

                    foreach ($Previous_Day_Employee_List as $Previous_Employee_List) {

                        $Previous_Day_Employee = $Previous_Employee_List->EmpNo;

                        if ($Present_Day_Employee == $Previous_Day_Employee) {

                            // Check for duplicate MachineId for the same EmpNo on the current day
                            $checkDuplicateMachine = "SELECT COUNT(*) as duplicateCount FROM Web_Employee_Work_Allocation_Mst
                                                      WHERE Date = '$Current_Date'
                                                      AND Shift = '$Shift'
                                                      AND EmpNo = '{$Previous_Employee_List->EmpNo}'
                                                      AND Machine_Id = '{$Previous_Employee_List->Machine_Id}'";

                            $duplicateQuery = $this->db->query($checkDuplicateMachine);
                            $duplicateResult = $duplicateQuery->row();

                            if ($duplicateResult->duplicateCount == 0) {
                                // No duplicate, proceed with insertion
                                $Current_Date_Converstion_Work_Allocation = [
                                    'Ccode'            => $CompanyCode,
                                    'Lcode'            => $LocationCode,
                                    'Wages'            => $Previous_Employee_List->Wages,
                                    'Department'       => $Previous_Employee_List->Department,
                                    'WorkArea'         => $Previous_Employee_List->WorkArea,
                                    'Job_Card_No'      => $Previous_Employee_List->Job_Card_No,
                                    'Date'             => $Current_Date,
                                    'Shift'            => $Shift,
                                    'EmpNo'            => $Previous_Employee_List->EmpNo,
                                    'FirstName'        => $Previous_Employee_List->FirstName,
                                    'ExistingCode'     => $Previous_Employee_List->ExistingCode,
                                    'Type'             => $Previous_Employee_List->Type,
                                    'Work_Type'        => $Previous_Employee_List->Work_Type,
                                    'Description'      => $Previous_Employee_List->Description,
                                    'Machine_Name'     => $Previous_Employee_List->Machine_Name,
                                    'Machine_Model'    => $Previous_Employee_List->Machine_Model,
                                    'Machine_Id'       => $Previous_Employee_List->Machine_Id,
                                    'Frame'            => $Previous_Employee_List->Frame,
                                    'FrameType'        => $Previous_Employee_List->FrameType,
                                    'Work_Status'      => $Previous_Employee_List->Work_Status,
                                    'Assign_Status'    => $Previous_Employee_List->Assign_Status,
                                    'IsWork'           => $Previous_Employee_List->IsWork,
                                    'Edit_Reason'      => $Previous_Employee_List->Edit_Reason,
                                    'Closing_Status'   => $Previous_Employee_List->Closing_Status,
                                    'Work_Start'       => $Previous_Employee_List->Work_Start,
                                    'Work_End'         => $Previous_Employee_List->Work_End,
                                    'Work_Duration'    => $Previous_Employee_List->Work_Duration,
                                    'Machine_EB_No'    => $Previous_Employee_List->Machine_EB_No,
                                    'Remarks'          => $Previous_Employee_List->Remarks,
                                    'Created_By'       => $Login_User,
                                    'Created_Time'     => date('Y-m-d H:i:s'),
                                    'Updated_By'       => '-',
                                    'Updated_Time'     => '-'
                                ];

                                $this->db->insert('Web_Employee_Work_Allocation_Mst', $Current_Date_Converstion_Work_Allocation);
                            } else {
                                // Handle duplicate case (e.g., log or notify)
                                continue;
                            }
                        }
                    }
                } else {
                    continue;
                }
            }
        }

        return 'Done';
    }
}



public function Allocation_List($CompanyCode,$LocationCode,$Login_User,$Date,$Shift){

    // $Date = '2025-02-04';

        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst Work inner join UserDetails_Det Login ON Login.Lcode = Work.Lcode AND Login.Name =  Work.Department
            where login.UserID = '$Login_User'
            AND Work.Date = '$Date'
            AND Work.Shift = '$Shift'
            AND Work.WorK_Status = '1'
            AND Work.Closing_Status = '0'";

            // print_r($sql);exit;

        $query = $this->db->query($sql);

        if($query->num_rows() > 0 ){

            $Assigned_Data = $query->result();

            return $Assigned_Data;

        } else {

            return 0;
        }

}


public function Employee_Shift_Closings($inputData){

    $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        $CompanyCode = $Session['Ccode'];
        $LocationCode = $Session['Lcode'];
        $Login_User = $Session['UserName'];

        foreach($inputData['Employees'] as $Details){

            // $date = '2025-02-04';
            $department = $Details['Department'];
            $shift = $Details['Shift'];
            $subDepartment = $Details['Work_Area'];
            $jobCardNo = $Details['JobCardNo'];
            $Employee_Id = $Details['EmployeeId'];
            $OTStatus = $Details['OTConfirm'];


            echo '<pre>';
            print_r($Employee_Id . '==> '.$OTStatus );

            if ($OTStatus == 1) {

                $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Date = '$date' AND Shift = '$shift' AND EmpNo = '$Employee_Id' AND Department = '$department' AND WorkArea = '$subDepartment' AND Job_Card_No = '$jobCardNo'";
                $query = $this->db->query($sql);
                $Employee_Work_Data = $query->result();

                print_r($Employee_Work_Data);

                foreach ($Employee_Work_Data as $item) {

                    $currentShift = $item->Shift;
                    $NextShift = $this->NextShift($currentShift);

                    $this->db->where([
                        'Date' => $date,
                        'Shift' => $shift,
                        'Assign_Status' => '1',
                        'Work_Status' => '1',
                        'EmpNo' => $Employee_Id
                    ]);

                    // $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst Where Date = '$date' AND Shift = '$shift' AND Assign_Status = '1' AND Work_Status = '1' AND EmpNo = '$Employee_Id' ";
                    // print_r($sql);exit;

                    $this->db->update('Web_Employee_Work_Allocation_Mst', [
                        'Closing_Status' => '1',
                        'Updated_By' => $Session['UserName'],
                        'Updated_Time' => date('Y-m-d H:i:s'),
                    ]);

                    $this->db->where([
                        'Date' => $date,
                        'Shift' => $NextShift,
                        // 'Machine_Id' => $item->Machine_Id,
                        // 'Frame' => $item->Frame,
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
                            'Department' => $item->Department,
                            'WorkArea' => $item->WorkArea,
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
                            'Remarks' => '',
                            'Type' => $item->Type,
                            'Wages' => $item->Wages,
                            'IsWork' => '0',
                            'Created_By' => $item->Created_By,
                            'Created_Time' => $item->Created_Time,
                            'Updated_By' => '-',
                            'Updated_Time' => '-',
                        ];

                        // Insert the new work allocation record
                        $this->db->insert('Web_Employee_Work_Allocation_Mst', $workAllocation);
                    }
                }
            } else {

                $this->db->where([
                    'Date' => $date,
                    'Shift' => $shift,
                    'Work_Status' => '1',
                ]);

                $this->db->update('Web_Employee_Work_Allocation_Mst', [
                    'Closing_Status' => '1',
                    'Updated_By' => $Session['UserName'],
                    'Updated_Time' => date('Y-m-d H:i:s'),
                ]);
            }
        }

        return 1;

    } else {
        redirect(base_url(), 'refresh');
    }
}




        private function NextShift($currentShift) {

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

             $sql_Shift = "SELECT ShiftDesc FROM Shift_Mst WHERE CompCode = '$CompanyCode' AND LocCode = '$LocationCode' AND ShiftDesc != 'GENERAL'";
                    $query_Shift = $this->db->query($sql_Shift);
                    $Shifts = $query_Shift->result();

                    $currentIndex = null;
                    foreach ($Shifts as $index => $shift) {
                        if ($shift->ShiftDesc == $currentShift) {
                            $currentIndex = $index;
                            break;
                        }
                    }

                    // Ensure that $nextShift is set to a valid value
                    if ($currentIndex !== null && isset($Shifts[$currentIndex + 1])) {
                        $NextShift = $Shifts[$currentIndex + 1]->ShiftDesc;

                        return $NextShift;
                    } else {
                        $NextShift = ''; // Set a default value if no next shift is found
                    }
        }
    else{
        redirect(base_url());
    }


    }
}




