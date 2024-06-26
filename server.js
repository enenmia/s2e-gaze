const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));  // 用于提供HTML文件和JavaScript

const PORT = process.env.PORT || 3001;

app.post('/call-openai', async (req, res) => {
    const { text } = req.body; // 从请求体获取文本

    const prompt = `hello, this is an OCR recognized text: '${text}'. The original text is blurred so I cannot understand its meaning. I know it had 6-10 words, and is about 'being'. Can you make a guess of what was the original text(6-10 words) and it was a fluent statment?Only change the word you can not understand, don't change too much. Please only return the text you guess, no other informations.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{"role": "system", "content": prompt}],
            temperature: 0.5
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ guess: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Failed to call OpenAI:', error);
        res.status(500).send('Error calling OpenAI API');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});