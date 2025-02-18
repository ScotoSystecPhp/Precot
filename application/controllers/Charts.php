<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Charts extends CI_Controller {

    public function __construct() {
        parent::__construct();

        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->helper('file');
        $this->load->library('session');
        $this->load->model('Chart_model');

    }

    public function Work_Allocation_Report() {

         $Session = $this->session->userdata('sess_array');
        if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

            $LocationCode = $Session['Lcode'];
            $CompanyCode = $Session['Ccode'];
            $Department = $Session['Department'];
            $Login_User = $Session['UserName'];


            $this->data['Work_Allocation_Count'] = $Work_Allocation_Count = $this->Chart_model->Work_Allocation_Count($CompanyCode,$LocationCode,$Login_User);

            echo json_encode($this->data);





        } else {
            redirect(base_url());
        }




    }

}
?>