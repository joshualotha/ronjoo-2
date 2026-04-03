<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Georgia', serif; color: #1C1812; margin: 0; padding: 0; background: #F2EBE0; }
        .container { max-width: 600px; margin: 0 auto; background: #FDFBF7; }
        .header { background: #1C1812; padding: 32px; text-align: center; }
        .header h1 { color: #D4A96A; font-size: 16px; margin: 0; letter-spacing: 3px; text-transform: uppercase; }
        .hero { padding: 48px 32px 32px; text-align: center; }
        .hero h2 { font-size: 28px; color: #1C1812; margin: 0 0 8px; font-style: italic; }
        .hero p { font-size: 15px; color: #1C1812; opacity: 0.6; margin: 0; line-height: 1.7; }
        .divider { width: 48px; height: 2px; background: #C4714A; margin: 24px auto; }
        .body { padding: 0 32px 32px; }
        .body p { font-size: 15px; line-height: 1.8; color: #1C1812; opacity: 0.7; }
        .summary { background: #F2EBE0; padding: 20px; margin: 24px 0; }
        .summary .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
        .summary .label { color: #1C1812; opacity: 0.4; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
        .summary .value { color: #1C1812; font-size: 14px; }
        .cta { text-align: center; padding: 16px 0 32px; }
        .cta a { display: inline-block; background: #C4714A; color: #FDFBF7; text-decoration: none; padding: 14px 32px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
        .whatsapp { text-align: center; margin-bottom: 32px; }
        .whatsapp a { color: #25D366; text-decoration: none; font-size: 14px; }
        .footer { padding: 24px 32px; text-align: center; font-size: 12px; color: #1C1812; opacity: 0.3; border-top: 1px solid #E8E0D5; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ronjoo Safaris</h1>
        </div>

        <div class="hero">
            <h2>Thank you, {{ $enquiry->guest_name }}</h2>
            <div class="divider"></div>
            <p>We've received your safari inquiry and our team is already on it.</p>
        </div>

        <div class="body">
            <p>
                One of our safari consultants will review your request and get back 
                to you <strong>within 4 hours</strong> (often much sooner). We'll craft 
                a personalized itinerary just for you.
            </p>

            @if($enquiry->safari_interest || $enquiry->preferred_dates || $enquiry->travelers)
            <div class="summary">
                @if($enquiry->safari_interest)
                <div style="margin-bottom: 8px;">
                    <div class="label">Safari</div>
                    <div class="value">{{ $enquiry->safari_interest }}</div>
                </div>
                @endif
                @if($enquiry->preferred_dates)
                <div style="margin-bottom: 8px;">
                    <div class="label">Preferred Dates</div>
                    <div class="value">{{ $enquiry->preferred_dates }}</div>
                </div>
                @endif
                @if($enquiry->travelers)
                <div style="margin-bottom: 8px;">
                    <div class="label">Travelers</div>
                    <div class="value">{{ $enquiry->travelers }}</div>
                </div>
                @endif
            </div>
            @endif

            <p>
                In the meantime, feel free to browse our 
                <a href="https://ronjoosafaris.co.tz/safaris" style="color: #C4714A;">safari packages</a> 
                or reach out directly on WhatsApp for a quicker response.
            </p>
        </div>

        <div class="whatsapp">
            <a href="https://wa.me/255123456789?text=Hi%20Ronjoo%20Safaris%2C%20I%20just%20submitted%20an%20inquiry">
                💬 Chat with us on WhatsApp
            </a>
        </div>

        <div class="footer">
            <p>Ronjoo Safaris · Arusha, Tanzania</p>
            <p>You're receiving this because you submitted an inquiry on our website.</p>
        </div>
    </div>
</body>
</html>
