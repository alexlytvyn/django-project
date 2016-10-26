from django.conf.urls import include, url
from django.contrib import admin
import django.views.i18n
import students.views.students
import students.views.groups
import students.views.journal
import students.views.exams
from .settings import MEDIA_ROOT, DEBUG
from django.conf import settings
from django.views.static import serve
from students.views.contact_admin import ContactView
from students.views.students import StudentCreateView, StudentUpdateView, StudentDeleteView
from students.views.groups import GroupCreateView, GroupUpdateView, GroupDeleteView
from students.views.exams import ExamCreateView, ExamUpdateView, ExamDeleteView
from students.views.journal import JournalView

js_info_dict = {
	'packages': ('students',),
}

urlpatterns = [
    # Students urls
	url(r'^$', students.views.students.students_list, name='home'),
	url(r'^students/add/$', StudentCreateView.as_view(), name='students_add'),
	url(r'^students/(?P<pk>\d+)/edit/$', StudentUpdateView.as_view(), name='students_edit'),
	url(r'^students/(?P<pk>\d+)/delete/$', StudentDeleteView.as_view(), name='students_delete'),

	# Groups urls
	url(r'^groups/$', students.views.groups.groups_list, name='groups'),
	url(r'^groups/add/$', GroupCreateView.as_view(), name='groups_add'),
	url(r'^groups/(?P<pk>\d+)/edit/$', GroupUpdateView.as_view(), name='groups_edit'),
	url(r'^groups/(?P<pk>\d+)/delete/$', GroupDeleteView.as_view(), name='groups_delete'),

	# Journal urls
	url(r'^journal/(?P<pk>\d+)?/?$', JournalView.as_view(), name='journal'),

	# Exams urls
	url(r'^exams/$', students.views.exams.exams_page, name='exams'),
	url(r'^exams/add/$', ExamCreateView.as_view(), name='exams_add'),
	url(r'^exams/(?P<pk>\d+)/edit/$', ExamUpdateView.as_view(), name='exams_edit'),
	url(r'^exams/(?P<pk>\d+)/delete/$', ExamDeleteView.as_view(), name='exams_delete'),

	# Contact Admin Form
	url(r'^contact-admin/$', ContactView.as_view(), name='contact_admin'),

	# JavaScript Code Translation
	url(r'^jsi18n\.js$', django.views.i18n.javascript_catalog, js_info_dict, name='jstranslate'),

	url(r'^admin/', include(admin.site.urls)),
]

if DEBUG:
	# serve files from media folder
	urlpatterns += [
		url(r'^media/(?P<path>.*)$', serve, {
				'document_root': MEDIA_ROOT,
				})
			]
