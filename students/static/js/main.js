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
        warning.html(gettext("The changes into journal will save automatically after each click on table cell."));
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
    locale: 'uk'
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
    locale: 'uk'
  }).on('dp.hide', function(event) {
    $(this).blur();
  });
  $input_datetimeinput.wrap('<div class="input-group date col-md-4" data-provide="datepicker"></div>');
  $input_datetimeinput.after('<div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div>')
} // End initDateTimeFields

function initEditStudentPage() {
  $('a.student-edit-form-link').click(function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var modal = $('#myModal'),
          html = $(data),
          form = html.find('#content-column form');
        modal.find('.modal-title').html(html.find('#content-column h2').text());
        modal.find('.modal-body').html(form);
        // init our edit form
        initEditStudentForm(form, modal);
        // setup and show modal window finally
        modal.modal({
          'keyboard': false,
          'backdrop': false,
          'show': true
        });
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
      }
    });
    return false;
  });
} // End initEditStudentPage

function initEditStudentForm(form, modal) {
  // attach datepicker and photocustomize
  initDateFields();
  initDateTimeFields();
	initPhoto();
  // close modal window on Cancel button click
  form.find('input[name="cancel_button"]').click(function(event) {
    modal.modal('hide');
    return false;
  });
  // make form work in AJAX mode
  form.ajaxForm({
    'dataType': 'html',
    'error': function() {
      alert(gettext('There was an error on the server. Please try again a bit later.'));
      return false;
    },
    'success': function(data, status, xhr) {
      var html = $(data),
        newform = html.find('#content-column form');
      // copy alert to modal window
      modal.find('.modal-body').html(html.find('.alert'));
      // copy form to modal if we found it in server response
      if (newform.length > 0) {
        modal.find('.modal-body').append(newform);
        // initialize form fields and buttons
        initEditStudentForm(newform, modal);
      } else {
        // if no form, it means success and we need to reload page
        // to get updated students list;
        // reload after 2 seconds, so that user can read
        // success message
        setTimeout(function() {
          location.reload(true);
        }, 1000);
      }
    },
    'beforeSend': function() {
      $('.ajax-loader-modal img').show();
      $('input, select, textarea, a, button').attr('disabled', 'disabled');
    },
    'complete': function() {
      $('.ajax-loader-modal img').hide();
      $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
    }
  });
} // End initEditStudentForm

function initAddStudentPage() {
  $('#student-add-form-button').click(function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var modal = $('#myModal'),
          html = $(data),
          form = html.find('#content-column form');
        modal.find('.modal-title').html(html.find('#content-column h2').text());
        modal.find('.modal-body').html(form);
        // init our edit form
        initAddStudentForm(form, modal);
        // setup and show modal window finally
        modal.modal({
          'keyboard': false,
          'backdrop': false,
          'show': true
        });
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
      }
    });
    return false;
  });
} // End initAddStudentPage

function initAddStudentForm(form, modal) {
  // attach datepicker and photocustomize
  initDateFields();
  initDateTimeFields();
	initPhoto();
  // close modal window on Cancel button click
  form.find('input[name="cancel_button"]').click(function(event) {
    modal.modal('hide');
    return false;
  });
  // make form work in AJAX mode
  form.ajaxForm({
    'dataType': 'html',
    'error': function() {
      alert(gettext('There was an error on the server. Please try again a bit later.'));
      return false;
    },
    'success': function(data, status, xhr) {
      var html = $(data),
        newform = html.find('#content-column form');
      // copy alert to modal window
      modal.find('.modal-body').html(html.find('.alert'));
      // copy form to modal if we found it in server response
      if (newform.length > 0) {
        modal.find('.modal-body').append(newform);
        // initialize form fields and buttons
        initAddStudentForm(newform, modal);
      } else {
        // if no form, it means success and we need to reload page
        // to get updated students list;
        // reload after 2 seconds, so that user can read
        // success message
        setTimeout(function() {
          location.reload(true);
        }, 1000);
      }
    },
    'beforeSend': function() {
      $('.ajax-loader-modal img').show();
      $('input, select, textarea, a, button').attr('disabled', 'disabled');
    },
    'complete': function() {
      $('.ajax-loader-modal img').hide();
      $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
    }
  });
} // End initAddStudentForm

function initDeleteStudentPage() {
  $('a.student-delete-form-link').click(function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var modal = $('#myModal'),
          html = $(data),
          form = html.find('#content-column form');
        modal.find('.modal-title').html(html.find('#content-column h2').text());
        modal.find('.modal-body').html(form);
        // init our edit form
        initDeleteStudentForm(form, modal);
        // setup and show modal window finally
        modal.modal({
          'keyboard': true,
          'backdrop': false,
          'show': true
        });
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
      }
    });
    return false;
  });
} // End initDeleteStudentPage

function initDeleteStudentForm(form, modal) {
  // close modal window on Cancel button click
  form.find('input[name="cancel_button"]').click(function(event) {
    modal.modal('hide');
    return false;
  });
  // make form work in AJAX mode
  form.ajaxForm({
    'dataType': 'html',
    'error': function() {
      alert(gettext('There was an error on the server. Please try again a bit later.'));
      return false;
    },
    'success': function(data, status, xhr) {
      var html = $(data),
        newform = html.find('#content-column form');
      // copy alert to modal window
      modal.find('.modal-body').html(html.find('.alert'));
      // copy form to modal if we found it in server response
      if (newform.length > 0) {
        modal.find('.modal-body').append(newform);
        // initialize form fields and buttons
        initDeleteStudentForm(newform, modal);
      } else {
        // if no form, it means success and we need to reload page
        // to get updated students list;
        // reload after 2 seconds, so that user can read
        // success message
        setTimeout(function() {
          location.reload(true);
        }, 1000);
      }
    },
    'beforeSend': function() {
      $('.ajax-loader-modal img').show();
      $('input, select, textarea, a, button').attr('disabled', 'disabled');
    },
    'complete': function() {
      $('.ajax-loader-modal img').hide();
      $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
    }
  });
} // End initDeleteStudentForm

function initEditGroupPage() {
  $('a.group-edit-form-link').click(function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var modal = $('#myModal'),
          html = $(data),
          form = html.find('#content-column form');
        modal.find('.modal-title').html(html.find('#content-column h2').text());
        modal.find('.modal-body').html(form);
        // init our edit form
        initEditGroupForm(form, modal);
        // setup and show modal window finally
        modal.modal({
          'keyboard': false,
          'backdrop': false,
          'show': true
        });
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
      }
    });
    return false;
  });
} // End initEditGroupPage

function initEditGroupForm(form, modal) {
  // attach datepicker and photocustomize
  initDateFields();
  initDateTimeFields();
  // close modal window on Cancel button click
  form.find('input[name="cancel_button"]').click(function(event) {
    modal.modal('hide');
    return false;
  });
  // make form work in AJAX mode
  form.ajaxForm({
    'dataType': 'html',
    'error': function() {
      alert(gettext('There was an error on the server. Please try again a bit later.'));
      return false;
    },
    'success': function(data, status, xhr) {
      var html = $(data),
        newform = html.find('#content-column form');
      // copy alert to modal window
      modal.find('.modal-body').html(html.find('.alert'));
      // copy form to modal if we found it in server response
      if (newform.length > 0) {
        modal.find('.modal-body').append(newform);
        // initialize form fields and buttons
        initEditGroupForm(newform, modal);
      } else {
        // if no form, it means success and we need to reload page
        // to get updated students list;
        // reload after 2 seconds, so that user can read
        // success message
        setTimeout(function() {
          location.reload(true);
        }, 1000);
      }
    },
    'beforeSend': function() {
      $('.ajax-loader-modal img').show();
      $('input, select, textarea, a, button').attr('disabled', 'disabled');
    },
    'complete': function() {
      $('.ajax-loader-modal img').hide();
      $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
    }
  });
} // End initEditGroupForm

function initAddGroupPage() {
  $('#group-add-form-button').click(function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var modal = $('#myModal'),
          html = $(data),
          form = html.find('#content-column form');
        modal.find('.modal-title').html(html.find('#content-column h2').text());
        modal.find('.modal-body').html(form);
        // init our edit form
        initAddGroupForm(form, modal);
        // setup and show modal window finally
        modal.modal({
          'keyboard': false,
          'backdrop': false,
          'show': true
        });
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
      }
    });
    return false;
  });
} // End initAddGroupPage

function initAddGroupForm(form, modal) {
  // attach datepicker and photocustomize
  initDateFields();
  initDateTimeFields();
  // close modal window on Cancel button click
  form.find('input[name="cancel_button"]').click(function(event) {
    modal.modal('hide');
    return false;
  });
  // make form work in AJAX mode
  form.ajaxForm({
    'dataType': 'html',
    'error': function() {
      alert(gettext('There was an error on the server. Please try again a bit later.'));
      return false;
    },
    'success': function(data, status, xhr) {
      var html = $(data),
        newform = html.find('#content-column form');
      // copy alert to modal window
      modal.find('.modal-body').html(html.find('.alert'));
      // copy form to modal if we found it in server response
      if (newform.length > 0) {
        modal.find('.modal-body').append(newform);
        // initialize form fields and buttons
        initAddGroupForm(newform, modal);
      } else {
        // if no form, it means success and we need to reload page
        // to get updated students list;
        // reload after 2 seconds, so that user can read
        // success message
        setTimeout(function() {
          location.reload(true);
        }, 1000);
      }
    },
    'beforeSend': function() {
      $('.ajax-loader-modal img').show();
      $('input, select, textarea, a, button').attr('disabled', 'disabled');
    },
    'complete': function() {
      $('.ajax-loader-modal img').hide();
      $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
    }
  });
} // End initAddGroupForm

function initDeleteGroupPage() {
  $('a.group-delete-form-link').click(function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var modal = $('#myModal'),
          html = $(data),
          form = html.find('#content-column form');
        modal.find('.modal-title').html(html.find('#content-column h2').text());
        modal.find('.modal-body').html(form);
        // init our edit form
        initDeleteGroupForm(form, modal);
        // setup and show modal window finally
        modal.modal({
          'keyboard': true,
          'backdrop': false,
          'show': true
        });
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
      }
    });
    return false;
  });
} // End initDeleteGroupPage

function initDeleteGroupForm(form, modal) {
  // close modal window on Cancel button click
  form.find('input[name="cancel_button"]').click(function(event) {
    modal.modal('hide');
    return false;
  });
  // make form work in AJAX mode
  form.ajaxForm({
    'dataType': 'html',
    'error': function() {
      alert(gettext('There was an error on the server. Please try again a bit later.'));
      return false;
    },
    'success': function(data, status, xhr) {
      var html = $(data),
        newform = html.find('#content-column form');
      // copy alert to modal window
      modal.find('.modal-body').html(html.find('.alert'));
      // copy form to modal if we found it in server response
      if (newform.length > 0) {
        modal.find('.modal-body').append(newform);
        // initialize form fields and buttons
        initDeleteGroupForm(newform, modal);
      } else {
        // if no form, it means success and we need to reload page
        // to get updated students list;
        // reload after 2 seconds, so that user can read
        // success message
        setTimeout(function() {
          location.reload(true);
        }, 1000);
      }
    },
    'beforeSend': function() {
      $('.ajax-loader-modal img').show();
      $('input, select, textarea, a, button').attr('disabled', 'disabled');
    },
    'complete': function() {
      $('.ajax-loader-modal img').hide();
      $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
    }
  });
} // End initDeleteGroupForm

function initEditExamPage() {
  $('a.exam-edit-form-link').click(function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var modal = $('#myModal'),
          html = $(data),
          form = html.find('#content-column form');
        modal.find('.modal-title').html(html.find('#content-column h2').text());
        modal.find('.modal-body').html(form);
        // init our edit form
        initEditExamForm(form, modal);
        // setup and show modal window finally
        modal.modal({
          'keyboard': false,
          'backdrop': false,
          'show': true
        });
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
      }
    });
    return false;
  });
} // End initEditExamPage

function initEditExamForm(form, modal) {
  // attach datepicker and photocustomize
  initDateFields();
  initDateTimeFields();
  // close modal window on Cancel button click
  form.find('input[name="cancel_button"]').click(function(event) {
    modal.modal('hide');
    return false;
  });
  // make form work in AJAX mode
  form.ajaxForm({
    'dataType': 'html',
    'error': function() {
      alert(gettext('There was an error on the server. Please try again a bit later.'));
      return false;
    },
    'success': function(data, status, xhr) {
      var html = $(data),
        newform = html.find('#content-column form');
      // copy alert to modal window
      modal.find('.modal-body').html(html.find('.alert'));
      // copy form to modal if we found it in server response
      if (newform.length > 0) {
        modal.find('.modal-body').append(newform);
        // initialize form fields and buttons
        initEditExamForm(newform, modal);
      } else {
        // if no form, it means success and we need to reload page
        // to get updated students list;
        // reload after 2 seconds, so that user can read
        // success message
        setTimeout(function() {
          location.reload(true);
        }, 1000);
      }
    },
    'beforeSend': function() {
      $('.ajax-loader-modal img').show();
      $('input, select, textarea, a, button').attr('disabled', 'disabled');
    },
    'complete': function() {
      $('.ajax-loader-modal img').hide();
      $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
    }
  });
} // End initEditExamForm

function initAddExamPage() {
  $('#exam-add-form-button').click(function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var modal = $('#myModal'),
          html = $(data),
          form = html.find('#content-column form');
        modal.find('.modal-title').html(html.find('#content-column h2').text());
        modal.find('.modal-body').html(form);
        // init our edit form
        initAddExamForm(form, modal);
        // setup and show modal window finally
        modal.modal({
          'keyboard': false,
          'backdrop': false,
          'show': true
        });
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
      }
    });
    return false;
  });
} // End initAddExamPage

function initAddExamForm(form, modal) {
  // attach datepicker and photocustomize
  initDateFields();
  initDateTimeFields();
  // close modal window on Cancel button click
  form.find('input[name="cancel_button"]').click(function(event) {
    modal.modal('hide');
    return false;
  });
  // make form work in AJAX mode
  form.ajaxForm({
    'dataType': 'html',
    'error': function() {
      alert(gettext('There was an error on the server. Please try again a bit later.'));
      return false;
    },
    'success': function(data, status, xhr) {
      var html = $(data),
        newform = html.find('#content-column form');
      // copy alert to modal window
      modal.find('.modal-body').html(html.find('.alert'));
      // copy form to modal if we found it in server response
      if (newform.length > 0) {
        modal.find('.modal-body').append(newform);
        // initialize form fields and buttons
        initAddExamForm(newform, modal);
      } else {
        // if no form, it means success and we need to reload page
        // to get updated students list;
        // reload after 2 seconds, so that user can read
        // success message
        setTimeout(function() {
          location.reload(true);
        }, 1000);
      }
    },
    'beforeSend': function() {
      $('.ajax-loader-modal img').show();
      $('input, select, textarea, a, button').attr('disabled', 'disabled');
    },
    'complete': function() {
      $('.ajax-loader-modal img').hide();
      $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
    }
  });
} // End initAddExamForm

function initDeleteExamPage() {
  $('a.exam-delete-form-link').click(function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var modal = $('#myModal'),
          html = $(data),
          form = html.find('#content-column form');
        modal.find('.modal-title').html(html.find('#content-column h2').text());
        modal.find('.modal-body').html(form);
        // init our edit form
        initDeleteExamForm(form, modal);
        // setup and show modal window finally
        modal.modal({
          'keyboard': true,
          'backdrop': false,
          'show': true
        });
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
      }
    });
    return false;
  });
} // End initDeleteExamPage

function initDeleteExamForm(form, modal) {
  // close modal window on Cancel button click
  form.find('input[name="cancel_button"]').click(function(event) {
    modal.modal('hide');
    return false;
  });
  // make form work in AJAX mode
  form.ajaxForm({
    'dataType': 'html',
    'error': function() {
      alert(gettext('There was an error on the server. Please try again a bit later.'));
      return false;
    },
    'success': function(data, status, xhr) {
      var html = $(data),
        newform = html.find('#content-column form');
      // copy alert to modal window
      modal.find('.modal-body').html(html.find('.alert'));
      // copy form to modal if we found it in server response
      if (newform.length > 0) {
        modal.find('.modal-body').append(newform);
        // initialize form fields and buttons
        initDeleteExamForm(newform, modal);
      } else {
        // if no form, it means success and we need to reload page
        // to get updated students list;
        // reload after 2 seconds, so that user can read
        // success message
        setTimeout(function() {
          location.reload(true);
        }, 1000);
      }
    },
    'beforeSend': function() {
      $('.ajax-loader-modal img').show();
      $('input, select, textarea, a, button').attr('disabled', 'disabled');
    },
    'complete': function() {
      $('.ajax-loader-modal img').hide();
      $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
    }
  });
} // End initDeleteExamForm

// function initContactAdminPage() {
//   $('a.contact-admin-form-button').click(function(event) {
//     var link = $(this);
//     $.ajax({
//       'url': link.attr('href'),
//       'dataType': 'html',
//       'type': 'get',
//       'success': function(data, status, xhr) {
//         // check if we got successfull response from the server
//         if (status != 'success') {
//           alert(gettext('There was an error on the server. Please try again a bit later.'));
//           return false;
//         }
//         // update modal window with arrived content from the server
//         var modal = $('#myModal'),
//           html = $(data),
//           form = html.find('#content-column form');
//         modal.find('.modal-title').html(html.find('#content-column h2').text());
//         modal.find('.modal-body').html(form);
//         // init our edit form
//         initContactAdminForm(form, modal);
//         // setup and show modal window finally
//         modal.modal({
//           'keyboard': true,
//           'backdrop': false,
//           'show': true
//         });
//       },
//       'error': function() {
//         alert(gettext('There was an error on the server. Please try again a bit later.'));
//         return false;
//       },
//       'beforeSend': function() {
//         $('.ajax-loader').show();
//       },
//       'complete': function() {
//         $('.ajax-loader').hide();
//       }
//     });
//     return false;
//   });
// } // End initContactAdminPage
//
// function initContactAdminForm(form, modal) {
//   // close modal window on Cancel button click
//   form.find('input[name="cancel_button"]').click(function(event) {
//     modal.modal('hide');
//     return false;
//   });
//   // make form work in AJAX mode
//   form.ajaxForm({
//     'dataType': 'html',
//     'error': function() {
//       alert(gettext('There was an error on the server. Please try again a bit later.'));
//       return false;
//     },
//     'success': function(data, status, xhr) {
//       var html = $(data),
//         newform = html.find('#content-column form');
//       // copy alert to modal window
//       modal.find('.modal-body').html(html.find('.alert'));
//       // copy form to modal if we found it in server response
//       if (newform.length > 0) {
//         modal.find('.modal-body').append(newform);
//         // initialize form fields and buttons
//         initContactAdminForm(newform, modal);
//       } else {
//         // if no form, it means success and we need to reload page
//         // to get updated students list;
//         // reload after 2 seconds, so that user can read
//         // success message
//         setTimeout(function() {
//           location.reload(true);
//         }, 1000);
//       }
//     },
//     'beforeSend': function() {
//       $('.ajax-loader-modal img').show();
//       $('input, select, textarea, a, button').attr('disabled', 'disabled');
//     },
//     'complete': function() {
//       $('.ajax-loader-modal img').hide();
//       $('input, select, textarea, a, button').removeAttr('disabled', 'disabled');
//     }
//   });
// } // End initContactAdminForm

function initPaginatePage() {
  $(document).on("click", 'a.content-pagination', function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var html = $(data),
          page = $(html.find("#content-column")),
          body = $('#content-column');
        body.html(page);
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false
      }
    });
    return false;
  });
}

function initSortPage() {
  $(document).on("click", 'a.content-sorting', function(event) {
    var link = $(this);
    $.ajax({
      'url': link.attr('href'),
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successfull response from the server
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        }
        // update modal window with arrived content from the server
        var html = $(data),
          page = $(html.find("#content-column")),
          body = $('#content-column');
        body.html(page);
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false
      }
    });
    return false;
  });
}

function navTabs() {
  var navLinks = $('.nav-tabs li > a');
  navLinks.click(function(event) {
    var url = this.href;
    $.ajax({
      'url': url,
      'dataType': 'html',
      'type': 'get',
      'success': function(data, status, xhr) {
        // check if we got successful responcse
        if (status != 'success') {
          alert(gettext('There was an error on the server. Please try again a bit later.'));
          return false;
        };
        // update table
        var content = $(data).find('#content-columns');
        var pageTitle = content.find('h2').text();
        $(document).find('#content-columns').html(content.html());
        navLinks.each(function(index) {
          if (this.href === url) {
            $(this).parent().addClass('active');
          } else {
            $(this).parent().removeClass('active');
          };
        });
        // update uri in address bar
        window.history.pushState("string", pageTitle, url);
        // update page title
        document.title = $(data).filter('title').text();
      },
      'error': function() {
        alert(gettext('There was an error on the server. Please try again a bit later.'));
        return false;
      },
      'beforeSend': function() {
        $('.ajax-loader').show();
      },
      'complete': function() {
        $('.ajax-loader').hide();
        initFunctions();
      }
    });
    event.preventDefault();
  });
}

function closeModalBackButton() {
  window.addEventListener('popstate', function() {
    $('#myModal').modal('hide');
    window.history.pushState("string", '', '');
  });
}

function initPhoto() {
  var photo = $('#div_id_photo').find('div.controls');
  var photolink = $(photo).find('a').attr('href');
  if (photolink == undefined) {
    photolink = "/data/work/virtualenvs/studentsdb/src/studentsdb/students/static/img/default_user.png"; // Вирішити питання!
  }
  var htmltext = "<img class='img-circle' src='" + photolink + "' height='30' width='30' /> \
<input id='photo-clear_id' type='checkbox' name='photo-clear'> <label for='photo-clear_id'>Очистити</label><br><input id='id_photo' class='clearablefileinput' align='top' type='file' name='photo'>";
  photo.html(htmltext);
}

$(document).ready(function() {
  initFunctions();
  navTabs();
  closeModalBackButton();
});

function initFunctions() {
  initJournal();
  initGroupSelector();
  initDateFields();
  initDateTimeFields();
  initEditStudentPage();
  initAddStudentPage();
  initDeleteStudentPage();
  initEditGroupPage();
  initAddGroupPage();
  initDeleteGroupPage();
  initEditExamPage();
  initAddExamPage();
  initDeleteExamPage();
  // initContactAdminPage();
  initPaginatePage();
  initSortPage();
}
