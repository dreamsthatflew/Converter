# Professional File Converter - Replit Project

## Overview
A production-ready web-based file converter with real conversion capabilities and a professional dark-themed UI. Supports multiple file format categories (Audio, Image, Video, Document) with actual server-side conversion using industry-standard tools.

**Current State**: Fully functional full-stack application with React frontend and Flask backend

## Project Structure

### Frontend (`/src`)
- `src/main.tsx` - React application entry point
- `src/App.tsx` - Main app component with state management
- `src/components/` - React components
  - `Header.tsx` - Application header
  - `FileConverter.tsx` - File upload and conversion UI
  - `ConversionHistory.tsx` - Conversion history and download management
- `src/index.css` - Global styles with dark theme
- `vite.config.ts` - Vite configuration (dev server on port 5000)
- `tsconfig.json` - TypeScript configuration

### Backend (`/server`)
- `app.py` - Flask API server (port 8000)
- `services/` - Conversion service modules
  - `image_converter.py` - Image conversion using Pillow
  - `audio_converter.py` - Audio conversion using FFmpeg
  - `video_converter.py` - Video conversion using FFmpeg
  - `document_converter.py` - Document conversion using Pandoc
- `utils/file_utils.py` - File handling utilities
- `uploads/` - Temporary upload storage
- `converted/` - Converted file storage (auto-cleanup after 1 hour)

### Configuration
- `start.sh` - Startup script for both frontend and backend
- `package.json` - Node.js dependencies and scripts
- `.gitignore` - Git ignore patterns

## Technologies

### Frontend Stack
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Modern dark theme styling

### Backend Stack
- **Flask** - Python web framework
- **FFmpeg** - Audio & video conversion
- **Pillow (PIL)** - Image processing
- **Pandoc** - Document conversion
- **ImageMagick** - Additional image processing
- **Python Magic** - MIME type detection

### Supported Formats

#### Audio Conversion
MP3, WAV, FLAC, AAC, OGG, M4A

#### Video Conversion
MP4, AVI, MOV, WMV, FLV, MKV

#### Image Conversion
JPG, PNG, WEBP, GIF, BMP, TIFF

#### Document Conversion
PDF, DOCX, TXT, RTF, ODT, HTML, MD

## Architecture

The application uses a client-server architecture:

1. **Frontend (Port 5000)**: React SPA handles UI, file selection, and conversion status display
2. **Backend (Port 8000)**: Flask API processes uploads, executes conversions, and serves downloads
3. **Proxy**: Vite dev server proxies `/api` requests to the Flask backend

## Security Features
- File size limit: 100MB maximum
- MIME type validation
- Secure filename handling
- Automatic file cleanup (1-hour retention)
- CORS protection
- Input sanitization

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/convert` - Upload and convert file
- `GET /api/download/<filename>` - Download converted file

## Workflow

The application runs both servers simultaneously via `start.sh`:
1. Flask backend starts on localhost:8000
2. Vite frontend starts on 0.0.0.0:5000
3. Frontend proxies API requests to backend
4. Users access the app via port 5000

## Development Notes
- Frontend hot-reloads on code changes (Vite HMR)
- Backend requires manual restart for changes
- Converted files auto-delete after 1 hour
- No database required (stateless design)

## Setup Date
- Original import: November 07, 2025
- Full-stack rebuild: November 07, 2025
