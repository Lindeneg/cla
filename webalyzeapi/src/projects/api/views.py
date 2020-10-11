from rest_framework import generics
from rest_framework import permissions

from projects.models import Project, Session, PageView
from projects.api.serializers import ProjectSerializer, SessionSerializer, PageViewSerializer


class ProjectListCreateAPIView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAdminUser]

class ProjectDetailCreateAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAdminUser]

class SessionCreateAPIView(generics.ListCreateAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAdminUser]

class SessionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAdminUser]

class PageViewCreateAPIView(generics.ListCreateAPIView):
    queryset = PageView.objects.all()
    serializer_class = PageViewSerializer
    permission_classes = [permissions.IsAdminUser]

class PageViewDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PageView.objects.all()
    serializer_class = PageViewSerializer
    permission_classes = [permissions.IsAdminUser]