# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

class StudentsAppConfig(AppConfig):
	name = 'students'
	verbose_name = _(u"Students Base")
	def ready(self):
		from students import signals
