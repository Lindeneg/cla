from django.contrib import admin

from projects.models import Project, Session, PageView

admin.site.register(Project)
admin.site.register(Session)
admin.site.register(PageView)
