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
			'beforeSend': function(xhr, settings){
        indicator.show();
        },
    'error': function(xhr, status, error){
        indicator.hide();
        warning.addClass("alert-danger");
        warning.html(error);
        warning.show();
        },
    'success': function(data, status, xhr){
        indicator.hide();
        warning.removeClass("alert-danger");
        warning.html("Зміни в журнал зберігаються автоматично при кожному кліку в клітинці таблиці.");
        warning.append(indicator);
        }
    });
  });
}
$(document).ready(function() {
  initJournal();
});
