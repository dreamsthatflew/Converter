import os
import uuid
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from services.image_converter import ImageConverter
from services.audio_converter import AudioConverter
from services.video_converter import VideoConverter
from services.document_converter import DocumentConverter
from utils.file_utils import allowed_file, get_file_extension, cleanup_old_files
import magic

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['CONVERTED_FOLDER'] = os.path.join(os.path.dirname(__file__), 'converted')
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['CONVERTED_FOLDER'], exist_ok=True)

converters = {
    'image': ImageConverter(),
    'audio': AudioConverter(),
    'video': VideoConverter(),
    'document': DocumentConverter()
}

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/convert', methods=['POST'])
def convert_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    target_format = request.form.get('targetFormat')
    category = request.form.get('category')
    
    if not target_format or not category:
        return jsonify({'error': 'Missing target format or category'}), 400
    
    if category not in converters:
        return jsonify({'error': 'Invalid category'}), 400
    
    try:
        # Secure the filename and validate
        filename = secure_filename(file.filename)
        
        # Validate file extension before processing
        if not allowed_file(filename, category):
            return jsonify({'error': 'Invalid file type for this category'}), 400
        
        unique_id = str(uuid.uuid4())
        file_ext = get_file_extension(filename)
        input_filename = f"{unique_id}_{filename}"
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
        
        file.save(input_path)
        
        # Validate MIME type matches category
        try:
            mime = magic.Magic(mime=True)
            file_mime = mime.from_file(input_path)
            
            # Validate MIME type against expected categories
            valid_mimes = {
                'image': ['image/'],
                'audio': ['audio/'],
                'video': ['video/'],
                'document': ['application/pdf', 'application/msword', 'application/vnd', 'application/rtf', 'text/']
            }
            
            if category in valid_mimes:
                if not any(file_mime.startswith(prefix) for prefix in valid_mimes[category]):
                    os.remove(input_path)
                    return jsonify({'error': f'File MIME type {file_mime} does not match category {category}'}), 400
        except Exception as e:
            # If MIME validation fails, remove file and return error
            if os.path.exists(input_path):
                os.remove(input_path)
            return jsonify({'error': f'File validation failed: {str(e)}'}), 400
        
        # Convert the file
        converter = converters[category]
        output_filename = f"{unique_id}_converted.{target_format}"
        output_path = os.path.join(app.config['CONVERTED_FOLDER'], output_filename)
        
        success, error = converter.convert(input_path, output_path, target_format)
        
        if not success:
            # Cleanup
            if os.path.exists(input_path):
                os.remove(input_path)
            return jsonify({'error': error or 'Conversion failed'}), 500
        
        # Cleanup input file
        if os.path.exists(input_path):
            os.remove(input_path)
        
        # Return download URL
        return jsonify({
            'success': True,
            'downloadUrl': f'/api/download/{output_filename}',
            'filename': output_filename
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        file_path = os.path.join(app.config['CONVERTED_FOLDER'], filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.before_request
def before_request():
    # Cleanup old files (older than 1 hour)
    cleanup_old_files(app.config['UPLOAD_FOLDER'], max_age_hours=1)
    cleanup_old_files(app.config['CONVERTED_FOLDER'], max_age_hours=1)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=False)
