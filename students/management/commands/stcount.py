from django.core.management.base import BaseCommand
from students.models import Student, Group
from django.contrib.auth.models import User
class Command(BaseCommand):
	args = '<model_name model_name ...>'
	help = "Prints to console number of student related objects in a database."
	models = (('student', Student), ('group', Group), ('user', User))
	def add_arguments(self, parser):
		for name, model in self.models:
			parser.add_argument(name)
	def handle(self, *args, **options):
		if options:
			for option in options:
				self.stdout.write('Number of %ss in database: %d' % (name, model.objects.count()))
