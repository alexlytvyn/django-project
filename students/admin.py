# -*- coding: utf-8 -*-
from django.contrib import admin
from django.core.urlresolvers import reverse
from django.forms import ModelForm, ValidationError
from models.students import Student
from models.groups import Group
from models.exams import Exam
class StudentFormAdmin(ModelForm):
    def clean_student_group(self):
        """ Check if student is leader in any group
            If yes, then ensure it's the same as selected group. """
        # get group where current sudent is a leader
        groups = Group.objects.filter(leader=self.instance)
        if len(groups) > 0 and self.cleaned_data['student_group'] != groups[0]:
            raise ValidationError(u"Студент є старостою іншої групи", code='invalid')
        return self.cleaned_data['student_group']
class StudentAdmin(admin.ModelAdmin):
	list_display = ['last_name', 'first_name', 'ticket', 'student_group']
	list_display_links = ['last_name', 'first_name']
	list_editable = ['student_group']
	ordering = ['last_name']
	list_filter = ['student_group']
	list_per_page = 10
	search_fields = ['last_name', 'first_name', 'middle_name', 'ticket', 'notes']
	actions = ['make_copy']
	def view_on_site(self, obj):
		return reverse('students_edit', kwargs={'pk': obj.id})
	def make_copy(modeladmin, request, queryset):
	    for query in queryset:
	        temp_query = Student(last_name = query.last_name, first_name = query.first_name, middle_name = query.middle_name, ticket = query.ticket , student_group = query.student_group, photo = query.photo, birthday = query.birthday, notes = query.notes)
	        temp_query.save()

	make_copy.short_description = u'Клонувати виділені записи'

class GroupAdmin(admin.ModelAdmin):
	list_display = ['title', 'leader']
	list_display_links = ['title']
	list_editable = ['leader']
	ordering = ['title']
	list_filter = ['leader']
	list_per_page = 10
	search_fields = ['title', 'leader', 'notes']
	def view_on_site(self, obj):
		return reverse('groups_edit', kwargs={'pk': obj.id})

class GroupFormAdmin(ModelForm):
    def clean_leader(self):
        # print leader
        # print self.instance
        leader = self.cleaned_data['leader']
        if leader.student_group != self.instance:
            raise ValidationError(u"Студент навчається в іншій групі.", code='invalid')
        return self.cleaned_data['leader']
# Register your models here.
admin.site.register(Student, StudentAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Exam)
