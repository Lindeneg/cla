from django.urls import path

from projects.api.views import (
    ProjectListCreateAPIView, ProjectDetailCreateAPIView, 
    SessionCreateAPIView, SessionDetailAPIView, 
    PageViewCreateAPIView, PageViewDetailAPIView
)

urlpatterns = [
    path("projects/", ProjectListCreateAPIView.as_view(), 
        name="project-list"),
    path("projects/<uuid:pk>", ProjectListCreateAPIView.as_view(), 
        name="project-detail"),
    path("projects/<uuid:project_pk>/sessions/", SessionCreateAPIView.as_view(), 
        name="project-session-create"),
    path("projects/<uuid:project_pk>/sessions/<uuid:pk>", SessionDetailAPIView.as_view(), 
        name="project-session-detail"),
    path("projects/<uuid:project_pk>/sessions/<uuid:session_pk>/pageviews/", PageViewCreateAPIView.as_view(), 
        name="project-session-pageview-create"),
    path("projects/<uuid:project_pk>/sessions/<uuid:session_pk>/pageviews/<uuid:pk>", PageViewDetailAPIView.as_view(), 
        name="project-session-pageview-detail"),
]
