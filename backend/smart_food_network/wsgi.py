import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_food_network.settings')
wsgi = get_wsgi_application()
app = wsgi
