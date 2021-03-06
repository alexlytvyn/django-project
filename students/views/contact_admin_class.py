# -*- coding: utf-8 -*-
from django import forms
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from studentsdb.settings import ADMIN_EMAIL
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from django.views.generic.edit import FormView
import logging
from django.utils.translation import ugettext as _
from django.contrib.auth.decorators import permission_required
class ContactForm(forms.Form):
	def __init__(self, *args, **kwargs):
		# call original initializator
		super(ContactForm, self).__init__(*args, **kwargs)
		# this helper object allows us to customize form
		self.helper = FormHelper()
		# form tag attributes
		self.helper.form_class = 'form-horizontal'
		self.helper.form_method = 'post'
		self.helper.form_action = reverse('contact_admin')
		# twitter bootstrap styles
		self.helper.help_text_inline = True
		self.helper.html5_required = True
		self.helper.label_class = 'col-sm-2 control-label'
		self.helper.field_class = 'col-sm-10'
		# form buttons
		self.helper.add_input(Submit('send_button', _(u'Send')))
	from_email = forms.EmailField(
		label = _(u'Your Email Address'))
	subject = forms.CharField(
		label= _(u"Message title"),
		max_length=128)
	message = forms.CharField(
		label= _(u"Message text"),
		max_length=2560,
		widget=forms.Textarea)
class ContactView(FormView):
	template_name = 'contact_admin/form.html'
	form_class = ContactForm
	def form_valid(self, form):
		"""This method is called for valid data"""
		subject = form.cleaned_data['subject']
		message = form.cleaned_data['message']
		from_email = form.cleaned_data['from_email']
		try:
			send_mail(subject, message+'\n\nMessage was send from: '+from_email, 'Students DB ', [ADMIN_EMAIL])
			# pass
		except Exception:
			self.message = _(u'The message was not sent.')
			logger = logging.getLogger(__name__)
			logger.exception(message)
		else:
			self.message = _(u'The message was sent successfully.')
		return super(ContactView, self).form_valid(form)
	def get_success_url(self):
		return u'%s?status_message=%s' % (reverse('contact_admin'), self.message)
