<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function get_holidays() {
  $arr_holidays = array(
    0 => array(
      'day' => 1,
      'month' => 1,
      'holiday_name' => 'Новогодние каникулы',
    ),
    1 => array(
      'day' => 2,
      'month' => 1,
      'holiday_name' => 'Новогодние каникулы',
    ),
    2 => array(
      'day' => 3,
      'month' => 1,
      'holiday_name' => 'Новогодние каникулы',
    ),
    3 => array(
      'day' => 4,
      'month' => 1,
      'holiday_name' => 'Новогодние каникулы',
    ),
    4 => array(
      'day' => 5,
      'month' => 1,
      'holiday_name' => 'Новогодние каникулы',
    ),
    5 => array(
      'day' => 6,
      'month' => 1,
      'holiday_name' => 'Новогодние каникулы',
    ),
    6 => array(
      'day' => 7,
      'month' => 1,
      'holiday_name' => 'Рождество Христово',
    ),
    7 => array(
      'day' => 8,
      'month' => 1,
      'holiday_name' => 'Новогодние каникулы',
    ),
    8 => array(
      'day' => 23,
      'month' => 2,
      'holiday_name' => 'День защитника отечества',
    ),
    9 => array(
      'day' => 8,
      'month' => 3,
      'holiday_name' => 'Международный женский день',
    ),
  );

  return $arr_holidays;
}

/**
 * Возвращает праздничные дни в требуемом году в формате UNIX
 * @param type $year
 * @return type
 *  Массив дат в формате UNIX
 */
function get_unix_holidays($year) {
  //Получаем праздничные дни из БОСС-Кадровик
  $arr_holidays = get_holidays();
  $holidays = array();

  foreach ($arr_holidays as $holiday) {
    $day = $holiday['day'];
    $month = $holiday['month'];
    $holidays[] = mktime(0, 0, 0, $month, $day, $year);
  }

  return $holidays;
}

function get_string_holidays($year) {
  //Получаем праздничные дни из БОСС-Кадровик
  $arr_holidays = get_holidays();
  $holidays = array();

  foreach ($arr_holidays as $holiday) {
    $day = $holiday['day'];
    $month = $holiday['month'];
    $holidays[] = format_date(strtotime(implode('-', array($year, $month, $day))), 'custom', 'Y-m-d');
  }

  return $holidays;
}

function get_leave_days($year) {
  $query = db_select('ls_leave_dates', 'ld')
      ->fields('ld')
      ->condition('uname', 1, '=')
      ->condition('year', $year, '=')
      ->execute()
      ->fetchAll();

  //debug($query);

  $arr_leave_days = array();
  foreach ($query as $k => $value) {
    $arr_leave_days[] = get_arr_leave_dates($value->d_from, $value->days);
  }
//debug($arr_leave_days);
$leave_days = implode(',', $arr_leave_days);
  /* $arr_leave_days = array(
    '2017-03-09',
    '2017-03-10',
    '2017-03-11',
    '2017-03-12',
    '2017-08-01',
    '2017-08-02',
    '2017-08-05',
    ); */

//debug(implode(',', $arr_leave_days));  
//$arr_leave_days = array();

  return explode(',', $leave_days);
}

function get_range_leave_dates($arr_leave_dates) {
  /* $prev_date = '';
    $start_leave = '';
    $days = 0;
    $range_leave_dates = array();

    foreach ($arr_leave_dates as $leave_date) {
    $prev_d = format_date(strtotime($leave_date) - 86400, 'custom', 'Y-m-d');

    if ($prev_d == $prev_date) {
    $days++;
    }
    else {
    if ($days == 0) {
    $start_leave = $leave_date;
    $days++;
    }
    else {
    $range_leave_dates[] = array(
    'start_leave' => $start_leave,
    'days' => $days,
    );
    $start_leave = $leave_date;
    $days = 0;
    }
    }
    $prev_date = $leave_date;
    }

    return $range_leave_dates; */

  $prev_date = '';
  //$str_start_leave = '';
  $start_leave = ''; //array();
  //$arr_total_days = array();
  $days = 1;
  $i = 0;
  $range_leave_dates = array();

  sort($arr_leave_dates);

  foreach ($arr_leave_dates as $leave_date) {
    $prev_d = format_date(strtotime($leave_date) - 86400, 'custom', 'Y-m-d');

    if ($prev_d == $prev_date) {
      $days++;
    }
    else {
      $start_leave = $leave_date;
      //$str_start_leave = $leave_date;
      $i = count($start_leave) - 1;
      $days = 1;
    }

    //$arr_total_days[$i] = $days;
    $range_leave_dates[$start_leave] = $days;
    $prev_date = $leave_date;
  }

  //debug($range_leave_dates);
  return $range_leave_dates; //$arr_total_days;
}

function get_arr_leave_dates($d_from, $days) {
  for ($i = 0; $i < $days; $i++) {
    $arr_leave_dates[] = format_date(strtotime("$d_from +$i days"), 'custom', 'Y-m-d');
  }
//debug($arr_leave_dates);
  return implode(',', $arr_leave_dates);
}
