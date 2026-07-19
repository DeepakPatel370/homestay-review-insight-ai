import os
from fpdf import FPDF

class DeliverablePDF(FPDF):
    def header(self):
        # Header banner
        self.set_text_color(15, 23, 42) # slate-900
        self.set_font('helvetica', 'B', 15)
        self.cell(0, 10, 'InsightStay AI - AI Feature Integration Verification', border=0, ln=True, align='L')
        self.set_font('helvetica', '', 9)
        self.set_text_color(100, 116, 139) # slate-500
        self.cell(0, 5, 'Internship Project Deliverables - Week 7: AI Feature Integration & Prompt Engineering', border=0, ln=True, align='L')
        
        # Horizontal divider line
        self.set_draw_color(226, 232, 240) # slate-200
        self.line(10, 26, 200, 26)
        self.ln(12)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(148, 163, 184) # slate-400
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def create_report():
    pdf = DeliverablePDF(orientation='P', unit='mm', format='A4')
    pdf.set_margins(10, 10, 10)
    pdf.set_auto_page_break(auto=True, margin=15)
    
    screenshots_dir = r'c:\Users\ASUS\Desktop\TBI-GUI\homestay-review-insight-ai\screenshots'
    output_filename = r'c:\Users\ASUS\Desktop\TBI-GUI\W7_AIFeatureDemo_TBI-26100216.pdf'
    output_filename_inner = r'c:\Users\ASUS\Desktop\TBI-GUI\homestay-review-insight-ai\W7_AIFeatureDemo_TBI-26100216.pdf'

    slides = [
        {
            'title': '1. AI Feature Input Screen - User Input & Tone Selection Form',
            'filename': 'w7_ai_input_screen.png',
            'caption': 'Figure 1: User Input Form. The user can specify property custom name, paste or write a homestay review message, and select from multiple target response tones (Professional, Empathetic, Enthusiastic, De-escalating) or click preset sample reviews.'
        },
        {
            'title': '2. Mid-Request Loading State - Active Loader & Feedback',
            'filename': 'w7_ai_loading_state.png',
            'caption': 'Figure 2: Active Loading State Mid-Request. Submitting the form dispatches an asynchronous POST /api/ai/analyze request to Google Gemini AI. The UI renders the Loader component (from Week 3) with spinner animation and progress status text.'
        },
        {
            'title': '3. Final AI Output Display & Network Request (POST /api/ai/analyze 200 OK)',
            'filename': 'w7_ai_final_output.png',
            'caption': 'Figure 3: Final AI Analysis Output Display. The backend parses the structured JSON returned by Google Gemini AI, rendering the sentiment rating badge ("Mixed"), rating score (55/100), key theme tags ("Cleanliness", "Check-in Delay"), review summary, and copyable draft host reply. The DevTools Network tab verifies the POST /api/ai/analyze request completed with HTTP 200 OK.'
        },
        {
            'title': '4. Graceful Error Handling & Error Toast Notification Verification',
            'filename': 'w7_ai_error_state.png',
            'caption': 'Figure 4: Error Handling & Error Toast Notification. If an API call fails, encounters a rate limit (429), or times out, the backend handles the exception gracefully, returning an HTTP error response. The frontend displays an Error Toast notification alongside an inline error alert box with a retry option.'
        }
    ]

    for slide in slides:
        pdf.add_page()
        
        # Add slide title
        pdf.set_text_color(30, 41, 59) # slate-800
        pdf.set_font('helvetica', 'B', 12)
        pdf.cell(0, 8, slide['title'], border=0, ln=True, align='L')
        pdf.ln(2)

        # Image placement
        img_path = os.path.join(screenshots_dir, slide['filename'])
        if os.path.exists(img_path):
            pdf.image(img_path, x=15, y=pdf.get_y(), w=180)
            pdf.ln(116) # Skip height of image + margin
        else:
            pdf.set_text_color(239, 68, 68)
            pdf.cell(0, 10, f'[Image file not found: {slide["filename"]}]', border=1, ln=True, align='C')
            pdf.ln(10)

        # Add caption
        pdf.set_text_color(71, 85, 105) # slate-600
        pdf.set_font('helvetica', '', 9.5)
        pdf.multi_cell(0, 5, slide['caption'], border=0, align='L')
        pdf.ln(5)

    # Save PDF output
    pdf.output(output_filename)
    pdf.output(output_filename_inner)
    print(f'PDF successfully generated and saved to: {output_filename}')

if __name__ == '__main__':
    create_report()
