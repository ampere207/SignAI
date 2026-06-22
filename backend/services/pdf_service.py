import os
import urllib.request
import logging
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

logger = logging.getLogger(__name__)

# Font configuration
FONT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "fonts")
FONT_PATH = os.path.join(FONT_DIR, "NotoSansKannada-Regular.ttf")
FONT_URL = "https://raw.githubusercontent.com/notofonts/noto-fonts/main/hinted/ttf/NotoSansKannada/NotoSansKannada-Regular.ttf"

def ensure_kannada_font() -> str:
    """
    Ensure the Kannada TrueType font is available locally.
    Downloads it from Google Noto Fonts if not present.
    Returns the font name to use, fallback to 'Helvetica' on failure.
    """
    if os.path.exists(FONT_PATH):
        try:
            pdfmetrics.registerFont(TTFont("NotoSansKannada", FONT_PATH))
            return "NotoSansKannada"
        except Exception as e:
            logger.error(f"Error registering local font: {e}")
            return "Helvetica"

    try:
        os.makedirs(FONT_DIR, exist_ok=True)
        logger.info(f"Downloading Kannada font to {FONT_PATH}...")
        # Download with timeout
        with urllib.request.urlopen(FONT_URL, timeout=15) as response:
            with open(FONT_PATH, "wb") as f:
                f.write(response.read())
        logger.info("Kannada font downloaded and saved.")
        
        pdfmetrics.registerFont(TTFont("NotoSansKannada", FONT_PATH))
        return "NotoSansKannada"
    except Exception as e:
        logger.error(f"Failed to download/register Kannada font: {e}", exc_info=True)
        return "Helvetica"

def generate_session_pdf(chat_history: list, session_id: str, summary_text: str) -> bytes:
    """
    Generate a professional transcript PDF containing the conversation details,
    raw and corrected text, Kannada translations, and a summary.

    Args:
        chat_history (list): List of chat messages.
        session_id (str): Unique session identifier.
        summary_text (str): Summarized text from Gemini.

    Returns:
        bytes: The PDF file bytes.
    """
    # Initialize font
    font_name = ensure_kannada_font()
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles to look premium
    primary_color = colors.HexColor("#2a065e")
    secondary_color = colors.HexColor("#6638B7")
    text_color = colors.HexColor("#333333")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=15
    )
    
    section_heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=secondary_color,
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )
    
    meta_style = ParagraphStyle(
        'Metadata',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#666666")
    )
    
    summary_style = ParagraphStyle(
        'SummaryText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=text_color
    )
    
    # Message styles
    msg_meta_style = ParagraphStyle(
        'MsgMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=secondary_color,
        spaceBefore=8,
        spaceAfter=2,
        keepWithNext=True
    )
    
    msg_raw_style = ParagraphStyle(
        'MsgRaw',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#777777")
    )
    
    msg_corrected_style = ParagraphStyle(
        'MsgCorrected',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=primary_color,
        spaceAfter=2
    )
    
    msg_kannada_style = ParagraphStyle(
        'MsgKannada',
        parent=styles['Normal'],
        fontName=font_name,
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#b30000"),
        spaceAfter=4
    )
    
    story = []
    
    # 1. Page Header / Title
    story.append(Paragraph("SignAI Conversation Transcript", title_style))
    
    # Metadata info
    current_time = datetime.now().strftime("%Y-%m-%d %I:%M %p")
    meta_text = f"<b>Date/Time:</b> {current_time}<br/><b>Session ID:</b> {session_id}"
    story.append(Paragraph(meta_text, meta_style))
    story.append(Spacer(1, 15))
    
    # 2. Conversation Summary Section
    if summary_text:
        story.append(Paragraph("Session Summary", section_heading_style))
        summary_p = Paragraph(summary_text, summary_style)
        
        # Summary Box
        summary_table = Table([[summary_p]], colWidths=[doc.width])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f3e8ff")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e9d5ff")),
            ('PADDING', (0,0), (-1,-1), 12),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 20))
    
    # 3. Transcript Heading
    story.append(Paragraph("Conversation Transcript", section_heading_style))
    story.append(Spacer(1, 5))
    
    # 4. Message Entries
    if not chat_history:
        story.append(Paragraph("No conversation recorded during this session.", summary_style))
    else:
        for idx, entry in enumerate(chat_history):
            timestamp = entry.get("timestamp") or entry.get("time") or ""
            speaker = str(entry.get("speaker", "deaf")).capitalize()
            raw_text = entry.get("raw_text") or entry.get("rawText") or ""
            corrected_text = entry.get("corrected_text") or entry.get("correctedText") or ""
            kannada_text = entry.get("kannada_text") or entry.get("kannadaText") or entry.get("translated_text") or entry.get("translatedText") or ""
            
            # Format speaker and time
            speaker_meta = f"[{timestamp}] <b>{speaker}</b>"
            
            msg_story = []
            msg_story.append(Paragraph(speaker_meta, msg_meta_style))
            
            if raw_text:
                msg_story.append(Paragraph(f"<b>Raw prediction:</b> {raw_text}", msg_raw_style))
            if corrected_text:
                msg_story.append(Paragraph(f"<b>Corrected:</b> {corrected_text}", msg_corrected_style))
            if kannada_text:
                msg_story.append(Paragraph(f"<b>Kannada:</b> {kannada_text}", msg_kannada_style))
            
            # Wrap in KeepTogether to prevent single message breaking across pages
            story.append(KeepTogether(msg_story))
            
            # Add separator line except for last entry
            if idx < len(chat_history) - 1:
                sep_table = Table([[""]], colWidths=[doc.width], rowHeights=[1])
                sep_table.setStyle(TableStyle([
                    ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
                    ('TOPPADDING', (0,0), (-1,-1), 5),
                ]))
                story.append(sep_table)
                story.append(Spacer(1, 5))
    
    # Build Document
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
