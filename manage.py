#!/usr/bin/env python
# Root delegate manage.py for Vercel zero-config Django support
import os
import sys

if __name__ == "__main__":
    # Add backend subdirectory to python path so Django modules can be loaded
    sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smart_food_network.settings")
    
    # Run from the backend directory to ensure relative operations work
    os.chdir(os.path.join(os.path.dirname(__file__), 'backend'))
    
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
