const TITLE_SCORES = {
  ceo: 30, cfo: 28, cto: 28, coo: 25, cio: 25, ciso: 25, vp: 22,
  director: 20, head: 18, manager: 15, lead: 12, senior: 10,
  مدير: 20, رئيس: 25, نائب: 22,
};

const BUDGET_SCORES = {
  '1m+': 30, '500k-1m': 25, '200k-500k': 20, '50k-200k': 12, '<50k': 5,
};

const TIMELINE_SCORES = {
  immediate: 25, '1-3months': 20, '3-6months': 12, '6months+': 5,
};

const SIZE_SCORES = {
  '1000+': 20, '501-1000': 16, '201-500': 12, '51-200': 8, '11-50': 5, '1-10': 2,
};

export function calculateLeadScore(lead) {
  let score = 0;

  const title = (lead.contact_title || '').toLowerCase();
  for (const [keyword, pts] of Object.entries(TITLE_SCORES)) {
    if (title.includes(keyword)) { score += pts; break; }
  }

  if (lead.budget_range && BUDGET_SCORES[lead.budget_range]) {
    score += BUDGET_SCORES[lead.budget_range];
  }

  if (lead.timeline && TIMELINE_SCORES[lead.timeline]) {
    score += TIMELINE_SCORES[lead.timeline];
  }

  if (lead.company_size && SIZE_SCORES[lead.company_size]) {
    score += SIZE_SCORES[lead.company_size];
  }

  if (lead.contact_phone) score += 5;
  if (lead.cr_number) score += 5;
  if (lead.company_website || lead.website) score += 3;

  const msg = lead.message || '';
  if (msg.length > 200) score += 8;
  else if (msg.length > 50) score += 4;

  if (lead.product_line) score += 5;
  if (lead.vertical) score += 3;
  if (lead.expected_users) score += 3;

  return Math.min(score, 100);
}
