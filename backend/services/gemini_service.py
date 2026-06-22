import os
import logging
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import GenerateContentResponse

# Configure logging
logger = logging.getLogger(__name__)

# Load environment variables explicitly from backend/.env
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(backend_dir, ".env")
load_dotenv(dotenv_path=env_path)

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    logger.info("Gemini API key loaded successfully for grammar correction and summarization.")
else:
    logger.warning("GEMINI_API_KEY environment variable is not set in backend/.env. Gemini services might fail.")

def correct_isl_grammar(raw_text: str) -> str:
    """
    Correct the grammar of a raw ISL sentence using Gemini API.

    Rules:
    - Preserve meaning.
    - Do not add information.
    - Return only the corrected sentence.
    - If the sentence is already correct, return it unchanged.

    Args:
        raw_text (str): The raw sign language gesture words.

    Returns:
        str: The grammatically corrected English sentence.
    """
    if not raw_text or not raw_text.strip():
        return raw_text

    if not api_key:
        logger.error("Gemini API key is not configured. Falling back to raw text.")
        return raw_text

    prompt = f"""You are an expert in Indian Sign Language translation.

Convert the following raw ISL sentence into natural, grammatically correct English.

Rules:
* Preserve meaning.
* Do not add information.
* Return only the corrected sentence.
* If sentence is already correct, return it unchanged.

Sentence:
{raw_text}"""

    import time
    from google.api_core.exceptions import ResourceExhausted

    for attempt in range(3):
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            response: GenerateContentResponse = model.generate_content(
                prompt,
                generation_config={"temperature": 0.0}
            )
            
            if response and response.text:
                corrected_text = response.text.strip()
                if (corrected_text.startswith('"') and corrected_text.endswith('"')) or \
                   (corrected_text.startswith("'") and corrected_text.endswith("'")):
                    corrected_text = corrected_text[1:-1].strip()
                return corrected_text
            else:
                logger.error("Gemini API returned an empty response.")
                return raw_text

        except ResourceExhausted as re:
            if attempt < 2:
                logger.warning(f"Gemini API rate limit hit in grammar correction. Retrying in 1.5s (attempt {attempt+1}/3)...")
                time.sleep(1.5)
            else:
                logger.error(f"Gemini API rate limit exceeded during grammar correction: {re}")
                return raw_text
        except Exception as e:
            logger.error(f"Gemini API failure during grammar correction: {str(e)}", exc_info=True)
            return raw_text
    return raw_text

def generate_conversation_summary(conversation_text: str) -> str:
    """
    Summarize the conversation using Gemini API.

    Args:
        conversation_text (str): The structured chat transcript.

    Returns:
        str: The summary string, or empty string on failure.
    """
    if not conversation_text or not conversation_text.strip():
        return "No conversation recorded."

    if not api_key:
        logger.error("Gemini API key is not configured for summarization.")
        return "Summary unavailable (API key not set)."

    prompt = f"""Summarize the following conversation in less than 150 words.

Focus on:
* Main discussion
* Important requests
* Overall context

Return only the summary.

Conversation:
{conversation_text}"""

    import time
    from google.api_core.exceptions import ResourceExhausted

    for attempt in range(3):
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            response: GenerateContentResponse = model.generate_content(
                prompt,
                generation_config={"temperature": 0.2}
            )

            if response and response.text:
                return response.text.strip()
            else:
                logger.error("Gemini API returned an empty summary response.")
                return "Summary unavailable."

        except ResourceExhausted as re:
            if attempt < 2:
                logger.warning(f"Gemini API rate limit hit in summarization. Retrying in 1.5s (attempt {attempt+1}/3)...")
                time.sleep(1.5)
            else:
                logger.error(f"Gemini API rate limit exceeded during summarization: {re}")
                return "Summary unavailable due to rate limits."
        except Exception as e:
            logger.error(f"Gemini API failure during summarization: {str(e)}", exc_info=True)
            return "Summary unavailable."
    return "Summary unavailable."

