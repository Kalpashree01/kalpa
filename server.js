const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint to handle quiz submissions
app.post('/submit-quiz', (req, res) => {
    const answers = req.body;
    console.log('Quiz Answers:', answers);
    // Process the answers (e.g., save to a database)
    res.status(200).json({ message: 'Submission received!' });
});

// Serve frontend files
app.use(express.static('public')); // Ensure your HTML is in the 'public' folder

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
