from django.conf.urls import include, url
from django.contrib import admin
import django.views.i18n
import students.views.students
import students.views.groups
import students.views.journal
import students.views.exams
import students.views.contact_admin
from .settings import MEDIA_ROOT, DEBUG
from django.conf import settings
from django.views.static import serve
# from students.views.contact_admin import ContactView
from students.views.students import StudentCreateView, StudentUpdateView, StudentDeleteView
from students.views.groups import GroupCreateView, GroupUpdateView, GroupDeleteView
from students.views.exams import ExamCreateView, ExamUpdateView, ExamDeleteView
from students.views.journal import JournalView
import students.views.set_language
from django.views.generic.base import RedirectView, TemplateView
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required

js_info_dict = {
	'packages': ('students',),
}

urlpatterns = [
    # Students urls
	url(r'^$', students.views.students.students_list, name='home'),
	url(r'^students/add/$', login_required(StudentCreateView.as_view()), name='students_add'),
	url(r'^students/(?P<pk>\d+)/edit/$', login_required(StudentUpdateView.as_view()), name='students_edit'),
	url(r'^students/(?P<pk>\d+)/delete/$', login_required(StudentDeleteView.as_view()), name='students_delete'),

	# Groups urls
	url(r'^groups/$', login_required(students.views.groups.groups_list), name='groups'),
	url(r'^groups/add/$', login_required(GroupCreateView.as_view()), name='groups_add'),
	url(r'^groups/(?P<pk>\d+)/edit/$', login_required(GroupUpdateView.as_view()), name='groups_edit'),
	url(r'^groups/(?P<pk>\d+)/delete/$', login_required(GroupDeleteView.as_view()), name='groups_delete'),

	# Journal urls
	url(r'^journal/(?P<pk>\d+)?/?$', login_required(JournalView.as_view()), name='journal'),

	# Exams urls
	url(r'^exams/$', login_required(students.views.exams.exams_page), name='exams'),
	url(r'^exams/add/$', login_required(ExamCreateView.as_view()), name='exams_add'),
	url(r'^exams/(?P<pk>\d+)/edit/$', login_required(ExamUpdateView.as_view()), name='exams_edit'),
	url(r'^exams/(?P<pk>\d+)/delete/$', login_required(ExamDeleteView.as_view()), name='exams_delete'),

	# Contact Admin Form Class & Function
	# url(r'^contact-admin/$', ContactView.as_view(), name='contact_admin'),

    url(r'^contact-admin/$', login_required(students.views.contact_admin.contact_admin), name='contact_admin'),

	# JavaScript Code Translation
	url(r'^jsi18n\.js$', django.views.i18n.javascript_catalog, js_info_dict, name='jstranslate'),

	# set_language view
    url('^set-language/$', students.views.set_language.set_language, name='set_language'),

	# User Related urls
	url(r'^users/profile/$', login_required(TemplateView.as_view(template_name='registration/profile.html')), name='profile'),
	url(r'^users/logout/$', auth_views.logout, kwargs={'next_page': 'home'}, name='auth_logout'),
	url(r'^register/complete/$', RedirectView.as_view(pattern_name='home'), name='registration_complete'),
	url(r'^users/', include('registration.backends.simple.urls', namespace='users')),

	# Social Auth Related urls
	url('^social/', include('social.apps.django_app.urls', namespace='social')),

	url(r'^admin/', include(admin.site.urls)),
]

if DEBUG:
	# serve files from media folder
	urlpatterns += [
		url(r'^media/(?P<path>.*)$', serve, {
				'document_root': MEDIA_ROOT,
				})
			]
