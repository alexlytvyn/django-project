# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
from ..models import Student, Group
from django.core.urlresolvers import reverse
from django.views.generic import CreateView, UpdateView, DeleteView
from django.forms import ModelForm, ValidationError
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Div, HTML
from crispy_forms.bootstrap import FormActions
from ..util import paginate, get_current_group
from django.utils.translation import ugettext as _
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

# Views for Groups
def groups_list(request):
	groups = []
	# check if we need to show only one student of groups
	current_group = get_current_group(request)
	if current_group:
		groups.append(current_group)
	else:
		# otherwise show all groups
		groups = Group.objects.all()
	# try to order group list
	order_by = request.GET.get('order_by', '')
	if order_by in ('title', 'leader', 'id'):
		groups = groups.order_by(order_by)
		if request.GET.get('reverse', '') == '1':
			groups = groups.reverse()
	# apply pagination, 3 students per page
	context = paginate(groups, 3, request, {}, var_name='groups')

	return render(request, 'students/groups_list.html', context)
# Add Groups Form class
class GroupCreateForm(ModelForm):
	class Meta:
		model = Group
		fields = "__all__"
	def __init__(self, *args, **kwargs):
		super(GroupCreateForm, self).__init__(*args, **kwargs)
		self.helper = FormHelper(self)
		# set form tag attributes
		self.helper.form_action = reverse('groups_add')
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
			HTML(u"<a class='btn btn-link' name='cancel_button' href='{% url 'groups' %}?status_message=Group adding canceled!'>Cancel</a>"),
		))
# Клас-"в'юшка" додавання групи
class GroupCreateView(CreateView):
	model = Group
	template_name = 'students/groups_edit.html'
	form_class = GroupCreateForm
	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(GroupCreateView, self).dispatch(*args, **kwargs)
	def get_success_url(self):
		return u'%s?status_message=%s %s %s' % (reverse('groups'), _(u'Group'), self.request.POST.get('title'), _(u'was added successfully!'))
# Клас форми редагування групи
class GroupUpdateForm(ModelForm):
	class Meta:
		model = Group
		fields = '__all__'
	def __init__(self, *args, **kwargs):
		super(GroupUpdateForm, self).__init__(*args, **kwargs)
		self.fields['leader'].queryset = Student.objects.filter(student_group=self.instance)
		self.helper = FormHelper(self)
		# set form tag attributes
		self.helper.form_action = reverse('groups_edit', kwargs={'pk': self.instance.id})
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
			HTML(u"<a class='btn btn-link' name='cancel_button' href='{% url 'groups' %}?status_message=Group editing was canceled!'>Cancel</a>"),
		))
# Клас-"в'юшка" редагування групи
class GroupUpdateView(UpdateView):
	model = Group
	template_name = 'students/groups_edit.html'
	form_class = GroupUpdateForm
	def get_success_url(self):
		return u'%s?status_message=%s %s %s' % (reverse('groups'), _(u'Group'), self.request.POST.get('title'), _(u'was edited successfully!'))
	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(GroupUpdateView, self).dispatch(*args, **kwargs)
	def post(self, request, *args, **kwargs):
		if request.POST.get('cancel_button'):
			return HttpResponseRedirect(u'%s?status_message=%s' % (reverse('groups'), _(u'Group editing was canceled!')))
		else:
			return super(GroupUpdateView, self).post(request, *args, **kwargs)
class GroupDeleteView(DeleteView):
	model = Group
	template_name = 'students/groups_confirm_delete.html'
	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(GroupDeleteView, self).dispatch(*args, **kwargs)
	def get_success_url(self):
		return u'%s?status_message=%s' % (reverse('groups'), _(u'was deleted successfully!'))
