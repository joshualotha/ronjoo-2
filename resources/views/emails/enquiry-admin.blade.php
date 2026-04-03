<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Georgia', serif; color: #1C1812; margin: 0; padding: 0; background: #F2EBE0; }
        .container { max-width: 600px; margin: 0 auto; background: #FDFBF7; }
        .header { background: #1C1812; padding: 24px 32px; }
        .header h1 { color: #D4A96A; font-size: 18px; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
        .body { padding: 32px; }
        .body h2 { font-size: 22px; color: #C4714A; margin: 0 0 16px; }
        .field { margin-bottom: 12px; }
        .field .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #1C1812; opacity: 0.5; margin-bottom: 2px; }
        .field .value { font-size: 15px; color: #1C1812; }
        .divider { height: 1px; background: #E8E0D5; margin: 20px 0; }
        .message { background: #F2EBE0; padding: 16px; font-size: 14px; line-height: 1.7; color: #1C1812; white-space: pre-wrap; }
        .footer { padding: 20px 32px; font-size: 12px; color: #1C1812; opacity: 0.4; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ronjoo Safaris</h1>
        </div>
        <div class="body">
            <h2>New Safari Inquiry</h2>

            <div class="field">
                <div class="label">Guest Name</div>
                <div class="value">{{ $enquiry->guest_name }}</div>
            </div>

            <div class="field">
                <div class="label">Email</div>
                <div class="value">{{ $enquiry->email }}</div>
            </div>

            @if($enquiry->whatsapp)
            <div class="field">
                <div class="label">WhatsApp</div>
                <div class="value">{{ $enquiry->whatsapp }}</div>
            </div>
            @endif

            @if($enquiry->country)
            <div class="field">
                <div class="label">Country</div>
                <div class="value">{{ $enquiry->country }}</div>
            </div>
            @endif

            <div class="divider"></div>

            @if($enquiry->safari_interest)
            <div class="field">
                <div class="label">Safari Interest</div>
                <div class="value">{{ $enquiry->safari_interest }}</div>
            </div>
            @endif

            @if($enquiry->preferred_dates)
            <div class="field">
                <div class="label">Preferred Dates</div>
                <div class="value">{{ $enquiry->preferred_dates }}</div>
            </div>
            @endif

            @if($enquiry->travelers)
            <div class="field">
                <div class="label">Travelers</div>
                <div class="value">{{ $enquiry->travelers }}</div>
            </div>
            @endif

            @if($enquiry->source)
            <div class="field">
                <div class="label">Source</div>
                <div class="value">{{ $enquiry->source }}</div>
            </div>
            @endif

            @if($enquiry->message)
            <div class="divider"></div>
            <div class="field">
                <div class="label">Message</div>
                <div class="message">{{ $enquiry->message }}</div>
            </div>
            @endif
        </div>
        <div class="footer">
            Received {{ $enquiry->received_at?->format('M j, Y g:i A') ?? now()->format('M j, Y g:i A') }}
        </div>
    </div>
</body>
</html>
