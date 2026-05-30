from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Donation, NGOMatching, VolunteerTask, Notification

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone_number', 'location_name', 'latitude', 'longitude', 'volunteer_points', 'ngo_capacity')
        read_only_fields = ('id', 'volunteer_points')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role', 'phone_number', 'location_name', 'latitude', 'longitude', 'ngo_capacity')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.username', read_only=True)
    donor_phone = serializers.CharField(source='donor.phone_number', read_only=True)

    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ('id', 'donor', 'freshness_score', 'urgency_level', 'safe_duration_hours', 'pickup_priority', 'ai_recommendations', 'co2_reduction_kg', 'cnn_confidence', 'status', 'created_at')


class NGOMatchingSerializer(serializers.ModelSerializer):
    ngo_name = serializers.CharField(source='ngo.username', read_only=True)
    ngo_phone = serializers.CharField(source='ngo.phone_number', read_only=True)
    ngo_location = serializers.CharField(source='ngo.location_name', read_only=True)
    ngo_capacity = serializers.CharField(source='ngo.ngo_capacity', read_only=True)

    class Meta:
        model = NGOMatching
        fields = '__all__'


class VolunteerTaskSerializer(serializers.ModelSerializer):
    volunteer_name = serializers.CharField(source='volunteer.username', read_only=True)
    volunteer_phone = serializers.CharField(source='volunteer.phone_number', read_only=True)
    donation_details = DonationSerializer(source='donation', read_only=True)
    ngo_details = serializers.SerializerMethodField()

    class Meta:
        model = VolunteerTask
        fields = '__all__'
        read_only_fields = ('id', 'assigned_at', 'otp_code', 'otp_verified_at', 'completion_points_awarded')

    def get_ngo_details(self, obj):
        try:
            match = NGOMatching.objects.get(donation=obj.donation)
            return {
                'id': match.ngo.id,
                'name': match.ngo.username,
                'phone': match.ngo.phone_number,
                'location': match.ngo.location_name,
                'latitude': match.ngo.latitude,
                'longitude': match.ngo.longitude
            }
        except NGOMatching.DoesNotExist:
            return None


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
