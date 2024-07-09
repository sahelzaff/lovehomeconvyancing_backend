import express from 'express';
import nodemailer from 'nodemailer';
import pdf from 'html-pdf';
import path from 'path';

const router = express.Router();

router.post('/send-quote', async (req, res) => {
    const { formData, quoteData } = req.body;

    // HTML template for the PDF
    const htmlTemplate = `
    <html>
    <head>
        <style>
            body {
                font-family: 'Poppins', sans-serif;
                max-width: 800px;
                margin: auto;
                padding: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header img {
                width: 200px;
            }
            .header h2 {
                color: #f0532d;
                font-size: 2.5em;
            }
            .content p {
                font-size: 1.2em;
                margin-bottom: 10px;
            }
            .content .total {
                font-size: 2em;
                font-weight: bold;
                color: #f0532d;
            }
            .coupon {
                background-color: #19345E;
                color: white;
                padding: 10px;
                text-align: center;
                margin: 20px 0;
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <img src="file:///${path.join(__dirname, '../assets/logoBlackRed.png')}" alt="Love Homes Conveyancing" />
            <h2>Your Instant Quote</h2>
        </div>
        <div class="content">
            <p>Name: ${formData.name}</p>
            <p>Email: ${formData.email}</p>
            <p>Exchange to Settlement: $${quoteData.exchangeToSettlement}</p>
            <p>Verification of Identity: $${quoteData.verificationOfIdentity}</p>
            <p>Searches - Estimated Price: $${quoteData.searchesEstimatedPrice}</p>
            <p>GST: $${quoteData.gst}</p>
            <p class="total">Your Quote Total inc GST: $${quoteData.total}</p>
            <p>*additional verification required if multiple applicants</p>
            <p>*You have received an email with this information.</p>
        </div>
        <div class="coupon">
            <h2>Enter <span style="color: #f0532d;">LoveHomes</span> in the coupon field to get a <span style="color: #f0532d;">$100 discount</span> on your legal fees!</h2>
        </div>
        <div class="content">
            <p>Ready to get going on your conveyancing?</p>
            <p>We'd love you to choose us today with this exclusive online only offer</p>
            <p>Pay a deposit now and <span style="color: #f0532d;">SAVE $100</span> on your Legal fees!</p>
        </div>
    </body>
    </html>
    `;

    // Generate PDF from HTML
    pdf.create(htmlTemplate, { format: 'A4' }).toBuffer(async (err, buffer) => {
        if (err) {
            console.error('PDF Generation Error:', err);
            return res.status(500).json({ error: 'Failed to generate PDF' });
        }

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'sahelzaffar2@gmail.com',
                pass: 'myhe enui rxmh hcbx'
            }
        });

        const mailOptions = {
            from: 'sahelzaffar2@gmail.com',
            to: formData.email,
            subject: 'Your Quote from Love Homes',
            text: 'Please find attached your quote.',
            attachments: [
                {
                    filename: 'quote.pdf',
                    content: buffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email Sending Error:', error);
                return res.status(500).json({ error: error.toString() });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent: ' + info.response });
        });
    });
});

export default router;
