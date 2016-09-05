# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
# Views for Students
def students_list(request):
	students = (
		{'id': 1,
		'first_name': u'Олександр',
		'last_name': u'Литвин',
		'ticket': '007',
		'image': 'img/alytvyn.jpg'},
		{'id': 2,
		'first_name': u'Вікторія',
		'last_name': u'Мороз',
		'ticket': '010',
		'image': 'img/vmoroz.jpg'},
		{'id': 3,
		'first_name': u'Михайло',
		'last_name': u'Желюк',
		'ticket': 609,
		'image': 'img/mzheljuk.jpg'},
		)
	return render(request, 'students/students_list.html',
		{'students': students})
def students_add(request):
	return HttpResponse('<h1>Student Add Form</h1>')
def students_edit(request, sid):
	return HttpResponse('<h1>Edit Student %s</h1>' % sid)
def students_delete(request, sid):
	return HttpResponse('<h1>Delete Student %s</h1>' % sid)
# Views for Groups
def groups_list(request):
	groups = (
		{'id': 1,
		'name': 'Ф-07',
		'leader': {'id': 1, 'name': u'Литвин Олександр'}},
		{'id': 2,
		'name': 'Ф-08',
		'leader': {'id': 2, 'name': u'Мороз Вікторія'}},
		{'id': 3,
		'name': 'Ф-09',
		'leader': {'id': 3, 'name': u'Желюк Михайло'}},
		)
	return render(request, 'students/groups_list.html',
		{'groups': groups})
def groups_add(request):
	return HttpResponse('<h1>Group Add Form</h1>')
def groups_edit(request, gid):
	return HttpResponse('<h1>Edit Group %s</h1>' % gid)
def groups_delete(request, gid):
	return HttpResponse('<h1>Delete Group %s</h1>' % gid)
