# build_files.sh
echo "=== Start Django Backend Build Pipeline ==="

# Install python dependencies from the backend folder
echo "Installing pip requirements..."
pip install -r backend/requirements.txt

# Collect static files using the backend manage.py
echo "Collecting static assets..."
python backend/manage.py collectstatic --noinput --clear

# Copy collected static files to root so Vercel static builder finds them in the expected output directory
echo "Moving collected static files to root..."
mkdir -p staticfiles
cp -r backend/staticfiles/. staticfiles/
rm -rf backend/staticfiles

echo "=== Django Backend Build Pipeline Completed ==="
