<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Settings extends CI_Controller
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
    }

    public function index(){

          $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $this->load->view('Frontend/Header');
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Settings/Upload_File', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }

    }

}