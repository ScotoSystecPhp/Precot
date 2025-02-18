<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Work_Master extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->helper('file');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->model('Work_Master_Model');
        $this->load->database();
    }

#===============================================================================================================================#
#================================================== MASTER DETAILS START =======================================================#
#===============================================================================================================================#

public function Depertments(){

     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

        $this->data['Departments'] = $Departments = $this->Work_Master_Model->Departments($CompanyCode,$LocationCode,$UserName);

        if(isset($Departments) && !empty($Departments)){

            echo json_encode($this->data);

        } else {

            echo json_encode(array('error' => 'No Data Found'));

        }

    }  else {

        redirect(base_url(), 'refresh');

    }
}



public function Shifts(){

     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

        $this->data['Shifts'] = $Shifts = $this->Work_Master_Model->Shifts($CompanyCode,$LocationCode);

        if(isset($Shifts) && !empty($Shifts)){

            echo json_encode($this->data);

        } else {

            echo json_encode(array('error' => 'No Data Found'));

        }

    }  else {

        redirect(base_url(), 'refresh');

    }
}


public function Work_Areas(){

     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

        $Department = $this->input->post('Department');

        $this->data['Work_Areas'] = $Work_Areas = $this->Work_Master_Model->Work_Areas($CompanyCode,$LocationCode,$Department);

        if(isset($Work_Areas) && !empty($Work_Areas)){

            echo json_encode($this->data);

        } else {

            echo json_encode(array('error' => 'No Data Found'));

        }

    }  else {

        redirect(base_url(), 'refresh');

    }
}


public function JobCards(){

     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

        $Department = $this->input->post('Department');
        $Work_Area = $this->input->post('Work_Area');

        $this->data['JobCards'] = $JobCards = $this->Work_Master_Model->JobCards($CompanyCode,$LocationCode,$Department,$Work_Area);

        if(isset($JobCards) && !empty($JobCards)){

            echo json_encode($this->data);

        } else {

            echo json_encode(array('error' => 'No Data Found'));

        }

    }  else {

        redirect(base_url(), 'refresh');

    }
}



public function Wages(){

     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

        $Department = $this->input->post('Department');

        $this->data['Wages'] = $Wages = $this->Work_Master_Model->Wages($CompanyCode,$LocationCode,$Department);

        if(isset($Wages) && !empty($Wages)){

            echo json_encode($this->data);

        } else {

            echo json_encode(array('error' => 'No Data Found'));

        }

    }  else {

        redirect(base_url(), 'refresh');

    }
}


public function Employee_List(){

     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

            //  $Date = '2025-01-24';

        $Date = $this->input->post('Date');
        $Shift = $this->input->post('Shift');
        $Department = $this->input->post('Department');
        $Employee_Type = $this->input->post('Employee_Type');
        $Work_Area = $this->input->post('Work_Area');
        $JobCard = $this->input->post('JobCardNo');


        $this->data['Employee_List'] = $Employee_List = $this->Work_Master_Model->Employee_List($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Employee_Type,$Work_Area,$JobCard);
        $this->data['Machines'] = $Machines = $this->Work_Master_Model->Machines($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Work_Area,$JobCard);
        // $this->data['Assigned_Employee_List'] = $Assigned_Employee_List = $this->Work_Master_Model->Assigned_Employee_List($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Employee_Type);

        if(isset($Employee_List) && !empty($Employee_List)){

            echo json_encode($this->data);

        } else {

            echo json_encode(array('error' => 'No Data Found'));

        }

    }  else {

        redirect(base_url(), 'refresh');

    }
}



public function Machine_Frames(){

     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

        //  $Date = '2025-01-24';

        $Date = $this->input->post('Date');
        $Shift = $this->input->post('Shift');
        $Department = $this->input->post('Department');
        $Employee_Type = $this->input->post('Employee_Type');
        $Work_Area = $this->input->post('Work_Area');
        $JobCard = $this->input->post('JobCardNo');
        $Machine_Id = $this->input->post('Machine_Id');



        $this->data['Machine_Frames'] = $Machine_Frames = $this->Work_Master_Model->Machine_Frames($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Work_Area,$JobCard,$Machine_Id);

        if(isset($Machine_Frames) && !empty($Machine_Frames)){

            echo json_encode($this->data);

        } else {

            echo json_encode(array('error' => 'No Data Found'));

        }

    }  else {

        redirect(base_url(), 'refresh');

    }
}


public function Assigned_Employee_List(){

     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

            //  $Date = '2025-01-24';

        $Date = $this->input->post('Date');
        $Shift = $this->input->post('Shift');
        $Department = $this->input->post('Department');
        $Employee_Type = $this->input->post('Employee_Type');
        $Work_Area = $this->input->post('Work_Area');
        $JobCard = $this->input->post('JobCardNo');


        $this->data['Assigned_Employee_List'] = $Assigned_Employee_List = $this->Work_Master_Model->Assigned_Employee_List($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Employee_Type);
        $this->data['Machines'] = $Machines = $this->Work_Master_Model->Machines($CompanyCode,$LocationCode,$Date,$Shift,$Department,$Work_Area,$JobCard);

        if(isset($Assigned_Employee_List) && !empty($Assigned_Employee_List)){

            echo json_encode($this->data);

        } else {

            echo json_encode(array('error' => 'No Data Found'));

        }

    }  else {

        redirect(base_url(), 'refresh');

    }
}



#===============================================================================================================================#
#==================================================== MASTER DETAILS END =======================================================#
#===============================================================================================================================#


public function Late_Employee(){

      $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

        $Date = $this->input->post('Date');
        $Employee_Shift_Type = $this->input->post('Employee_Shift_Type');
        $Department = $this->input->post('Department');
        $Employee_Type = $this->input->post('Employee_Type');
        $Work_Area = $this->input->post('WorkArea');
        $JobCard = $this->input->post('JobCard');
        $Alloacation_Type = $this->input->post('Allocation_Type');
        $Assiging_Shift = $this->input->post('Assigning_Shift');

        $this->data['Late_Employee'] = $Late_Employee = $this->Work_Master_Model->Shift_Employee_Late($CompanyCode, $LocationCode, $Date, $Department, $Employee_Shift_Type, $Assiging_Shift);
        $this->data['Machines'] = $Machines = $this->Work_Master_Model->Machines($CompanyCode,$LocationCode,$Date,$Assiging_Shift,$Department,$Work_Area,$JobCard);

        if(isset($Late_Employee)){
            echo json_encode($this->data);
        } else {

        }

    } else {
        redirect(base_url(), 'refresh');
    }


}


public function Shift_Closing(){


      $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $this->data['Favicon'] = 'Precot | Employee Shift Closing';

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Work_Master/Shift_Closing', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }



}







}