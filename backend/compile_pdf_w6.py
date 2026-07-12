import os
from fpdf import FPDF

class DeliverablePDF(FPDF):
    def header(self):
        # Draw elegant brand header
        self.set_text_color(15, 23, 42) # slate-900
        self.set_font('helvetica', 'B', 15)
        self.cell(0, 10, 'InsightStay AI - JWT and OAuth Security Verification', border=0, ln=True, align='L')
        self.set_font('helvetica', '', 9)
        self.set_text_color(100, 116, 139) # slate-500
        self.cell(0, 5, 'Internship Project Deliverables - Week 6: Authentication & Security Basics', border=0, ln=True, align='L')
        
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
    output_filename = r'c:\Users\ASUS\Desktop\TBI-GUI\W6_AuthFlowScreenshots_TBI-26100216.pdf'
    output_filename_inner = r'c:\Users\ASUS\Desktop\TBI-GUI\homestay-review-insight-ai\W6_AuthFlowScreenshots_TBI-26100216.pdf'

    slides = [
        {
            'title': '1. Route Protection - Redirection from /dashboard to /login',
            'filename': 'w6_auth_redirect.png',
            'caption': 'Figure 1: Authentication Guard Redirection. An unauthenticated user attempts to visit the protected /dashboard page directly. The React Route Guard component detects that there is no session JWT, prevents page rendering, and automatically redirects the user to /login with a Toast warning.'
        },
        {
            'title': '2. User Registration - Create Account Form Input',
            'filename': 'w6_auth_reg_form.png',
            'caption': 'Figure 2: Registration screen. Toggling register mode displays name, email, and password fields. Inputs are validated in both client-side React code and server-side Zod schemas.'
        },
        {
            'title': '3. User Registration - Success Notification',
            'filename': 'w6_auth_register_success.png',
            'caption': 'Figure 3: Registration Success. Submitting the credentials to POST /api/auth/register hashes the password using bcrypt with 12 salt rounds, registers the document in MongoDB, and triggers a success Toast. The plain text password is never stored or returned.'
        },
        {
            'title': '4. User Login - Credentials Verification & Redirect',
            'filename': 'w6_auth_login_success.png',
            'caption': 'Figure 4: User Login Success. Entering correct credentials to POST /api/auth/login verifies the password, returns a signed JWT token, saves the token to localStorage, and routes the authenticated session safely into the dashboard.'
        },
        {
            'title': '5. OAuth Login - Google Account Consent Screen',
            'filename': 'w6_auth_oauth_consent.png',
            'caption': 'Figure 5: Google OAuth Flow Consent Screen. Clicking "Continue with Google" redirects the browser to the backend OAuth initialization. The Express backend serves a visual simulated Google Consent window requesting basic profile scope approval, mimicking real Passport.js behavior.'
        },
        {
            'title': '6. OAuth Login - Callback Handled & Dashboard State',
            'filename': 'w6_auth_oauth_success.png',
            'caption': 'Figure 6: Logged-in OAuth Dashboard. Clicking Allow handles the redirection callback, registers the OAuth user inside MongoDB, signs the JWT, and redirects the browser back to the frontend /oauth-success page, landing the Google guest user onto the secure dashboard.'
        },
        {
            'title': '7. Security Basics - API Rate Limiter triggering 429 Status',
            'filename': 'w6_auth_ratelimit.png',
            'caption': 'Figure 7: DevTools Network showing rate limiter and successful JWT response. Excessive failed authentication hits (more than 5 requests per 15 minutes) trigger the express-rate-limit middleware, which rejects all subsequent hits with a clean 429 Too Many Requests response.'
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
