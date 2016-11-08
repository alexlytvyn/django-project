from django import template
register = template.Library()
# Usage: {% pagenav object_list=students is_paginated=is_paginated paginator=paginator %}
@register.inclusion_tag('students/pagination.html')
def pagenav(object_list, is_paginated, paginator):
	"""Display page navigation for given list of objects"""
	return {
		'object_list': object_list,
		'is_paginated': is_paginated,
		'paginator': paginator
	}
