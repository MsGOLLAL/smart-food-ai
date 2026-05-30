from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth JWT & Profiles
    path('auth/register/', views.RegisterView.as_view(), name='auth_register'),
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='auth_token_refresh'),
    path('auth/profile/', views.get_user_profile, name='auth_profile'),

    # Donors
    path('donations/upload/', views.DonationUploadView.as_view(), name='donation_upload'),
    path('donations/my/', views.donor_donations, name='donor_donations'),

    # NGOs
    path('ngo/incoming/', views.ngo_incoming_donations, name='ngo_incoming_donations'),

    # Volunteers
    path('volunteer/tasks/', views.VolunteerTaskListView.as_view(), name='volunteer_tasks'),
    path('volunteer/tasks/<int:task_id>/claim/', views.volunteer_claim_task, name='volunteer_claim_task'),
    path('volunteer/tasks/<int:task_id>/status/', views.volunteer_update_status, name='volunteer_update_status'),
    path('volunteer/tasks/<int:task_id>/verify-otp/', views.volunteer_verify_otp, name='volunteer_verify_otp'),

    # Notifications & Analytics
    path('notifications/', views.NotificationListView.as_view(), name='notifications_list'),
    path('analytics/dashboard/', views.admin_global_analytics, name='admin_dashboard_analytics'),
]
