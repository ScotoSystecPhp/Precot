<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Home extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->helper('file');
        $this->load->library('session');
        $this->load->library('form_validation');
        $this->load->database();
        $this->load->model('Home_Model');
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

            $this->data['Favicon'] = 'Precot | Home';

            $Ccode = $this->data['Ccode'];
            $Lcode = $this->data['Lcode'];

            // $this->data['Employee_datas'] = $Employee_datas = $this->Home_Model->Trainee_Employee_List($Ccode, $Lcode);


            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Frontend/Dashboard', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url());
        }
    }


    public function Work_Allocation_Details(){

          $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $User =  $Session['UserName'];

            $Current_Date =  date('Y-m-d ');
            $LocationCode =   $Session['Lcode'];
        $CompanyCode =   $Session['Ccode'];
        $UserName =  $Session['UserName'];

        $this->data['Shifts'] = $Shifts = $this->Work_Master_Model->Shifts($CompanyCode,$LocationCode);

        $Shift = $Shifts[0]->ShiftDesc;  // If $Shifts is an array of associative arrays.



            $sql = "SELECT
    W.WorkArea,
    COUNT(DISTINCT E.EmpNo) AS EmpCount
FROM
    UserDetails_Det U
INNER JOIN
    Web_Work_Area_Mst W ON W.Department = U.Name
INNER JOIN
    Web_Employee_Work_Allocation_Mst E ON E.WorkArea = W.WorkArea
WHERE
    E.Assign_Status = '1'
    AND E.Date = '$Current_Date'  -- Replace 'your_date' with the actual date condition
    AND E.Shift = ' $Shift'  -- Replace 'your_shift' with the actual shift condition
GROUP BY
    W.WorkArea";

    // print_r($sql);exit;


        } else {
            redirect(base_url());
        }

    }


}