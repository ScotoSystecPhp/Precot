<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Master extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->helper('file');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->model('Master_Model');
        $this->load->model('Work_Master_Model');
    }

    public function index()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );


            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];

            $this->data['Favicon'] = 'precot | Work Area List';


            $this->data['Sub_Dep'] = $Sub_Dep = $this->Master_Model->Sub_Depart($Ccode, $Lcode);

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Master/Index', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }


    public function Add_depart()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

             $this->data['Favicon'] = 'precot | New Work Area ';



            if ($_POST) {

                $Ccode = $this->input->post('Ccode');
                $Lcode = $this->input->post('Lcode');
                $Department = $this->input->post('Department');
                $Work_Area = $this->input->post('Sub_Depat');


                $Sub_Depart = array(
                    'Ccode' =>  $Session['Ccode'],
                    'Lcode' =>  $Session['Lcode'],
                    'Department' => $this->input->post('Department'),
                    'WorkArea' => $this->input->post('Sub_Depat'),
                    'CreatedBy' =>  $Session['UserName'],
                    'CreatedTime' => date('Y-m-d'),
                    'UpdatedBy' => '',
                    'UpdatedTime' => '',
                );

                $sql1 = "SELECT *  FROM Web_Work_Area_Mst where Ccode = '$Ccode' AND Lcode = '$Lcode' AND Department = '$Department' AND WorkArea = '$Work_Area'";
                $query1 = $this->db->query($sql1);
                // print_r($sql1);exit;
                $row1 = $query1->num_rows();

                if(empty($row1)) {

                $this->db->insert('Web_Work_Area_Mst', $Sub_Depart);

                }
            }

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Master/add_department', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Sub_Depart()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );
            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];

            $Department = $this->input->post('Department');
            $this->data['Sub_Dep'] = $Sub_Dep = $this->Master_Model->Sub_Departs($Ccode, $Lcode, $Department);
            echo json_encode($Sub_Dep);
        } else {
            redirect(base_url(), 'refresh');
        }
    }


    // --------------------------------------------------  EB Power Management  -----------------------------------------------//


    public function Add_EB()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );
            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];

            $this->load->view('Frontend/Header');
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Master/EB_Master', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Eb_Servive_No()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );
            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];

            $this->data['EB_Servive_No'] = $EB_Servive_No = $this->Master_Model->Eb_Servive_No($Ccode, $Lcode);
            echo json_encode($EB_Servive_No);
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Eb_Servive_Detail()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );
            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];
            $Service_No = $this->input->post('Service_No');

            $this->data['Power_List'] = $Power_List = $this->Master_Model->Power_List($Ccode, $Lcode, $Service_No);
            $this->data['Electric_Power_Rate'] = $Electric_Power_Rate = $this->Master_Model->Electric_Power_Rate($Ccode, $Lcode);
            $this->data['EB_Servive_Name'] = $EB_Servive_Name = $this->Master_Model->EB_Servive_Name($Ccode, $Lcode, $Service_No);

            echo json_encode($this->data);
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Previous_Date_EB()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );
            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];
            $Service_No = $this->input->post('Service_No');
            $Service_Name = $this->input->post('Service_Name');
            $Date = $this->input->post('Date');
            $this->data['Previous_Date'] = $Previous_Date = $this->Master_Model->Previous_Date_EB($Ccode, $Lcode, $Service_No, $Service_Name, $Date);
            echo json_encode($this->data);
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function EB_Calculation_Save()
    {

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];
            $Service_No = $this->input->post('Service_No');
            $Service_Name = $this->input->post('Service_Name');
            $Date = $this->input->post('Date');
            $Previous_Day_Unit = $this->input->post('Previous_Day_Unit');
            $Current_Day_Unit = $this->input->post('Current_Day_Unit');
            $Unit_Rate = $this->input->post('Rate_Amount');
            $EB_Amount = $this->input->post('Unit_Amount');
            $Running = $this->input->post('Actual_Unit');


            $this->data['EB_Calculation_Save'] = $EB_Calculation_Save = $this->Master_Model->EB_Calculation_Saves($Ccode, $Lcode, $Service_No, $Service_Name, $Date, $Previous_Day_Unit, $Current_Day_Unit, $Unit_Rate, $EB_Amount, $Running);

            // print_r($EB_Calculation_Save);exit;
            if ($EB_Calculation_Save == '1') {
                echo json_encode('Already');
            } else if ($EB_Calculation_Save == '0') {
                echo json_encode('Success');
            }
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function JobCardNo(){
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];

            $Department = $this->input->post('Department');
            $Sub_Department = $this->input->post('Sub_Department');

            $this->data['JobCardNo'] =  $JobCardNo = $this->Master_Model->JobCardNo($Ccode, $Lcode, $Department, $Sub_Department);
            echo json_encode($this->data);

        }else{
            redirect(base_url(),'refresh');
        }
    }
}