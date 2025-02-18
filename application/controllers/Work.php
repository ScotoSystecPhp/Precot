<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Work extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->helper('file');
        $this->load->library('session');
        $this->load->model('Work_Model');
    }


    public function Shift_Employee_List(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

        $Date = $this->input->post('Date');
        $Shift = $this->input->post('Shift');
        $Type = $this->input->post('Type');

        $this->data['Shift_Employee_List'] = $Shift_Employee_List = $this->Work_Model->Shift_Employee_List($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Type);
        $this->data['User_Department'] = $User_Department = $this->Work_Model->User_Department($CompanyCode,$LocationCode,$Login_User);



        if(isset($Shift_Employee_List)){
            echo  json_encode($this->data);
        }

        } else {

            redirect(base_url());

        }
    }


    public function Work_Type(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

        $Date = $this->input->post('Date');
        $Shift = $this->input->post('Shift');
        $Department = $this->input->post('Department');
        $WorArea = $this->input->post('WorkArea');
        $JobCardNo = $this->input->post('JobCardNo');

        $this->data['Work_Type'] = $Work_Type = $this->Work_Model->Work_Type($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Department,$WorArea,$JobCardNo);
        // $this->data['User_Department'] = $User_Department = $this->Work_Model->User_Department($CompanyCode,$LocationCode,$Login_User);



        if(isset($Work_Type)){
            echo  json_encode($this->data);
        }

        } else {

            redirect(base_url());

        }


    }

    public function Work_Areas(){

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

        $Department = $this->input->post('Department');


        $this->data['Work_Areas'] = $Work_Areas = $this->Work_Model->Work_Areas($CompanyCode,$LocationCode,$Login_User,$Department);



        if(isset($Work_Areas)){
            echo  json_encode($this->data);
        }

        } else {

            redirect(base_url());

        }

    }


     public function Job_Card_Nos(){

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

        $Department = $this->input->post('Department');
        $WorkArea = $this->input->post('WorkArea');

        $this->data['Job_Card_Nos'] = $Job_Card_Nos = $this->Work_Model->Job_Card_Nos($CompanyCode,$LocationCode,$Login_User,$Department,$WorkArea);

        if(isset($Job_Card_Nos)){
            echo  json_encode($this->data);
        }

        } else {

            redirect(base_url());

        }

    }

    public function Frame(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

        $Date = $this->input->post('Date');
        $Shift = $this->input->post('Shift');
        $Department = $this->input->post('Department');
        $WorkArea = $this->input->post('WorkArea');
        $JobCardNo = $this->input->post('JobCardNo');
        $Machine_Id = $this->input->post('Machine_Id');

        $this->data['Frame'] = $Frame = $this->Work_Model->Frame($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Department,$WorkArea,$JobCardNo,$Machine_Id);

        if(isset($Frame)){
            echo  json_encode($this->data);
        }

        } else {

            redirect(base_url());

        }

    }

    public function Save(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

        $input_data = json_decode($this->input->raw_input_stream, true);

        $this->data['Work_Allocation'] = $Work_Allocation = $this->Work_Model->Assign($input_data, $CompanyCode, $LocationCode);


           foreach ($input_data['Allocations'] as $row) {
            $Department = $row['Department'];
            $Date = $row['Date'];
            $Shift = $row['Shift'];
            $Work_Area = $row['Work_Area'];
            $Employee_Id = $row['EmployeeId'];
            $Frame = $row['Frames'];
            $FrameType = $row['FrameType'];
            $Machine_Id = $row['Machine_Id'];
            $Job_Card_No = $row['JobCardNo'];
            $Type = $row['Allocation_Type'];
           }

        $this->data['Shift_Employee_List'] = $Shift_Employee_List = $this->Work_Model->Shift_Employee_List($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Type);
        $this->data['User_Department'] = $User_Department = $this->Work_Model->User_Department($CompanyCode,$LocationCode,$Login_User);



        if(isset($Shift_Employee_List)){
            echo  json_encode($this->data);
        }


        }else {
             redirect(base_url());

        }

    }

    public function Edit(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

        $input_data = json_decode($this->input->raw_input_stream, true);

        $this->data['Edit'] = $Work_Allocation = $this->Work_Model->Edit($input_data, $CompanyCode, $LocationCode);


           foreach ($input_data['Allocations'] as $row) {
            $Department = $row['Department'];
            $Date = $row['Date'];
            $Shift = $row['Shift'];
            $Work_Area = $row['Work_Area'];
            $Employee_Id = $row['EmployeeId'];
            $Frame = $row['Frames'];
            $FrameType = $row['FrameType'];
            $Machine_Id = $row['Machine_Id'];
            $Job_Card_No = $row['JobCardNo'];
            $Type = $row['Allocation_Type'];
           }

        $this->data['Shift_Employee_List'] = $Shift_Employee_List = $this->Work_Model->Shift_Employee_List($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Type);
        $this->data['User_Department'] = $User_Department = $this->Work_Model->User_Department($CompanyCode,$LocationCode,$Login_User);


        if(isset($Shift_Employee_List)){
            echo  json_encode($this->data);
        }

        }else {
             redirect(base_url());

        }
    }



    public function Previous_Allocation(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

        $Date = $this->input->post('Date');
        $Shift = $this->input->post('Shift');
        $Type = $this->input->post('Type');

        $this->data['Previous_Allocation'] = $Previous_Allocation = $this->Work_Model->Previous_Allocation($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Type);


        $this->data['Shift_Employee_List'] = $Shift_Employee_List = $this->Work_Model->Shift_Employee_List($CompanyCode,$LocationCode,$Login_User,$Date,$Shift,$Type);
        $this->data['User_Department'] = $User_Department = $this->Work_Model->User_Department($CompanyCode,$LocationCode,$Login_User);


        if(isset($Shift_Employee_List)){
            echo  json_encode($this->data);
        }

        } else {
            redirect(base_url());
        }

    }


    public function Allocation_List(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $Login_User =  $Session['UserName'];

        $Date = $this->input->post('Date');
        $Shift = $this->input->post('Shift');

        $this->data['Allocation_List'] = $Allication_List =  $this->Work_Model->Allocation_List($CompanyCode,$LocationCode,$Login_User,$Date,$Shift);

        echo json_encode($this->data);

    } else {

        redirect(base_url());
    }


    }


    public function Employee_Shift_Closings()
    {

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $inputData = json_decode($this->input->raw_input_stream, true);

        $this->data['Employee_Shift_Closings'] = $Employee_Shift_Closings = $this->Work_Model->Employee_Shift_Closings($inputData);

        echo json_encode('success');

        } else {

             redirect(base_url(), 'refresh');
        }

    }



}