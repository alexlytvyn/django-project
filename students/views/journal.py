# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse
# Views for Journal
def journal_page(request):
    return render(request, 'students/journal.html', {})
