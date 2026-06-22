import os
import logging
import time
import glob
import uuid
from gtts import gTTS

logger = logging.getLogger(__name__)

# Base directory for TTS audio files
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
TTS_DIR = os.path.join(STATIC_DIR, "tts")

# Ensure directories exist
os.makedirs(TTS_DIR, exist_ok=True)

def cleanup_old_files(max_age_seconds: int = 300) -> None:
    """
    Delete audio files in the TTS directory that are older than max_age_seconds.
    Default: 5 minutes (300 seconds).
    """
    try:
        current_time = time.time()
        pattern = os.path.join(TTS_DIR, "*.mp3")
        for file_path in glob.glob(pattern):
            try:
                creation_time = os.path.getmtime(file_path)
                if current_time - creation_time > max_age_seconds:
                    os.remove(file_path)
                    logger.debug(f"Deleted old TTS file: {file_path}")
            except Exception as fe:
                logger.warning(f"Failed to delete old file {file_path}: {fe}")
    except Exception as e:
        logger.error(f"Error during TTS cleanup: {e}")

def generate_kannada_audio(text: str) -> str:
    """
    Generate speech audio for Kannada text.
    Saves a temporary mp3 file and returns the relative path.
    Cleans up old files.

    Args:
        text (str): Kannada text to speak.

    Returns:
        str: Relative URL/path of the generated mp3 file, e.g. "static/tts/UUID.mp3"
    """
    # Clean up old files first
    cleanup_old_files()

    try:
        # Generate unique filename
        filename = f"tts_{uuid.uuid4().hex}.mp3"
        file_path = os.path.join(TTS_DIR, filename)

        # Generate audio using gTTS (lang="kn")
        tts = gTTS(text=text, lang="kn")
        tts.save(file_path)

        logger.info(f"Generated Kannada audio for: '{text[:15]}...' -> {file_path}")
        
        # Return relative URL/path that can be accessed via static mount or custom endpoint
        # We can construct the path relative to the app root or just the filename.
        # Returning the file path so the API router can serve it or map it.
        return file_path

    except Exception as e:
        logger.error(f"Failed to generate Kannada TTS audio: {e}", exc_info=True)
        raise e
