<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Chart_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }


    public function Work_Allocation_Count($CompanyCode,$LocationCode,$Login_User){

                        $Current_Time = date('Y-m-d');


        $sql = "SELECT
            A.Department,
            A.Shift,
            COUNT(DISTINCT A.EmpNo) AS Workers FROM
            Web_Employee_Work_Allocation_Mst A
        INNER JOIN
            UserDetails_Det B ON A.Lcode = B.Lcode
        WHERE
            B.UserID = 'pafsi' AND
            A.Date = '2025-02-04'
        AND A.Assign_status = '1'
        GROUP BY
            A.Department,
            A.Shift";
        $query = $this->db->query($sql);
        $Work_Allocation_Count = $query->result();

        return $Work_Allocation_Count;
    }




}
?>