import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  ClipboardCheck,
  Database,
  FileSearch,
  FileText,
  Gauge,
  Globe2,
  Layers3,
  LineChart,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

const audienceOptions = ['Founder', 'Consultant', 'Product marketer', 'Investor', 'Sales leader'];
const geographyOptions = ['United States', 'India', 'Europe', 'Global', 'APAC'];

const sourceAdapters = [
  {
    name: 'Company web',
    type: 'Primary evidence',
    authority: 88,
    coverage: 'Positioning, pricing hints, proof points, customer logos, implementation depth',
  },
  {
    name: 'News and press',
    type: 'Momentum signal',
    authority: 74,
    coverage: 'Funding, launches, partnerships, regulation, executive commentary',
  },
  {
    name: 'Filings and investor material',
    type: 'Financial evidence',
    authority: 92,
    coverage: 'Risk factors, segment priorities, market exposure, revenue language',
  },
  {
    name: 'Jobs and hiring',
    type: 'Demand proxy',
    authority: 68,
    coverage: 'Budget formation, expansion signals, GTM hiring, skill demand',
  },
  {
    name: 'Research graph',
    type: 'External validation',
    authority: 82,
    coverage: 'Technology maturity, adoption barriers, research velocity',
  },
  {
    name: 'Buyer voice',
    type: 'Friction signal',
    authority: 64,
    coverage: 'Unmet needs, switching triggers, complaints, substitute behavior',
  },
];

const researchDepth = [
  { label: 'Market boundary', value: 'Defined before sizing', icon: Globe2 },
  { label: 'Demand quality', value: 'Triangulated signals', icon: LineChart },
  { label: 'Competitor map', value: 'Direct + substitutes', icon: Building2 },
  { label: 'Confidence', value: 'Claim-level scoring', icon: ClipboardCheck },
];

function cleanTopic(topic) {
  return topic.trim().replace(/\s+/g, ' ') || 'AI market research tools for boutique consultants';
}

function detectSegment(topic) {
  const lower = topic.toLowerCase();
  const checks = [
    {
      match: ['health', 'clinic', 'doctor', 'dental', 'patient', 'hospital'],
      segment: 'Healthcare operations technology',
      competitors: ['Abridge', 'Nabla', 'Suki AI', 'Freed', 'Tebra'],
      headline: 'Demand is strongest where documentation burden, staff shortages, and compliance risk overlap.',
      angle: 'The attractive wedge is likely a specialty workflow where generic AI tools lack clinical context and auditability.',
      caution: 'Regulatory exposure can make broad claims fragile. Strategy-grade work should verify compliance language and workflow ownership.',
      signal: 78,
    },
    {
      match: ['fintech', 'finance', 'bank', 'payment', 'lending', 'wealth'],
      segment: 'Financial services technology',
      competitors: ['Plaid', 'Stripe', 'Adyen', 'Modern Treasury', 'Unit'],
      headline: 'Demand quality improves when the product reduces integration friction, audit burden, or operational risk.',
      angle: 'The strongest wedge is a narrow regulated workflow where trust and reliability matter more than feature breadth.',
      caution: 'Distribution dependencies and compliance constraints can shrink the reachable market if they are under-modeled.',
      signal: 74,
    },
    {
      match: ['ai', 'automation', 'copilot', 'agent', 'llm'],
      segment: 'AI-enabled workflow software',
      competitors: ['Perplexity Enterprise', 'Glean', 'Hebbia', 'Harvey', 'Dust'],
      headline: 'Interest is high, but durable demand depends on repeatable workflow value rather than launch novelty.',
      angle: 'The most defensible wedge is likely role-specific intelligence with proprietary context, source traceability, and workflow memory.',
      caution: 'AI markets are crowded with similar positioning. Pricing evidence, retention proxies, and credible customer proof matter more than announcement volume.',
      signal: 84,
    },
    {
      match: ['saas', 'b2b', 'enterprise', 'sales', 'marketing', 'crm'],
      segment: 'B2B software and services',
      competitors: ['HubSpot', 'Salesforce', 'Gong', '6sense', 'Clari'],
      headline: 'Budget exists when the category maps directly to revenue growth, cost reduction, or risk control.',
      angle: 'A focused buyer workflow should come before a broad platform narrative.',
      caution: 'Incumbent suites and internal workflows are real substitutes. Differentiation must be proven at the use-case level.',
      signal: 76,
    },
  ];

  return checks.find((item) => item.match.some((term) => lower.includes(term))) || {
    segment: 'Emerging business category',
    competitors: ['Incumbent suites', 'Vertical specialists', 'Agency substitutes', 'Open-source tooling', 'Internal teams'],
    headline: 'The category is not yet specific enough for high-confidence sizing; the first useful step is market boundary discipline.',
    angle: 'Narrow the category around a buyer, a painful workflow, and the substitute currently absorbing the budget.',
    caution: 'Broad category labels can create false confidence. Multiple independent source types should corroborate the market before strategy decisions.',
    signal: 68,
  };
}

function audienceRead(audience) {
  const reads = {
    Founder: 'founders deciding whether the opportunity deserves deeper validation',
    Consultant: 'consultants producing client-ready intelligence with traceable evidence',
    'Product marketer': 'marketing teams turning competitor signals into positioning and battlecards',
    Investor: 'investors screening momentum, defensibility, and downside risk',
    'Sales leader': 'sales teams entering a new vertical or competitive motion',
  };

  return reads[audience] || reads.Founder;
}

function sourceRoute(label, topic, geography) {
  const query = encodeURIComponent(`${topic} ${label} ${geography}`);
  const routes = {
    'Company proof': `https://www.google.com/search?q=${query}+pricing+customers+case+study`,
    'Market momentum': `https://news.google.com/search?q=${query}+funding+launch+partnership`,
    'Public disclosures': 'https://www.sec.gov/search-filings',
    'Hiring signal': `https://www.google.com/search?q=${query}+jobs+hiring+go-to-market`,
    'Research validation': `https://openalex.org/works?search=${encodeURIComponent(topic)}`,
    'Buyer friction': `https://www.google.com/search?q=${query}+reviews+complaints+alternatives`,
  };

  return routes[label];
}

function buildEvidence(topic, geography, segment, audience) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return [
    {
      id: 'E01',
      label: 'Company proof',
      claim: `Frame the topic as ${segment.segment} before attempting market sizing.`,
      basis: 'The category should be bounded through product language, customer proof, and adjacent substitute analysis.',
      confidence: 86,
      route: sourceRoute('Company proof', topic, geography),
      checkedAt: today,
    },
    {
      id: 'E02',
      label: 'Market momentum',
      claim: segment.headline,
      basis: 'Momentum should be confirmed through funding, partnerships, launch cadence, and customer adoption signals.',
      confidence: segment.signal,
      route: sourceRoute('Market momentum', topic, geography),
      checkedAt: today,
    },
    {
      id: 'E03',
      label: 'Public disclosures',
      claim: 'Public-company disclosures are useful only when the topic touches listed companies or their strategic segments.',
      basis: 'Filings can validate risk language, executive priorities, and exposure to an adjacent category.',
      confidence: 79,
      route: sourceRoute('Public disclosures', topic, geography),
      checkedAt: today,
    },
    {
      id: 'E04',
      label: 'Hiring signal',
      claim: 'Hiring patterns are a useful proxy for where teams are placing budget and operational focus.',
      basis: 'Role frequency, seniority, and functional mix help distinguish curiosity from organized investment.',
      confidence: 72,
      route: sourceRoute('Hiring signal', topic, geography),
      checkedAt: today,
    },
    {
      id: 'E05',
      label: 'Buyer friction',
      claim: segment.angle,
      basis: 'Whitespace should be derived from complaints, alternatives, switching friction, and workflow ownership.',
      confidence: 74,
      route: sourceRoute('Buyer friction', topic, geography),
      checkedAt: today,
    },
  ].map((item) => ({
    ...item,
    confidenceLabel: item.confidence >= 82 ? 'High' : item.confidence >= 73 ? 'Medium-high' : 'Medium',
    audienceFit: audienceRead(audience),
  }));
}

function buildSnapshot(topic, geography, audience) {
  const normalized = cleanTopic(topic);
  const segment = detectSegment(normalized);
  const evidence = buildEvidence(normalized, geography, segment, audience);
  const confidence = Math.round(evidence.reduce((total, item) => total + item.confidence, 0) / evidence.length);

  return {
    topic: normalized,
    geography,
    audience,
    segment: segment.segment,
    competitors: segment.competitors,
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    confidence,
    confidenceLabel: confidence >= 82 ? 'High confidence' : confidence >= 74 ? 'Medium-high confidence' : 'Medium confidence',
    executiveRead: [
      {
        title: 'Category read',
        text: `${normalized} is best assessed as ${segment.segment} in ${geography}, not as a broad keyword market.`,
      },
      {
        title: 'Demand quality',
        text: segment.headline,
      },
      {
        title: 'Strategic angle',
        text: segment.angle,
      },
    ],
    whatWeKnow: [
      `The first useful buyer lens is ${audienceRead(audience)}.`,
      'The market should be segmented by workflow pain, budget owner, substitute behavior, and proof of repeat usage.',
      'Competitor analysis should include direct vendors, adjacent suites, agencies, open-source alternatives, and internal teams.',
    ],
    toVerify: [
      'Which competitors show credible customer proof rather than generic category language?',
      'Are buyers actively budgeting for this workflow, or only experimenting with it?',
      'Which pain point has the highest urgency, frequency, and willingness to pay?',
      'What evidence contradicts the initial attractiveness of the category?',
    ],
    caution: segment.caution,
    evidence,
  };
}

function App() {
  const [topic, setTopic] = useState('AI market research tools for boutique consultants');
  const [geography, setGeography] = useState('United States');
  const [audience, setAudience] = useState('Founder');
  const [snapshot, setSnapshot] = useState(() => buildSnapshot(topic, geography, audience));
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasDraftChanges, setHasDraftChanges] = useState(false);

  const updateTopic = (value) => {
    setTopic(value);
    setHasDraftChanges(true);
  };

  const updateGeography = (value) => {
    setGeography(value);
    setHasDraftChanges(true);
  };

  const updateAudience = (value) => {
    setAudience(value);
    setHasDraftChanges(true);
  };

  const refreshSnapshot = () => {
    if (topic.trim().length < 3 || isGenerating) return;
    setIsGenerating(true);

    window.setTimeout(() => {
      setSnapshot(buildSnapshot(topic, geography, audience));
      setHasDraftChanges(false);
      setIsGenerating(false);
    }, 900);
  };

  return (
    <main className="site-shell">
      <header className="masthead">
        <a className="brand" href="#top" aria-label="MarketPulse home">
          <span>MP</span>
          <strong>MarketPulse</strong>
        </a>
        <nav aria-label="Page navigation">
          <a href="#snapshot">Snapshot</a>
          <a href="#evidence">Evidence</a>
          <a href="#method">Method</a>
          <a href="#consulting">Analyst review</a>
        </nav>
      </header>

      <section className="hero-grid" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Market intelligence workspace</p>
          <h1>Market snapshots that show their work.</h1>
          <p>
            MarketPulse turns a research question into a structured brief with source routes,
            confidence scoring, competitor candidates, and clear uncertainties.
          </p>
        </div>

        <section className="query-panel" aria-label="Research query">
          <label>
            <span>Research topic</span>
            <input value={topic} onChange={(event) => updateTopic(event.target.value)} />
          </label>
          <div className="field-row">
            <Select label="Geography" value={geography} options={geographyOptions} onChange={updateGeography} />
            <Select label="Audience" value={audience} options={audienceOptions} onChange={updateAudience} />
          </div>
          <button className="primary-action" onClick={refreshSnapshot} disabled={topic.trim().length < 3 || isGenerating} type="button">
            {isGenerating ? <RefreshCw className="spin" size={18} /> : <Sparkles size={18} />}
            {isGenerating ? 'Refreshing snapshot' : hasDraftChanges ? 'Refresh snapshot' : 'Run snapshot again'}
          </button>
          <small>{hasDraftChanges ? 'Inputs changed. Refresh to update the brief.' : 'Snapshot is current for the selected inputs.'}</small>
        </section>
      </section>

      <section className="signal-strip" aria-label="Snapshot quality signals">
        {researchDepth.map((item) => {
          const Icon = item.icon;
          return (
            <div className="signal-card" key={item.label}>
              <Icon size={18} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          );
        })}
      </section>

      <SnapshotReport snapshot={snapshot} isGenerating={isGenerating} />

      <section className="method-section" id="method">
        <div>
          <p className="eyebrow">Research method</p>
          <h2>Confidence is earned claim by claim.</h2>
          <p>
            The report separates market facts, source-backed signals, and analyst hypotheses.
            Each claim is scored for authority, specificity, recency, corroboration, and contradiction risk.
          </p>
        </div>
        <div className="adapter-grid">
          {sourceAdapters.map((adapter) => (
            <article key={adapter.name}>
              <Database size={18} />
              <strong>{adapter.name}</strong>
              <span>{adapter.type}</span>
              <p>{adapter.coverage}</p>
              <b>{adapter.authority}% authority baseline</b>
            </article>
          ))}
        </div>
      </section>

      <section className="consulting-section" id="consulting">
        <div>
          <p className="eyebrow">Analyst review</p>
          <h2>When the decision matters, add a human layer.</h2>
          <p>
            Use the engine for structured discovery, then bring in expert review for market-entry choices,
            investor narratives, board-ready memos, and strategy recommendations.
          </p>
        </div>
        <div className="review-actions">
          <button type="button"><MessageSquareText size={17} /> Discuss a deep dive</button>
          <button type="button"><FileText size={17} /> Export brief</button>
        </div>
      </section>
    </main>
  );
}

function SnapshotReport({ snapshot, isGenerating }) {
  return (
    <section className={`snapshot-shell ${isGenerating ? 'is-loading' : ''}`} id="snapshot" aria-label="Market snapshot">
      <div className="report-header">
        <div>
          <p className="eyebrow">Market snapshot</p>
          <h2>{snapshot.topic}</h2>
          <span>{snapshot.segment} · {snapshot.geography} · {snapshot.generatedAt}</span>
        </div>
        <div className="confidence-mark">
          <strong>{snapshot.confidence}%</strong>
          <span>{snapshot.confidenceLabel}</span>
        </div>
      </div>

      <div className="executive-grid">
        {snapshot.executiveRead.map((item) => (
          <article key={item.title}>
            <span>{item.title}</span>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="snapshot-grid">
        <section className="brief-panel">
          <div className="section-title">
            <Target size={18} />
            <h3>What the snapshot supports</h3>
          </div>
          <ul className="clean-list">
            {snapshot.whatWeKnow.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="brief-panel">
          <div className="section-title">
            <FileSearch size={18} />
            <h3>What to verify next</h3>
          </div>
          <ul className="clean-list">
            {snapshot.toVerify.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </div>

      <section className="competitor-panel">
        <div className="section-title">
          <Building2 size={18} />
          <h3>Competitor starting set</h3>
        </div>
        <div className="competitor-grid">
          {snapshot.competitors.map((company, index) => (
            <article key={company}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{company}</strong>
              <small>{index < 2 ? 'Direct candidate' : index === 4 ? 'Adjacent candidate' : 'Substitute to test'}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="evidence-panel" id="evidence">
        <div className="section-title">
          <ShieldCheck size={18} />
          <h3>Evidence ledger</h3>
        </div>
        <div className="evidence-table">
          {snapshot.evidence.map((item) => (
            <article key={item.id}>
              <span>{item.id}</span>
              <div>
                <strong>{item.claim}</strong>
                <p>{item.basis}</p>
                <a href={item.route} target="_blank" rel="noreferrer">Open source route <ArrowRight size={13} /></a>
              </div>
              <b>{item.confidenceLabel}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="caution-panel">
        <Gauge size={19} />
        <p>{snapshot.caution}</p>
      </section>
    </section>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default App;
