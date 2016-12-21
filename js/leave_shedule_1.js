/*Date.prototype.getUnixTime = function () {
 return this.getTime() / 1000 | 0;
 };*/

Date.prototype.getStringDate = function () {
  var year = this.getFullYear();
  var month = this.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var day = this.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  return year + '-' + month + '-' + day;
};

(function ($) {
  Drupal.behaviors.leave_shedule = {
    attach: function (context, settings) {

      var holidays = Drupal.settings.holidays;
      var leave_days = Drupal.settings.leave_days;
      //console.log(leave_days);
      var total_leave_days = Drupal.settings.total_leave_days;
      var year = Drupal.settings.year;

      pickmeup.defaults.locales['ru'] = {
        days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
      };

      function isHoliday(date) {
        for (var i = 0; i < holidays.length; i++) {
          if (holidays[i] === date) {
            return true;
          }
        }
        return false;
      }

      function update_total_leave_days() {
        var sel_days = pickmeup('#leave-shedule').get_date('Y-m-d').length;
        var caption = 'Дней отпуска: ' + total_leave_days;
        caption += ', использовано: ' + sel_days;
        caption += ', осталось выбрать: ' + (total_leave_days - sel_days);
        $('#total_leave_days').html(caption);
      }

      pickmeup('#leave-shedule', {
        flat: true, //календарь отображается на странице
        mode: 'multiple', //допускается множественный выбор дат
        calendars: 12, //количество календарей на странице (12-полный год)
        format: 'Y-m-d',
        min: year + '-01-01', //'01-01-' + year,
        max: year + '-12-31', //'31-12-' + year,
        locale: 'ru',
        select_month: false,
        select_year: false,
        date: leave_days, //даты, которые будут выбраны в календаре
        render: function (date) {
          //var my_date = new Date(2017, 2, 9);
          var d = date.getStringDate();
          //console.log(d);
          //if (date.getDate() == holidays[0]['day'] && date.getMonth() + 1 == holidays[0]['month']) {
          //var d = new Date(2017, holidays[0]['month'] - 1, holidays[0]['day']);
          //console.log(d);
          if (isHoliday(d)) {
            return {
              disabled: true,
              class_name: 'holiday'
            };
          }
        },
        change: function (formated) {
          alert('hi');
          console.log(formated);
        }
      }).addEventListener('pickmeup-fill', function (e) {
        //
      });

      update_total_leave_days();

      /*pickmeup(element);
      element.addEventListener('pickmeup-fill', function (e) {
        console.log(e);
        // Do stuff here
      });*/

      //var el = $('#leave-shedule');
      //console.log(el);

      /*el.pickmeup({
       change: function (formated) {
       el.val(formated);
       }
       });*/

      /*input.pickmeup({
       position: 'right',
       before_show: function () {
       input.pickmeup('set_date', input.val(), true);
       },
       change: function (formated) {
       input.val(formated);
       }
       });*/


      /*pickmeup('#leave-shedule').addEventListener('pickmeup-change', function (e) {
       console.log(e.detail.formatted_date); // New date according to current format
       console.log(e.detail.date);           // New date as Date object
       });*/

      /*pickmeup('#leave-shedule').addEventListener('pickmeup-change', function (e) {
       console.log(e.detail.formatted_date); // New date according to current format
       console.log(e.detail.date);           // New date as Date object
       });*/

      /*pickmeup('#leave-shedule').addEventListener('pickmeup-fill', function (e) {
       console.log('fill');
       });*/

      /*$('#leave-shedule').addEventListener('pickmeup-fill', function (e) {
       console.log('fill');
       })*/

      $('#btn_clear').on('click', function () {
        pickmeup('#leave-shedule').clear();
        update_total_leave_days();
      });

      $('#btn_change').on('click', function () {
        pickmeup('#leave-shedule').set_date(arr_leave_dates);
      });

      $('#btn_get').on('click', function () {
        //pickmeup('#leave-shedule').update();
        var sel = pickmeup('#leave-shedule').get_date('Y-m-d');
        //console.log(sel);
        $.ajax({
          url: 'hr/data/leave_shedule/save',
          type: 'POST',
          data: {
            leave_dates: sel,
            year: year,
          },
          success: function (data) {
            console.log(data);
            //alert('All right');
          },
          error: function () {
            alert('Произошла ошибка!');
          },
        });
      });

    }
  };
})(jQuery);

