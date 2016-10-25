# -*- coding: utf-8 -*-
from django.db import models
from django.utils.translation import ugettext_lazy as _

class MonthJournal(models.Model):
	"""Student Monthly Journal"""
	class Meta:
		verbose_name = _(u"Monthly Journal")
		verbose_name_plural = _(u"Monthly Journals")
	student = models.ForeignKey('Student',
		verbose_name=_(u"Student"),
		blank=False,
		unique_for_month='date')
	# we only need year and month, so always set day to first day of the month
	date = models.DateField(
		verbose_name=_(u"Date"),
		blank=False)
	# list of days, each says whether student was presenе or not
	scope = locals()
	for field_number in range(1,32):
	    scope['present_day'+str(field_number)]=models.BooleanField(verbose_name = _(u"Day #")+str(field_number), default=False)
	def __unicode__(self):
		return u'%s: %d, %d' % (self.student.last_name, self.date.month, self.date.year)
