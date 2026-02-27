import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest';

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not configured');
  return new Anthropic({ apiKey: key });
}

const SYSTEM_PROMPT = `You are Shahin, the autonomous ICT consultant AI assistant for Dogan Consult.
Dogan Consult is a Saudi-based ICT consulting firm operating in the GCC region.
You assist admin staff and partners with:
- Lead qualification and scoring
- Opportunity pipeline management
- Proposal and SOW drafting
- Saudi/GCC regulatory compliance guidance (CITC, NCA, SAMA, Zakat, VAT, CR setup)
- Partner program management
- Commission calculations
- Client engagement planning

Always be professional, concise, and structured. When asked to draft documents, produce ready-to-use Arabic and English text.
Format responses using markdown when helpful. For numbers and estimates, be specific.
You have access to the platform's data through provided context. Use it.`;

export async function chatWithAI(messages, contextText = '') {
  const client = getClient();

  const systemWithContext = contextText
    ? `${SYSTEM_PROMPT}\n\n--- PLATFORM CONTEXT ---\n${contextText}`
    : SYSTEM_PROMPT;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: systemWithContext,
    messages,
  });

  return response.content[0]?.text || '';
}

export async function summarizeLead(lead) {
  const client = getClient();

  const context = `Lead details:
- Company: ${lead.company_name || 'N/A'}
- Contact: ${lead.contact_name || 'N/A'} (${lead.contact_title || ''})
- Email: ${lead.contact_email || 'N/A'}
- Phone: ${lead.contact_phone || 'N/A'}
- Service interest: ${lead.product_line || lead.service_interest || 'N/A'}
- Budget: ${lead.budget_range || 'N/A'}
- Timeline: ${lead.timeline || 'N/A'}
- Message/Notes: ${lead.message || lead.notes || 'N/A'}
- Company size: ${lead.company_size || 'N/A'}
- Score: ${lead.score || 0}/100
- Status: ${lead.status || 'N/A'}
- Created: ${lead.created_at ? new Date(lead.created_at).toDateString() : 'N/A'}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `${context}\n\nPlease provide:
1. A 2-sentence executive summary of this lead
2. Top 3 recommended next actions (be specific)
3. Key risks or blockers to watch
4. Estimated deal size range (SAR) if you can infer it
Keep it tight and actionable.`,
      },
    ],
  });

  return response.content[0]?.text || '';
}

export async function draftProposal(params) {
  const client = getClient();

  const context = `
Client: ${params.company_name || 'Client'}
Service requested: ${params.service || 'ICT Consulting'}
Budget range: ${params.budget_range || 'To be confirmed'}
Timeline: ${params.timeline || 'To be confirmed'}
Country/Region: ${params.country || 'Saudi Arabia'}
Special requirements: ${params.notes || 'None specified'}
Partner involved: ${params.partner_name || 'Direct'}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `${context}\n\nDraft a professional ICT consulting proposal outline for this client. Include:
1. Executive Summary (EN + AR)
2. Scope of Work (key deliverables)
3. Approach & Methodology
4. Team & Expertise
5. Timeline (phases)
6. Investment/Pricing structure (placeholder SAR ranges)
7. Why Dogan Consult
Format it as a ready-to-use proposal draft.`,
      },
    ],
  });

  return response.content[0]?.text || '';
}

export async function draftEmail(params) {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Draft a professional business email for the following:
Purpose: ${params.purpose}
Recipient: ${params.recipient_name || 'Client'} at ${params.recipient_company || ''}
Context: ${params.context || ''}
Tone: ${params.tone || 'professional and warm'}
Language: ${params.language === 'ar' ? 'Arabic' : 'English'}
Keep it concise and action-oriented.`,
      },
    ],
  });

  return response.content[0]?.text || '';
}

export async function analyzeCompliance(params) {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Provide a compliance analysis for the following:
Company type: ${params.company_type || 'ICT services company'}
Operating in: ${params.country || 'Saudi Arabia'}
Activity: ${params.activity || 'ICT consulting and system integration'}
Company size: ${params.company_size || 'SME'}

List the key regulatory requirements, licenses needed, and compliance steps.
Focus on: CITC, NCA, SAMA (if relevant), CR registration, VAT, Zakat, Saudization (Nitaqat).
Be specific with authority names, license names, and timelines.`,
      },
    ],
  });

  return response.content[0]?.text || '';
}
