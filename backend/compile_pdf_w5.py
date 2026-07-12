import os
from fpdf import FPDF

class DeliverablePDF(FPDF):
    def header(self):
        # Draw elegant brand header
        self.set_text_color(15, 23, 42) # slate-900
        self.set_font('helvetica', 'B', 16)
        self.cell(0, 10, 'InsightStay AI - Database CRUD Verification', border=0, ln=True, align='L')
        self.set_font('helvetica', '', 9)
        self.set_text_color(100, 116, 139) # slate-500
        self.cell(0, 5, 'Internship Project Deliverables - Week 5: Database Persistence', border=0, ln=True, align='L')
        
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
    output_filename = r'c:\Users\ASUS\Desktop\TBI-GUI\W5_CRUDVerification_TBI-26100216.pdf'
    output_filename_inner = r'c:\Users\ASUS\Desktop\TBI-GUI\homestay-review-insight-ai\W5_CRUDVerification_TBI-26100216.pdf'

    slides = [
        {
            'title': '1. READ Operation - Initial Dashboard History Load from MongoDB',
            'filename': 'w5_crud_read.png',
            'caption': 'Figure 1: Initial load of the dashboard history from the MongoDB database. The Recent Analyses History panel displays the 3 seeded reviews ("r1", "r2", "r3" equivalents) which are retrieved dynamically from the MongoDB collection. The metrics row shows 3 total reviews, 3.2 average rating, and 67% sentiment index, calculated from the persistent documents.'
        },
        {
            'title': '2. CREATE Operation - Analysis and Response Saved to MongoDB',
            'filename': 'w5_crud_create.png',
            'caption': 'Figure 2: Review Analysis & Creation. The host inputted review text for "Sunset Haven Villa" and clicked "Analyze & Generate Reply". The backend analyzed the text, saved the analysis report to the MongoDB database, and associated it with the property reference. The metrics row dynamically recalculated to show 4 total reviews, 3.6 average rating, and 75% sentiment index.'
        },
        {
            'title': '3. UPDATE Operation - Suggested Response Draft Modified in MongoDB',
            'filename': 'w5_crud_update.png',
            'caption': 'Figure 3: Inline Update of Reply Draft. The host clicked "View Draft Response" on the newly created review, edited the suggested response by prepending "UPDATED GUEST REPLY: ", and clicked "Save". This triggers a PUT request that updates the document field in MongoDB. The changes are successfully persisted to the database and reloaded.'
        },
        {
            'title': '4. DELETE Operation - Review Analysis Deleted from MongoDB',
            'filename': 'w5_crud_delete.png',
            'caption': 'Figure 4: Review Deletion. The host clicked "Delete" on the created review, which fired a DELETE request to the backend. The document is permanently removed from the MongoDB collection. The dashboard list reloaded to confirm removal, and the metrics row updated back to 3 total reviews, 3.2 average rating, and 67% sentiment index.'
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
            # Center image on A4 page with width 180
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
