import os
import subprocess
import shutil
from typing import Tuple

class VideoConverter:
    """Handles video format conversions using FFmpeg"""
    
    SUPPORTED_FORMATS = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv']
    
    def __init__(self):
        """Check if FFmpeg is available"""
        self.has_ffmpeg = shutil.which('ffmpeg') is not None
    
    def convert(self, input_path: str, output_path: str, target_format: str) -> Tuple[bool, str]:
        """
        Convert a video file to the target format
        
        Args:
            input_path: Path to input file
            output_path: Path to output file
            target_format: Target format (mp4, avi, mov, etc.)
        
        Returns:
            Tuple of (success, error_message)
        """
        try:
            if not self.has_ffmpeg:
                return False, "FFmpeg is not installed. Video conversion is not available."
            
            target_format = target_format.lower()
            
            if target_format not in self.SUPPORTED_FORMATS:
                return False, f"Unsupported format: {target_format}"
            
            # Build FFmpeg command
            cmd = ['ffmpeg', '-i', input_path, '-y']
            
            # Format-specific options for good quality and compatibility
            if target_format == 'mp4':
                cmd.extend([
                    '-codec:v', 'libx264',
                    '-preset', 'medium',
                    '-crf', '23',
                    '-codec:a', 'aac',
                    '-b:a', '192k'
                ])
            elif target_format == 'avi':
                cmd.extend([
                    '-codec:v', 'libx264',
                    '-codec:a', 'libmp3lame',
                    '-b:a', '192k'
                ])
            elif target_format == 'mov':
                cmd.extend([
                    '-codec:v', 'libx264',
                    '-codec:a', 'aac',
                    '-b:a', '192k'
                ])
            elif target_format == 'wmv':
                cmd.extend([
                    '-codec:v', 'wmv2',
                    '-codec:a', 'wmav2',
                    '-b:a', '192k'
                ])
            elif target_format == 'flv':
                cmd.extend([
                    '-codec:v', 'libx264',
                    '-codec:a', 'aac',
                    '-b:a', '128k'
                ])
            elif target_format == 'mkv':
                cmd.extend([
                    '-codec:v', 'libx264',
                    '-codec:a', 'aac',
                    '-b:a', '192k'
                ])
            
            cmd.append(output_path)
            
            # Execute conversion
            result = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=600  # 10 minute timeout for videos
            )
            
            if result.returncode != 0:
                error_msg = result.stderr.decode('utf-8', errors='ignore')
                return False, f"FFmpeg error: {error_msg[:200]}"
            
            if not os.path.exists(output_path):
                return False, "Output file was not created"
            
            return True, ""
        
        except subprocess.TimeoutExpired:
            return False, "Conversion timeout (max 10 minutes)"
        except Exception as e:
            return False, f"Video conversion error: {str(e)}"
