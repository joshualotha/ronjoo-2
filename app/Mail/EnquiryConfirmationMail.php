<?php

namespace App\Mail;

use App\Models\Enquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnquiryConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Enquiry $enquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'We received your safari inquiry — Ronjoo Safaris',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.enquiry-confirmation',
            with: ['enquiry' => $this->enquiry],
        );
    }
}
