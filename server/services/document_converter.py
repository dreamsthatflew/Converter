import os
import subprocess
import shutil
from typing import Tuple

class DocumentConverter:
    """Handles document format conversions using pandoc"""
    
    SUPPORTED_FORMATS = ['pdf', 'docx', 'txt', 'rtf', 'odt', 'html', 'md']
    
    def __init__(self):
        """Check if pandoc is available (not required for TXT conversions)"""
        self.has_pandoc = shutil.which('pandoc') is not None
    
    def convert(self, input_path: str, output_path: str, target_format: str) -> Tuple[bool, str]:
        """
        Convert a document to the target format
        
        Args:
            input_path: Path to input file
            output_path: Path to output file
            target_format: Target format (pdf, docx, txt, etc.)
        
        Returns:
            Tuple of (success, error_message)
        """
        try:
            target_format = target_format.lower()
            
            if target_format not in self.SUPPORTED_FORMATS:
                return False, f"Unsupported format: {target_format}"
            
            # Get input format
            input_ext = os.path.splitext(input_path)[1].lower().lstrip('.')
            
            # Simple text conversions
            if input_ext == 'txt' and target_format == 'txt':
                # Just copy
                import shutil
                shutil.copy2(input_path, output_path)
                return True, ""
            
            # Try pandoc for document conversions
            if not self.has_pandoc and target_format != 'txt':
                return False, "Pandoc is not installed. Only TXT conversions are supported without it."
            
            try:
                cmd = ['pandoc', input_path, '-o', output_path]
                
                # Add format-specific options
                if target_format == 'pdf':
                    cmd.extend(['--pdf-engine=pdflatex'])
                
                result = subprocess.run(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=120
                )
                
                if result.returncode == 0 and os.path.exists(output_path):
                    return True, ""
                
                # If pandoc fails, try simple text extraction for txt format
                if target_format == 'txt':
                    return self._extract_text(input_path, output_path)
                
                error_msg = result.stderr.decode('utf-8', errors='ignore')
                return False, f"Pandoc error: {error_msg[:200]}"
            
            except FileNotFoundError:
                # Pandoc not available, try simple text extraction for txt
                if target_format == 'txt':
                    return self._extract_text(input_path, output_path)
                return False, "Pandoc is not installed"
        
        except subprocess.TimeoutExpired:
            return False, "Conversion timeout (max 2 minutes)"
        except Exception as e:
            return False, f"Document conversion error: {str(e)}"
    
    def _extract_text(self, input_path: str, output_path: str) -> Tuple[bool, str]:
        """Simple text extraction as fallback"""
        try:
            # Try to read as text
            with open(input_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True, ""
        except Exception as e:
            return False, f"Text extraction failed: {str(e)}"
