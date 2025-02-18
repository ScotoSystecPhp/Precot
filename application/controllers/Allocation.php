<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Allocation extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->helper('file');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->model('Allocation_Model');
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

            $this->data['Favicon'] = 'Precot | Work Allocation';


            $this->load->view('Frontend/Header',$this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Alloction/Index', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }


    public function Assign()
{
     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $UserName =  $Session['UserName'];

        $input_data = json_decode($this->input->raw_input_stream, true);

        // print_r($input_data);exit;

        $this->data['Work_Allocation'] = $Work_Allocation = $this->Allocation_Model->Assign($input_data, $CompanyCode, $LocationCode);

        if ($Work_Allocation) {
            echo json_encode(1);
        } else {
            echo json_encode(array('0'));
        }




    } else {
        redirect(base_url(), 'refresh');
    }
}

public function Edit(){

      $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $UserName =  $Session['UserName'];

        $input_data = json_decode($this->input->raw_input_stream, true);

        $this->data['Edit_Work_Allocation'] = $Edit_Work_Allocation = $this->Allocation_Model->Edit($input_data, $CompanyCode, $LocationCode);

        if ($Edit_Work_Allocation) {
            echo json_encode(1);
        } else {
            echo json_encode(array(0));
        }

    } else {
        redirect(base_url(), 'refresh');
    }

}



public function Previous_Day()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {


        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $UserName =  $Session['UserName'];

            $Date = $this->input->post('Date');
            $Department = $this->input->post('Department');
            $Shift = $this->input->post('Shift');
            $Work_Area = $this->input->post('Work_Area');
            $JobCard = $this->input->post('JobCardNo');
            

            $this->data['Previous_Day_Work_Alloction'] = $Previous_Day_Work_Alloction = $this->Allocation_Model->Previous_Day_Work_Alloction($Date, $Department, $Shift, $Work_Area, $JobCard);
            $this->data['Machines'] = $Machines = $this->Work_Master_Model->Machines($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Work_Area,$JobCard);

            if (!empty($Previous_Day_Work_Alloction)) {
                $this->data['Previous_Day_Work_Alloction'] = $Previous_Day_Work_Alloction;
            } else {
                $this->data['Previous_Day_Work_Alloction'] = [];
            }

            echo json_encode($this->data);
        } else {
            redirect(base_url(), 'refresh');
        }
    }


    public function Work_Assign(){

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $this->data['Favicon'] = 'Precot | Others Work Allocation';

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Alloction/Late_Employee_Assign', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }

    }

     public function Shift_Employee_Work_Details()
    {

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $CompanyCode =  $Session['Ccode'];
        $LocationCode =  $Session['Lcode'];
        $UserName =  $Session['UserName'];

            $Shift = $this->input->post('Shift');
            // $Shift = 'SHIFT2';
            $Date = $this->input->post('Date');
            $Department = $this->input->post('Department');
            $Work_Area = $this->input->post('Work_Area');
            $JobCard = $this->input->post('JobCard');

            $this->data['Shift_Employee_Work_Details'] = $Shift_Employee_Work_Details = $this->Allocation_Model->Shift_Employee_Work_Details($CompanyCode, $LocationCode, $Date , $Shift ,$Department,$Work_Area,$JobCard);

            if(isset($Shift_Employee_Work_Details) && !empty($Shift_Employee_Work_Details)){

                echo json_encode($this->data);

            } else {

                echo json_encode(0);
            }

        } else {
            redirect(base_url(), 'refresh');
        }
    }



        public function Employee_Shift_Closings()
    {

          $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $inputData = json_decode($this->input->raw_input_stream, true);

        $this->data['Employee_Shift_Closings'] = $Employee_Shift_Closings = $this->Allocation_Model->Employee_Shift_Closings($inputData);



        } else {

             redirect(base_url(), 'refresh');
        }

    }


    public function Partial_Close(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data['Favicon'] = 'Precot | Partial Close Work';

            if($_POST){

            $CompanyCode =  $Session['Ccode'];
            $LocationCode =  $Session['Lcode'];
            $UserName =  $Session['UserName'];
            $Shift = $this->input->post('Shift');
            $Date = $this->input->post('Date');
            $Department = $this->input->post('Department');
            $Employee_Id = $this->input->post('Employee_Id');
            $Reason = $this->input->post('Reason');
            $Work_Time =  $this->input->post('Work_Time');

            $this->data['Partial_Close_Work'] = $Partial_Close_Work = $this->Allocation_Model->Partial_Close_Work($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Employee_Id,$Reason,$Work_Time);

            if($Partial_Close_Work == TRUE){

                 $Reponse = array (
                    'status' => 'success',
                    'mesaage' => 'Employee Partial Work Closed.',
                );

                echo json_encode($Reponse);

            } else{

                $Reponse = array (
                    'status' => 'error',
                    'mesaage' => 'Employee Partial Work Not Closed.',
                );

                echo json_encode($Reponse);

            }

exit;

            }

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Alloction/Partial_Close', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }

    }


    public function Assgined_Employee_Id(){


        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $CompanyCode =  $Session['Ccode'];
            $LocationCode =  $Session['Lcode'];
            $UserName =  $Session['UserName'];
            $Shift = $this->input->post('Shift');
            $Date = $this->input->post('Date');
            $Department = $this->input->post('Department');

            $this->data['Assgined_Employee_Id'] = $Assgined_Employee_Id = $this->Allocation_Model->Assgined_Employee_Id($CompanyCode,$LocationCode,$Date,$Shift,$Department);

            if($Assgined_Employee_Id != FALSE){

                echo json_encode($Assgined_Employee_Id);

            } else {

                $Reponse = array (
                    'status' => 'error',
                    'mesaage' => 'Employee Details Not Found!!.',
                );

                echo json_encode($Reponse);

            }

        } else {
            redirect(base_url(), 'refresh');
        }

    }


    public function Partial_Close_List(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

           $CompanyCode =  $Session['Ccode'];
           $LocationCode =  $Session['Lcode'];
           $UserName =  $Session['UserName'];
           $Date = $this->input->post('Date');
           $Shift = $this->input->post('Shift');

           $this->data['Partial_Close_List'] = $Partial_Close_List = $this->Allocation_Model->Partial_Close_List($CompanyCode,$LocationCode,$UserName,$Date,$Shift);

           if($Partial_Close_List  != FALSE){

            echo json_encode($Partial_Close_List);

           } else {

             $Reponse = array (
                    'status' => 'error',
                    'mesaage' => 'Employee Details Not Found!!.',
                );

                echo json_encode($Reponse);

           }


        } else {
            redirect(base_url());
        }

    }


    public function Late_Employee_List(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $CompanyCode =  $Session['Ccode'];
            $LocationCode =  $Session['Lcode'];
            $UserName =  $Session['UserName'];
            $Date = $this->input->post('Date');
            $Department = $this->input->post('Department');
            $Work_Area = $this->input->post('WorkArea');
            $JobCard = $this->input->post('JobCard');
            $Shift = $this->input->post('Assigning_Shift');
            $Employee_Type = $this->input->post('Employee_Type');

           $this->data['Late_Employee_List'] = $Late_Employee_List = $this->Allocation_Model->Late_Employee_List($CompanyCode,$LocationCode,$Date,$UserName,$Shift,$Department,$Work_Area,$JobCard,$Employee_Type);
           $this->data['Machines'] = $Machines = $this->Work_Master_Model->Machines($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Work_Area,$JobCard);

        //    if($Late_Employee_List){

            echo json_encode($this->data);

        //    } else {

        //      $Reponse = array (
        //             'status' => 'error',
        //             'mesaage' => 'Employee Details Not Found!!.',
        //         );

        //         echo json_encode($Reponse);

        //    }


        } else {
            redirect(base_url());
        }


    }




}