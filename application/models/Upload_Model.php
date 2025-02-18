<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class  Upload_Model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function Check_Department($Ccode, $Lcode, $Department)
    {

        $sql = "SELECT * FROM Department_Mst WHERE CompCode = '$Ccode' AND LocCode = '$Lcode' AND DeptName = '$Department'";
        $query = $this->db->query($sql);
        return $query->num_rows();
    }

    public function Check_Work_Area($Ccode, $Lcode, $Department, $Work_Area)
    {

        $sql = "SELECT * FROM Web_Sub_Department_Mst WHERE CompCode = '$Ccode' AND LocCode = '$Lcode' AND MainDeptName = '$Department' AND DeptName = '$Work_Area'";
        $query = $this->db->query($sql);
        return $query->num_rows();
    }

    public function Check_Job_Card($Ccode, $Lcode, $Department, $Work_Area, $Job_Card_No)
    {

        $sql = "SELECT * FROM Web_Job_Card_Mst WHERE Ccode = '$Ccode' AND Lcode = '$Lcode' AND Department = '$Department' AND Sub_Department = '$Work_Area' AND Job_Card_No = '$Job_Card_No'";
        $query = $this->db->query($sql);
        return $query->num_rows();
    }

    public function Check_Machine_Id($Ccode, $Lcode, $Department, $Work_Area, $Machine_Id)
    {

        if ($Machine_Id == '-') {
            return;
        } else {
            $sql = "SELECT * FROM Web_Machine_Mst WHERE Ccode = '$Ccode' AND Lcode = '$Lcode' AND Department = '$Department' AND Sub_Department = '$Work_Area' AND Machine_Id = '$Machine_Id'";
            $query = $this->db->query($sql);
            return $query->num_rows();
        }
    }

    public function Check_Present_Employee($Ccode, $Lcode, $Date, $Shift, $Department, $EmployeeId)
    {
        $sql = "SELECT * FROM Shift_Mst
            WHERE CompCode = '$Ccode'
            AND LocCode = '$Lcode'
            AND ShiftDesc = '$Shift'";
        $query = $this->db->query($sql);
        $shift_Data = $query->num_rows();


        if ($shift_Data == 1) {
            $Shift_Row = $query->result();
            $Shift_Punch_Start = $Shift_Row[0]->StartIN;
            $Shift_Punch_End = $Shift_Row[0]->EndIN;

            $sql = "SELECT * FROM LogTime_IN
                WHERE CompCode = '$Ccode'
                AND LocCode = '$Lcode'
                AND CONVERT(DATE, TimeIN) = '$Date'
                AND TimeIN >= '$Date $Shift_Punch_Start'
                AND TimeIN <= '$Date $Shift_Punch_End'";
            $query = $this->db->query($sql);
            $log_Data = $query->result();

            // print_r($sql);exit;

            foreach ($log_Data as $Employee_Data) {
                $Machine_Id = $Employee_Data->MachineID;

                if ($Machine_Id == $EmployeeId) {

                    $sql = "SELECT FirstName, EmpNo
                        FROM Employee_Mst
                        WHERE CompCode = '$Ccode'
                        AND LocCode = '$Lcode'
                        AND MachineID = '$Machine_Id'
                        AND DeptName = '$Department'
                        AND CatName != 'STAFF'";
                    $query = $this->db->query($sql);
                    $EmployeeData = $query->row();

                    if ($EmployeeData) {
                        return 1;
                    }
                }
            }

            return 0;
        }

        return 0;
    }

    public function Check_Jobcard($Ccode, $Lcode, $Department, $Work_Area, $Jobcard)
    {

        $sql = "SELECT * FROM Web_Job_Card_Mst where Ccode = '$Ccode' AND Lcode = '$Lcode' AND Department = '$Department'AND Sub_Department = '$Work_Area' AND Job_Card_No = '$Jobcard'";
        $query = $this->db->query($sql);
        $Row = $query->num_rows();

        if ($Row == 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function Check_Machine_Ids($Ccode, $Lcode, $Department, $Work_Area, $Machine_Id)
    {

        $sql = "SELECT * FROM Web_Machine_Mst WHERE Ccode = '$Ccode' AND Lcode = '$Lcode' AND Department = '$Department' AND Sub_Department = '$Work_Area' AND Machine_Id = '$Machine_Id'";
        $query = $this->db->query($sql);
        $Row = $query->num_rows();

        if ($Row == 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function Check_Employee_Work_Assign($Ccode, $Lcode, $Date, $Shift, $Department, $Work_Area, $Machine_Id, $Frame)
    {

        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$Ccode' AND Lcode = '$Lcode' AND Date = '$Date' AND  Shift = '$Shift' AND DeptName = '$Department' AND  Sub_Department = '$Work_Area' AND Machine_Id = '$Machine_Id' AND Frame = '$Frame'";
        $query = $this->db->query($sql);
        $Row = $query->row();

        if ($Row == 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function Duplicate_Work_Allocation($Ccode, $Lcode, $Date, $Shift, $Department, $Work_Area, $Machine_Id, $Frame, $EmployeeId)
    {
        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$Ccode' AND Lcode = '$Lcode' AND Date = '$Date' AND Shift = '$Shift' AND DeptName = '$Department' AND Sub_Department = '$Work_Area' AND EmpNo = '$EmployeeId' AND Machine_Id = 'Others'";
        $query = $this->db->query($sql);
        $OthersRows = $query->row();

        if ($OthersRows == 1) {
            return 1;
        } else {
            $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$Ccode' AND Lcode = '$Lcode' AND Date = '$Date' AND Shift = '$Shift' AND DeptName = '$Department' AND Sub_Department = '$Work_Area' AND EmpNo = '$EmployeeId' AND Machine_Id = 'NoWork'";
            $query = $this->db->query($sql);
            $Nowork = $query->row();

            if ($Nowork == 1) {
                return 1;
            } else {
                $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$Ccode' AND Lcode = '$Lcode' AND Date = '$Date' AND Shift = '$Shift' AND DeptName = '$Department' AND Sub_Department = '$Work_Area' AND Machine_Id = '$Machine_Id' AND Frame = '$Frame' AND EmpNo = '$EmployeeId'";
                $query = $this->db->query($sql);
                $MachineRows = $query->row();

                if ($MachineRows == 1) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    }

    public function Others_Works_Type($Ccode, $Lcode, $Date, $Shift, $Department, $Work_Area, $Others, $EmployeeId)
    {

        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Ccode = '$Ccode' AND Lcode = '$Lcode' AND Date = '$Date' AND Shift = '$Shift' AND DeptName = '$Department' AND Sub_Department = '$Work_Area' AND EmpNo = '$EmployeeId' AND Machine_Id = '$Others' AND EmpNo = '$EmployeeId'";
        $query = $this->db->query($sql);
        $OthersRows = $query->row();

        if ($OthersRows == 1) {
            return 1;
        } else {
            return 0;
        }
    }
}
