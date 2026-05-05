// /api/chat.js
// Vercel serverless function — securely calls OpenAI on behalf of the browser.
// The OPENAI_API_KEY env variable lives only on the server, never exposed to the client.

import { SYSTEM_PROMPT } from '../src/lib/glowwiseSystemPrompt.js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage, history = [], userContext = null } = req.body || {};

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid userMessage' });
    }

    // Build the messages array for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Optionally include user context (profile, focus areas, recent check-ins)
    if (userContext) {
      messages.push({
        role: 'system',
        content: `User context:\n${JSON.stringify(userContext, null, 2)}`,
      });
    }

    // Include recent conversation history (last 10 messages max for cost control)
    const recentHistory = history.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));
    messages.push(...recentHistory);

    // Append the new user message
    messages.push({ role: 'user', content: userMessage });

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages,
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      return res.status(500).json({
        error: 'AI service unavailable. Please try again in a moment.',
      });
    }

    const data = await openaiResponse.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ error: 'No response generated.' });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      error: 'Something went wrong. Please try again.',
    });
  }
}
