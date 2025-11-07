import os
import time

ALLOWED_EXTENSIONS = {
    'image': {'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'},
    'audio': {'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'},
    'video': {'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'},
    'document': {'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'html', 'md'}
}

def allowed_file(filename: str, category: str = "") -> bool:
    """Check if file extension is allowed"""
    if '.' not in filename:
        return False
    
    ext = filename.rsplit('.', 1)[1].lower()
    
    if category:
        return ext in ALLOWED_EXTENSIONS.get(category, set())
    
    # Check all categories
    for extensions in ALLOWED_EXTENSIONS.values():
        if ext in extensions:
            return True
    return False

def get_file_extension(filename: str) -> str:
    """Get file extension without dot"""
    if '.' not in filename:
        return ''
    return filename.rsplit('.', 1)[1].lower()

def cleanup_old_files(directory: str, max_age_hours: int = 1):
    """Remove files older than max_age_hours"""
    try:
        now = time.time()
        max_age_seconds = max_age_hours * 3600
        
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            if os.path.isfile(file_path):
                file_age = now - os.path.getmtime(file_path)
                if file_age > max_age_seconds:
                    os.remove(file_path)
    except Exception as e:
        print(f"Cleanup error: {e}")
