<?php

namespace App\Mail;

use App\Models\Enquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewEnquiryAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Enquiry $enquiry) {}

    public function envelope(): Envelope
    {
        $name = $this->enquiry->guest_name ?? 'Guest';
        $safari = $this->enquiry->safari_interest ?? 'Safari';
        return new Envelope(
            subject: "New Safari Inquiry from {$name} — {$safari}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.enquiry-admin',
            with: ['enquiry' => $this->enquiry],
        );
    }
}
