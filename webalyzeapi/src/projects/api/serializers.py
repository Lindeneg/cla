from rest_framework import serializers
from projects.models import Project, Session, PageView


class PageViewSerializer(serializers.ModelSerializer):

    class Meta:
        model = PageView
        exclude = ("session",)


class SessionSerializer(serializers.ModelSerializer):

    pageviews = PageViewSerializer(many=True, read_only=True)

    class Meta:
        model = Session
        exclude = ("project",)

class ProjectSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    sessions = SessionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = "__all__"
