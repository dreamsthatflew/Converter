import os
import subprocess
import shutil
from typing import Tuple

class AudioConverter:
    """Handles audio format conversions using FFmpeg"""
    
    SUPPORTED_FORMATS = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a']
    
    def __init__(self):
        """Check if FFmpeg is available"""
        self.has_ffmpeg = shutil.which('ffmpeg') is not None
    
    def convert(self, input_path: str, output_path: str, target_format: str) -> Tuple[bool, str]:
        """
        Convert an audio file to the target format
        
        Args:
            input_path: Path to input file
            output_path: Path to output file
            target_format: Target format (mp3, wav, flac, etc.)
        
        Returns:
            Tuple of (success, error_message)
        """
        try:
            if not self.has_ffmpeg:
                return False, "FFmpeg is not installed. Audio conversion is not available."
            
            target_format = target_format.lower()
            
            if target_format not in self.SUPPORTED_FORMATS:
                return False, f"Unsupported format: {target_format}"
            
            # Build FFmpeg command
            cmd = ['ffmpeg', '-i', input_path, '-y']
            
            # Format-specific options
            if target_format == 'mp3':
                cmd.extend(['-codec:a', 'libmp3lame', '-qscale:a', '2'])
            elif target_format == 'wav':
                cmd.extend(['-codec:a', 'pcm_s16le'])
            elif target_format == 'flac':
                cmd.extend(['-codec:a', 'flac'])
            elif target_format == 'aac':
                cmd.extend(['-codec:a', 'aac', '-b:a', '192k'])
            elif target_format == 'ogg':
                cmd.extend(['-codec:a', 'libvorbis', '-qscale:a', '5'])
            elif target_format == 'm4a':
                cmd.extend(['-codec:a', 'aac', '-b:a', '192k'])
            
            cmd.append(output_path)
            
            # Execute conversion
            result = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=300  # 5 minute timeout
            )
            
            if result.returncode != 0:
                error_msg = result.stderr.decode('utf-8', errors='ignore')
                return False, f"FFmpeg error: {error_msg[:200]}"
            
            if not os.path.exists(output_path):
                return False, "Output file was not created"
            
            return True, ""
        
        except subprocess.TimeoutExpired:
            return False, "Conversion timeout (max 5 minutes)"
        except Exception as e:
            return False, f"Audio conversion error: {str(e)}"
