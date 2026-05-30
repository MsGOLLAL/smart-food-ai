from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('donor', 'Donor'),
        ('ngo', 'NGO'),
        ('volunteer', 'Volunteer'),
        ('admin', 'Admin'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='donor')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    location_name = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    # Volunteer-specific fields
    volunteer_points = models.IntegerField(default=0)
    
    # NGO-specific fields
    ngo_capacity = models.CharField(max_length=50, blank=True, null=True, default='Medium')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Donation(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('ngo_assigned', 'NGO Assigned'),
        ('en_route', 'En Route'),
        ('picked_up', 'Picked Up'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    )
    
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')
    food_name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=100) # e.g. "10 kg", "25 meals"
    image_url = models.TextField(blank=True, null=True) # supports base64 or hosted URL
    preparation_time = models.DateTimeField()
    storage_condition = models.CharField(max_length=100) # e.g. "Refrigerated", "Ambient"
    expiry_duration = models.CharField(max_length=100) # e.g. "4 hours"
    latitude = models.FloatField()
    longitude = models.FloatField()
    special_notes = models.TextField(blank=True, null=True)
    
    # AI Predictions (Computed by Gemini)
    freshness_score = models.IntegerField(default=100)
    urgency_level = models.CharField(max_length=20, default='Medium') # Low, Medium, High
    safe_duration_hours = models.IntegerField(default=4)
    pickup_priority = models.CharField(max_length=20, default='Standard') # Standard, Urgent, Immediate
    ai_recommendations = models.TextField(blank=True, null=True)
    co2_reduction_kg = models.FloatField(default=0.0) # Calculated impact metric
    cnn_confidence = models.FloatField(default=0.0) # CNN classification accuracy score
    
    # Matching and Logistics status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.food_name} - {self.quantity} ({self.status})"


class NGOMatching(models.Model):
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE, related_name='ngo_matching')
    ngo = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ngo_matches')
    distance_km = models.FloatField()
    eta_minutes = models.IntegerField()
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Match: {self.donation.food_name} -> {self.ngo.username}"


class VolunteerTask(models.Model):
    STATUS_CHOICES = (
        ('assigned', 'Assigned'),
        ('en_route', 'En Route'),
        ('picked_up', 'Picked Up'),
        ('completed', 'Completed'),
    )
    
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE, related_name='volunteer_task')
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='volunteer_tasks', blank=True, null=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='assigned')
    
    # Verification
    otp_code = models.CharField(max_length=6)
    otp_verified_at = models.DateTimeField(blank=True, null=True)
    completion_points_awarded = models.IntegerField(default=50)

    def __str__(self):
        return f"Task: {self.donation.food_name} -> {self.volunteer.username} ({self.status})"


class Notification(models.Model):
    TYPE_CHOICES = (
        ('urgent', 'Urgent'),
        ('alert', 'Alert'),
        ('success', 'Success'),
        ('info', 'Info'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"
