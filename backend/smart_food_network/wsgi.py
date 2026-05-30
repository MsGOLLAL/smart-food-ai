import os
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
        with open('/tmp/migrated', 'w') as f:
            f.write('1')
        print("=== Serverless Auto-Migrations Completed successfully ===")
    except Exception as e:
        print(f"Serverless auto-migration warning: {e}")
