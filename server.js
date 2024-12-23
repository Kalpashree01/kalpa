node server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let responses = [];

// Endpoint to receive quiz responses
app.post('/submit', (req, res) => {
    const { teamCode, answers } = req.body;

    // Save responses
    responses.push({ teamCode, ...answers });

    // Create an Excel file
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(responses);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Responses');
    const filePath = './quiz_responses.xlsx';
    xlsx.writeFile(workbook, filePath);

    // Send the file via email
    sendEmail(filePath);

    res.status(200).send({ message: 'Responses saved and sent to admin.' });
});

// Function to send email with Excel file
function sendEmail(filePath) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-email-password', // Replace with your email password
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'admin-email@example.com', // Replace with admin email
        subject: 'Quiz Responses',
        text: 'Attached are the quiz responses.',
        attachments: [{ path: filePath }],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
