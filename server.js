const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());

const SUPABASE_URL = 'https://qxmuapbnknjaxdayijga.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4bXVhcGJua25qYXhkYXlpamdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzM5MjksImV4cCI6MjA5NjY0OTkyOX0.NlsxUoDCaVee7siYOjEfxknxUA78kYbdtb8wzTOsbr08';

app.post('/chat', async (req, res) => {
  try {
    // Save message to Supabase
    const userMessage = req.body.messages[req.body.messages.length - 1].content;
const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  },
  body: JSON.stringify({ user_message: userMessage })
});
const sbData = await sbRes.json();
console.log('Supabase response:', JSON.stringify(sbData));

    // Send to Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
