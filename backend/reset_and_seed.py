import os
import sys
from pathlib import Path
import django

# Paths
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / 'db.sqlite3'

# Remove existing sqlite db
if DB_PATH.exists():
    print(f"Removing existing database at {DB_PATH}...")
    try:
        # Close any active handle by forcing garbage collection and deleting
        import gc
        gc.collect()
        os.remove(DB_PATH)
        print("Database removed successfully.")
    except Exception as e:
        print(f"Error removing database: {e}")
        sys.exit(1)
else:
    print("No existing database found.")

# Add backend directory to python path
sys.path.append(str(BASE_DIR))

# Setup Django Environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smart_food_network.settings")
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model

print("Applying clean database migrations...")
call_command('migrate', interactive=False)
print("Migrations applied successfully.")

User = get_user_model()

# Exact active accounts reconstructed clean
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

print("Seeding clean default users...")
for u_data in users_to_create:
    username = u_data['username']
    role = u_data['role']
    password = u_data['password']
    
    user = User.objects.create_user(
        username=username,
        email=u_data['email'],
        password=password,
        role=role,
        location_name=u_data['location_name'],
        latitude=u_data['latitude'],
        longitude=u_data['longitude'],
        ngo_capacity=u_data.get('ngo_capacity', 'Medium')
    )
    
    if role == 'admin':
        user.is_superuser = True
        user.is_staff = True
        user.save()
        
    print(f"-> Created {role.upper()}: username='{username}', password='{password}'")

print("\nAll database tables initialized and default users seeded successfully!")
