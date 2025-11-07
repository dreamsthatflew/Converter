# Professional File Converter

A production-ready web-based file converter with real conversion capabilities and a modern, professional UI. Built with React, TypeScript, Flask, and industry-standard conversion tools.

## 🚀 Features

### Real File Conversion
- ✅ **Audio**: MP3, WAV, FLAC, AAC, OGG, M4A (powered by FFmpeg)
- ✅ **Video**: MP4, AVI, MOV, WMV, FLV, MKV (powered by FFmpeg)
- ✅ **Images**: JPG, PNG, WEBP, GIF, BMP, TIFF (powered by Pillow)
- ✅ **Documents**: PDF, DOCX, TXT, RTF, ODT, HTML, MD (powered by Pandoc)

### Professional UI/UX
- 🎨 Modern dark theme design
- 📱 Fully responsive layout
- 🖱️ Drag & drop file upload
- 📊 Real-time conversion progress
- 📜 Conversion history with download links
- ⚡ Fast and intuitive interface

### Technical Highlights
- Built with React 19 + TypeScript
- Flask REST API backend
- FFmpeg for audio/video processing
- Pillow for image manipulation
- Automatic file cleanup
- MIME type validation
- 100MB file size limit

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- Axios
- Modern CSS3

**Backend:**
- Python 3.11
- Flask
- FFmpeg
- Pillow (PIL)
- Pandoc
- Python Magic

## 📖 How to Use

1. **Select Category**: Choose Audio, Video, Image, or Document
2. **Upload File**: Drag & drop or click to browse
3. **Choose Format**: Select your desired output format
4. **Convert**: Click "Convert File" button
5. **Download**: Download your converted file from the history

## 🔒 Security

- File size limits (100MB max)
- MIME type validation
- Secure filename handling
- Automatic cleanup (files deleted after 1 hour)
- CORS protection
- Input sanitization

## 🌐 Running Locally

The application is configured to run on Replit with:
- Frontend: http://localhost:5000
- Backend API: http://localhost:8000

Both servers start automatically via the workflow.

## 📝 License

MIT License - Open source and free to use!

## ⭐ Show Your Support

If you find this project useful, please give it a star!

---

**Note**: This is a fully functional file converter with real conversion capabilities, not a demo or simulation.
