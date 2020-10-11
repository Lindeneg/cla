from uuid import uuid4
from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    uuid = models.UUIDField(unique=True, primary_key=True, default=uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    domain = models.CharField(max_length=256, blank=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return str(self.uuid)

class Session(models.Model):
    uuid = models.UUIDField(unique=True, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="sessions")
    ip = models.CharField(max_length=128)
    language = models.CharField(max_length=128)
    user_agent = models.CharField(max_length=512)
    referrer = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.uuid)

class PageView(models.Model):
    uuid = models.UUIDField(unique=True, primary_key=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="pageviews")
    title = models.CharField(max_length=256)
    uri = models.URLField(max_length=256)
    path = models.CharField(max_length=512)
    mutations = models.TextField()
    events = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.uuid)