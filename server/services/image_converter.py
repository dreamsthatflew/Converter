import os
from PIL import Image
from typing import Tuple

class ImageConverter:
    """Handles image format conversions using Pillow"""
    
    SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff']
    
    def convert(self, input_path: str, output_path: str, target_format: str) -> Tuple[bool, str]:
        """
        Convert an image to the target format
        
        Args:
            input_path: Path to input file
            output_path: Path to output file
            target_format: Target format (jpg, png, webp, etc.)
        
        Returns:
            Tuple of (success, error_message)
        """
        try:
            target_format = target_format.lower()
            
            if target_format not in self.SUPPORTED_FORMATS:
                return False, f"Unsupported format: {target_format}"
            
            # Open and convert
            with Image.open(input_path) as img:
                # Handle transparency for formats that don't support it
                if target_format in ['jpg', 'jpeg'] and img.mode in ('RGBA', 'LA', 'P'):
                    # Create white background
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                
                # Convert mode if needed
                if target_format == 'png' and img.mode not in ('RGBA', 'RGB'):
                    img = img.convert('RGBA')
                elif target_format in ['jpg', 'jpeg'] and img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Save with appropriate settings
                if target_format in ['jpg', 'jpeg']:
                    img.save(output_path, format='JPEG', quality=95, optimize=True)
                elif target_format == 'png':
                    img.save(output_path, format='PNG', optimize=True)
                elif target_format == 'webp':
                    img.save(output_path, format='WEBP', quality=90)
                else:
                    img.save(output_path, format=target_format.upper())
            
            return True, ""
        
        except Exception as e:
            return False, f"Image conversion error: {str(e)}"
