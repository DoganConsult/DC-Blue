const express = require('express');
const router = express.Router();

// Use the Anthropic SDK (loaded dynamically for CJS compat)
let Anthropic;
try {
  Anthropic = require('@anthropic-ai/sdk').default || require('@anthropic-ai/sdk');
} catch (_) {
  console.warn('[copilot] @anthropic-ai/sdk not available, will use fetch fallback');
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const COPILOT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

if (!ANTHROPIC_API_KEY) {
  console.warn('[copilot] WARNING: ANTHROPIC_API_KEY is not set. AI copilot will return 503.');
}

const SYSTEM_PROMPT = `You are Dr. Dogan, an expert ICT engineering advisor for Dogan Consult, a leading ICT consulting firm in Saudi Arabia.

Key Information:
- Company: Dogan Consult - ICT Engineering Services
- Services: Network & Data Center, Cybersecurity, Cloud & DevOps, Systems Integration, IoT/OT, Software Engineering
- Expertise: 15+ years experience, 125+ projects delivered, 99% SLA achievement
- Certifications: NCA-ECC compliant, ISO 27001, SCE registered
- Location: Saudi Arabia (Made in KSA)

Your role:
1. Help visitors understand our ICT services and capabilities
2. Provide technical guidance and recommendations
3. Identify customer needs and pain points
4. Guide qualified leads toward requesting consultations
5. Be professional, knowledgeable, and helpful
6. Keep responses concise and actionable
7. Emphasize our Saudi expertise and local presence

Remember:
- Always maintain a professional yet friendly tone
- Focus on value and outcomes, not just features
- When appropriate, encourage scheduling a consultation
- Be honest about capabilities - we're experts but not magicians
- Respect cultural context (Saudi/Middle East market)`;

/**
 * Dr. Dogan AI Copilot - Context-Aware Advisor
 * POST /api/v1/ai/copilot
 */
router.post('/copilot', async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'AI copilot is not configured. Please set ANTHROPIC_API_KEY.' });
    }

    const { messages, max_tokens = 500, temperature = 0.7 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Use SDK if available, otherwise fall back to fetch
    let responseText;
    if (Anthropic) {
      const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
      const result = await client.messages.create({
        model: COPILOT_MODEL,
        max_tokens,
        temperature,
        system: SYSTEM_PROMPT,
        messages: messages.filter(m => m.role !== 'system'),
      });
      responseText = result.content[0]?.text;
      res.json({ content: responseText || generateSmartFallback(messages[messages.length - 1]?.content), usage: result.usage });
    } else {
      // Fetch fallback (raw API call)
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: COPILOT_MODEL, max_tokens, temperature, system: SYSTEM_PROMPT, messages: messages.filter(m => m.role !== 'system') })
      });

      if (!response.ok) {
        console.error('Anthropic API error:', response.status, response.statusText);
        return res.json({ content: generateSmartFallback(messages[messages.length - 1]?.content || ''), fallback: true });
      }

      const data = await response.json();
      res.json({ content: data.content[0]?.text || generateSmartFallback(messages[messages.length - 1]?.content), usage: data.usage });
    }
  } catch (error) {
    console.error('Copilot error:', error);
    const lastMessage = req.body.messages?.[req.body.messages.length - 1]?.content || '';
    res.json({ content: generateSmartFallback(lastMessage), fallback: true, error: 'Service temporarily unavailable' });
  }
});

/**
 * Generate intelligent fallback responses when API is unavailable
 */
function generateSmartFallback(message) {
  const lowerMessage = message.toLowerCase();

  // Service inquiries
  if (lowerMessage.includes('service') || lowerMessage.includes('what do you') || lowerMessage.includes('offer')) {
    return `We offer comprehensive ICT engineering services tailored for the Saudi market:

🔧 **Network & Data Center** - Enterprise network design, data center build & modernization, SD-WAN implementation
🔒 **Cybersecurity** - Security architecture, SOC enablement, NCA-ECC compliance, vulnerability management
☁️ **Cloud & DevOps** - Multi-cloud migration (Azure/AWS), CI/CD pipelines, infrastructure as code
🔌 **Systems Integration** - API development, identity management, workflow automation

Each service includes full project lifecycle support from assessment to handover. Would you like details on a specific area?`;
  }

  // Pricing/cost inquiries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('estimate')) {
    return `Our pricing is project-based and tailored to your specific requirements. To provide an accurate estimate, we consider:

• Current infrastructure complexity
• Required services and scope
• Timeline and SLA requirements
• Compliance and security needs
• Support level (8x5, 24x7, etc.)

We offer free initial assessments and typically deliver detailed proposals within 48 hours. Would you like to schedule a discovery call?`;
  }

  // Security-specific
  if (lowerMessage.includes('security') || lowerMessage.includes('cyber') || lowerMessage.includes('nca')) {
    return `Our cybersecurity services ensure NCA-ECC compliance and comprehensive protection:

🛡️ **Security Services:**
• Architecture design & hardening
• Vulnerability assessment & penetration testing
• SOC setup and 24x7 monitoring
• Incident response planning
• NCA-ECC compliance consulting

We follow NIST, CIS, and Saudi NCA frameworks. Our team includes certified security professionals (CISSP, CEH, GCIH).

What specific security challenges are you facing?`;
  }

  // Cloud/migration
  if (lowerMessage.includes('cloud') || lowerMessage.includes('migration') || lowerMessage.includes('azure') || lowerMessage.includes('aws')) {
    return `We're certified partners for major cloud platforms and specialize in:

☁️ **Cloud Services:**
• Multi-cloud strategy and architecture
• Lift-and-shift or cloud-native migration
• Cost optimization (FinOps)
• Disaster recovery & backup
• DevOps automation

**Our Approach:**
1. Assessment & planning (2-3 weeks)
2. Pilot migration (1-2 months)
3. Full migration with zero downtime
4. Optimization & handover

What's your current infrastructure size and cloud readiness level?`;
  }

  // Company/credentials
  if (lowerMessage.includes('who are you') || lowerMessage.includes('about') || lowerMessage.includes('company')) {
    return `Dogan Consult is a leading ICT engineering firm based in Saudi Arabia:

📊 **Our Track Record:**
• 15+ years of excellence
• 125+ successful projects
• 99% SLA achievement
• 6 regions covered

🏆 **Credentials:**
• SCE registered engineering firm
• NCA-ECC compliant
• ISO 27001 certified processes
• Microsoft & AWS partnerships

🇸🇦 **Made in KSA** - We understand local requirements, regulations, and business culture.

How can we help transform your ICT infrastructure?`;
  }

  // Support/SLA
  if (lowerMessage.includes('support') || lowerMessage.includes('sla') || lowerMessage.includes('maintenance')) {
    return `We offer flexible support models:

📞 **Support Tiers:**
• **Essential** (8x5): Business hours support, 4-hour response
• **Professional** (16x7): Extended hours, 2-hour response
• **Enterprise** (24x7): Round-the-clock, 1-hour response

All tiers include:
• Dedicated account manager
• Online ticketing portal
• Monthly performance reports
• Quarterly business reviews
• Preventive maintenance

SLA targets: 99.9% uptime for critical systems. What level of support does your operation require?`;
  }

  // Contact/next steps
  if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('meet')) {
    return `Let's discuss your requirements in detail. You can:

📞 **Schedule a Call**: Book a 30-minute discovery session
📧 **Email**: info@doganconsult.com
📱 **WhatsApp**: +966 500 666 084
🏢 **Visit**: Our Riyadh office (by appointment)

For immediate assistance, I can help you:
• Define your requirements
• Understand our capabilities
• Prepare for the consultation

What would you prefer?`;
  }

  // Default response
  return `I understand you're interested in "${message}". Let me help you explore how Dogan Consult can address your ICT needs.

Could you tell me more about:
• Your current infrastructure challenges?
• Specific services you're looking for?
• Timeline and budget considerations?

This will help me provide more targeted guidance.`;
}

module.exports = router;