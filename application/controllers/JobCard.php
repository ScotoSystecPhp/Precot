<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class JobCard extends CI_Controller
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
    }

    private function set_rule_jobcardno()
    {
        $rules = array(

            array(
                'field' => 'Department',
                'label' => 'Department',
                'rules' => 'trim|required'
            ),
            array(
                'field' => 'jobcardno',
                'label' => 'jobcardno',
                'rules' => 'trim|required'
            ),
        );
        return $rules;
    }

    private function set_rule_Machine_Master_rules()
    {
        $rules = array(

            array(
                'field' => 'Department',
                'label' => 'Department',
                'rules' => 'trim|required'
            ),

            array(
                'field' => 'Machine_Model',
                'label' => 'Machine_Model',
                'rules' => 'trim|required'
            ),
            array(
                'field' => 'Machine_Model_No',
                'label' => 'Machine_Model_No',
                'rules' => 'trim|required'
            ),
        );
        return $rules;
    }

    public function index()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data['Favicon'] = 'Precot | Job Card List';

            $this->data['Get_Job_Card'] = $Get_Job_Card = $this->Master_Model->Get_Job_Card();

            $this->load->view('Frontend/Header',$this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Job_Card/Index', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Get_Department()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data['Ccode'] = $Ccode =  $Session['Ccode'];
            $this->data['Lcode'] = $Lcode =  $Session['Lcode'];
            $this->data['UserName'] = $UserName =  $Session['UserName'];

            $this->data['Department'] = $Department = $this->Master_Model->Get_Department($Ccode, $Lcode, $UserName);
            echo json_encode($Department);
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function add()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $this->data['Favicon'] = 'precot | Add New Job Card ';


            if ($_POST) {

                $rules = $this->set_rule_jobcardno();
                $this->form_validation->set_rules($rules);
                if ($this->form_validation->run() == FALSE) {
                    $this->data['form_validation'] = validation_errors();
                } else {

                    $update = $this->Master_Model->Job_Card_No();

                    if ($update == 1) {
                        $this->session->set_flashdata('success', 'Job Card No data updated successfully');
                    } else if ($update == 2) {
                        echo json_encode('2');
                    }else{
                        $this->session->set_flashdata('error', 'Already Job Card No data updated');
                    }
                }
            }

            $this->load->view('Frontend/Header',$this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Job_Card/Add', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Generate_New()
    {

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {


            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $Department = $this->input->post('Department');
            $Sub_Department = $this->input->post('Sub_Department');

            $this->data['Ccode'] = $Ccode =  $Session['Ccode'];
            $this->data['Lcode'] = $Lcode =  $Session['Lcode'];

            $this->data['Job_Card_No'] = $Job_Card_No = $this->Master_Model->Generate_New($Ccode, $Lcode, $Department, $Sub_Department);

            if ($Job_Card_No == FALSE) {

                echo json_encode('error');
            } else {

                echo json_encode($this->data);
            }
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Generete_Machine_id()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $Department = $this->input->post('Department');
            $Sub_Department = $this->input->post('Sub_Department');

            $this->data['Ccode'] = $Ccode =  $Session['Ccode'];
            $this->data['Lcode'] = $Lcode =  $Session['Lcode'];

            $this->data['Machine_Id'] = $Machine_Id = $this->Master_Model->Generete_Machine_id($Ccode, $Lcode, $Department, $Sub_Department);

            echo json_encode($this->data);

        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Machine()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data['Ccode'] = $Ccode =  $Session['Ccode'];
            $this->data['Lcode'] = $Lcode =  $Session['Lcode'];
            $this->data['UserName'] = $UserName =  $Session['UserName'];
            $this->data['Department'] = $Department =  $Session['Department'];

            $this->data['Favicon'] = 'Precot | Machine List';

            $this->data['Machine_Master'] = $Machine_Master = $this->Master_Model->Get_Machine_Master($Ccode, $Lcode, $Department);

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Machine_Master/Index', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Get_Job_Card_No()
    {

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data['Ccode'] = $Ccode =  $Session['Ccode'];
            $this->data['Lcode'] = $Lcode =  $Session['Lcode'];
            $this->data['UserName'] = $UserName =  $Session['UserName'];

            $Department = $this->input->post('Department');
            $Sub_Department = $this->input->post('Sub_Department');

            $this->data['Job_Card_No'] = $Job_Card_No = $this->Master_Model->Get_Job_Card_No($Ccode, $Lcode, $Department, $Sub_Department);
            echo json_encode($Job_Card_No);
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Add_Machine()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $this->data['Favicon'] = 'Precot | Add New Machine';

            if ($_POST) {

                $rules = $this->set_rule_Machine_Master_rules();
                $this->form_validation->set_rules($rules);
                if ($this->form_validation->run() == FALSE) {
                    $this->data['form_validation'] = validation_errors();
                    print_r($this->data);
                } else {

                    $update = $this->Master_Model->Create_Machine_Master();
                    // print_r($update );exit;

                    if ($update == '1') {
                        echo json_encode(1);
                    } else if ($update == '0') {
                        echo json_encode(0);
                    }
                    exit;
                }
            }


            $this->load->view('Frontend/Header',$this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Machine_Master/Add', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Machine_Details()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data['Ccode'] = $Ccode =  $Session['Ccode'];
            $this->data['Lcode'] = $Lcode =  $Session['Lcode'];
            $this->data['UserName'] = $UserName =  $Session['UserName'];
            $this->data['Department'] = $Department =  $Session['Department'];

            $this->data['Machine_Master'] = $Machine_Master = $this->Master_Model->Get_Machine_Master($Ccode, $Lcode, $Department);

            $this->load->view('Frontend/Header');
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Machine_Master/Index', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }
}