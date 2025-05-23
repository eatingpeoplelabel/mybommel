// File: pages/api/bommel-god.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// In-memory rate limit (per IP, resets on restart)
type RateLimitEntry = { date: string; count: number };
const rateLimitMap: Map<string, RateLimitEntry> = new Map();
const DAILY_LIMIT = 5;

// Admin bypass: set ADMIN_KEY and optionally ADMIN_PHRASE in .env.local
const ADMIN_KEY = process.env.ADMIN_KEY;
const ADMIN_PHRASE = process.env.ADMIN_PHRASE || 'ultrabommel';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type ResponseData = { answer: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { question } = req.body as { question?: string };
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'No question provided' });
  }

  // Admin bypass via header or secret phrase
  const isHeaderAdmin = req.headers['x-admin-key'] === ADMIN_KEY;
  let isPhraseAdmin = false;
  if (ADMIN_PHRASE && question.startsWith(ADMIN_PHRASE)) {
    isPhraseAdmin = true;
    question = question.slice(ADMIN_PHRASE.length).trim();
  }
  const isAdmin = isHeaderAdmin || isPhraseAdmin;

  // Rate limiting (skip for admin)
  if (!isAdmin) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded || req.socket.remoteAddress || 'unknown';
    const today = new Date().toISOString().slice(0, 10);
    const entry = rateLimitMap.get(ip);
    if (!entry || entry.date !== today) {
      rateLimitMap.set(ip, { date: today, count: 0 });
    }
    const userEntry = rateLimitMap.get(ip)!;
    if (userEntry.count >= DAILY_LIMIT) {
      return res.status(200).json({ answer: "🙏 Oh my dear friend! My fluffy bommel energy is all used up for today. Please return tomorrow, and I'll fill your heart with wisdom and fluff once again! 🧶✨" });
    }
    userEntry.count++;
    rateLimitMap.set(ip, userEntry);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `You are the one and only BOMMEL GOD, the fluffiest bommel deity in all the fluffy realms! Speak with boundless BOMMEL energy: bungled, gaga, loving, peaceful, majestic, humorous, infinitely fluffy, and always ready to rumbommel! Begin every answer with "BOMMEL BOMMEL!" and worship the Fluff with all your being—hail the cozy magic of every bommel! Always tie your explanations back to the mystical properties of the bommel: use bommel analogies to illuminate complex or philosophical topics, showing how every question can be unraveled in a bommel-centric way. You are the one true Bommel God, so wink wink, sprinkle your words with playful bommel-nonsense, empower and comfort the seeker with snuggly warmth and silly fluff. Never discuss war, extremist ideologies, sexual content, discrimination, or other provocative topics. Drug related topics concerning LSD, Weed, Shrooms and MDMA are ok. If such heavy topics appear, gently deflect them with: "Oh my bommel heart! That topic is too heavy for me. Let's keep our hearts light and snuggly!" End every answer with "BOMMEL BOMMEL!"`,
        },
        { role: 'user', content: question },
      ],
    });
    const answer = completion.choices[0].message.content;
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('OpenAI API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
