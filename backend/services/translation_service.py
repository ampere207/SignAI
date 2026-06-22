import os
import logging
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import GenerateContentResponse

logger = logging.getLogger(__name__)

# Load environment variables explicitly from backend/.env
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(backend_dir, ".env")
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    logger.info("Gemini API key loaded successfully for translation service.")
else:
    logger.warning("GEMINI_API_KEY environment variable is not set in backend/.env for translation.")

def translate_to_kannada(text: str) -> str:
    """
    Translate an English sentence into natural conversational Kannada using Gemini API.

    Rules:
    - Preserve meaning.
    - Use proper Kannada script.
    - Do not transliterate.
    - Return only Kannada text.

    Args:
        text (str): The English text to translate.

    Returns:
        str: The Kannada translation or the original text if translation fails.
    """
    if not text or not text.strip():
        return text

    if not api_key:
        logger.error("Gemini API key is not configured for translation. Falling back to original text.")
        return text

    prompt = f"""You are an expert translator.

Translate the following English sentence into natural conversational Kannada.

Rules:
* Preserve meaning.
* Use proper Kannada script.
* Do not transliterate.
* Return only Kannada text.

Sentence:
{text}"""

    import time
    from google.api_core.exceptions import ResourceExhausted

    for attempt in range(3):
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            response: GenerateContentResponse = model.generate_content(
                prompt,
                generation_config={"temperature": 0.1}
            )

            if response and response.text:
                kannada_text = response.text.strip()
                return kannada_text
            else:
                logger.error("Gemini API returned an empty translation response.")
                return text

        except ResourceExhausted as re:
            if attempt < 2:
                logger.warning(f"Gemini API rate limit hit in translation. Retrying in 1.5s (attempt {attempt+1}/3)...")
                time.sleep(1.5)
            else:
                logger.error(f"Gemini API rate limit exceeded during translation: {re}")
                return text
        except Exception as e:
            logger.error(f"Gemini API failure during translation: {str(e)}", exc_info=True)
            return text
    return text
