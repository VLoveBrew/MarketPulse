const DEFAULT_TOPIC = 'AI market research tools for boutique consultants';
const DEFAULT_GEOGRAPHY = 'United States';
const DEFAULT_AUDIENCE = 'Founder';

const SEGMENTS = [
  {
    match: ['health', 'clinic', 'doctor', 'dental', 'patient', 'hospital'],
    category: 'Healthcare operations technology',
    competitors: ['Abridge', 'Nabla', 'Suki AI', 'Freed', 'Tebra'],
    demand: 'Demand is strongest where documentation burden, staff shortages, and compliance risk overlap.',
    angle: 'The attractive wedge is likely a specialty workflow where generic tools lack domain context and auditability.',
    caution: 'Regulatory exposure can make broad claims fragile. Verify workflow ownership, compliance language, and implementation risk before making strategy decisions.',
  },
  {
    match: ['fintech', 'finance', 'bank', 'payment', 'lending', 'wealth'],
    category: 'Financial services technology',
    competitors: ['Plaid', 'Stripe', 'Adyen', 'Modern Treasury', 'Unit'],
    demand: 'Demand quality improves when the product reduces integration friction, audit burden, or operational risk.',
    angle: 'The strongest wedge is a narrow regulated workflow where trust and reliability matter more than feature breadth.',
    caution: 'Distribution dependencies and compliance constraints can shrink the reachable market if they are under-modeled.',
  },
  {
    match: ['ai', 'automation', 'copilot', 'agent', 'llm'],
    category: 'AI-enabled workflow software',
    competitors: ['Perplexity Enterprise', 'Glean', 'Hebbia', 'Harvey', 'Dust'],
    demand: 'Interest is high, but durable demand depends on repeatable workflow value rather than launch novelty.',
    angle: 'The most defensible wedge is likely role-specific intelligence with proprietary context, source traceability, and workflow memory.',
    caution: 'AI markets are crowded with similar positioning. Pricing evidence, retention proxies, and credible customer proof matter more than announcement volume.',
  },
  {
    match: ['saas', 'b2b', 'enterprise', 'sales', 'marketing', 'crm'],
    category: 'B2B software and services',
    competitors: ['HubSpot', 'Salesforce', 'Gong', '6sense', 'Clari'],
    demand: 'Budget exists when the category maps directly to revenue growth, cost reduction, or risk control.',
    angle: 'A focused buyer workflow should come before a broad platform narrative.',
    caution: 'Incumbent suites and internal workflows are real substitutes. Differentiation must be proven at the use-case level.',
  },
];

const SOURCE_ADAPTERS = [
  {
    id: 'market_momentum',
    name: 'GDELT news index',
    sourceType: 'news',
    authority: 74,
    search: searchGdelt,
  },
  {
    id: 'research_validation',
    name: 'OpenAlex research graph',
    sourceType: 'research',
    authority: 82,
    search: searchOpenAlex,
  },
  {
    id: 'market_boundary',
    name: 'Wikipedia category search',
    sourceType: 'reference',
    authority: 70,
    search: searchWikipedia,
  },
  {
    id: 'buyer_voice',
    name: 'Hacker News public discussion',
    sourceType: 'community',
    authority: 58,
    search: searchHackerNews,
  },
];

export async function handleMarketSnapshotRequest(request) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Use POST with topic, geography, and audience.' }, 405);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Request body must be valid JSON.' }, 400);
  }

  const snapshot = await createMarketSnapshot(payload);
  return jsonResponse(snapshot);
}

export async function createMarketSnapshot(payload = {}) {
  const input = normalizeInput(payload);
  const segment = detectSegment(input.topic);
  const sourcePlan = buildSourcePlan(input.topic, input.geography);
  const sourceResults = await collectEvidence(input, sourcePlan);
  const evidenceLedger = buildEvidenceLedger(input, segment, sourceResults);
  const confidence = scoreSnapshot(evidenceLedger, sourceResults);
  const competitors = buildCompetitors(segment, evidenceLedger);

  return {
    topic: input.topic,
    geography: input.geography,
    audience: input.audience,
    depth: input.depth,
    market_category: segment.category,
    generated_at: new Date().toISOString(),
    overall_confidence: {
      score: confidence.score,
      label: confidence.label,
      reason: confidence.reason,
    },
    executive_snapshot: [
      {
        title: 'Category read',
        insight: `${input.topic} is best assessed as ${segment.category} in ${input.geography}, not as a broad keyword market.`,
        confidence: confidence.label,
        supporting_evidence_ids: takeIds(evidenceLedger, ['reference', 'research', 'news']),
      },
      {
        title: 'Demand signal',
        insight: sourceResults.news.length > 2 ? summarizeMomentum(sourceResults.news, segment.demand) : segment.demand,
        confidence: sourceResults.news.length > 2 ? 'Medium-high' : 'Medium',
        supporting_evidence_ids: takeIds(evidenceLedger, ['news', 'community']),
      },
      {
        title: 'Strategic angle',
        insight: segment.angle,
        confidence: 'Medium',
        supporting_evidence_ids: takeIds(evidenceLedger, ['community', 'research']),
      },
    ],
    competitors,
    buyer_pain_points: [
      {
        pain: 'Difficulty separating genuine market demand from announcement noise.',
        evidence: 'MarketPulse compares news, reference, research, and buyer-discussion signals before summarizing demand.',
        confidence: sourceResults.news.length || sourceResults.community.length ? 'Medium-high' : 'Medium',
      },
      {
        pain: 'Unclear category boundary and substitute set.',
        evidence: 'The agent treats the first pass as market-boundary work before sizing or opportunity scoring.',
        confidence: 'High',
      },
    ],
    opportunities: [
      {
        opportunity: segment.angle,
        why_it_matters: 'A narrow wedge creates a better research brief than a generic category summary.',
        confidence: 'Medium',
      },
      {
        opportunity: 'Use evidence transparency as the product differentiator.',
        why_it_matters: 'Users can inspect source routes and confidence levels instead of receiving unsupported prose.',
        confidence: 'High',
      },
    ],
    risks_and_uncertainties: [
      {
        risk: segment.caution,
        why_it_matters: 'Weakly verified claims create false confidence for founders, consultants, and investors.',
        what_to_verify_next: 'Run a deeper pass across competitor pricing, customer proof, filings, review sites, and interviews.',
      },
      {
        risk: sourceResults.failures.length ? 'Some public-source adapters did not return usable evidence.' : 'Free source coverage is intentionally limited.',
        why_it_matters: 'A free snapshot should be useful, but not overstate completeness.',
        what_to_verify_next: 'Add search APIs, paid databases, and human review for strategy-grade work.',
      },
    ],
    evidence_ledger: evidenceLedger,
    source_summary: {
      adapters_queried: sourcePlan.length,
      records_found: Object.values(sourceResults).flat().filter((item) => item && item.title).length,
      failures: sourceResults.failures,
    },
    recommended_next_steps: [
      'Verify the competitor list against primary company pages and pricing pages.',
      'Look for buyer proof: case studies, reviews, job postings, and implementation stories.',
      'Separate direct competitors from substitutes and internal workflows.',
      'Only estimate market size after the category boundary and buyer workflow are clear.',
    ],
  };
}

function normalizeInput(payload) {
  return {
    topic: clean(payload.topic || DEFAULT_TOPIC),
    geography: clean(payload.geography || DEFAULT_GEOGRAPHY),
    audience: clean(payload.audience || DEFAULT_AUDIENCE),
    depth: clean(payload.depth || 'snapshot'),
  };
}

function clean(value) {
  return String(value).trim().replace(/\s+/g, ' ');
}

function detectSegment(topic) {
  const lower = topic.toLowerCase();
  return SEGMENTS.find((segment) => segment.match.some((term) => lower.includes(term))) || {
    category: 'Emerging business category',
    competitors: ['Incumbent suites', 'Vertical specialists', 'Agency substitutes', 'Open-source tooling', 'Internal teams'],
    demand: 'The category is not yet specific enough for high-confidence demand assessment; the first useful step is market boundary discipline.',
    angle: 'Narrow the category around a buyer, a painful workflow, and the substitute currently absorbing the budget.',
    caution: 'Broad category labels can create false confidence. Multiple independent source types should corroborate the market before strategy decisions.',
  };
}

function buildSourcePlan(topic, geography) {
  return SOURCE_ADAPTERS.map((adapter) => ({
    ...adapter,
    query: `${topic} ${geography}`,
  }));
}

async function collectEvidence(input, sourcePlan) {
  const output = {
    news: [],
    research: [],
    reference: [],
    community: [],
    failures: [],
  };

  const results = await Promise.all(
    sourcePlan.map(async (adapter) => {
      try {
        return {
          adapter,
          items: await adapter.search(input.topic, input.geography),
          failure: '',
        };
      } catch (error) {
        return {
          adapter,
          items: [],
          failure: `${adapter.name}: ${error.message || 'source adapter failed'}`,
        };
      }
    }),
  );

  for (const result of results) {
    output[result.adapter.sourceType].push(...result.items);
    if (result.failure) {
      output.failures.push(result.failure);
    }
  }

  return output;
}

function buildEvidenceLedger(input, segment, sourceResults) {
  const records = [
    ...sourceResults.reference.slice(0, 2).map((item) => evidenceFromSource(item, 'reference', 70, input)),
    ...sourceResults.news.slice(0, 3).map((item) => evidenceFromSource(item, 'news', 74, input)),
    ...sourceResults.research.slice(0, 2).map((item) => evidenceFromSource(item, 'research', 82, input)),
    ...sourceResults.community.slice(0, 1).map((item) => evidenceFromSource(item, 'community', 58, input)),
  ];

  records.push({
    claim: `Treat ${input.topic} as ${segment.category} until primary company evidence proves a better category boundary.`,
    source_title: 'MarketPulse category-boundary model',
    source_url: searchUrl(input.topic, input.geography),
    source_type: 'synthesis',
    date: new Date().toISOString(),
    summary: 'This is an analyst hypothesis generated from topic classification and source coverage. It should be verified against primary sources.',
    confidence: 'Medium',
    score: 69,
  });

  return records.slice(0, 8).map((record, index) => ({
    id: `E${String(index + 1).padStart(2, '0')}`,
    ...record,
  }));
}

function evidenceFromSource(item, sourceType, authority, input) {
  const specificity = scoreSpecificity(item.title, input.topic);
  const recency = scoreRecency(item.date);
  const score = Math.round((authority * 0.48) + (specificity * 0.32) + (recency * 0.2));

  return {
    claim: makeClaim(item, sourceType, input.topic),
    source_title: item.title,
    source_url: item.url,
    source_type: sourceType,
    date: item.date || new Date().toISOString(),
    summary: item.summary || 'Public source returned a relevant record for this topic.',
    confidence: labelForScore(score),
    score,
  };
}

function makeClaim(item, sourceType, topic) {
  if (sourceType === 'news') {
    return `Recent public coverage includes "${item.title}", suggesting market activity around ${topic}.`;
  }
  if (sourceType === 'research') {
    return `Research-index evidence exists for "${item.title}", which can help validate technical maturity or adoption barriers.`;
  }
  if (sourceType === 'community') {
    return `Public discussion includes "${item.title}", which may reveal buyer language, friction, or substitutes.`;
  }
  return `Reference results include "${item.title}", useful for initial market-boundary checks.`;
}

function buildCompetitors(segment, evidenceLedger) {
  return segment.competitors.map((name, index) => ({
    name,
    type: index < 2 ? 'direct' : index === segment.competitors.length - 1 ? 'substitute' : 'adjacent',
    why_relevant: index < 2
      ? 'Candidate direct competitor to verify through company pages, customer proof, and positioning.'
      : 'Candidate adjacent player or substitute to test during the competitor-mapping pass.',
    confidence: index < 2 ? 'Medium-high' : 'Medium',
    source_ids: evidenceLedger.slice(0, 3).map((item) => item.id),
  }));
}

function scoreSnapshot(evidenceLedger, sourceResults) {
  const sourceTypes = ['news', 'research', 'reference', 'community'].filter((type) => sourceResults[type].length > 0).length;
  const averageEvidence = evidenceLedger.length
    ? evidenceLedger.reduce((total, item) => total + (item.score || 60), 0) / evidenceLedger.length
    : 58;
  const score = Math.min(88, Math.round((averageEvidence * 0.72) + (sourceTypes * 7)));
  const missing = 4 - sourceTypes;

  return {
    score,
    label: labelForScore(score),
    reason: missing > 0
      ? `The snapshot found ${sourceTypes} usable public source types. Confidence is capped until ${missing} additional source type${missing === 1 ? '' : 's'} corroborate the claims.`
      : 'The snapshot found multiple public source types and scored claims by authority, specificity, and recency.',
  };
}

function takeIds(evidenceLedger, sourceTypes) {
  return evidenceLedger
    .filter((item) => sourceTypes.includes(item.source_type))
    .slice(0, 3)
    .map((item) => item.id);
}

function summarizeMomentum(news, fallback) {
  const outlets = [...new Set(news.map((item) => item.domain).filter(Boolean))].slice(0, 3);
  if (!outlets.length) return fallback;
  return `Public coverage appears across ${outlets.join(', ')}, which suggests active market conversation. Validate whether that activity reflects buying intent or only announcement volume.`;
}

function scoreSpecificity(title, topic) {
  const words = new Set(clean(topic).toLowerCase().split(' ').filter((word) => word.length > 2));
  const titleWords = clean(title || '').toLowerCase().split(' ');
  const matches = titleWords.filter((word) => words.has(word)).length;
  return Math.min(94, 52 + (matches * 11));
}

function scoreRecency(date) {
  if (!date) return 62;
  const timestamp = Date.parse(date);
  if (Number.isNaN(timestamp)) return 62;
  const ageDays = (Date.now() - timestamp) / 86400000;
  if (ageDays < 365) return 90;
  if (ageDays < 1095) return 78;
  if (ageDays < 2190) return 66;
  return 54;
}

function labelForScore(score) {
  if (score >= 82) return 'High';
  if (score >= 73) return 'Medium-high';
  if (score >= 58) return 'Medium';
  return 'Low';
}

async function searchGdelt(topic, geography) {
  const query = encodeURIComponent(`"${topic}" ${geography}`);
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=ArtList&maxrecords=8&format=json&sort=hybridrel`;
  const data = await fetchJson(url);
  return (data.articles || []).slice(0, 6).map((article) => ({
    title: article.title,
    url: article.url,
    date: article.seendate || article.datetime,
    summary: article.sourcecountry ? `Coverage from ${article.sourcecountry}.` : 'News-index result returned for the research topic.',
    domain: article.domain,
  })).filter((item) => item.title && item.url);
}

async function searchOpenAlex(topic) {
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(topic)}&per-page=6&select=id,display_name,publication_year,cited_by_count,doi,primary_location`;
  const data = await fetchJson(url);
  return (data.results || []).slice(0, 5).map((work) => ({
    title: work.display_name,
    url: work.doi || work.primary_location?.landing_page_url || work.id,
    date: work.publication_year ? `${work.publication_year}-01-01` : undefined,
    summary: `${work.cited_by_count || 0} citations in the OpenAlex research graph.`,
  })).filter((item) => item.title && item.url);
}

async function searchWikipedia(topic) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&utf8=1`;
  const data = await fetchJson(url);
  return (data.query?.search || []).slice(0, 4).map((page) => ({
    title: page.title,
    url: `https://en.wikipedia.org/?curid=${page.pageid}`,
    date: page.timestamp,
    summary: stripHtml(page.snippet || 'Wikipedia search result for category context.'),
  })).filter((item) => item.title && item.url);
}

async function searchHackerNews(topic) {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(topic)}&tags=story&hitsPerPage=5`;
  const data = await fetchJson(url);
  return (data.hits || []).slice(0, 4).map((hit) => ({
    title: hit.title || hit.story_title,
    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
    date: hit.created_at,
    summary: `${hit.points || 0} points and ${hit.num_comments || 0} comments on Hacker News.`,
  })).filter((item) => item.title && item.url);
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'MarketPulse/0.1 public-source research prototype',
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Source request failed: ${response.status}`);
    }
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function searchUrl(topic, geography) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${topic} ${geography} competitors market`)}`;
}

function stripHtml(value) {
  return String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
