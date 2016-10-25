# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.utils.translation import ugettext_lazy as _

class Exam(models.Model):
    """Exam model"""
    subject = models.CharField(
        max_length=256,
        blank=False,
        verbose_name=_(u"Subject"))
    examdate = models.DateTimeField(
        blank=False,
        verbose_name=_(u"Date and Time of Exam"))
    teacher = models.CharField(
        max_length=256,
        blank=False,
        verbose_name=_(u"Teacher's Name"))
    exam_group = models.ForeignKey(
		'Group',
		verbose_name=_(u"Group"),
    	blank=False,
    	null=True,)
    class Meta(object):
        verbose_name = _(u"Exam")
        verbose_name_plural = _(u"Exams")
    def __unicode__(self):
        return u"%s - %s @ %s" % (self.subject, self.exam_group, self.examdate)
