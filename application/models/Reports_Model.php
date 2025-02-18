<?php if (! defined('BASEPATH')) exit('No direct script access allowed');

class Reports_Model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }


    public function No_Work_Employee($Date, $Department, $Shift)
    {
        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE  Shift = '$Shift' AND Date = '$Date' AND Department = '$Department' AND Machine_Id = 'NoWork'";
        $query = $this->db->query($sql);
        $result = $query->result_array();
        return $result;
    }

    public function Shift_Closing_Report($Date, $Shift, $Department, $Work_Area, $JobCardNo)
    {

        $sql = "SELECT distinct Ccode,
            Lcode,
            Department,
            WorkArea,
            Job_Card_No,
            Date,
            Shift,
            EmpNo,
            FirstName,
            ExistingCode,
            Work_Type,
            Description,
            Machine_Name,
            Machine_Model,
            Machine_Id,
            Frame,
            FrameType,
            Work_Status,
            Assign_Status,
            Closing_Status,
            Work_Start,
            Work_End,
            Work_Duration,
            Machine_EB_No,
            Created_By,
            Created_Time,
            Updated_By,
            Updated_Time FROM Web_Employee_Work_Allocation_Mst WHERE  Shift = '$Shift' AND Date = '$Date' AND Department = '$Department' AND WorkArea = '$Work_Area' AND Job_Card_No = '$JobCardNo' AND Work_Status = '1'";
        $query = $this->db->query($sql);
        $result = $query->result();
        return $result;
    }


    public function Active_Employee_List($Ccode, $Lcode, $Department, $Employee_Status)
    {

        if ($Employee_Status == 'Active') {
            $IsActive = 'Yes';
        } elseif ($Employee_Status == '') {
            $IsActive = '';
        }

        $sql = "SELECT
                    DeptName,
                    CONVERT(VARCHAR, DOJ, 105) AS DOJ,
                    FirstName,
                    MachineID,
                    EmployeeMobile,
                    IsActive,
                    DATEDIFF(YEAR, DOJ, GETDATE()) AS ExperienceYears,
                    DATEDIFF(MONTH, DOJ, GETDATE()) % 12 AS ExperienceMonths,
                    CONCAT(
                        DATEDIFF(YEAR, DOJ, GETDATE()),
                        ' Years ',
                        DATEDIFF(MONTH, DOJ, GETDATE()) % 12,
                        ' Months'
                    ) AS ExperienceFormatted
                FROM Employee_Mst
                WHERE
                    CompCode = '$Ccode'
                    AND LocCode = '$Lcode'
                    AND DeptName = '$Department'
                    AND IsActive = '$IsActive'";

        $query = $this->db->query($sql);
        return $query->result_array();
    }

        public function Assigned_List($CompanyCode,$LocationCode,$Login_User,$Shift, $Date)
    {
      $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst A
                INNER JOIN
                    UserDetails_Det B ON A.Ccode = B.Ccode AND A.Lcode = B.Lcode  AND A.Department = B.Name
                WHERE
                    B.UserID = '$Login_User' AND
                    A.Date = '$Date'
                    AND A.Shift = '$Shift'
                    AND A.Ccode = '$CompanyCode'
                    AND A.Lcode = '$LocationCode'
                    AND A.Assign_Status = '1'";



                    $query = $this->db->query($sql);
                    $Employee_Work_Data = $query->result();

                    $Department = $Employee_Work_Data[0]->Department;
                    $JobCardNo = $Employee_Work_Data[0]->Job_Card_No;


                    if($Department == 'CARDING' && $JobCardNo = 'PRECARS003' ){


                    }


                    if($query->num_rows() > 0){

                        return $Employee_Work_Data;

                    } else {

                        return 0;

                    }

        // print_r($sql);exit;
    }





    public function Shift_Work_Details($Current_Date,$Department,$Work_Area,$Shift){

        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst WHERE Shift = '$Shift' AND Date = '$Current_Date' AND Department = '$Department' AND WorkArea = '$Work_Area'";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function All_Department_Report($Date,$Shift){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $Login_User = $Session['UserName'];
            $LocationCode = $Session['Lcode'];
            $CompanyCode = $Session['Ccode'];

            $sql = "SELECT distinct B.Name as Department , D.Workarea , E.JobCard_No FROM UserDetails A INNER JOIN UserDetails_Det B ON B.UserID = A.UserID  Inner join
                    Web_Work_Area_Mst D ON  D.Department = B.Name   Inner join  Web_JobCard_Mst E ON E.Department = D.Department AND E.WorkArea = D.WorkArea
                    AND A.Ccode = '$CompanyCode'
                    AND A.Lcode = '$LocationCode'
                    AND A.UserID = '$Login_User'
                    ORDER BY B.Name";

            $query = $this->db->query($sql);
            $Data = $query->result();

             foreach ($Data as $row) {

                // $Date = '2025-02-03';

                $Department = $row->Department;
                $Work_Area = $row->Workarea;
                $JobCard = $row->JobCard_No;

            $sql1 = "SELECT * FROM Web_Employee_Work_Allocation_Mst where Shift = '$Shift' AND Date = '$Date'";
            $query1 = $this->db->query($sql1);
            $Assigned_Data = $query1->result();

            $Assined_Rows = $query1->num_rows();

            if($Assined_Rows > 0){

                return $Assigned_Data;

            } else {

                return FALSE;

            }
        }


        } else {
            redirect('Auth');
        }



    }

    public function Shift_Closing_All_Report($CompanyCode,$LocationCode,$Login_User,$Date,$Shift){

        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst A
                INNER JOIN
                    UserDetails_Det B ON A.Ccode = B.Ccode AND A.Lcode = B.Lcode  AND A.Department = B.Name
                WHERE
                    B.UserID = '$Login_User' AND
                    A.Date = '$Date'
                    AND Shift = '$Shift'";

                    $query = $this->db->query($sql);
                    $Employee_Work_Data = $query->result();

                    if($query->num_rows() > 0){

                        return $Employee_Work_Data;

                    } else {

                        return 0;

                    }





    }

    public function Late_Employee_List($CompanyCode,$LocationCode,$Login_User,$Date,$Shift){

        $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst A
                INNER JOIN
                    UserDetails_Det B ON A.Ccode = B.Ccode AND A.Lcode = B.Lcode  AND A.Department = B.Name
                WHERE
                    B.UserID = '$Login_User' AND
                    A.Date = '2025-02-03' AND
                    A.Type = 'LATE' ";
                    // print_r( $sql);exit;
                    $query = $this->db->query($sql);
                    $Late_Employee_List = $query->result();


                    if($query->num_rows() > 0 ){

                        return  $Late_Employee_List;

                    } else {

                        return FALSE;
                    }


}



public function Shift_Closing_Report_Download($CompanyCode, $LocationCode, $Login_User, $Date, $Shift){

     $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst A
                INNER JOIN
                    UserDetails_Det B ON A.Ccode = B.Ccode AND A.Lcode = B.Lcode  AND A.Department = B.Name
                WHERE
                    B.UserID = '$Login_User' AND
                    A.Date = '$Date'
                    AND A.Shift = '$Shift'
                    AND A.Ccode = '$CompanyCode'
                    AND A.Lcode = '$LocationCode'";

                    $query = $this->db->query($sql);
                    $Employee_Work_Data = $query->result();

                    if($query->num_rows() > 0){

                        return $Employee_Work_Data;

                    } else {

                        return 0;

                    }

}



public function NoWork_Employee_List($CompanyCode,$LocationCode,$Login_User, $Date,$Shift){


    $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst A
                INNER JOIN
                    UserDetails_Det B ON A.Ccode = B.Ccode AND A.Lcode = B.Lcode  AND A.Department = B.Name
                WHERE
                    B.UserID = '$Login_User' AND
                    A.Date = '$Date'
                    AND A.Shift = '$Shift'
                    AND A.Ccode = '$CompanyCode'
                    AND A.Lcode = '$LocationCode'
                    AND A.Work_Type = 'NoWork'";

                    $query = $this->db->query($sql);
                    $Employee_Work_Data = $query->result();

                    if($query->num_rows() > 0){

                        return $Employee_Work_Data;

                    } else {

                        return 0;

                    }

}


public function Monthly_Reports($CompanyCode,$Lcode,$Login_User,$Month_Year){


 $sql = "SELECT * FROM Web_Employee_Work_Allocation_Mst A
                INNER JOIN
                    UserDetails_Det B ON A.Ccode = B.Ccode AND A.Lcode = B.Lcode  AND A.Department = B.Name
                WHERE
                    B.UserID = '$Login_User' AND
                    A.Date = '$Date'
                    AND A.Shift = '$Shift'
                    AND A.Ccode = '$CompanyCode'
                    AND A.Lcode = '$LocationCode'
                    AND A.Work_Type = 'NoWork'";

                    $query = $this->db->query($sql);
                    $Employee_Work_Data = $query->result();

                    if($query->num_rows() > 0){

                        return $Employee_Work_Data;

                    } else {

                        return 0;

                    }


}





}