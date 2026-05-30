# build_files.sh
echo "=== Start Django Backend Build Pipeline ==="

# Install python dependencies from the backend folder
echo "Installing pip requirements..."
pip install -r backend/requirements.txt

# Collect static files using the backend manage.py
echo "Collecting static assets..."
python backend/manage.py collectstatic --noinput --clear

echo "=== Django Backend Build Pipeline Completed ==="
