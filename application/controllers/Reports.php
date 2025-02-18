<?php
require 'vendor/autoload.php';
// use PHPUnit\Util\Printer;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;




if (!defined('BASEPATH')) exit('No direct script access allowed');


class Reports extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->helper('file');
        $this->load->library('session');
        $this->load->helper('download');
        $this->load->model('Reports_Model');
        $this->load->model('Allocation_Model');
    }

    public function No_Work_Employees_Report()
    {
        // Fetch parameters from the URL
        $Date = urldecode($this->uri->segment(3));
        $Department = urldecode($this->uri->segment(4));
        $Shift = urldecode($this->uri->segment(5));

        // Replace underscores with spaces
        $Date = str_replace('_', ' ', $Date);
        $Department = str_replace('_', ' ', $Department);
        $Shift = str_replace('_', ' ', $Shift);

        // Fetch employee details
        $data = $this->Reports_Model->No_Work_Employee($Date, $Department, $Shift);

        if (count($data) > 0) {
            // Initialize PhpSpreadsheet
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            // Set the main heading
            $mainHeading = 'No Work Employees Report';
            $sheet->mergeCells('A1:P1'); // Adjust the range based on the number of columns
            $sheet->setCellValue('A1', $mainHeading);
            $sheet->getStyle('A1')->applyFromArray([
                'font' => [
                    'bold' => true,
                    'size' => 16,
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ]);
            $sheet->getRowDimension('1')->setRowHeight(30);

            // Set subpoints (Date, Department, Shift)
            // $sheet->setCellValue('A2', 'Date: ' . $Date);
            $sheet->setCellValue('A2', 'COMPANY: ' . "PRECOT");
            $sheet->setCellValue('C2', 'Department: ' . $Department);
            $sheet->setCellValue('D2', 'Shift: ' . $Shift);
            $sheet->setCellValue('O2', 'Date: ' . $Date);

            // Apply style for the subpoints
            $sheet->getStyle('A2:AB2')->applyFromArray([
                'font' => [
                    'bold' => true,
                    'size' => 10,
                ],
            ]);

            // Set the header row
            $header = [
                'S.No',
                'Ccode',
                'Lcode',
                'DeptName',
                'Sub_Department',
                'Job_Card_No',
                'Date',
                'Shift',
                'EmpNo',
                'FirstName',
                'ExistingCode',
                'Created_By',
                'Created_Time',
                'Updated_By',
                'Updated_Time',
            ];

            $sheet->fromArray($header, NULL, 'A3');

            // Apply styles to the header row
            $sheet->getStyle('A3:AB3')->applyFromArray([
                'font' => ['bold' => true],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ]);

            // Set row height for the header
            $sheet->getRowDimension('3')->setRowHeight(20);

            // Populate the data rows
            $rowNumber = 4; // Starting from row 4, below the header
            foreach ($data as $index => $employee) {
                $row = [
                    $index + 1,
                    $employee['Ccode'],
                    $employee['Lcode'],
                    $employee['DeptName'],
                    $employee['Sub_Department'],
                    $employee['Job_Card_No'],
                    $employee['Date'],
                    $employee['Shift'],
                    $employee['EmpNo'],
                    $employee['FirstName'],
                    $employee['ExistingCode'],
                    $employee['Created_By'],
                    $employee['Created_Time'],
                    $employee['Updated_By'] ?: '-',
                    $employee['Updated_Time'] ?: '-',
                ];

                $sheet->fromArray($row, NULL, 'A' . $rowNumber);
                $rowNumber++;
            }

            // Prepare the file for download
            $filename = 'No_Work_Employees_Report_' . date('Y-m-d') . '.xlsx';

            // Write the file to output
            $writer = new Xlsx($spreadsheet);

            // Clear the output buffer to avoid unwanted content before the file download
            ob_end_clean();

            // Set headers to trigger file download
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="' . $filename . '"');
            header('Cache-Control: max-age=0');

            // Save the file to output
            $writer->save('php://output');
            exit;
        } else {
            echo 'No data available for export';
        }
    }



    public function Download_Excel()
    {
        $Department = $this->input->post('Department');
        $Shift = $this->input->post('Shift');
        $Date = $this->input->post('Date');

        // Get data from the model
        $Shift_Wise_Employee = $this->Allocation_Model->Shift_Wise_Employee($Department, $Shift, $Date);

        // echo"<pre>";
        // print_r($Shift_Wise_Employee);
        // exit;
        if (count($Shift_Wise_Employee) > 0) {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            $mainHeading = 'Employees Report';
            $sheet->mergeCells('A1:P1');
            $sheet->setCellValue('A1', $mainHeading);
            $sheet->getStyle('A1')->applyFromArray([
                'font' => [
                    'bold' => true,
                    'size' => 16,
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ]);
            $sheet->getRowDimension('1')->setRowHeight(30);

            // $sheet->setCellValue('A2', 'Date: ' . $Date);
            $sheet->setCellValue('A2', 'COMPANY: ' . "PRECOT");
            $sheet->setCellValue('C2', 'Department: ' . $Department);
            $sheet->setCellValue('D2', 'Shift: ' . $Shift);
            $sheet->setCellValue('M2', 'Date: ' . $Date);

            $sheet->getStyle('A2:AB2')->applyFromArray([
                'font' => [
                    'bold' => true,
                    'size' => 10,
                ],
            ]);

            $header = [
                'S.No',
                'Ccode',
                'Lcode',
                'DeptName',
                'Date',
                'Shift',
                'EmpNo',
                'FirstName',
                'ExistingCode',
                'Created_By',
                'Created_Time',
                'Updated_By',
                'Updated_Time',
            ];

            $sheet->fromArray($header, NULL, 'A3');

            $sheet->getStyle('A3:AB3')->applyFromArray([
                'font' => ['bold' => true],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ]);

            $sheet->getRowDimension('3')->setRowHeight(20);

            $rowNumber = 4; // Starting from row 4, below the header
            foreach ($Shift_Wise_Employee as $index => $employee) {
                $row = [
                    $index + 1,
                    $employee['Ccode'],
                    $employee['Lcode'],
                    $employee['DeptName'],
                    $employee['Date'],
                    $employee['Shift'],
                    $employee['EmpNo'],
                    $employee['FirstName'],
                    $employee['ExistingCode'],
                    $employee['Created_By'],
                    $employee['Created_Time'],
                    $employee['Updated_By'] ?: '-',
                    $employee['Updated_Time'] ?: '-',
                ];

                $sheet->fromArray($row, NULL, 'A' . $rowNumber);
                $rowNumber++;
            }

            // Prepare the file for download
            $filename = 'Employees_Report_' . date('Y-m-d') . '.xlsx';

            // Write the file to output
            $writer = new Xlsx($spreadsheet);

            // Clear the output buffer to avoid unwanted content before the file download
            ob_end_clean();

            // Set headers to trigger file download
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="' . $filename . '"');
            header('Cache-Control: max-age=0');

            // Save the file to output
            $writer->save('php://output');
            exit;
        } else {
            echo 'No data available for export';
        }
    }



public function Shift_Closing_Report()
{
    ob_start();

     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $Date = $this->input->post('Date');
        // $Shift = $this->input->post('Shift');
         $Shift = 'SHIFT2';
        $Department = $this->input->post('Department');
        $Work_Area = $this->input->post('Work_Area');
        $JobCardNo = $this->input->post('JobCardNo');

        $this->data['Shift_Closing_Report'] = $Shift_Closing_Report = $this->Reports_Model->Shift_Closing_Report($Date, $Shift, $Department, $Work_Area, $JobCardNo);

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $mainHeading = 'Shift Closing Report';
        $sheet->mergeCells('A1:AB1');
        $sheet->setCellValue('A1', $mainHeading);
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 16,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        $sheet->getRowDimension('1')->setRowHeight(30);

        $sheet->setCellValue('A2', 'COMPANY: ' . "PRECOT")
              ->setCellValue('C2', 'Department: ' . $Department)
              ->setCellValue('D2', 'Shift: ' . $Shift)
              ->setCellValue('M2', 'Date: ' . $Date);

        $sheet->getStyle('A2:AB2')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 10,
            ],
        ]);

        $sheet->setCellValue('A3', 'Ccode')
              ->setCellValue('B3', 'Lcode')
              ->setCellValue('C3', 'Department')
              ->setCellValue('D3', 'WorkArea')
              ->setCellValue('E3', 'Job_Card_No')
              ->setCellValue('F3', 'Date')
              ->setCellValue('G3', 'Shift')
              ->setCellValue('H3', 'EmpNo')
              ->setCellValue('I3', 'FirstName')
              ->setCellValue('J3', 'ExistingCode')
              ->setCellValue('K3', 'Work_Type')
              ->setCellValue('L3', 'Description')
              ->setCellValue('M3', 'Machine_Name')
              ->setCellValue('N3', 'Machine_Model')
              ->setCellValue('O3', 'Machine_Id')
              ->setCellValue('P3', 'Frame')
              ->setCellValue('Q3', 'FrameType')
              ->setCellValue('R3', 'Work_Status')
              ->setCellValue('S3', 'Assign_Status')
              ->setCellValue('T3', 'Closing_Status')
              ->setCellValue('U3', 'Work_Start')
              ->setCellValue('V3', 'Work_End')
              ->setCellValue('W3', 'Work_Duration')
              ->setCellValue('X3', 'Machine_EB_No')
              ->setCellValue('Y3', 'Created_By')
              ->setCellValue('Z3', 'Created_Time')
              ->setCellValue('AA3', 'Updated_By')
              ->setCellValue('AB3', 'Updated_Time');

        $rowNumber = 4;
        foreach ($Shift_Closing_Report as $data) {

            $workStatus = ($data->Work_Status == 1) ? 'Assigned' : '-';
            $assignStatus = ($data->Assign_Status == 1) ? 'Assigned' : '-';
            $closingStatus = ($data->Closing_Status == 1) ? 'Closed' : ($data->Closing_Status == 0 ? 'Not-Closed' : '-');

            $sheet->setCellValue('A' . $rowNumber, $data->Ccode)
                  ->setCellValue('B' . $rowNumber, $data->Lcode)
                  ->setCellValue('C' . $rowNumber, $data->Department)
                  ->setCellValue('D' . $rowNumber, $data->WorkArea)
                  ->setCellValue('E' . $rowNumber, $data->Job_Card_No)
                  ->setCellValue('F' . $rowNumber, $data->Date)
                  ->setCellValue('G' . $rowNumber, $data->Shift)
                  ->setCellValue('H' . $rowNumber, $data->EmpNo)
                  ->setCellValue('I' . $rowNumber, $data->FirstName)
                  ->setCellValue('J' . $rowNumber, $data->ExistingCode)
                  ->setCellValue('K' . $rowNumber, $data->Work_Type)
                  ->setCellValue('L' . $rowNumber, $data->Description)
                  ->setCellValue('M' . $rowNumber, $data->Machine_Name)
                  ->setCellValue('N' . $rowNumber, $data->Machine_Model)
                  ->setCellValue('O' . $rowNumber, $data->Machine_Id)
                  ->setCellValue('P' . $rowNumber, $data->Frame)
                  ->setCellValue('Q' . $rowNumber, $data->FrameType)
                  ->setCellValue('R' . $rowNumber, $workStatus)
                  ->setCellValue('S' . $rowNumber, $assignStatus)
                  ->setCellValue('T' . $rowNumber, $closingStatus)
                  ->setCellValue('U' . $rowNumber, $data->Work_Start)
                  ->setCellValue('V' . $rowNumber, $data->Work_End)
                  ->setCellValue('W' . $rowNumber, $data->Work_Duration)
                  ->setCellValue('X' . $rowNumber, $data->Machine_EB_No)
                  ->setCellValue('Y' . $rowNumber, $data->Created_By)
                  ->setCellValue('Z' . $rowNumber, $data->Created_Time)
                  ->setCellValue('AA' . $rowNumber, $data->Updated_By)
                  ->setCellValue('AB' . $rowNumber, $data->Updated_Time);

            if ($closingStatus == 'Closed') {
                $sheet->getStyle('T' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB(Color::COLOR_GREEN);
            } elseif ($closingStatus == 'Not-Closed') {
                $sheet->getStyle('T' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB(Color::COLOR_RED);
            }

            $rowNumber++;
        }

        $writer = new Xlsx($spreadsheet);
        $file_path = 'assets/reports/shift_closing_report.xlsx';
        $writer->save($file_path);

        echo json_encode(['file_url' => base_url($file_path)]);
    } else {
        echo json_encode(['error' => 'User not logged in']);
    }
}




public function Work_Allocation_Report()
{
     $Session = $this->session->userdata('sess_array');
    if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

        $Date = $this->input->post('Date');
        $Shift = $this->input->post('Shift');
        //  $Shift = 'SHIFT2';
        $Department = $this->input->post('Department');
        $Work_Area = $this->input->post('Work_Area');
        $JobCardNo = $this->input->post('JobCardNo');

        $this->data['Assigned_List'] = $Assigned_List = $this->Reports_Model->Assigned_List($Shift, $Date, $Department, $Work_Area, $JobCardNo);

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $mainHeading = 'Employees Work Allocation Report';
        $sheet->mergeCells('A1:AB1');
        $sheet->setCellValue('A1', $mainHeading);
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 16,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        $sheet->getRowDimension('1')->setRowHeight(30);

        $sheet->setCellValue('A2', 'COMPANY: ' . "PRECOT")
              ->setCellValue('C2', 'Department: ' . $Department)
              ->setCellValue('D2', 'Shift: ' . $Shift)
              ->setCellValue('M2', 'Date: ' . $Date);

        $sheet->getStyle('A2:AB2')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 10,
            ],
        ]);

        $sheet->setCellValue('A3', 'Ccode')
              ->setCellValue('B3', 'Lcode')
              ->setCellValue('C3', 'Department')
              ->setCellValue('D3', 'WorkArea')
              ->setCellValue('E3', 'Job_Card_No')
              ->setCellValue('F3', 'Date')
              ->setCellValue('G3', 'Shift')
              ->setCellValue('H3', 'EmpNo')
              ->setCellValue('I3', 'FirstName')
              ->setCellValue('J3', 'ExistingCode')
              ->setCellValue('K3', 'Work_Type')
              ->setCellValue('L3', 'Description')
              ->setCellValue('M3', 'Machine_Name')
              ->setCellValue('N3', 'Machine_Model')
              ->setCellValue('O3', 'Machine_Id')
              ->setCellValue('P3', 'Frame')
              ->setCellValue('Q3', 'FrameType')
              ->setCellValue('R3', 'Work_Status')
              ->setCellValue('S3', 'Assign_Status')
              ->setCellValue('T3', 'Closing_Status')
              ->setCellValue('U3', 'Work_Start')
              ->setCellValue('V3', 'Work_End')
              ->setCellValue('W3', 'Work_Duration')
              ->setCellValue('X3', 'Machine_EB_No')
              ->setCellValue('Y3', 'Created_By')
              ->setCellValue('Z3', 'Created_Time')
              ->setCellValue('AA3', 'Updated_By')
              ->setCellValue('AB3', 'Updated_Time');

        $rowNumber = 4;
        foreach ($Assigned_List as $data) {

            $workStatus = ($data->Work_Status == 1) ? 'Assigned' : '-';
            $assignStatus = ($data->Assign_Status == 1) ? 'Assigned' : '-';
            $closingStatus = ($data->Closing_Status == 1) ? 'Closed' : ($data->Closing_Status == 0 ? 'Not-Closed' : '-');

            $sheet->setCellValue('A' . $rowNumber, $data->Ccode)
                  ->setCellValue('B' . $rowNumber, $data->Lcode)
                  ->setCellValue('C' . $rowNumber, $data->Department)
                  ->setCellValue('D' . $rowNumber, $data->WorkArea)
                  ->setCellValue('E' . $rowNumber, $data->Job_Card_No)
                  ->setCellValue('F' . $rowNumber, $data->Date)
                  ->setCellValue('G' . $rowNumber, $data->Shift)
                  ->setCellValue('H' . $rowNumber, $data->EmpNo)
                  ->setCellValue('I' . $rowNumber, $data->FirstName)
                  ->setCellValue('J' . $rowNumber, $data->ExistingCode)
                  ->setCellValue('K' . $rowNumber, $data->Work_Type)
                  ->setCellValue('L' . $rowNumber, $data->Description)
                  ->setCellValue('M' . $rowNumber, $data->Machine_Name)
                  ->setCellValue('N' . $rowNumber, $data->Machine_Model)
                  ->setCellValue('O' . $rowNumber, $data->Machine_Id)
                  ->setCellValue('P' . $rowNumber, $data->Frame)
                  ->setCellValue('Q' . $rowNumber, $data->FrameType)
                  ->setCellValue('R' . $rowNumber, $workStatus)
                  ->setCellValue('S' . $rowNumber, $assignStatus)
                  ->setCellValue('T' . $rowNumber, $closingStatus)
                  ->setCellValue('U' . $rowNumber, $data->Work_Start)
                  ->setCellValue('V' . $rowNumber, $data->Work_End)
                  ->setCellValue('W' . $rowNumber, $data->Work_Duration)
                  ->setCellValue('X' . $rowNumber, $data->Machine_EB_No)
                  ->setCellValue('Y' . $rowNumber, $data->Created_By)
                  ->setCellValue('Z' . $rowNumber, $data->Created_Time)
                  ->setCellValue('AA' . $rowNumber, $data->Updated_By)
                  ->setCellValue('AB' . $rowNumber, $data->Updated_Time);

            if ($closingStatus == 'Closed') {
                $sheet->getStyle('T' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB(Color::COLOR_GREEN);
            } elseif ($closingStatus == 'Not-Closed') {
                $sheet->getStyle('T' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB(Color::COLOR_RED);
            }

            $rowNumber++;
        }

        $writer = new Xlsx($spreadsheet);
        $file_path = 'assets/reports/Work_Allocation_Report.xlsx';

        if (!file_exists('assets/reports')) {
            mkdir('assets/reports', 0777, true);
        }

        $writer->save($file_path);

        echo json_encode(['file_url' => base_url($file_path)]);
    }
}



    public function Employee_Active_List_Download()
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
            $Employee_Status = $this->input->post('Employee_Status');

            $this->data['Active_Employee_List'] = $Active_Employee_List = $this->Reports_Model->Active_Employee_List($Ccode, $Lcode, $Department, $Employee_Status);

            // echo '<pre>';
            // print_r($Active_Employee_List);
            // exit;

            if (empty($Active_Employee_List)) {
                echo json_encode(['error' => 'No employees found.']);
                exit;
            }

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            $sheet->setCellValue('A1', 'LCode')
                ->setCellValue('B1', 'CCode')
                ->setCellValue('C1', 'DeptName')
                ->setCellValue('D1', 'DOJ')
                ->setCellValue('E1', 'FirstName')
                ->setCellValue('F1', 'MachineID')
                ->setCellValue('G1', 'EmployeeMobile')
                ->setCellValue('H1', 'IsActive')
                ->setCellValue('I1', 'ExperienceYears')
                ->setCellValue('J1', 'ExperienceMonths')
                ->setCellValue('K1', 'ExperienceFormatted');

            $rowNumber = 2;
            foreach ($Active_Employee_List as $data) {
                $sheet->setCellValue('A' . $rowNumber, $Lcode)
                    ->setCellValue('B' . $rowNumber, $Ccode)
                    ->setCellValue('C' . $rowNumber, $data['DeptName'])
                    ->setCellValue('D' . $rowNumber, $data['DOJ'])
                    ->setCellValue('E' . $rowNumber, $data['FirstName'])
                    ->setCellValue('F' . $rowNumber, $data['MachineID'])
                    ->setCellValue('G' . $rowNumber, $data['EmployeeMobile'])
                    ->setCellValue('H' . $rowNumber, $data['IsActive'])
                    ->setCellValue('I' . $rowNumber, $data['ExperienceYears'])
                    ->setCellValue('J' . $rowNumber, $data['ExperienceMonths'])
                    ->setCellValue('K' . $rowNumber, $data['ExperienceFormatted']);

                $rowNumber++;
            }

            $writer = new Xlsx($spreadsheet);
            $file_path = 'assets/reports/Employee_Active_List.xlsx';

            try {
                $writer->save($file_path);
                echo json_encode(['file_url' => base_url($file_path)]);
            } catch (Exception $e) {
                echo json_encode(['error' => 'Failed to create Excel file. Error: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['error' => 'User not logged in.']);
        }
    }


        public function Assigned()
    {

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data['Favicon'] = 'Precot | Work Allocation Report';

            if ($_POST) {

            $CompanyCode = $Session['Ccode'];
            $LocationCode = $Session['Lcode'];
            $Login_User = $Session['UserName'];

            $Date = $this->input->post('Date');
            $Shift = $this->input->post('Shift');


                $this->data['Assigned_List'] = $Assigned_List = $this->Reports_Model->Assigned_List($CompanyCode,$LocationCode,$Login_User,$Shift, $Date);
                echo json_encode($this->data);
                exit;
            }

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Reports/Assigned_Report', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }


            public function Shift_Closing_Reports()
    {

         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $CompanyCode = $Session['Ccode'];
            $LocationCode = $Session['Lcode'];
            $Login_User = $Session['UserName'];

            $Date = $this->input->post('Date');
            $Shift = $this->input->post('Shift');


            $this->data['Favicon'] = 'Precot | Work Shift Closing Report';

            if ($_POST) {

                $Shift = $this->input->post('Shift');
                $Date = $this->input->post('Date');
                // $Shift = 'SHIFT2';
                $Department = $this->input->post('Department');
                $Work_Area = $this->input->post('Work_Area');
                $JobCard = $this->input->post('JobCardNo');

                $this->data['Assigned_List'] = $Assigned_List = $this->Reports_Model->Assigned_List($Shift, $Date, $Department, $Work_Area, $JobCard);
                echo json_encode($this->data);
                exit;
            }

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Reports/Shift_Closing_Report', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }



public function Shift_Closing_Report_Download() {
    $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        if ($_POST) {

            $CompanyCode = $Session['Ccode'];
            $LocationCode = $Session['Lcode'];
            $Login_User = $Session['UserName'];

            $Date = $this->input->post('Date');
            $Shift = $this->input->post('Shift');

            $this->data['Shift_Closing_Report_Download'] = $Shift_Closing_Report_Download = $this->Reports_Model->Shift_Closing_Report_Download($CompanyCode, $LocationCode, $Login_User, $Date, $Shift);

            if ($Shift_Closing_Report_Download == 0) {
                $Reponse = array(
                    'status' => 'error',
                    'message' => 'Employee Shift Closing Report!!.'
                );
                echo json_encode($Reponse);
            } else {
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();

                $mainHeading = 'Employee Shift Closing Report';
                $sheet->mergeCells('A1:K1');
                $sheet->setCellValue('A1', $mainHeading);
                $sheet->getStyle('A1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 16,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $sheet->getRowDimension('1')->setRowHeight(30);

                $sheet->setCellValue('A2', 'COMPANY: ' . $CompanyCode)
                      ->setCellValue('A3', 'LOCATION: ' . $LocationCode)
                      ->setCellValue('K2', 'SHIFT: ' . $Shift)
                      ->setCellValue('K3', 'DATE: ' . $Date);

                // Apply bold to SHIFT and DATE rows
                $sheet->getStyle('K2:K3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
                $sheet->getStyle('A2:A3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 10,
                    ],
                ]);

                // Header columns
                $sheet->setCellValue('A6', 'Ccode')
                      ->setCellValue('B6', 'Lcode')
                      ->setCellValue('C6', 'Department')
                      ->setCellValue('D6', 'WorkArea')
                      ->setCellValue('E6', 'Job_Card_No')
                      ->setCellValue('F6', 'Date')
                      ->setCellValue('G6', 'Shift')
                      ->setCellValue('H6', 'EmpNo')
                      ->setCellValue('I6', 'FirstName')
                      ->setCellValue('J6', 'ExistingCode')
                      ->setCellValue('K6', 'Work_Type')
                      ->setCellValue('L6', 'Description')
                      ->setCellValue('M6', 'Machine_Name')
                      ->setCellValue('N6', 'Machine_Model')
                      ->setCellValue('O6', 'Machine_Id')
                      ->setCellValue('P6', 'Frame')
                      ->setCellValue('Q6', 'FrameType')
                      ->setCellValue('R6','Closing_Status')
                      ->setCellValue('Y6', 'Created_By')
                      ->setCellValue('Z6', 'Created_Time');

                $sheet->getStyle('A6:Z6')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 10,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                        ],
                    ],
                ]);

                $rowNumber = 7;
                foreach ($Shift_Closing_Report_Download as $data) {

                    $sheet->setCellValue('A' . $rowNumber, $data->Ccode)
                          ->setCellValue('B' . $rowNumber, $data->Lcode)
                          ->setCellValue('C' . $rowNumber, $data->Department)
                          ->setCellValue('D' . $rowNumber, $data->WorkArea)
                          ->setCellValue('E' . $rowNumber, $data->Job_Card_No)
                          ->setCellValue('F' . $rowNumber, $data->Date)
                          ->setCellValue('G' . $rowNumber, $data->Shift)
                          ->setCellValue('H' . $rowNumber, $data->EmpNo)
                          ->setCellValue('I' . $rowNumber, $data->FirstName)
                          ->setCellValue('J' . $rowNumber, $data->ExistingCode)
                          ->setCellValue('K' . $rowNumber, $data->Work_Type)
                          ->setCellValue('L' . $rowNumber, $data->Description)
                          ->setCellValue('M' . $rowNumber, $data->Machine_Name)
                          ->setCellValue('N' . $rowNumber, $data->Machine_Model)
                          ->setCellValue('O' . $rowNumber, $data->Machine_Id)
                          ->setCellValue('P' . $rowNumber, $data->Frame)
                          ->setCellValue('Q' . $rowNumber, $data->FrameType)
                          ->setCellValue('R' . $rowNumber, $data->Closing_Status)
                          ->setCellValue('Y' . $rowNumber, $data->Created_By)
                          ->setCellValue('Z' . $rowNumber, $data->Created_Time);

                    // Set text based on Closing_Status
                    if ($data->Closing_Status == 0) {
                        // Apply orange background for NOT CLOSE
                        $sheet->getStyle('R' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID);
                        $sheet->getStyle('R' . $rowNumber)->getFill()->getStartColor()->setRGB('FFA500'); // Orange
                        $sheet->setCellValue('R' . $rowNumber, 'NOT CLOSE'); // Set text as "NOT CLOSE"
                    } elseif ($data->Closing_Status == 1) {
                        // Apply green background for CLOSE
                        $sheet->getStyle('R' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID);
                        $sheet->getStyle('R' . $rowNumber)->getFill()->getStartColor()->setRGB('008000'); // Green
                        $sheet->setCellValue('R' . $rowNumber, 'CLOSE'); // Set text as "CLOSE"
                    }

                    $rowNumber++;
                }

                // Set the column widths to auto size based on content
                foreach (range('A', 'Z') as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }

                $writer = new Xlsx($spreadsheet);
                $currentDate = date('Y-m-d');
                $file_path = 'assets/reports/shift/Shift_Closing_Report' . $currentDate . '.xlsx';

                if (!file_exists('assets/reports')) {
                    mkdir('assets/reports', 0777, true);
                }

                $writer->save($file_path);

                echo json_encode(['file_url' => base_url($file_path)]);

                exit;
            }
        }
    } else {
        redirect(base_url());
    }
}


public function Shift_Closing_List(){

     $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

     if ($_POST) {

            $CompanyCode = $Session['Ccode'];
            $LocationCode = $Session['Lcode'];
            $Login_User = $Session['UserName'];

            $Date = $this->input->post('Date');
            $Shift = $this->input->post('Shift');

            $this->data['Shift_Closing_Report_Download'] = $Shift_Closing_Report_Download = $this->Reports_Model->Shift_Closing_Report_Download($CompanyCode, $LocationCode, $Login_User, $Date, $Shift);

            if ($Shift_Closing_Report_Download == 0) {
                $Reponse = array(
                    'status' => 'error',
                    'message' => 'Employee Shift Closing Report Not Found Server!!.'
                );
                echo json_encode($Reponse);
            } else {

                 echo json_encode($this->data);

            }
        }
        } else {
            redirect(base_url());
        }
}




        public function No_Work_Emloyee()
    {
         $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $this->data = array(
                'Ccode' =>  $Session['Ccode'],
                'Lcode' =>  $Session['Lcode'],
                'UserName' =>  $Session['UserName'],
            );

            $this->data['Date'] = null;
            $this->data['Department'] = null;
            $this->data['Shift'] = null;
            $this->data['getStudent_List'] = null;

            $this->data['Favicon'] = 'Precot | No Work Report';


            if ($_POST) {

                $this->data['Date'] = $Date = $this->input->post('Date');
                $this->data['Department'] = $Department = $this->input->post('Department');
                $this->data['Shift'] = $Shift= $this->input->post('Shift');
                $this->data['No_Work_Employee'] = $No_Work_Employee = $this->Reports_Model->No_Work_Employee($Date, $Department, $Shift);
            }

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Reports/No_Work_Employee', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
    }

    public function Shift_Work_Details(){

          $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $Current_Date =  date('Y-m-d ');
            $Department = $this->input->post('Department');
            $Work_Area = $this->input->post('Work_Area');
            $Shift = $this->input->post('Shift');

            $this->data['Shift_Work_Details'] = $Shift_Work_Details = $this->Reports_Model->Shift_Work_Details($Current_Date,$Department,$Work_Area,$Shift);

            echo json_encode($this->data);

        } else {
            redirect(base_url(),'refresh');
        }

    }

    public function All_Department_Report(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $LocationCode = $Session['Lcode'];
            $CompanyCode = $Session['Ccode'];
            $Date =  $this->input->post('Date');
            $Shift = $this->input->post('Shift');

            $this->data['All_Department_Report'] = $All_Department_Report = $this->Reports_Model->All_Department_Report($Date,$Shift);

            if($All_Department_Report != FALSE){

                $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $mainHeading = 'Employees Work Allocation Report';
        $sheet->mergeCells('A1:AA1');
        $sheet->setCellValue('A1', $mainHeading);
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 16,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        $sheet->getRowDimension('1')->setRowHeight(30);

        $sheet->setCellValue('A2', 'COMPANY: ' . "PRECOT")
              ->setCellValue('C2', 'Location: ' . $LocationCode)
              ->setCellValue('D2', 'Shift: ' . $Shift)
              ->setCellValue('M2', 'Date: ' . $Date);

        $sheet->getStyle('A2:AB2')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 10,
            ],
        ]);

        $sheet->setCellValue('A3', 'Ccode')
              ->setCellValue('B3', 'Lcode')
              ->setCellValue('C3', 'Department')
              ->setCellValue('D3', 'WorkArea')
              ->setCellValue('E3', 'Job_Card_No')
              ->setCellValue('F3', 'Date')
              ->setCellValue('G3', 'Shift')
              ->setCellValue('H3', 'EmpNo')
              ->setCellValue('I3', 'FirstName')
              ->setCellValue('J3', 'ExistingCode')
              ->setCellValue('K3', 'Work_Type')
              ->setCellValue('L3', 'Description')
              ->setCellValue('M3', 'Machine_Name')
              ->setCellValue('N3', 'Machine_Model')
              ->setCellValue('O3', 'Machine_Id')
              ->setCellValue('P3', 'Frame')
              ->setCellValue('Q3', 'FrameType')
              ->setCellValue('R3', 'Work_Status')
              ->setCellValue('S3', 'Assign_Status')
              ->setCellValue('T3', 'Closing_Status')
              ->setCellValue('U3', 'Work_Start')
              ->setCellValue('V3', 'Work_End')
              ->setCellValue('W3', 'Work_Duration')
              ->setCellValue('X3', 'Machine_EB_No')
              ->setCellValue('Y3', 'Created_By')
              ->setCellValue('Z3', 'Created_Time');


        $rowNumber = 4;
        foreach ($All_Department_Report as $data) {

            $workStatus = ($data->Work_Status == 1) ? '-' : '-';
            $assignStatus = ($data->Assign_Status == 1) ? 'Assigned' : '-';
            $closingStatus = ($data->Closing_Status == 1) ? 'Closed' : ($data->Closing_Status == 0 ? 'Not-Closed' : '-');

            $sheet->setCellValue('A' . $rowNumber, $data->Ccode)
                  ->setCellValue('B' . $rowNumber, $data->Lcode)
                  ->setCellValue('C' . $rowNumber, $data->Department)
                  ->setCellValue('D' . $rowNumber, $data->WorkArea)
                  ->setCellValue('E' . $rowNumber, $data->Job_Card_No)
                  ->setCellValue('F' . $rowNumber, $data->Date)
                  ->setCellValue('G' . $rowNumber, $data->Shift)
                  ->setCellValue('H' . $rowNumber, $data->EmpNo)
                  ->setCellValue('I' . $rowNumber, $data->FirstName)
                  ->setCellValue('J' . $rowNumber, $data->ExistingCode)
                  ->setCellValue('K' . $rowNumber, $data->Work_Type)
                  ->setCellValue('L' . $rowNumber, $data->Description)
                  ->setCellValue('M' . $rowNumber, $data->Machine_Name)
                  ->setCellValue('N' . $rowNumber, $data->Machine_Model)
                  ->setCellValue('O' . $rowNumber, $data->Machine_Id)
                  ->setCellValue('P' . $rowNumber, $data->Frame)
                  ->setCellValue('Q' . $rowNumber, $data->FrameType)
                  ->setCellValue('R' . $rowNumber, $workStatus)
                  ->setCellValue('S' . $rowNumber, $assignStatus)
                  ->setCellValue('T' . $rowNumber, $closingStatus)
                  ->setCellValue('U' . $rowNumber, $data->Work_Start)
                  ->setCellValue('V' . $rowNumber, $data->Work_End)
                  ->setCellValue('W' . $rowNumber, $data->Work_Duration)
                  ->setCellValue('X' . $rowNumber, $data->Machine_EB_No)
                  ->setCellValue('Y' . $rowNumber, $data->Created_By)
                  ->setCellValue('Z' . $rowNumber, $data->Created_Time);


            if ($closingStatus == 'Closed') {
                $sheet->getStyle('T' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB(Color::COLOR_GREEN);
            } elseif ($closingStatus == 'Not-Closed') {
                $sheet->getStyle('T' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB(Color::COLOR_RED);
            }

            $rowNumber++;
        }

        $writer = new Xlsx($spreadsheet);
        $file_path = 'assets/reports/Work_Allocation_Report.xlsx';

        if (!file_exists('assets/reports')) {
            mkdir('assets/reports', 0777, true);
        }

        $writer->save($file_path);

        echo json_encode(['file_url' => base_url($file_path)]);





            } else {

              $Reponse = array (
                    'status' => 'error',
                    'mesaage' => 'Work Allocation Details Not Found!.',
                );

                echo json_encode($Reponse);

            }

        } else {
            redirect(base_url(),'refresh');
        }


    }


        public function All_Department_Reports(){

        $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $LocationCode = $Session['Lcode'];
            $CompanyCode = $Session['Ccode'];
            $Date =  $this->input->post('Date');
            $Shift = $this->input->post('Shift');

            $this->data['All_Department_Report'] = $All_Department_Report = $this->Reports_Model->All_Department_Report($Date,$Shift);

            if($All_Department_Report == FALSE){

                $Reponse = array (
                    'status' => 'error',
                    'mesaage' => 'Work Allocation Details Not Found!!.',
                );

                echo json_encode($Reponse);

            } else {

                echo json_encode($All_Department_Report);
            }


        } else {

             redirect(base_url(),'refresh');

        }

    }


     public function Shift_Closing_All_Report(){

        $Session = $this->session->userdata('sess_array');
         if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $CompanyCode =  $Session['Ccode'];
            $LocationCode =  $Session['Lcode'];
            $Login_User =  $Session['UserName'];
            $Date = $this->input->post('Date');
            $Shift =  $this->input->post('Shift');

            $this->data['Shift_Closing_All_Report'] =  $Shift_Closing_All_Report = $this->Reports_Model->Shift_Closing_All_Report($CompanyCode,$LocationCode,$Login_User,$Date,$Shift);

          if($Shift_Closing_All_Report == 0){

               $Reponse = array (
                    'status' => 'error',
                    'mesaage' => 'Work Allocation Details Not Found!!.',
                );

                echo json_encode($Reponse);


          } else{

                   $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $mainHeading = 'Employees Work Allocation Report';
        $sheet->mergeCells('A1:AA1');
        $sheet->setCellValue('A1', $mainHeading);
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 16,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        $sheet->getRowDimension('1')->setRowHeight(30);

        $sheet->setCellValue('A2', 'DATE: ' . $Date)
        ->setCellValue('A3', 'COMPANY: ' . $CompanyCode)
              ->setCellValue('A4', 'LOCATION: ' . $LocationCode)
              ->setCellValue('A5', 'SHIFT: ' . $Shift);

        $sheet->getStyle('A2:AB2')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 10,
            ],
        ]);

        $sheet->setCellValue('A3', 'Ccode')
              ->setCellValue('B3', 'Lcode')
              ->setCellValue('C3', 'Department')
              ->setCellValue('D3', 'WorkArea')
              ->setCellValue('E3', 'Job_Card_No')
              ->setCellValue('F3', 'Date')
              ->setCellValue('G3', 'Shift')
              ->setCellValue('H3', 'EmpNo')
              ->setCellValue('I3', 'FirstName')
              ->setCellValue('J3', 'ExistingCode')
              ->setCellValue('K3', 'Work_Type')
              ->setCellValue('L3', 'Description')
              ->setCellValue('M3', 'Machine_Name')
              ->setCellValue('N3', 'Machine_Model')
              ->setCellValue('O3', 'Machine_Id')
              ->setCellValue('P3', 'Frame')
              ->setCellValue('Q3', 'FrameType')
              ->setCellValue('R3', 'Work_Status')
              ->setCellValue('S3', 'Assign_Status')
              ->setCellValue('T3', 'Closing_Status')
              ->setCellValue('U3', 'Work_Start')
              ->setCellValue('V3', 'Work_End')
              ->setCellValue('W3', 'Work_Duration')
              ->setCellValue('X3', 'Machine_EB_No')
              ->setCellValue('Y3', 'Created_By')
              ->setCellValue('Z3', 'Created_Time');


        $rowNumber = 4;
        foreach ($Shift_Closing_All_Report as $data) {

            $workStatus = ($data->Work_Status == 1) ? '-' : '-';
            $assignStatus = ($data->Assign_Status == 1) ? 'Assigned' : '-';
            $closingStatus = ($data->Closing_Status == 1) ? 'Closed' : ($data->Closing_Status == 0 ? 'Not-Closed' : '-');

            $sheet->setCellValue('A' . $rowNumber, $data->Ccode)
                  ->setCellValue('B' . $rowNumber, $data->Lcode)
                  ->setCellValue('C' . $rowNumber, $data->Department)
                  ->setCellValue('D' . $rowNumber, $data->WorkArea)
                  ->setCellValue('E' . $rowNumber, $data->Job_Card_No)
                  ->setCellValue('F' . $rowNumber, $data->Date)
                  ->setCellValue('G' . $rowNumber, $data->Shift)
                  ->setCellValue('H' . $rowNumber, $data->EmpNo)
                  ->setCellValue('I' . $rowNumber, $data->FirstName)
                  ->setCellValue('J' . $rowNumber, $data->ExistingCode)
                  ->setCellValue('K' . $rowNumber, $data->Work_Type)
                  ->setCellValue('L' . $rowNumber, $data->Description)
                  ->setCellValue('M' . $rowNumber, $data->Machine_Name)
                  ->setCellValue('N' . $rowNumber, $data->Machine_Model)
                  ->setCellValue('O' . $rowNumber, $data->Machine_Id)
                  ->setCellValue('P' . $rowNumber, $data->Frame)
                  ->setCellValue('Q' . $rowNumber, $data->FrameType)
                  ->setCellValue('R' . $rowNumber, $workStatus)
                  ->setCellValue('S' . $rowNumber, $assignStatus)
                  ->setCellValue('T' . $rowNumber, $closingStatus)
                  ->setCellValue('U' . $rowNumber, $data->Work_Start)
                  ->setCellValue('V' . $rowNumber, $data->Work_End)
                  ->setCellValue('W' . $rowNumber, $data->Work_Duration)
                  ->setCellValue('X' . $rowNumber, $data->Machine_EB_No)
                  ->setCellValue('Y' . $rowNumber, $data->Created_By)
                  ->setCellValue('Z' . $rowNumber, $data->Created_Time);


            if ($closingStatus == 'Closed') {
                $sheet->getStyle('T' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB(Color::COLOR_GREEN);
            } elseif ($closingStatus == 'Not-Closed') {
                $sheet->getStyle('T' . $rowNumber)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB(Color::COLOR_RED);
            }

            $rowNumber++;
        }

        $writer = new Xlsx($spreadsheet);
        $file_path = 'assets/reports/Work_Allocation_Report.xlsx';

        if (!file_exists('assets/reports')) {
            mkdir('assets/reports', 0777, true);
        }

        $writer->save($file_path);

        echo json_encode(['file_url' => base_url($file_path)]);

          }



         } else {
            redirect(base_url());
         }

    }

    public function Late_Report(){


        $Session = $this->session->userdata('sess_array');
         if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $CompanyCode =  $Session['Ccode'];
            $LocationCode =  $Session['Lcode'];
            $Login_User =  $Session['UserName'];

            $this->data['Favicon'] = 'Precot | Late Employee Report';

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Reports/Late_Employee_Report', $this->data);
            $this->load->view('Frontend/Footer');

         } else {
            redirect(base_url());
         }


    }

public function Late_Employee_List() {

    $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        if ($_POST) {

            $CompanyCode = $Session['Ccode'];
            $LocationCode = $Session['Lcode'];
            $Login_User = $Session['UserName'];

            $Date = $this->input->post('Date');
            $Shift = $this->input->post('Shift');

            $this->data['Late_Employee_List'] = $Late_Employee_List = $this->Reports_Model->Late_Employee_List($CompanyCode, $LocationCode, $Login_User, $Date, $Shift);

            if ($Late_Employee_List == 0) {
                $Reponse = array(
                    'status' => 'error',
                    'message' => 'Work Allocation Details Not Found!!.'
                );
                echo json_encode($Reponse);
            } else {
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();

                $mainHeading = 'No Work Employee Report';
                $sheet->mergeCells('A1:N1');
                $sheet->setCellValue('A1', $mainHeading);
                $sheet->getStyle('A1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 16,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $sheet->getRowDimension('1')->setRowHeight(30);

                $sheet->setCellValue('A2', 'COMPANY: ' . $CompanyCode)
                      ->setCellValue('A3', 'LOCATION: ' . $LocationCode)
                      ->setCellValue('N2', 'SHIFT: ' . $Shift)
                      ->setCellValue('N3', 'DATE: ' . $Date);

                // Apply bold to SHIFT and DATE rows
                $sheet->getStyle('N2:N3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
                $sheet->getStyle('A2:A3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 10,
                    ],
                ]);

                $sheet->setCellValue('A6', 'Ccode')
                      ->setCellValue('B6', 'Lcode')
                      ->setCellValue('C6', 'Department')
                      ->setCellValue('D6', 'WorkArea')
                      ->setCellValue('E6', 'Job_Card_No')
                      ->setCellValue('F6', 'Date')
                      ->setCellValue('G6', 'Shift')
                      ->setCellValue('H6', 'EmpNo')
                      ->setCellValue('I6', 'FirstName')
                      ->setCellValue('J6', 'ExistingCode')
                      ->setCellValue('K6', 'Work_Type')
                      ->setCellValue('L6', 'Description')
                      ->setCellValue('M6', 'Machine_Name')
                      ->setCellValue('N6', 'Machine_Model')
                      ->setCellValue('O6', 'Machine_Id')
                      ->setCellValue('P6', 'Frame')
                      ->setCellValue('Q6', 'FrameType')
                      ->setCellValue('Y6', 'Created_By')
                      ->setCellValue('Z6', 'Created_Time');

                $sheet->getStyle('A6:Z6')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 10,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                        ],
                    ],
                ]);

                $rowNumber = 7;
                foreach ($Late_Employee_List as $data) {

                    $sheet->setCellValue('A' . $rowNumber, $data->Ccode)
                          ->setCellValue('B' . $rowNumber, $data->Lcode)
                          ->setCellValue('C' . $rowNumber, $data->Department)
                          ->setCellValue('D' . $rowNumber, $data->WorkArea)
                          ->setCellValue('E' . $rowNumber, $data->Job_Card_No)
                          ->setCellValue('F' . $rowNumber, $data->Date)
                          ->setCellValue('G' . $rowNumber, $data->Shift)
                          ->setCellValue('H' . $rowNumber, $data->EmpNo)
                          ->setCellValue('I' . $rowNumber, $data->FirstName)
                          ->setCellValue('J' . $rowNumber, $data->ExistingCode)
                          ->setCellValue('K' . $rowNumber, $data->Work_Type)
                          ->setCellValue('L' . $rowNumber, $data->Description)
                          ->setCellValue('M' . $rowNumber, $data->Machine_Name)
                          ->setCellValue('N' . $rowNumber, $data->Machine_Model)
                          ->setCellValue('O' . $rowNumber, $data->Machine_Id)
                          ->setCellValue('P' . $rowNumber, $data->Frame)
                          ->setCellValue('Q' . $rowNumber, $data->FrameType)
                          ->setCellValue('Y' . $rowNumber, $data->Created_By)
                          ->setCellValue('Z' . $rowNumber, $data->Created_Time);

                    $rowNumber++;
                }

                // Set the column widths to auto size based on content
                foreach (range('A', 'Z') as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }

                $writer = new Xlsx($spreadsheet);
                $currentDate = date('Y-m-d');
                $file_path = 'assets/reports/No_Work_Employee_Report_' . $currentDate . '.xlsx';

                if (!file_exists('assets/reports')) {
                    mkdir('assets/reports', 0777, true);
                }

                $writer->save($file_path);

                echo json_encode(['file_url' => base_url($file_path)]);

                exit;
            }
        }
    } else {
        redirect(base_url());
    }
}


public function NoWork_Employee_List(){

    $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $LocationCode = $Session['Lcode'];
            $CompanyCode = $Session['Ccode'];
            $Login_User = $Session['UserName'];
            $Date =  $this->input->post('Date');
            $Shift = $this->input->post('Shift');

            $this->data['NoWork_Employee_List'] = $NoWork_Employee_List = $this->Reports_Model->NoWork_Employee_List($CompanyCode,$LocationCode,$Login_User, $Date,$Shift);

            if($NoWork_Employee_List == FALSE){

                $Reponse = array (
                    'status' => 'error',
                    'mesaage' => 'Work Allocation Details Not Found!!.',
                );

                echo json_encode($Reponse);

            } else {

                echo json_encode($this->data);
            }


        } else {

             redirect(base_url(),'refresh');

        }

}



public function No_Work_Report_Download(){



     $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        if ($_POST) {

            $CompanyCode = $Session['Ccode'];
            $LocationCode = $Session['Lcode'];
            $Login_User = $Session['UserName'];

            $Date = $this->input->post('Date');
            $Shift = $this->input->post('Shift');

            $this->data['No_Work_Report_Download'] = $No_Work_Report_Download = $this->Reports_Model->NoWork_Employee_List($CompanyCode, $LocationCode, $Login_User, $Date, $Shift);

            if ($No_Work_Report_Download == 0) {
                $Reponse = array(
                    'status' => 'error',
                    'message' => 'Work Allocation Details Not Found!!.'
                );
                echo json_encode($Reponse);
            } else {
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();

                $mainHeading = 'No Work Employee Report';
                $sheet->mergeCells('A1:M1');
                $sheet->setCellValue('A1', $mainHeading);
                $sheet->getStyle('A1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 16,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $sheet->getRowDimension('1')->setRowHeight(30);

                $sheet->setCellValue('A2', 'COMPANY: ' . $CompanyCode)
                      ->setCellValue('A3', 'LOCATION: ' . $LocationCode)
                      ->setCellValue('M2', 'SHIFT: ' . $Shift)
                      ->setCellValue('M3', 'DATE: ' . $Date);

                // Apply bold to SHIFT and DATE rows
                $sheet->getStyle('M2:M3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
                $sheet->getStyle('A2:A3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 10,
                    ],
                ]);

                $sheet->setCellValue('A6', 'Ccode')
                      ->setCellValue('B6', 'Lcode')
                      ->setCellValue('C6', 'Department')
                      ->setCellValue('D6', 'WorkArea')
                      ->setCellValue('E6', 'Job_Card_No')
                      ->setCellValue('F6', 'Date')
                      ->setCellValue('G6', 'Shift')
                      ->setCellValue('H6', 'EmpNo')
                      ->setCellValue('I6', 'FirstName')
                      ->setCellValue('J6', 'ExistingCode')
                      ->setCellValue('K6', 'Work_Type')
                      ->setCellValue('L6', 'Created_By')
                      ->setCellValue('M6', 'Created_Time');

                $sheet->getStyle('A6:M6')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 10,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                        ],
                    ],
                ]);

                $rowNumber = 7;
                foreach ($No_Work_Report_Download as $data) {

                    $sheet->setCellValue('A' . $rowNumber, $data->Ccode)
                          ->setCellValue('B' . $rowNumber, $data->Lcode)
                          ->setCellValue('C' . $rowNumber, $data->Department)
                          ->setCellValue('D' . $rowNumber, $data->WorkArea)
                          ->setCellValue('E' . $rowNumber, $data->Job_Card_No)
                          ->setCellValue('F' . $rowNumber, $data->Date)
                          ->setCellValue('G' . $rowNumber, $data->Shift)
                          ->setCellValue('H' . $rowNumber, $data->EmpNo)
                          ->setCellValue('I' . $rowNumber, $data->FirstName)
                          ->setCellValue('J' . $rowNumber, $data->ExistingCode)
                          ->setCellValue('K' . $rowNumber, $data->Work_Type)
                          ->setCellValue('L' . $rowNumber, $data->Created_By)
                          ->setCellValue('M' . $rowNumber, $data->Created_Time);

                    $rowNumber++;
                }

                // Set the column widths to auto size based on content
                foreach (range('A', 'M') as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }

                $writer = new Xlsx($spreadsheet);
                $currentDate = date('Y-m-d');
                $file_path = 'assets/reports/No_Work_Employee_Report_' . $currentDate . '.xlsx';

                if (!file_exists('assets/reports')) {
                    mkdir('assets/reports', 0777, true);
                }

                $writer->save($file_path);

                echo json_encode(['file_url' => base_url($file_path)]);

                exit;
            }
        }
    } else {
        redirect(base_url());
    }



}




public function Work_Allocation_Report_Download(){

      $Session = $this->session->userdata('sess_array');
    if (!empty($Session) && isset($Session['IsOnLogin']) && $Session['IsOnLogin'] === TRUE) {

        if ($_POST) {

            $CompanyCode = $Session['Ccode'];
            $LocationCode = $Session['Lcode'];
            $Login_User = $Session['UserName'];

            $Date = $this->input->post('Date');
            $Shift = $this->input->post('Shift');

                $this->data['Assigned_List'] = $Assigned_List = $this->Reports_Model->Assigned_List($CompanyCode,$LocationCode,$Login_User,$Shift, $Date);

            if ($Assigned_List == 0) {
                $Reponse = array(
                    'status' => 'error',
                    'message' => 'Work Allocation Details Not Found!!.'
                );
                echo json_encode($Reponse);
            } else {
                $spreadsheet = new Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();

                $mainHeading = 'Employee Work Allocation Report';
                $sheet->mergeCells('A1:K1');
                $sheet->setCellValue('A1', $mainHeading);
                $sheet->getStyle('A1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 16,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                $sheet->getRowDimension('1')->setRowHeight(30);

                $sheet->setCellValue('A2', 'COMPANY: ' . $CompanyCode)
                      ->setCellValue('A3', 'LOCATION: ' . $LocationCode)
                      ->setCellValue('K2', 'SHIFT: ' . $Shift)
                      ->setCellValue('K3', 'DATE: ' . $Date);

                // Apply bold to SHIFT and DATE rows
                $sheet->getStyle('K2:K3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
                $sheet->getStyle('A2:A3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 10,
                    ],
                ]);

                $sheet->setCellValue('A6', 'Ccode')
                      ->setCellValue('B6', 'Lcode')
                      ->setCellValue('C6', 'Department')
                      ->setCellValue('D6', 'WorkArea')
                      ->setCellValue('E6', 'Job_Card_No')
                      ->setCellValue('F6', 'Date')
                      ->setCellValue('G6', 'Shift')
                      ->setCellValue('H6', 'EmpNo')
                      ->setCellValue('I6', 'FirstName')
                      ->setCellValue('J6', 'ExistingCode')
                      ->setCellValue('K6', 'Work_Type')
                      ->setCellValue('L6', 'Description')
                      ->setCellValue('M6', 'Machine_Name')
                      ->setCellValue('N6', 'Machine_Model')
                      ->setCellValue('O6', 'Machine_Id')
                      ->setCellValue('P6', 'Frame')
                      ->setCellValue('Q6', 'FrameType')
                      ->setCellValue('R6', 'Created_By')
                      ->setCellValue('S6', 'Created_Time');

                $sheet->getStyle('A6:S6')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'size' => 10,
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                        ],
                    ],
                ]);

                $rowNumber = 7;
                foreach ($Assigned_List as $data) {

                    $sheet->setCellValue('A' . $rowNumber, $data->Ccode)
                          ->setCellValue('B' . $rowNumber, $data->Lcode)
                          ->setCellValue('C' . $rowNumber, $data->Department)
                          ->setCellValue('D' . $rowNumber, $data->WorkArea)
                          ->setCellValue('E' . $rowNumber, $data->Job_Card_No)
                          ->setCellValue('F' . $rowNumber, $data->Date)
                          ->setCellValue('G' . $rowNumber, $data->Shift)
                          ->setCellValue('H' . $rowNumber, $data->EmpNo)
                          ->setCellValue('I' . $rowNumber, $data->FirstName)
                          ->setCellValue('J' . $rowNumber, $data->ExistingCode)
                          ->setCellValue('K' . $rowNumber, $data->Work_Type)
                          ->setCellValue('L' . $rowNumber, $data->Description)
                          ->setCellValue('M' . $rowNumber, $data->Machine_Name)
                          ->setCellValue('N' . $rowNumber, $data->Machine_Model)
                          ->setCellValue('O' . $rowNumber, $data->Machine_Id)
                          ->setCellValue('P' . $rowNumber, $data->Frame)
                          ->setCellValue('Q' . $rowNumber, $data->FrameType)
                          ->setCellValue('R' . $rowNumber, $data->Created_By)
                          ->setCellValue('S' . $rowNumber, $data->Created_Time);

                    $rowNumber++;
                }


                // Set the column widths to auto size based on content
                foreach (range('A', 'S') as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }

                $writer = new Xlsx($spreadsheet);
                $currentDate = date('Y-m-d');
                $file_path = 'assets/reports/Employee_Work_Allocation' . $currentDate . '.xlsx';

                if (!file_exists('assets/reports')) {
                    mkdir('assets/reports', 0777, true);
                }

                $writer->save($file_path);

                echo json_encode(['file_url' => base_url($file_path)]);

                exit;
            }
        }
    } else {
        redirect(base_url());
    }


}

public function Monthly_Report(){

  $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {



            $this->data['Favicon'] = 'Precot | Employee Monthly Work Report';

            $this->load->view('Frontend/Header', $this->data);
            $this->load->view('Frontend/Sidebar');
            $this->load->view('Reports/Monthly_Report', $this->data);
            $this->load->view('Frontend/Footer');
        } else {
            redirect(base_url(), 'refresh');
        }
}


public function Monthly_Reports(){

     $Session = $this->session->userdata('sess_array');
        if (!empty( $Session) && isset( $Session['IsOnLogin']) &&  $Session['IsOnLogin'] === TRUE) {

            $CompanyCode = $Session['Ccode'];
            $LocationCode = $Session['Lcode'];
            $Login_User = $Session['UserName'];
            $Month_Year = $this->input->post('Year_Month');

            $this->data['Monthly_Reports'] = $Monthly_Reports = $this->Reports_Model->Monthly_Reports($CompanyCode,$Lcode,$Login_User,$Month_Year);




        } else {
            redirect(base_url(), 'refresh');
        }



}




}