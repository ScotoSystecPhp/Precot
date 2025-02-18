<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Upload_Format extends CI_Controller
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

    public function Jobcard()
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

            $data = array(
                array(
                    'Ccode' => 'PRECOT',
                    'Lcode' => 'PRECOT - A',
                    'Department' => '',
                    'Work Area' => '',
                    'Job Card No' => '',

                ),
            );

            header('Content-Description: File Transfer');
            header('Content-Type: application/csv');
            header('Content-Disposition: attachment; filename="Jobcard_upload_format.csv"');
            header('Content-Transfer-Encoding: binary');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');

            $fp = fopen('php://output', 'w');

            fputcsv($fp, array('Ccode', 'Lcode', 'Department', 'Work Area', 'Job Card No'));

            foreach ($data as $row) {
                fputcsv($fp, $row);
            }

            fclose($fp);
            exit;
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Machine()
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


            $data = array(
                array(
                    'Ccode' => $Ccode,
                    'Lcode' => $Lcode,
                    'Department' => '',
                    'Department_code' => '',
                    'Work Area' => '',
                    'Machine_Code' => '',
                    'Machine_Name' => '',
                    'Frame_Type' => '',
                    'Input_Method' => '',
                    'Frame' => '',
                    'Unit' => '',
                    'Machine_Model' => '',
                    'Machine_Id' => ''


                ),
            );

            header('Content-Description: File Transfer');
            header('Content-Type: application/csv');
            header('Content-Disposition: attachment; filename="Machine_upload_format.csv"');
            header('Content-Transfer-Encoding: binary');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');

            $fp = fopen('php://output', 'w');

            fputcsv($fp, array('Ccode', 'Lcode', 'Department', 'Department_code', 'Work Area', 'Machine_Code', 'Machine_Name', 'Frame_Type', 'Input_Method', 'Frame', 'Unit', 'Machine_Model', 'Machine_Id'));

            foreach ($data as $row) {
                fputcsv($fp, $row);
            }

            fclose($fp);
            exit;
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function work_allocation_upload(){

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];

            $data = array(
                array(
                    'Date' =>  date("Y-m-d"),
                    'Shift' => '',
                    'Department' => '',
                    'Employee Id' =>'',
                    'Employee Name' => '',
                    'Work Area' => '',
                    'Job Card' => '',
                    'Machine Id' => '',
                    'Frame' => '',
                    'Description' => '',
                ),
            );

            header('Content-Description: File Transfer');
            header('Content-Type: application/csv');
            header('Content-Disposition: attachment; filename="work_allocation_upload_format.csv"');
            header('Content-Transfer-Encoding: binary');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');

            $fp = fopen('php://output', 'w');

            fputcsv($fp, array('Date','Shift','Department', 'Employee Id', 'Employee Name ', 'Work Area', 'Jobcard','Machine Id','Frame','Description'));

            foreach ($data as $row) {
                fputcsv($fp, $row);
            }

            fclose($fp);
            exit;
        } else {
            redirect(base_url(), 'refresh');
        }

    }
}