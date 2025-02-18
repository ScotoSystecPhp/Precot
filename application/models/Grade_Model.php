

<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class  Grade_Model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function Active_Employee_List($Ccode, $Lcode, $Department, $Employee_Status)
    {

        if ($Employee_Status == 'Active') {
            $IsActive = 'Yes';
        } elseif ($Employee_Status == '') {
            $IsActive = '';
        }

        $sql = "SELECT
    DeptName,
    CONVERT(VARCHAR, DOJ, 105) AS DOJ, -- Format date as 'DD-MM-YYYY'
    FirstName,
    MachineID,
    EmployeeMobile,
    IsActive,
    -- Calculate experience in years
    DATEDIFF(YEAR, DOJ, GETDATE()) AS ExperienceYears,
    -- Calculate months difference
    DATEDIFF(MONTH, DOJ, GETDATE()) % 12 AS ExperienceMonths,
    -- Format the experience
    CONCAT(
        DATEDIFF(YEAR, DOJ, GETDATE()),
        ' Years ',
        DATEDIFF(MONTH, DOJ, GETDATE()) % 12,
        ' Months'
    ) AS ExperienceFormatted
FROM Employee_Mst
WHERE
    CompCode = 'PRECOT'
    AND LocCode = 'PRECOT - A'
    AND DeptName = 'FINISHING-CON'
    AND IsActive = 'Yes';

    ";


        // print_r($sql);
        // exit;

        $query = $this->db->query($sql);
        return $query->result_array();
    }

    public function InActive_Employee_List($Ccode, $Lcode, $Department, $Employee_Status, $FromDate, $ToDate)
    {
        $IsActive = ($Employee_Status == 'Active') ? 'Yes' : 'No';
        $sql = "SELECT
                DeptName,
                FORMAT(TRY_CONVERT(DATE, DOJ), 'dd-MM-yyyy') AS DOJ,
                FORMAT(TRY_CONVERT(DATE, DOR), 'dd-MM-yyyy') AS DOR,
                FirstName,
                MachineID,
                EmployeeMobile,
                IsActive,
                DOR,
                DATEDIFF(YEAR, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) AS ExperienceYears,
                DATEDIFF(MONTH, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) % 12 AS ExperienceMonths,
                CONCAT(
                    DATEDIFF(YEAR, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())),
                    ' Years ',
                    DATEDIFF(MONTH, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) % 12,
                    ' Months'
                ) AS ExperienceFormatted
            FROM Employee_Mst
            WHERE
                CompCode = '$Ccode'
                AND LocCode = '$Lcode'
                AND DeptName = '$Department'
                AND IsActive = '$IsActive'
                AND TRY_CONVERT(DATE, DOR, 103) >= '$FromDate'
                AND TRY_CONVERT(DATE, DOR, 103) <= '$ToDate' ";

        // print_r($sql);exit;

        $query = $this->db->query($sql);
        return $query->result_array();
    }



    public function Trainee_Employee_List($Ccode, $Lcode, $Department, $Employee_Status, $TraineeMonth)
    {
        // Determine the `IsActive` value based on `Employee_Status`
        $IsActive = ($Employee_Status == 'Active') ? 'Yes' : 'No';

        // Get the current date
        $Date = date("Y-m-d");

        // SQL query to calculate experience
        $sql = "
            SELECT *
            FROM (
                SELECT
                    MachineID,
                    DOJ,
                    IsActive,
                    CompCode,
                    LocCode,
                    DeptName,
                    FirstName,
                    EmployeeMobile,
                    -- Calculate months of activity
                    DATEDIFF(MONTH, DOJ, '$Date') AS Months_Active,
                    -- Calculate years of experience
                    DATEDIFF(YEAR, DOJ, '$Date') AS ExperienceYears,
                    -- Calculate remaining months of experience
                    DATEDIFF(MONTH, DOJ, '$Date') % 12 AS ExperienceMonths,
                    -- Format the experience as 'X Years Y Months'
                    CONCAT(
                        DATEDIFF(YEAR, DOJ, '$Date'),
                        ' Years ',
                        DATEDIFF(MONTH, DOJ, '$Date') % 12,
                        ' Months'
                    ) AS ExperienceFormatted
                FROM Employee_Mst
            ) AS temp
            WHERE
                Months_Active >= 1
                AND Months_Active <= ?
                AND temp.IsActive = ?
                AND temp.CompCode = ?
                AND temp.LocCode = ?
                AND temp.DeptName = ?
            ORDER BY DOJ DESC";

        // echo"<pre>";
        // print_r($sql);
        // exit;



        // Execute the query with parameterized values
        $query = $this->db->query($sql, [$TraineeMonth, 'Yes', $Ccode, $Lcode, $Department]);

        // Return the results as an associative array
        return $query->result_array();
    }


    public function OnRoll_Employee_List($Ccode, $Lcode, $Department, $Employee_Status, $FromDate, $ToDate)
    {
        $sql = "SELECT
                CompCode,
                LocCode,
                DeptName,
                IsActive,
                CONVERT(VARCHAR(10), DOJ, 120) AS DOJ,
                FirstName,
                MachineID,
                EmployeeMobile,
                DATEDIFF(MONTH, DOJ, GETDATE()) AS Months_Active,
                CONCAT(FLOOR(DATEDIFF(DAY, DOJ, GETDATE()) / 365), ' Years ', FLOOR((DATEDIFF(DAY, DOJ, GETDATE()) % 365) / 30), ' Months') AS ExperienceFormatted,
                CONVERT(VARCHAR(10), DATEADD(MONTH, 6, DOJ), 120) AS SixMonthsAfterDOJ
            FROM
                Employee_Mst
            WHERE
                CompCode = '$Ccode'
                AND LocCode = '$Lcode'
                AND DeptName = '$Department'
                AND IsActive = 'Yes'
                AND TRY_CONVERT(DATE, DOR, 103) >= '$FromDate'
                AND TRY_CONVERT(DATE, DOR, 103) <= '$ToDate'
                AND DATEADD(MONTH, 6, DOJ) <= GETDATE()
            ORDER BY
                DOJ DESC";

        $query = $this->db->query($sql);
        return $query->result_array();
    }



    // --------------------------------------------Attendance - Sheet  - Section  -----------------------------------------------//


    public function Attendance_List($Ccode, $Lcode, $Department)
    {

        $sql = "WITH AttendanceData AS (
    SELECT
        ExistingCode,
        FirstName,
        TRY_CONVERT(DATE, doj, 103) AS ValidDOJ,
        FORMAT(Attn_Date, 'yyyy-MM') AS YearMonth,
        SUM(CASE WHEN Present = '1' AND Wh_Count != '1' THEN 1 ELSE 0 END) AS Present,
        COUNT(CASE WHEN Wh_Count != '1' THEN 1 ELSE NULL END) AS TotalWorkingDays
    FROM LogTime_Days
    WHERE Attn_Date >= DATEADD(MONTH, -6, CAST(DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) AS DATE))
    AND Attn_Date < CAST(DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) AS DATE)
    AND CompCode = '$Ccode'
    AND LocCode = '$Lcode'
    AND DeptName = '$Department'
    GROUP BY ExistingCode, FirstName, doj, FORMAT(Attn_Date, 'yyyy-MM')
)
SELECT
    AD.ExistingCode,
    AD.FirstName,
    AD.ValidDOJ AS doj,
    CASE
        WHEN AD.ValidDOJ IS NULL THEN 'Invalid Date'
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) < 3 THEN 'N' -- New (less than 3 months)
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) < 6 THEN 'T' -- Trainee (between 3 and 6 months)
        ELSE 'Exp' -- Experienced (6 months or more)
    END AS Status,
    DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) AS WorkingMonths,

    -- Percentage for the last 6 months
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_6,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_5,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_4,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_3,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_2,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_1,

    -- Calculating the Average Percentage over the last 6 months
    ROUND( (
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
    ) * 100 / 6, 0 ) AS Average_Percentage,

    -- New Grade Column based on Average Percentage for Exp employees
    CASE
        WHEN AD.ValidDOJ IS NULL THEN 'Invalid Date'
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) < 3 THEN 'N'  -- New
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) < 6 THEN 'T'  -- Trainee
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) >= 6 THEN
            CASE
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 80 AND 90 THEN 'A+'
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 70 AND 80 THEN 'A'
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 60 AND 70 THEN 'B+'
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 50 AND 60 THEN 'B'
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 1 AND 50 THEN 'C'
                ELSE 'No Grade'
            END
    END AS Grade
FROM AttendanceData AD
GROUP BY
    AD.ExistingCode,
    AD.FirstName,
    AD.ValidDOJ
";
        $query = $this->db->query($sql);
        return $query->result_array();
    }




    // Inactive Employee List

    public function Last_thirdy($Ccode, $Lcode, $Department)
    {

        $first_day_last_month = date('01/m/Y', strtotime('first day of last month'));
        $last_day_last_month = date('t/m/Y', strtotime('last day of last month'));

        $sql = "SELECT
                FirstName,
                MachineID,
                EmployeeMobile,
                ExistingCode,
                DOJ,
                DOR,
                IsActive,
                DeptName,
                DATEDIFF(YEAR, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) AS ExperienceYears,
                DATEDIFF(MONTH, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) % 12 AS ExperienceMonths,
                CONCAT(
                    DATEDIFF(YEAR, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())),
                    ' Years ',
                    DATEDIFF(MONTH, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) % 12,
                    ' Months'
                ) AS Experience
            FROM
                Employee_Mst
            WHERE
                CompCode = '$Ccode'
                AND LocCode = '$Lcode'
                AND DeptName = '$Department'
                AND Convert(Date,DOR,103) >= Convert(Date,'$first_day_last_month',103)
                AND Convert(Date,DOR,103) <= Convert(Date,'$last_day_last_month',103)
                AND IsActive = 'No'

        ";

        // print_r($sql);exit;

        $query = $this->db->query($sql);
        return $query->result_array();
    }


    public function Last_Sixty($Ccode, $Lcode, $Department)
    {

        $first_day_last_month = date('01/m/Y', strtotime('first day of -2 month'));
        $last_day_last_month = date('t/m/Y', strtotime('last day of last month'));

        $sql = "SELECT
                FirstName,
                MachineID,
                EmployeeMobile,
                ExistingCode,
                DOJ,
                DOR,
                IsActive,
                DeptName,
                DATEDIFF(YEAR, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) AS ExperienceYears,
                DATEDIFF(MONTH, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) % 12 AS ExperienceMonths,
                CONCAT(
                    DATEDIFF(YEAR, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())),
                    ' Years ',
                    DATEDIFF(MONTH, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) % 12,
                    ' Months'
                ) AS Experience
            FROM
                Employee_Mst
            WHERE
                CompCode = '$Ccode'
                AND LocCode = '$Lcode'
                AND DeptName = '$Department'
                AND Convert(Date,DOR,103) >= Convert(Date,'$first_day_last_month',103)
                AND Convert(Date,DOR,103) <= Convert(Date,'$last_day_last_month',103)
                AND IsActive = 'No'";
        $query = $this->db->query($sql);
        return $query->result_array();
    }

    public function Last_Ninety($Ccode, $Lcode, $Department)
    {

        $first_day_last_month = date('01/m/Y', strtotime('first day of -3 month'));
        $last_day_last_month = date('t/m/Y', strtotime('last day of last month'));

        $sql = "SELECT
                FirstName,
                MachineID,
                EmployeeMobile,
                ExistingCode,
                DOJ,
                DOR,
                IsActive,
                DeptName,
                DATEDIFF(YEAR, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) AS ExperienceYears,
                DATEDIFF(MONTH, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) % 12 AS ExperienceMonths,
                CONCAT(
                    DATEDIFF(YEAR, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())),
                    ' Years ',
                    DATEDIFF(MONTH, TRY_CONVERT(DATE, DOJ), ISNULL(TRY_CONVERT(DATE, DOR), GETDATE())) % 12,
                    ' Months'
                ) AS Experience
            FROM
                Employee_Mst
            WHERE
                CompCode = '$Ccode'
                AND LocCode = '$Lcode'
                AND DeptName = '$Department'
                AND Convert(Date,DOR,103) >= Convert(Date,'$first_day_last_month',103)
                AND Convert(Date,DOR,103) <= Convert(Date,'$last_day_last_month',103)
                AND IsActive = 'No'";
        $query = $this->db->query($sql);
        return $query->result_array();
    }



    // OnRoll Employee List


    public function On_Last_thirdy($Ccode, $Lcode, $Department)
    {

        $first_day_last_month = date('01/m/Y', strtotime('first day of last month'));
        $last_day_last_month = date('t/m/Y', strtotime('last day of last month'));

        $sql = "SELECT
                        FirstName,
                        MachineID,
                        EmployeeMobile,
                        ExistingCode,
                        CONVERT(VARCHAR(10), DOJ, 120) AS DOJ,
                        CONVERT(VARCHAR(10), DOR, 120) AS DOR,
                        IsActive,
                        DeptName,
                        DATEDIFF(MONTH, DOJ, GETDATE()) AS Months_Active,
                        CONCAT(FLOOR(DATEDIFF(DAY, DOJ, GETDATE()) / 365), ' Years ', FLOOR((DATEDIFF(DAY, DOJ, GETDATE()) % 365) / 30), ' Months') AS ExperienceFormatted
                    FROM Employee_Mst
                    WHERE
                        CompCode = '$Ccode'
                        AND LocCode = '$Lcode'
                        AND DeptName = '$Department'
                        AND Convert(Date,DOR,103) >= Convert(Date,'$first_day_last_month',103)
                        AND Convert(Date,DOR,103) <= Convert(Date,'$last_day_last_month',103)
                        AND IsActive = 'Yes'
                    ORDER BY DOR DESC";

        // print_r($sql);exit;

        $query = $this->db->query($sql);
        return $query->result_array();
    }


    public function On_Last_Sixty($Ccode, $Lcode, $Department)
    {


        $first_day_last_month = date('01/m/Y', strtotime('first day of -2 month'));
        $last_day_last_month = date('t/m/Y', strtotime('last day of last month'));

        $sql = "SELECT
                        FirstName,
                        MachineID,
                        EmployeeMobile,
                        ExistingCode,
                        CONVERT(VARCHAR(10), DOJ, 120) AS DOJ,  -- Format DOJ as YYYY-MM-DD
                        CONVERT(VARCHAR(10), DOR, 120) AS DOR,  -- Format DOR as YYYY-MM-DD
                        IsActive,
                        DeptName,
                        DATEDIFF(MONTH, DOJ, GETDATE()) AS Months_Active,  -- Calculate months of active experience
                        CONCAT(FLOOR(DATEDIFF(DAY, DOJ, GETDATE()) / 365), ' Years ', FLOOR((DATEDIFF(DAY, DOJ, GETDATE()) % 365) / 30), ' Months') AS ExperienceFormatted
                    FROM Employee_Mst
                    WHERE
                        CompCode = '$Ccode'
                        AND LocCode = '$Lcode'
                        AND DeptName = '$Department'
                        AND Convert(Date,DOR,103) >= Convert(Date,'$first_day_last_month',103)
                        AND Convert(Date,DOR,103) <= Convert(Date,'$last_day_last_month',103)
                        AND IsActive = 'Yes'
                    ORDER BY DOR DESC;";

        $query = $this->db->query($sql);
        return $query->result_array();
    }

    public function On_Last_Ninety($Ccode, $Lcode, $Department)
    {

        $first_day_last_month = date('01/m/Y', strtotime('first day of -3 month'));
        $last_day_last_month = date('t/m/Y', strtotime('last day of last month'));

        $sql = "SELECT
                        FirstName,
                        MachineID,
                        EmployeeMobile,
                        ExistingCode,
                        CONVERT(VARCHAR(10), DOJ, 120) AS DOJ,  -- Format DOJ as YYYY-MM-DD
                        CONVERT(VARCHAR(10), DOR, 120) AS DOR,  -- Format DOR as YYYY-MM-DD
                        IsActive,
                        DeptName,
                        DATEDIFF(MONTH, DOJ, GETDATE()) AS Months_Active,  -- Calculate months of active experience
                        CONCAT(FLOOR(DATEDIFF(DAY, DOJ, GETDATE()) / 365), ' Years ', FLOOR((DATEDIFF(DAY, DOJ, GETDATE()) % 365) / 30), ' Months') AS ExperienceFormatted
                    FROM Employee_Mst
                    WHERE
                        CompCode = '$Ccode'
                        AND LocCode = '$Lcode'
                        AND DeptName = '$Department'
                        AND Convert(Date,DOR,103) >= Convert(Date,'$first_day_last_month',103)
                        AND Convert(Date,DOR,103) <= Convert(Date,'$last_day_last_month',103)
                        AND IsActive = 'Yes'
                    ORDER BY DOR DESC;";

        $query = $this->db->query($sql);
        return $query->result_array();
    }

    public function Last_6_Month_Trainee_Incomplete($Ccode, $Lcode)
    {
        $sql = "SELECT
            EmpNo,
            FirstName,
            DOJ,
            Category,
            Duration,
            DeptName,

            DATEDIFF(MONTH, DOJ, GETDATE()) AS Months_Active,
            DATEDIFF(YEAR, DOJ, GETDATE()) AS ExperienceYears,
            DATEDIFF(MONTH, DOJ, GETDATE()) % 12 AS ExperienceMonths,

            CONCAT(
                DATEDIFF(YEAR, DOJ, GETDATE()),
                ' Years ',
                DATEDIFF(MONTH, DOJ, GETDATE()) % 12,
                ' Months'
            ) AS ExperienceFormatted,

            DATEDIFF(MONTH, Duration, GETDATE()) AS DurationMonths,

            CONCAT(
                DATEDIFF(YEAR, Duration, GETDATE()),
                ' Years ',
                DATEDIFF(MONTH, Duration, GETDATE()) % 12,
                ' Months'
            ) AS DurationFormatted
        FROM Employee_Mst
        WHERE
            Category = 'Traniee'
            AND CompCode = '$Ccode'
            AND LocCode = '$Lcode'
            AND IsActive = 'Yes'
            AND DATEDIFF(MONTH, DOJ, GETDATE()) <= 6
        ORDER BY DOJ DESC


";
        $query = $this->db->query($sql);
        return $query->result();
    }



    public function Last_12_Month_Trainee_Incomplete($Ccode, $Lcode)
    {
        $sql = "SELECT
            EmpNo,
            FirstName,
            DOJ,
            Category,
            Duration,
            DeptName,

            DATEDIFF(MONTH, DOJ, GETDATE()) AS Months_Active,
            DATEDIFF(YEAR, DOJ, GETDATE()) AS ExperienceYears,
            DATEDIFF(MONTH, DOJ, GETDATE()) % 12 AS ExperienceMonths,

            CONCAT(
                DATEDIFF(YEAR, DOJ, GETDATE()),
                ' Years ',
                DATEDIFF(MONTH, DOJ, GETDATE()) % 12,
                ' Months'
            ) AS ExperienceFormatted,

            DATEDIFF(MONTH, Duration, GETDATE()) AS DurationMonths,

            CONCAT(
                DATEDIFF(YEAR, Duration, GETDATE()),
                ' Years ',
                DATEDIFF(MONTH, Duration, GETDATE()) % 12,
                ' Months'
            ) AS DurationFormatted
        FROM Employee_Mst
        WHERE
            Category = 'Traniee'
            AND CompCode = '$Ccode'
            AND LocCode = '$Lcode'
            AND IsActive = 'Yes'
            AND DATEDIFF(MONTH, DOJ, GETDATE()) <= 12
        ORDER BY DOJ DESC";
        $query = $this->db->query($sql);
        return $query->result();
    }

    public function Above_6_Month_Trainee_Incomplete($Ccode, $Lcode)
    { {
            $sql = "SELECT
                EmpNo,
                FirstName,
                DOJ,
                Category,
                Duration,
                DeptName,

                DATEDIFF(MONTH, DOJ, GETDATE()) AS Months_Active,
                DATEDIFF(YEAR, DOJ, GETDATE()) AS ExperienceYears,
                DATEDIFF(MONTH, DOJ, GETDATE()) % 12 AS ExperienceMonths,

                CONCAT(
                    DATEDIFF(YEAR, DOJ, GETDATE()),
                    ' Years ',
                    DATEDIFF(MONTH, DOJ, GETDATE()) % 12,
                    ' Months'
                ) AS ExperienceFormatted,

                DATEDIFF(MONTH, Duration, GETDATE()) AS DurationMonths,

                CONCAT(
                    DATEDIFF(YEAR, Duration, GETDATE()),
                    ' Years ',
                    DATEDIFF(MONTH, Duration, GETDATE()) % 12,
                    ' Months'
                ) AS DurationFormatted
            FROM Employee_Mst
            WHERE
                Category = 'Traniee'
                AND CompCode = '$Ccode'
                AND LocCode = '$Lcode'
                AND IsActive = 'Yes'
                AND DATEDIFF(MONTH, DOJ, GETDATE()) >= 6
            ORDER BY DOJ DESC";
            $query = $this->db->query($sql);
            return $query->result();
        }
    }

    public function Above_12_Month_Trainee_Incomplete($Ccode, $Lcode)
    { {
            $sql = "SELECT
                EmpNo,
                FirstName,
                DOJ,
                Category,
                Duration,
                DeptName,

                DATEDIFF(MONTH, DOJ, GETDATE()) AS Months_Active,
                DATEDIFF(YEAR, DOJ, GETDATE()) AS ExperienceYears,
                DATEDIFF(MONTH, DOJ, GETDATE()) % 12 AS ExperienceMonths,

                CONCAT(
                    DATEDIFF(YEAR, DOJ, GETDATE()),
                    ' Years ',
                    DATEDIFF(MONTH, DOJ, GETDATE()) % 12,
                    ' Months'
                ) AS ExperienceFormatted,

                DATEDIFF(MONTH, Duration, GETDATE()) AS DurationMonths,

                CONCAT(
                    DATEDIFF(YEAR, Duration, GETDATE()),
                    ' Years ',
                    DATEDIFF(MONTH, Duration, GETDATE()) % 12,
                    ' Months'
                ) AS DurationFormatted
            FROM Employee_Mst
            WHERE
                Category = 'Traniee'
                AND CompCode = '$Ccode'
                AND LocCode = '$Lcode'
                AND IsActive = 'Yes'
                AND DATEDIFF(MONTH, DOJ, GETDATE()) >= 12
            ORDER BY DOJ DESC";
            $query = $this->db->query($sql);
            return $query->result();
        }
    }


    public function Chart_Fro_Attendance_Grade($Ccode, $Lcode)
    {

        $sql = "WITH AttendanceData AS (
    SELECT
        ExistingCode,
        FirstName,
        TRY_CONVERT(DATE, doj, 103) AS ValidDOJ,
        FORMAT(Attn_Date, 'yyyy-MM') AS YearMonth,
        SUM(CASE WHEN Present = '1' AND Wh_Count != '1' THEN 1 ELSE 0 END) AS Present,
        COUNT(CASE WHEN Wh_Count != '1' THEN 1 ELSE NULL END) AS TotalWorkingDays
    FROM LogTime_Days
    WHERE Attn_Date >= DATEADD(MONTH, -6, CAST(DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) AS DATE))
    AND Attn_Date < CAST(DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) AS DATE)
    AND CompCode = '$Ccode'
    AND LocCode = '$Lcode'
    GROUP BY ExistingCode, FirstName, doj, FORMAT(Attn_Date, 'yyyy-MM')
)
SELECT
    AD.ExistingCode,
    AD.FirstName,
    AD.ValidDOJ AS doj,
    CASE
        WHEN AD.ValidDOJ IS NULL THEN 'Invalid Date'
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) < 3 THEN 'N' -- New (less than 3 months)
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) < 6 THEN 'T' -- Trainee (between 3 and 6 months)
        ELSE 'Exp' -- Experienced (6 months or more)
    END AS Status,
    DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) AS WorkingMonths,

    -- Percentage for the last 6 months
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_6,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_5,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_4,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_3,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_2,
    MAX(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
             THEN ROUND(CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) * 100, 0)
             ELSE 0 END) AS Percentage_Month_1,

    -- Calculating the Average Percentage over the last 6 months
    ROUND( (
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
        SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                 THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
    ) * 100 / 6, 0 ) AS Average_Percentage,

    -- New Grade Column based on Average Percentage for Exp employees
    CASE
        WHEN AD.ValidDOJ IS NULL THEN 'Invalid Date'
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) < 3 THEN 'N'  -- New
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) < 6 THEN 'T'  -- Trainee
        WHEN DATEDIFF(MONTH, AD.ValidDOJ, GETDATE()) >= 6 THEN
            CASE
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 80 AND 90 THEN 'A+'
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 70 AND 80 THEN 'A'
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 60 AND 70 THEN 'B+'
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 50 AND 60 THEN 'B'
                WHEN ROUND( (
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -6, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -5, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -4, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -3, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -2, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END) +
                    SUM(CASE WHEN AD.YearMonth = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM')
                             THEN CAST(AD.Present AS FLOAT) / NULLIF(AD.TotalWorkingDays, 0) ELSE 0 END)
                ) * 100 / 6, 0 ) BETWEEN 1 AND 50 THEN 'C'
                ELSE 'No Grade'
            END
    END AS Grade
FROM AttendanceData AD
GROUP BY
    AD.ExistingCode,
    AD.FirstName,
    AD.ValidDOJ
";
        $query = $this->db->query($sql);
        return $query->result_array();
    }


    public function All_Status($Ccode, $Lcode){

        $sql = "SELECT
    EmpNo,
    FirstName,
    LastName,
    DOJ,
    IsActive,
    DATEDIFF(DAY, DOJ, GETDATE()) AS DaysSinceJoin,  -- Calculates the days since joining
    -- Categorizing based on IsActive status
    CASE
        WHEN IsActive = 'Yes' THEN 'ACTIVE'
        WHEN IsActive = 'No' THEN 'INACTIVE'
        ELSE 'INACTIVE'
    END AS Status,
    -- Categorizing based on the joining date, considering the IsActive status
    CASE
        -- Check if the employee joined in the current year
        WHEN YEAR(DOJ) = YEAR(GETDATE()) AND DATEDIFF(MONTH, DOJ, GETDATE()) <= 6 THEN 'TRAINEE'  -- 6 months or less in the current year
        WHEN YEAR(DOJ) = YEAR(GETDATE()) AND DATEDIFF(MONTH, DOJ, GETDATE()) > 6 THEN 'NEW'  -- More than 6 months and still active in the current year
        -- Check for employees with over 2 years of experience
        WHEN DATEDIFF(YEAR, DOJ, GETDATE()) > 2 THEN 'EXPERIENCED'  -- More than 2 years of experience
        -- For inactive employees, mark as INACTIVE
        WHEN IsActive = 'No' THEN 'INACTIVE'
        ELSE 'UNKNOWN'  -- Default case
    END AS EmployeeType
FROM
    Employee_Mst WHERE CompCode = '$Ccode' AND LocCode = '$Lcode'
ORDER BY
    DOJ;
";
$query = $this->db->query($sql);
        return $query->result_array();

    }





}
