<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class  Work_Master_Model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }


    public function Departments($CompanyCode, $LocationCode,$UserName){

    $sql = "SELECT Name FROM UserDetails_Det WHERE CCode = '$CompanyCode' AND LCode = '$LocationCode' AND UserName = '$UserName' AND Name != 'HR' ORDER BY Name ASC";
        $query = $this->db->query($sql);
        $Row = $query->result();

        if($query->num_rows() > 0){
            return $Row;
        }else{
            return false;
        }
    }


    public function Shifts($CompanyCode, $LocationCode) {

    $currentTime = date('H:i:s');
    $currentDateTime = new DateTime($currentTime);

    $sql = "SELECT ShiftDesc, StartTime, EndTime FROM Shift_Mst WHERE CompCode = '$CompanyCode' AND LocCode = '$LocationCode' AND ShiftDesc != 'GENERAL' ORDER BY ShiftDesc ASC";
    $query = $this->db->query($sql);
    $shifts = $query->result();


    // if ($query->num_rows() > 0) {
    //     $matched = [];

    //     foreach ($shifts as $shift) {
    //         $startTime = new DateTime($shift->StartTime);
    //         $endTime = new DateTime($shift->EndTime);

    //         if ($endTime < $startTime) {
    //             if ($currentDateTime >= $startTime || $currentDateTime <= $endTime) {
    //                 $matched[] = $shift->ShiftDesc;
    //             }
    //         } else {
    //             if ($currentDateTime >= $startTime && $currentDateTime <= $endTime) {
    //                 $matched[] = $shift->ShiftDesc;
    //             }
    //         }
    //     }

    //     return (count($matched) > 0) ? $matched : false;

    // } else {
    //     return false;
    // }

    return $shifts;
}


public function Work_Areas($CompanyCode,$LocationCode,$Department){

    $sql = "SELECT WorkArea FROM Web_Work_Area_Mst WHERE CCode = '$CompanyCode' AND Lcode = '$LocationCode' AND Department = '$Department' ORDER BY WorkArea ASC";
    $query = $this->db->query($sql);
    $Row = $query->result();

    if($query->num_rows() > 0){
            return $Row;
        } else{
            return false;
        }

    }


    public function JobCards($CompanyCode,$LocationCode,$Department,$Work_Area){

    $sql = "SELECT JobCard_No FROM Web_JobCard_Mst WHERE CCode = '$CompanyCode' AND Lcode = '$LocationCode' AND Department = '$Department'  AND WorkArea = '$Work_Area' ORDER BY WorkArea ASC";
    $query = $this->db->query($sql);

    $Row = $query->result();

    if($query->num_rows() > 0){
            return $Row;
        } else{
            return false;
        }

    }



    public function Wages($CompanyCode,$LocationCode,$Department){

   $sql = "SELECT wages,
       CASE
           WHEN wages IN ('A2') THEN 'Permanent'
           WHEN wages IN ('A3') THEN 'Contract'
           WHEN wages IN ('OSP') THEN 'OSP'
           WHEN wages IN ('BALE PRESS') THEN 'BALE PRESS'
           WHEN wages IN ('SCHEME') THEN 'SCHEME'

       END AS wage_category
            FROM Employee_Mst
            WHERE CompCode = '$CompanyCode'
            AND LocCode = '$LocationCode'
            AND DeptName = '$Department'
            AND wages IN ('A2', 'A3', 'M2', 'M3', 'M4', 'CONTRACT-SSI', 'CONTRACT-BE', 'CONTRACT-SRF', 'CONTRACT', 'APPRENTICE', 'LOADING', 'OTHERS', 'SCHEME', 'FNG LOADING', 'EXTERNAL SCHEME' , 'OSP','BALE PRESS')
            ORDER BY wages ASC;
            ";
                $query = $this->db->query($sql);
                $Row = $query->result();

                if($query->num_rows() > 0){
                    return $Row;
                } else{
                    return false;
            }
    }


public function Employee_List($CompanyCode, $LocationCode, $Date, $Shift, $Department, $Employee_Type, $Work_Area, $JobCard) {
    $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        $sql1 = "SELECT * FROM Shift_Mst
                 WHERE CompCode = '$CompanyCode'
                 AND LocCode = '$LocationCode'
                 AND ShiftDesc = '$Shift'";
        $query1 = $this->db->query($sql1);
        $shift_Data = $query1->num_rows();

        if ($shift_Data == 1) {

            $Shift_Row = $query1->result();
            $Shift_Pounch_Start = $Shift_Row[0]->StartIN;
            $Shift_Pounch_End = $Shift_Row[0]->EndIN;

            // Step 2: Get LogTime_IN Data
            $sql2 = "SELECT Log.MachineID, Emp.FirstName, Emp.EmpNo,WorkArea,DeptName,JobCardNo
                     FROM LogTime_IN Log
                     INNER JOIN Employee_Mst Emp ON Log.MachineID = Emp.MachineID
                     WHERE Log.CompCode = '$CompanyCode'
                     AND Log.LocCode = '$LocationCode'
                     AND CONVERT(DATE, Log.TimeIN) = '$Date'
                     AND Log.TimeIN >= '$Date $Shift_Pounch_Start'
                     AND Log.TimeIN <= '$Date $Shift_Pounch_End'
                     AND Emp.DeptName = '$Department'
                     AND Emp.WorkArea = '$Work_Area'
                     AND Emp.JobCardNo = '$JobCard'
                     AND Emp.wages = '$Employee_Type'
                     AND Emp.CatName != 'STAFF'";
            $query2 = $this->db->query($sql2);
            $log_Data = $query2->result();


            foreach ($log_Data as $Employee_Data) {
                $Machine_Id = $Employee_Data->MachineID;

                $this->db->where('EmpNo', $Employee_Data->EmpNo);
                $this->db->where('Date', $Date);
                $this->db->where('Shift', $Shift);
                $existingEntry = $this->db->get('Web_Employee_Work_Allocation_Mst');

                if ($existingEntry->num_rows() == 0) {
                    $Work_Allocation = [
                        'Ccode' => $CompanyCode,
                        'Lcode' => $LocationCode,
                        'Machine_Id' => '-',
                        'Machine_Name' => '-',
                        'FirstName' => $Employee_Data->FirstName,
                        'EmpNo' => $Employee_Data->EmpNo,
                        'Shift' => $Shift,
                        'Date' => $Date,
                        'Job_Card_No' => $Employee_Data->JobCardNo,
                        'Department' => $Employee_Data->DeptName,
                        'WorkArea' => $Employee_Data->WorkArea,
                        'Work_Start' => '-',
                        'Work_End' => '-',
                        'Work_Duration' => '-',
                        'Machine_EB_No' => '-',
                        'Work_Status' => '1',
                        'Assign_Status' => '0',
                        'Closing_Status' => '0',
                        'IsWork' => '0',
                        'Created_By' =>  $Session['UserName'],
                        'Created_Time' => date('Y-m-d H:i:s'),
                        'Updated_By' => '-',
                        'Updated_Time' => '-',
                    ];

                    $this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocation);
                } else {

            $sql3 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode'AND
            Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard' AND
            Assign_Status = '1' AND Work_Status = '1' ";
            $query = $this->db->query($sql3);
            $Assigned_Data = $query->result();

            $sql4 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND
            Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard' AND
            Assign_Status = '0' AND Work_Status = '1'";
            $query4 = $this->db->query($sql4);
            $Un_Assigned_Data = $query4->result();

            $sql5 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND
            Date = '$Date' AND Shift = '$Shift' AND Assign_Status = '0' AND Work_Status = '1' AND IsWork = '1'";
            $query5 = $this->db->query($sql5);
            $No_Work_Data = $query5->result();

            $data = array_merge($Assigned_Data, $Un_Assigned_Data, $No_Work_Data);

            // print_r($data);exit;
            return $data;

                }
            }

             $sql3 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode'AND
            Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard' AND
            Assign_Status = '1' AND Work_Status = '1' AND IsWork = '0'";
            $query = $this->db->query($sql3);
            $Assigned_Data = $query->result();

            $sql4 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND
            Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard' AND
            Assign_Status = '0' AND Work_Status = '1' AND IsWork = '0'";
            $query4 = $this->db->query($sql4);
            $Un_Assigned_Data = $query4->result();

            $sql5 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND
            Date = '$Date' AND Shift = '$Shift' AND Assign_Status = '0' AND Work_Status = '1' AND IsWork = '1'";
            $query5 = $this->db->query($sql5);
            $No_Work_Data = $query5->result();

            $data = array_merge($Assigned_Data, $Un_Assigned_Data, $No_Work_Data);

            // print_r($data);exit;
            return $data;
        }


            // Step 3: Get Assigned, Unassigned, and NoWork Employees

            $sql3 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode'AND
            Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard' AND
            Assign_Status = '1' AND Work_Status = '1' AND IsWork = '0'";
            $query = $this->db->query($sql3);
            $Assigned_Data = $query->result();

            $sql4 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND
            Date = '$Date' AND Shift = '$Shift' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCard' AND
            Assign_Status = '0' AND Work_Status = '1' AND IsWork = '0'";
            $query4 = $this->db->query($sql4);
            $Un_Assigned_Data = $query4->result();

            $sql5 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND
            Date = '$Date' AND Shift = '$Shift' AND Assign_Status = '0' AND Work_Status = '1' AND IsWork = '1'";
            $query5 = $this->db->query($sql5);
            $No_Work_Data = $query5->result();

            $data = array_merge($Assigned_Data, $Un_Assigned_Data, $No_Work_Data);

            // print_r($data);exit;
            return $data;

    } else {
        redirect(base_url(), 'refresh');
    }
}




public function Machines($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Work_Area,$JobCard){

    //  $Date = '2025-01-24';

    $sql = "SELECT Machine_Id, Frame FROM Web_Machine_Mst WHERE CCode = '$CompanyCode' AND LCode = '$LocationCode' AND WorkArea = '$Work_Area'";
            $query = $this->db->query($sql);
            $Machine_Data = $query->result();



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





public function Machine_Frames($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Work_Area,$JobCard,$Machine_Id){


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

public function Assigned_Employee_List($CompanyCode,$LocationCode,$Date,$Shift,$Department){

    $sql = "SELECT *  FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$CompanyCode' AND Lcode = '$LocationCode' AND Shift = '$Shift' AND Date = '$Date' AND Work_Status = '1' AND Assign_Status = '1' AND Department = '$Department' ORDER BY EmpNo ASC";
    $query = $this->db->query($sql);
    $data =  $query->result();

    if($query->num_rows() > 0){
        return $data;
    } else{
        return [];
    }

}



public function Shift_Employee_Late($CompanyCode, $LocationCode, $Date, $Department, $Employee_Shift_Type, $Assiging_Shift)
{
     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $sql = "SELECT FirstName, EmpNo, MachineID FROM Employee_Mst WHERE CompCode = '$CompanyCode' AND LocCode = '$LocationCode' AND DeptName = '$Department' AND ShiftType = '$Employee_Shift_Type' AND IsActive = 'Yes'";
        $query = $this->db->query($sql);
        $Employee_List = $query->result();

        $NotAllocatedEmployees = [];

        // Check for unassigned employees
        foreach ($Employee_List as $EmployeeData) {

            $Employee_Id = $EmployeeData->MachineID;

            $sql1 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Date = '$Date' AND Shift = '$Assiging_Shift' AND Department = '$Department' AND Work_Status = '1' AND Assign_Status = '1'";
            $query1 = $this->db->query($sql1);
            $Assign_Employee = $query1->result();

            $isAssigned = false;

            // Check if the employee is already assigned to the shift
            if (!empty($Assign_Employee)) {
                foreach ($Assign_Employee as $assigned) {
                    if ($Employee_Id == $assigned->EmpNo) {
                        $isAssigned = true;
                        break;
                    }
                }
            }

            if (!$isAssigned) {
                $NotAllocatedEmployees[] = $EmployeeData;
            }
        }

        // Allocate the shift to not yet allocated employees
        foreach ($NotAllocatedEmployees as $Others) {
            $Others_Employee_Id = $Others->EmpNo;
            $Others_Employee_FirstName = $Others->FirstName;

            // Check if the employee already has an allocation for this date, shift, and department
            $duplicateCheckSql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Date = '$Date' AND Shift = '$Assiging_Shift' AND Department = '$Department' AND EmpNo = '$Others_Employee_Id' AND Work_Status = '1' AND Assign_Status = '0'";
            $duplicateQuery = $this->db->query($duplicateCheckSql);
            $duplicateData = $duplicateQuery->result();

            // If no duplicate allocation exists, insert the new allocation
            if (empty($duplicateData)) {
                $Work_Allocations = [
                    'Ccode' => $CompanyCode,
                    'Lcode' => $LocationCode,
                    'Machine_Id' => '-',
                    'Machine_Name' => '-',
                    'FirstName' => $Others_Employee_FirstName,
                    'EmpNo' => $Others_Employee_Id,
                    'Shift' => $Assiging_Shift, // Correct variable usage
                    'Date' => $Date,
                    'Job_Card_No' => '-',
                    'Department' => $Department,
                    'WorkArea' => '-',
                    'Work_Start' => '-',
                    'Work_End' => '-',
                    'Work_Duration' => '-',
                    'Machine_EB_No' => '-',
                    'Work_Status' => '1',
                    'Assign_Status' => '0',
                    'Closing_Status' => '0',
                    'Created_By' =>  $Session['UserName'],
                    'Created_Time' => date('Y-m-d H:i:s'),
                    'Updated_By' => '-',
                    'Updated_Time' => '-',
                ];

                // Insert the new work allocation
                $this->db->insert('Web_Employee_Work_Allocation_Mst', $Work_Allocations);
            }
        }
    }

    // Fetch and return updated data
    $sql1 = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Date = '$Date' AND Shift = '$Assiging_Shift' AND Department ='$Department' AND Work_Status = '1' AND Assign_Status = '0' ";
    $query = $this->db->query($sql1);
    $Data = $query->result();

    if (isset($Data)) {
        return $Data;
    } else {
        return FALSE;
    }
}











}