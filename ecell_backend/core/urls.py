from django.urls import path
from .views import PitchCreateView

urlpatterns = [
    path('pitches/', PitchCreateView.as_view(), name='pitches'),
]