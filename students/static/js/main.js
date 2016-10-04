function initJournal() {
  var indicator = $('#ajax-progress-indicator');
  var warning = $("#warning-message");
  $('.day-box input[type="checkbox"]').click(function(event) {
    var box = $(this);
    $.ajax(box.data('url'), {
      'type': 'POST',
      'async': true,
      'dataType': 'json',
      'data': {
        'pk': box.data('student-id'),
        'date': box.data('date'),
        'present': box.is(':checked') ? '1' : '',
        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
      },
      'beforeSend': function(xhr, settings) {
        indicator.show();
      },
      'error': function(xhr, status, error) {
        indicator.hide();
        warning.addClass("alert-danger");
        warning.html(error);
        warning.show();
      },
      'success': function(data, status, xhr) {
        indicator.hide();
        warning.removeClass("alert-danger");
        warning.html("Зміни в журнал зберігаються автоматично при кожному кліку в клітинці таблиці.");
        warning.append(indicator);
      }
    });
  });
} // End initJournal
function initGroupSelector() {
  // look up select element with groups and attach our even handler
  // on field "change" event
  $('#group-selector select').change(function(event) {
    // get value of currently selected group option
    var group = $(this).val();
    if (group) {
      // set cookie with expiration date 1 year since now;
      // cookie creation function takes period in days
      $.cookie('current_group', group, {
        'path': '/',
        'expires': 365
      });
    } else {
      // otherwise we delete the cookie
      $.removeCookie('current_group', {
        'path': '/'
      });
    }
    // and reload a page
    location.reload(true);
    return true;
  });
} // End initGroupSelector

function initDateFields() {
	var $input_dateinput = $('input.dateinput');
  $input_dateinput.datetimepicker({
    'format': 'YYYY-MM-DD',
		locale:'uk'
  }).on('dp.hide', function(event) {
    $(this).blur();
  });
	$input_dateinput.wrap('<div class="input-group date col-md-4" data-provide="datepicker"></div>');
	$input_dateinput.after('<div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>')
} // End initDateFields

function initDateTimeFields() {
	var $input_datetimeinput = $('input.datetimeinput');
  $input_datetimeinput.datetimepicker({
    'format': 'YYYY-MM-DD HH:mm',
		locale:'uk'
  }).on('dp.hide', function(event) {
    $(this).blur();
  });
	$input_datetimeinput.wrap('<div class="input-group date col-md-4" data-provide="datepicker"></div>');
	$input_datetimeinput.after('<div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>')
} // End initDateFields

$(document).ready(function() {
  initJournal();
  initGroupSelector();
  initDateFields();
	initDateTimeFields()
});
