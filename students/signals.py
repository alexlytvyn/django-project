# -*- coding: utf-8 -*-
import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Student, Group, Exam

@receiver(post_save, sender=Student)
def log_student_updated_added_event(sender, **kwargs):
	"""Writes information about newly added or updated student into log file"""
	logger = logging.getLogger(__name__)
	student = kwargs['instance']
	if kwargs['created']:
		logger.info("Student added: %s %s (ID: %d)", student.first_name, student.last_name, student.id)
	else:
		logger.info("Student updated: %s %s (ID: %d)", student.first_name, student.last_name, student.id)

@receiver(post_delete, sender=Student)
def log_student_deleted_event(sender, **kwargs):
	"""Writes information about deleted student into log file"""
	logger = logging.getLogger(__name__)
	student = kwargs['instance']
	logger.info("Student deleted: %s %s (ID: %d)", student.first_name, student.last_name, student.id)

@receiver(post_save, sender=Group)
def log_group_updated_added_event(sender, **kwargs):
	"""Writes information about newly added or updated group into log file"""
	logger = logging.getLogger(__name__)
	group = kwargs['instance']
	if kwargs['created']:
		logger.info(u"Group added: %s (Староста: %s, ID: %d)", group.title, group.leader, group.id)
	else:
		logger.info(u"Group updated: %s (Староста: %s, ID: %d)", group.title, group.leader, group.id)

@receiver(post_delete, sender=Group)
def log_group_deleted_event(sender, **kwargs):
	"""Writes information about deleted group into log file"""
	logger = logging.getLogger(__name__)
	group = kwargs['instance']
	logger.info(u"Group deleted: %s (Староста: %s, ID: %d)", group.title, group.leader, group.id)

@receiver(post_save, sender=Exam)
def log_exam_updated_added_event(sender, **kwargs):
	"""Writes information about newly added or updated exam into log file"""
	logger = logging.getLogger(__name__)
	exam = kwargs['instance']
	if kwargs['created']:
		logger.info(u"Exam added: %s (Дата: %s, Група: %s)", exam.subject, exam.examdate, exam.exam_group)
	else:
		logger.info(u"Exam updated: %s (Дата: %s, Група: %s)", exam.subject, exam.examdate, exam.exam_group)

@receiver(post_delete, sender=Exam)
def log_exam_deleted_event(sender, **kwargs):
	"""Writes information about deleted exam into log file"""
	logger = logging.getLogger(__name__)
	exam = kwargs['instance']
	logger.info(u"Exam deleted: %s (Дата: %s, Група: %s)", exam.subject, exam.examdate, exam.exam_group)
