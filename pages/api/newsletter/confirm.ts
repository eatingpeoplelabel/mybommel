import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// 1. Extract and validate email query parameter
const emailParam = req.query.email
const email = Array.isArray(emailParam) ? emailParam[0] : emailParam
if (!email) {
return res.status(400).json({ error: 'Missing email parameter' })
}

// 2. Update the newsletter_candidate record, set confirmed_at
const { error } = await supabase
.from('newsletter_candidate')
.update({ confirmed_at: new Date().toISOString() })
.eq('email', email)

if (error) {
console.error('Error confirming newsletter candidate:', error)
return res.status(500).json({ error: 'Could not confirm subscription' })
}

// 3. Redirect to a thank-you page
res.redirect('/newsletter-thank-you')
}

