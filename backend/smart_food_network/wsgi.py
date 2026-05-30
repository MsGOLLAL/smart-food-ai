import os
import sys

# Add the backend root directory to the python search path to support Vercel serverless entrypoint imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_food_network.settings')
wsgi = get_wsgi_application()
app = wsgi

# Dynamic database migration check on Vercel container boot
if os.environ.get('VERCEL') == '1' and not os.path.exists('/tmp/migrated'):
    try:
        from django.core.management import call_command
        print("=== Triggering Serverless Auto-Migrations in /tmp ===")
        call_command('migrate', interactive=False)
        
        # Auto-seed default testing profiles
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if User.objects.count() == 0:
            print("=== Seeding default users for Vercel backend ===")
            users_to_create = [
                {
                    'username': 'admin',
                    'email': 'admin@smartfoodnetwork.org',
                    'role': 'admin',
                    'password': 'password123',
                    'location_name': 'Central Control Command Center',
                    'latitude': 12.9716,
                    'longitude': 77.5946,
                },
                {
                    'username': 'donor',
                    'email': 'donor@smartfoodnetwork.org',
                    'role': 'donor',
                    'password': 'password123',
                    'location_name': 'Indiranagar Food Hub',
                    'latitude': 12.9716,
                    'longitude': 77.5946,
                },
                {
                    'username': 'cmcafe',
                    'email': 'cmcafe@smartfoodnetwork.org',
                    'role': 'donor',
                    'password': 'password123',
                    'location_name': 'CM Cafe Indiranagar',
                    'latitude': 12.9720,
                    'longitude': 77.5950,
                },
                {
                    'username': 'oldagehomengo',
                    'email': 'oldagehome@smartfoodnetwork.org',
                    'role': 'ngo',
                    'password': 'password123',
                    'location_name': 'Malleshwaram Care Center',
                    'latitude': 12.9830,
                    'longitude': 77.5820,
                    'ngo_capacity': 'Medium',
                },
                {
                    'username': 'agaashram',
                    'email': 'agaashram@smartfoodnetwork.org',
                    'role': 'ngo',
                    'password': 'password123',
                    'location_name': 'Aga Ashram Center',
                    'latitude': 12.9840,
                    'longitude': 77.5830,
                    'ngo_capacity': 'Large',
                },
                {
                    'username': 'gollal',
                    'email': 'gollal@smartfoodnetwork.org',
                    'role': 'volunteer',
                    'password': 'password123',
                    'location_name': 'MG Road Transit Point',
                    'latitude': 12.9680,
                    'longitude': 77.6010,
                },
                {
                    'username': 'gollalmanasunagi',
                    'email': 'gollalmanasunagi@smartfoodnetwork.org',
                    'role': 'volunteer',
                    'password': 'password123',
                    'location_name': 'Volunteer Transit Hub',
                    'latitude': 12.9690,
                    'longitude': 77.6020,
                },
            ]
            for u_data in users_to_create:
                user = User.objects.create_user(
                    username=u_data['username'],
                    email=u_data['email'],
                    password=u_data['password'],
                    role=u_data['role'],
                    location_name=u_data['location_name'],
                    latitude=u_data['latitude'],
                    longitude=u_data['longitude'],
                    ngo_capacity=u_data.get('ngo_capacity', 'Medium')
                )
                if u_data['role'] == 'admin':
                    user.is_superuser = True
                    user.is_staff = True
                    user.save()
            print("=== Default users seeded successfully for Vercel ===")
            
        with open('/tmp/migrated', 'w') as f:
            f.write('1')
        print("=== Serverless Auto-Migrations Completed successfully ===")
    except Exception as e:
        print(f"Serverless auto-migration warning: {e}")
