<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Auth extends CI_Controller
{
	public function __construct()
	{
		parent::__construct();

		$this->load->helper('url');
		$this->load->helper('form');
		$this->load->helper('file');
		$this->load->library('session');
		$this->load->library('form_validation');
		$this->load->model('Authorization_model');
		$this->load->model('Rights_Model');

	}

	public function index()
	{
		$this->load->view('Authorization/Login');
	}

public function verify()
{

      if($_POST){

        $username = $this->input->post('UserName');
        $password = $this->input->post('Password');

        // Verify the credentials using your model
        $Verify = $this->Authorization_model->Verify($username, $password);

        if ($Verify ==  0) {


  redirect(base_url());

        } elseif ($Verify == -1) {


  redirect(base_url());



        } else {

            $sess_array = array(
                'Ccode' => $Verify->Ccode,
                'Lcode' => $Verify->Lcode,
                'UserType' => $Verify->UserType,
                'Designation' => $Verify->Designation,
                'Department' => $Verify->Name,
                'UserName' => $username,
                'IsOnLogin' => TRUE,
            );

            // Set session variables
            $this->session->set_userdata('sess_array', $sess_array);
            $this->session->set_userdata('logged_in', TRUE);
            redirect('Home');


        }

	}

}



public function user_rights()
	{

		$this->data['Favicon'] = 'Precot | Set User Permission';
		$this->load->view('frontend/header',$this->data);
		$this->load->view('frontend/sidebar');
		$this->load->view('user_rights/user_rights');
		$this->load->view('frontend/footer');
	}


	public function Get_Rights_Details()
	{

		$username = $this->session->userdata('sess_array');
		if (!empty($username) && isset($username['IsOnLogin']) && $username['IsOnLogin'] === TRUE) {


			$usertype = $username['UserType'];

			$selectedUserType = $this->input->post('selectedValue');

			if ($selectedUserType) {
				$this->data['get_rights_details'] = $get_rights_details = $this->Rights_Model->get_rights_details($selectedUserType);

				echo json_encode($get_rights_details);
			}
		} else {
			redirect('Auth', 'refresh');
		}
	}


	public function Change_user_rights()
{
    $data = $this->input->post('dataArray');
    $data1 = $this->input->post('usertype');

    if (!empty($data)) {
        $res = 0; // Initialize res variable
        foreach ($data as $row) {
            $screenName = $row['screenName'];
            $checkboxValue = $row['checkboxValue'];
            $created_date = date('Y-m-d H:i:s');

			// echo "<pre>";
			// print_r($checkboxValue);
			// exit;
            $result  = $this->Rights_Model->save_screen_data($screenName, $checkboxValue, $data1);
            if ($result == 1) {
                $res = 1; // Set to 1 if success
            } else {
                $res = 0;
                break; // Exit loop on error
            }
        }
        echo json_encode($res);
    } else {
        echo json_encode(0); // Return 0 if data is empty
    }
}



public function logout() {
	$this->session->sess_destroy(); // Destroy session
	redirect('Auth'); // Redirect to login page
}

}