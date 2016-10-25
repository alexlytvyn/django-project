# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
from ..models import Exam
from django.core.urlresolvers import reverse
from django.views.generic import CreateView, UpdateView, DeleteView
from django.forms import ModelForm, ValidationError
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Div, HTML
from crispy_forms.bootstrap import FormActions
from datetime import datetime
from ..util import paginate, get_current_group
from django.utils.translation import ugettext as _

# Views for Exam
def exams_page(request):
	# check if we need to show only one group of exam
	group = get_current_group(request)
	if group:
		exams = Exam.objects.filter(exam_group = group)
	else:
		# otherwise show all students
		exams = Exam.objects.all()
	# try to order exams list
	order_by = request.GET.get('order_by', '')
	if order_by in ('id', 'subject', 'exam_group', 'examdate', 'teacher'):
		exams = exams.order_by(order_by)
		if request.GET.get('reverse', '') == '1':
			exams = exams.reverse()
	# apply pagination, 3 groups per page
	context = paginate(exams, 3, request, {}, var_name='exams')
	return render(request, 'students/exams_list.html', context)
# Клас форми додавання іспиту
class ExamCreateForm(ModelForm):
	class Meta:
		model = Exam
		fields = "__all__"
	def __init__(self, *args, **kwargs):
		super(ExamCreateForm, self).__init__(*args, **kwargs)
		self.helper = FormHelper(self)
		# set form tag attributes
		self.helper.form_action = reverse('exams_add')
		self.helper.form_method = 'POST'
		self.helper.form_class = 'form-horizontal'
		# set form field properties
		self.helper.help_text_inline = True
		self.helper.html5_required = True
		self.helper.label_class = 'col-sm-2 control-label'
		self.helper.field_class = 'col-sm-10'
		# add buttons
		self.helper.layout.append(FormActions(
			Div(css_class = self.helper.label_class),
			Submit('add_button', _(u'Save'), css_class="btn btn-primary"),
			HTML(u"<a class='btn btn-link' name='cancel_button' href='{% url 'exams' %}?status_message=Exam adding was canceled!'>Cancel</a>"),
		))
# Клас-"в'юшка" додавання іспиту
class ExamCreateView(CreateView):
    model = Exam
    template_name = 'students/exams_edit.html'
    form_class = ExamCreateForm
    def get_success_url(self):
		return u'%s?status_message=%s %s %s %s' % (reverse('exams'), _(u'Exam'), self.request.POST.get('subject'), self.request.POST.get('examdate'), _(u'was added successfully!'))
# Клас форми редагування даних про іспит
class ExamUpdateForm(ModelForm):
    class Meta:
        model = Exam
        fields = '__all__'
    def __init__(self, *args, **kwargs):
        super(ExamUpdateForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        # set form tag attributes
        self.helper.form_action = reverse('exams_edit', kwargs={'pk': kwargs['instance'].id})
        self.helper.form_method = 'POST'
        self.helper.form_class = 'form-horizontal'
        # set form field properties
        self.helper.help_text_inline = True
        self.helper.html5_required = True
        self.helper.label_class = 'col-sm-2 control-label'
        self.helper.field_class = 'col-sm-10'
        # add buttons
        self.helper.layout.append(FormActions(
			Div(css_class = self.helper.label_class),
			Submit('add_button', _(u'Save'), css_class="btn btn-primary"),
			HTML(u"<a class='btn btn-link' name='cancel_button' href='{% url 'exams' %}?status_message=Exam editing was canceled!'>Cancel</a>"),
		))
# Клас-"в'юшка" редагування даних про іспит
class ExamUpdateView(UpdateView):
    model = Exam
    template_name = 'students/exams_edit.html'
    form_class = ExamUpdateForm
    def get_success_url(self):
        return u'%s?status_message=%s %s %s %s' % (reverse('exams'),_(u'Exam'), self.request.POST.get('subject'), self.request.POST.get('examdate'), _(u'was edited successfully!'))
    def post(self, request, *args, **kwargs):
        if request.POST.get('cancel_button'):
            return HttpResponseRedirect(u'%s?status_message=%s' % (reverse('exams'), _(u'Exam editing was canceled!')))
        else:
            return super(ExamUpdateView, self).post(request, *args, **kwargs)
# Клас-"в'юшка" видалення іспиту
class ExamDeleteView(DeleteView):
	model = Exam
	template_name = 'students/exams_confirm_delete.html'
	def get_success_url(self):
		return u'%s?status_message=%s' % (reverse('exams'), _(u'Exam was deleted successfully!'))
