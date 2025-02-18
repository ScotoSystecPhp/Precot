<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class  Master_Model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function Get_Department($Ccode, $Lcode, $UserName)
    {

       $sql = "SELECT * FROM UserDetails_Det WHERE CCode = '$Ccode' AND LCode = '$Lcode' AND UserName = '$UserName' AND Name != 'HR'";
        $query = $this->db->query($sql);
        return $query->result();

    }

    public function Job_Card_No()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            if ($_POST) {


                $Ccode = $this->input->post('Ccode');
                $Lcode = $this->input->post('Lcode');
                $Department = $this->input->post('Department');
                $Work_Area = $this->input->post('sub_Department');
                $JobCardNo = $this->input->post('jobcardno');



                $JobCard = array(
                    'Ccode' => $this->input->post('Ccode'),
                    'Lcode' => $this->input->post('Lcode'),
                    'Department' => $this->input->post('Department'),
                    'WorkArea' => $this->input->post('sub_Department'),
                    'JobCard_No' => $this->input->post('jobcardno'),
                    'Created_By' =>  $Session['UserName'],
                    'Created_Time' => date('Y-m-d H:i:s'),
                    'Updated_By' =>  '',
                    'Updated_Time' => '',
                );

                $sql1 = "SELECT *  FROM Web_JobCard_Mst where Ccode = '$Ccode' AND Lcode = '$Lcode' AND Department = '$Department' AND WorkArea = '$Work_Area'";
                $query1 = $this->db->query($sql1);
                // print_r($sql1);exit;
                $row1 = $query1->num_rows();

                if(empty($row1)) {

                 $Updated = $this->db->insert('Web_JobCard_Mst', $JobCard);

                if ($Updated) {

                    return 1;

                } else {

                    return 0;
                }

                }

            }
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Generate_New($Ccode, $Lcode, $Department, $WorkArea)
    {
        // First, check if there are any existing job cards for the given Department and WorkArea
        $this->db->select('JobCard_No');
        $this->db->where('Ccode', $Ccode);
        $this->db->where('Lcode', $Lcode);

        $query = $this->db->get('Web_JobCard_Mst');

        if ($query->num_rows() == 0) {
            // If no job cards exist, generate the first job card number
            $this->db->select('MAX(TRY_CAST(SUBSTRING(CAST(JobCard_No AS VARCHAR), 4, 4) AS INT)) AS last_id');
            $this->db->where('Ccode', $Ccode);
            $this->db->where('Lcode', $Lcode);

            $query_last_id = $this->db->get('Web_JobCard_Mst');
            $result = $query_last_id->row();
            $last_id = isset($result->last_id) ? $result->last_id : 0;

            // Increment the last id and generate a new Job Card ID
            $new_id_number = str_pad($last_id + 1, 4, '0', STR_PAD_LEFT);
            $new_job_id = "JOB" . $new_id_number;
        } else {
            // If job cards exist, start from the highest existing number
            $this->db->select('MAX(TRY_CAST(SUBSTRING(CAST(JobCard_No AS VARCHAR), 4, 4) AS INT)) AS last_id');
            $this->db->where('Ccode', $Ccode);
            $this->db->where('Lcode', $Lcode);

            $query_last_id = $this->db->get('Web_JobCard_Mst');
            $result = $query_last_id->row();
            $last_id = isset($result->last_id) ? $result->last_id : 0;

            // Generate the first new ID and check if it already exists
            $new_id_number = str_pad($last_id + 1, 4, '0', STR_PAD_LEFT);
            $new_job_id = "JOB" . $new_id_number;

            // Check if the new Job Card number already exists in the database
            while ($this->is_job_card_exists($new_job_id, $Ccode, $Lcode)) {
                // If it exists, increment and check again
                $last_id++;
                $new_id_number = str_pad($last_id + 1, 4, '0', STR_PAD_LEFT);
                $new_job_id = "JOB" . $new_id_number;
            }
        }

        return $new_job_id;
    }

    // Helper function to check if a Job Card number already exists
    private function is_job_card_exists($job_card_no, $Ccode, $Lcode)
    {
        $this->db->select('JobCard_No');
        $this->db->where('JobCard_No', $job_card_no);
        $this->db->where('Ccode', $Ccode);
        $this->db->where('Lcode', $Lcode);

        $query = $this->db->get('Web_JobCard_Mst');

        return $query->num_rows() > 0; // Returns true if the job card exists
    }


    public function Generete_Machine_id($Ccode, $Lcode, $Department, $WorkArea)
    {
        // Check if there are any machines already for the given Department and WorkArea
        $this->db->select('Machine_Id');
        $this->db->where('Ccode', $Ccode);
        $this->db->where('Lcode', $Lcode);


        $query = $this->db->get('Web_Machine_Mst');

        // If no machines exist, generate the first machine code as MC0001
        if ($query->num_rows() == 0) {
            $new_machine_code = "MC0001";
        } else {
            // Get the maximum existing machine ID number
            $this->db->select('MAX(TRY_CAST(SUBSTRING(CAST(Machine_Id AS VARCHAR), 3, 4) AS INT)) AS last_id');
            $this->db->where('Ccode', $Ccode);
            $this->db->where('Lcode', $Lcode);


            $query_last_id = $this->db->get('Web_Machine_Mst');
            $result = $query_last_id->row();
            $last_id = isset($result->last_id) ? $result->last_id : 0;

            // Generate the new machine code based on the last ID
            $new_id_number = str_pad($last_id + 1, 4, '0', STR_PAD_LEFT);
            $new_machine_code = "MC" . $new_id_number;

            // Check if the new Machine ID already exists
            while ($this->is_machine_id_exists($new_machine_code, $Ccode, $Lcode, $Department, $WorkArea)) {
                // If it exists, increment the ID and check again
                $last_id++;
                $new_id_number = str_pad($last_id + 1, 4, '0', STR_PAD_LEFT);
                $new_machine_code = "MC" . $new_id_number;
            }
        }

        return $new_machine_code;
    }

    // Helper function to check if a Machine ID already exists
    private function is_machine_id_exists($machine_id, $Ccode, $Lcode, $Department, $WorkArea)
    {
        $this->db->select('Machine_Id');
        $this->db->where('Machine_Id', $machine_id);
        $this->db->where('Ccode', $Ccode);
        $this->db->where('Lcode', $Lcode);


        $query = $this->db->get('Web_Machine_Mst');

        return $query->num_rows() > 0; // Returns true if the Machine ID exists
    }












    public function Get_Job_Card()
    {
        $sql = "SELECT * from Web_JobCard_Mst";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function Get_JobCard_No($Ccode, $Lcode, $Department, $WorkArea)
    {
        $sql = "SELECT * from Web_JobCard_Mst where CCode = '$Ccode' AND LCode = '$Lcode' AND Department = '$Department' AND WorkArea = '$WorkArea' ";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function Get_Machine_Master($Ccode, $Lcode, $Department)
    {
        $sql = "SELECT * from Web_Machine_Mst where CCode = '$Ccode' AND LCode = '$Lcode'";
        $query = $this->db->query($sql);
        return $query->result();
    }



    public function Create_Machine_Master()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $Ccode =  $Session['Ccode'];
            $Lcode =  $Session['Lcode'];
            $UserName =  $Session['UserName'];

            // Debugging - Remove echo/print in production code
            echo '<pre>';
            print_r($_POST);
            // exit;

            if ($_POST) {

                $Department = $this->input->post('Department');

                $Machine_Id = $this->input->post('Machine_Model_No');
                $query = $this->db->get_where('Web_Machine_Mst', array('Machine_Id' => $Machine_Id));

                if ($query->num_rows() > 0) {
                    echo 'Machine ID already exists!';
                    return 2;
                }

                if ($Department == "SPINNING" || $Department == "CARDING" || $Department == "SPINNING-MNT") {

                    $Machine = array(
                        'Ccode' => $Ccode,
                        'Lcode' => $Lcode,
                        'Department' => $this->input->post('Department'),
                        'WorkArea' => $this->input->post('Work_Area'),
                        'JobCard_No' => '-',
                        'Machine_Id' => $this->input->post('Machine_Model_No'),
                        'Machine_Model' => $this->input->post('Machine_Model'),
                        'Machine_Name' => $this->input->post('Machine_Name'),
                        'Frame_Type' => $this->input->post('FrameType'),
                        'Input_Method' => $this->input->post('InputMethod'),
                        'Frame' => '-',
                        'Status' => 'Active',
                        'Created_By' =>  $Session['UserName'],
                        'Created_Time' => date('Y-m-d H:i:s'),
                        'Updated_By' => '',
                        'Updated_Time' => '',
                    );

                    // Insert the new record
                    $Updated = $this->db->insert('Web_Machine_Mst', $Machine);
                } else {

                    $Machine = array(
                        'Ccode' => $Ccode,
                        'Lcode' => $Lcode,
                        'Department' => $this->input->post('Department'),
                        'WorkArea' => $this->input->post('Work_Area'),
                        'JobCard_No' => '-',
                        'Machine_Id' => $this->input->post('Machine_Model_No'),
                        'Machine_Model' => $this->input->post('Machine_Model'),
                        'Machine_Name' => $this->input->post('Machine_Name'),
                        'Frame_Type' => $this->input->post('FrameType'),
                        'Input_Method' => $this->input->post('InputMethod'),
                        'Frame' => '-',
                        'Status' => 'Active',
                        'Created_By' =>  $Session['UserName'],
                        'Created_Time' => date('Y-m-d H:i:s')
                    );

                    // Insert the new record
                    $Updated = $this->db->insert('Web_Machine_Mst', $Machine);
                }

                if ($Updated) {
                    return 1;  // Successfully inserted
                } else {
                    return 0;  // Insertion failed
                }
            } else {
                // If no POST data, redirect to Auth
                redirect(base_url(), 'refresh');
            }
        }
    }



    public function Sub_Depart($Ccode, $Lcode)
    {

        $sql = "SELECT * from Web_Work_Area_Mst where Ccode = '$Ccode' AND Lcode = '$Lcode'";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function Sub_Departs($Ccode, $Lcode, $Department)
    {
        $sql = "SELECT * from Web_Work_Area_Mst where Ccode = '$Ccode' AND Lcode = '$Lcode' AND MainDeptName = '$Department'";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function Machine_Frames($Department, $WorkArea, $Machine_Id, $Machine_Name)
    {
        foreach ($Machine_Id as $Machine) {
            $sql = "SELECT Frame , Machine_Id from Web_Machine_Mst where Department = '$Department' AND WorkArea = '$WorkArea' AND Machine_Id = '$Machine' AND Machine_Name = '$Machine_Name'";
            $query = $this->db->query($sql);
        }
        return $query->result();
    }

    public function Eb_Servive_No($Ccode, $Lcode)
    {
        $sql = "SELECT * from Web_EB_Master_Mst where CCode = '$Ccode' AND LCode = '$Lcode'";
        $query = $this->db->query($sql);
        return $query->result();
    }


    public function EB_Servive_Name($Ccode, $Lcode, $Service_No)
    {
        $sql = "SELECT Service_Name from Web_EB_Master_Mst where CCode = '$Ccode' AND LCode = '$Lcode' AND Service_No = '$Service_No'";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function Previous_Date_EB($Ccode, $Lcode, $Service_No, $Service_Name, $Date)
    {
        $previousDate = date('Y-m-d', strtotime($Date . ' -1 day'));

        $sql = "
            SELECT Date, Current_Day
            FROM Web_EB_Calculate_Mst
            WHERE CCode = '$Ccode'
            AND LCode = '$Lcode'
            AND Service_No = '$Service_No'
            AND Service_Name = '$Service_Name'
            AND Date = '$previousDate'";

        $query = $this->db->query($sql);
        return $query->result();
    }

    public function EB_Calculation_Saves($Ccode, $Lcode, $Service_No, $Service_Name, $Date, $Previous_Day_Unit, $Current_Day_Unit, $Unit_Rate, $EB_Amount, $Running_Unit)
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $sql = "SELECT * FROM Web_EB_Calculate_Mst WHERE Ccode='$Ccode' AND Lcode='$Lcode' AND Service_No='$Service_No' AND Date = '$Date'";
            $query = $this->db->query($sql);
            $result = $query->num_rows();

            if ($result == 0) {

                $date = new DateTime($Date);

                $Year = $date->format('Y');
                $Month = $date->format('F');

                $Insert_Data = array(
                    'CCode' => $Ccode,
                    'LCode' => $Lcode,
                    'Unit' => 'PRECOT',
                    'Service_No' => $Service_No,
                    'Service_Name' => $Service_Name,
                    'Date' => $Date,
                    'Month' =>  $Month,
                    'Year' => $Year,
                    'Shift' => '-',
                    'Previous_Day' => $Previous_Day_Unit,
                    'Current_Day' => $Current_Day_Unit,
                    'Running_Unit' => $Running_Unit,
                    'EB_Rate' => $Unit_Rate,
                    'Amount' => $EB_Amount,
                    'Remarks' => '-',
                    'Is_Active' => 'Active',
                    'Approved_By' => 'Approved',
                    'Created_By' =>  $Session['UserName'],
                    'Created_Time' => date('Y-m-d H:i:s'),
                    'Updated_By' => '-',
                    'Updated_Time' => '-',
                );
                $this->db->insert('Web_EB_Calculate_Mst', $Insert_Data);

                return 0;
            } else {
                return 1;
            }
        } else {
            redirect(base_url(), 'refresh');
        }
    }


    public function Power_List($Ccode, $Lcode, $Service_No)
    {
        $sql = "SELECT * FROM Web_EB_Calculate_Mst WHERE Ccode='$Ccode' AND Lcode='$Lcode' AND Service_No='$Service_No'";
        $query = $this->db->query($sql);
        $result = $query->result();
        return $result;
    }

    public function JobCardNo($Ccode, $Lcode, $Department, $WorkArea)
    {

        $sql = "SELECT * FROM Web_JobCard_Mst WHERE Ccode='$Ccode' AND Lcode='$Lcode' AND Department='$Department' AND WorkArea='$WorkArea'";
        $query = $this->db->query($sql);
        $result = $query->result();
        return $result;
    }

    public function Electric_Power_Rate($Ccode, $Lcode)
    {

        $sql = "SELECT Rate FROM Web_EB_Rating_Mst WHERE Ccode ='$Ccode' AND LCode = '$Lcode'";
        $query = $this->db->query($sql);
        $result = $query->result();
        return $result;
    }
}