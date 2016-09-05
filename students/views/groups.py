# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
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
