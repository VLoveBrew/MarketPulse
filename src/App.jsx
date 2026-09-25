import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  Database,
  FileSearch,
  FileText,
  Gauge,
  Globe2,
  HardDriveDownload,
  LineChart,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

const defaultTopic = 'AI market research tools for boutique consultants';
const snapshotStorageKey = 'marketpulse:lastSnapshot';
const audienceOptions = ['Founder', 'Consultant', 'Product marketer', 'Investor', 'Sales leader'];
const geographyOptions = ['United States', 'India', 'Europe', 'Global', 'APAC'];

const sourceAdapters = [
  {
    name: 'GDELT news index',
    type: 'Momentum signal',
    coverage: 'Recent coverage, funding, launches, partnerships, and market activity',
  },
  {
    name: 'OpenAlex research graph',
    type: 'Research validation',
    coverage: 'Academic and technical records that help test maturity and adoption barriers',
  },
  {
    name: 'Wikipedia category search',
    type: 'Market boundary',
    coverage: 'Reference records for terminology, adjacent categories, and baseline context',
  },
  {
    name: 'Public discussions',
    type: 'Buyer language',
    coverage: 'Community signals that may surface workflow friction and substitute behavior',
  },
];

const researchDepth = [
  { label: 'Backend agent', value: 'Live endpoint', icon: Database },
  { label: 'Public sources', value: 'No-key adapters', icon: Globe2 },
  { label: 'Evidence ledger', value: 'Claim-level basis', icon: ShieldCheck },
  { label: 'Reopenable', value: 'Saved on device', icon: HardDriveDownload },
];

function App() {
  const [topic, setTopic] = useState(defaultTopic);
  const [geography, setGeography] = useState('United States');
  const [audience, setAudience] = useState('Founder');
  const [snapshot, setSnapshot] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasDraftChanges, setHasDraftChanges] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedSnapshot = readSavedSnapshot();
    if (savedSnapshot) {
      setSnapshot(savedSnapshot);
    }
    requestSnapshot({ topic: defaultTopic, geography: 'United States', audience: 'Founder' }, { background: Boolean(savedSnapshot) });
  }, []);

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

  const requestSnapshot = async (input = { topic, geography, audience }, options = {}) => {
    if (input.topic.trim().length < 3 || isGenerating) return;
    setIsGenerating(true);
    if (!options.background) {
      setError('');
    }

    try {
      const response = await fetch('/api/market-snapshot', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          topic: input.topic,
          geography: input.geography,
          audience: input.audience,
          depth: 'snapshot',
        }),
      });

      if (!response.ok) {
        throw new Error('The intelligence agent could not return a snapshot.');
      }

      const report = await response.json();
      const liveReport = {
        ...report,
        delivery_mode: 'Live agent',
      };
      setSnapshot(liveReport);
      saveSnapshot(liveReport);
      setHasDraftChanges(false);
    } catch (requestError) {
      const savedSnapshot = readSavedSnapshot(input);
      const fallback = savedSnapshot || buildDeviceSnapshot(input, requestError.message);
      setSnapshot(fallback);
      setHasDraftChanges(false);
      setError(
        savedSnapshot
          ? 'Live research is unavailable right now, so MarketPulse reopened the last saved snapshot on this device.'
          : 'Live research is unavailable right now, so MarketPulse created a device-ready snapshot you can still use.',
      );
    } finally {
      setIsGenerating(false);
    }
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
          <p className="eyebrow">Market intelligence agent</p>
          <h1>Market snapshots that show their work.</h1>
          <p>
            MarketPulse now sends each research question to a backend agent that gathers
            public-source signals, scores evidence, and returns an analyst-ready brief.
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
          <button className="primary-action" onClick={() => requestSnapshot()} disabled={topic.trim().length < 3 || isGenerating} type="button">
            {isGenerating ? <RefreshCw className="spin" size={18} /> : <Sparkles size={18} />}
            {isGenerating ? 'Agent is researching' : hasDraftChanges ? 'Create new snapshot' : 'Run agent again'}
          </button>
          <small>{hasDraftChanges ? 'Inputs changed. Run the agent to refresh the brief.' : snapshot?.delivery_mode || 'Ready for live research.'}</small>
          {error && <p className="error-note">{error}</p>}
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
          <p className="eyebrow">Agent method</p>
          <h2>The backend separates source evidence from analyst synthesis.</h2>
          <p>
            The v1 agent queries public no-key source adapters, extracts source records,
            scores each claim, and returns the agreed JSON contract for the page to render.
          </p>
        </div>
        <div className="adapter-grid">
          {sourceAdapters.map((adapter) => (
            <article key={adapter.name}>
              <Database size={18} />
              <strong>{adapter.name}</strong>
              <span>{adapter.type}</span>
              <p>{adapter.coverage}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="consulting-section" id="consulting">
        <div>
          <p className="eyebrow">Analyst review</p>
          <h2>When the decision matters, add a human layer.</h2>
          <p>
            Use the agent for structured discovery, then bring in expert review for market-entry choices,
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
  if (!snapshot) {
    return (
      <section className="snapshot-shell is-loading" id="snapshot" aria-label="Market snapshot">
        <div className="loading-state">
          <RefreshCw className="spin" size={28} />
          <p className="eyebrow">Backend agent</p>
          <h2>Building the first evidence-backed snapshot.</h2>
          <p>The agent is gathering public signals and preparing the evidence ledger.</p>
        </div>
      </section>
    );
  }

  const evidence = snapshot.evidence_ledger || [];
  const competitors = snapshot.competitors || [];
  const executiveSnapshot = snapshot.executive_snapshot || [];
  const buyerPainPoints = snapshot.buyer_pain_points || [];
  const risks = snapshot.risks_and_uncertainties || [];
  const nextSteps = snapshot.recommended_next_steps || [];
  const confidence = snapshot.overall_confidence || { score: 0, label: 'Low', reason: 'Confidence could not be scored.' };
  const sourceSummary = snapshot.source_summary || { records_found: 0, adapters_queried: 0 };
  const generatedAt = new Date(snapshot.generated_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section className={`snapshot-shell ${isGenerating ? 'is-loading' : ''}`} id="snapshot" aria-label="Market snapshot">
      <div className="report-header">
        <div>
          <p className="eyebrow">Market snapshot</p>
          <h2>{snapshot.topic}</h2>
          <span>{snapshot.market_category} · {snapshot.geography} · {generatedAt} · {snapshot.delivery_mode || 'Live agent'}</span>
        </div>
        <div className="confidence-mark">
          <strong>{confidence.score}%</strong>
          <span>{confidence.label} confidence</span>
        </div>
      </div>

      <div className="confidence-reason">
        <Gauge size={18} />
        <p>
          {confidence.reason}
          {' '}
          The agent found {sourceSummary.records_found} public records across {sourceSummary.adapters_queried} adapters.
        </p>
      </div>

      <div className="executive-grid">
        {executiveSnapshot.map((item) => (
          <article key={item.title}>
            <span>{item.title}</span>
            <p>{item.insight}</p>
            <small>{item.confidence} · {item.supporting_evidence_ids.join(', ') || 'No direct evidence id'}</small>
          </article>
        ))}
      </div>

      <div className="snapshot-grid">
        <section className="brief-panel">
          <div className="section-title">
            <Target size={18} />
            <h3>Buyer pain points</h3>
          </div>
          <ul className="clean-list">
            {buyerPainPoints.map((item) => (
              <li key={item.pain}>
                <strong>{item.pain}</strong>
                <span>{item.evidence}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="brief-panel">
          <div className="section-title">
            <FileSearch size={18} />
            <h3>Risks and uncertainties</h3>
          </div>
          <ul className="clean-list">
            {risks.map((item) => (
              <li key={item.risk}>
                <strong>{item.risk}</strong>
                <span>{item.what_to_verify_next}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="competitor-panel">
        <div className="section-title">
          <Building2 size={18} />
          <h3>Competitor starting set</h3>
        </div>
        <div className="competitor-grid">
          {competitors.map((company, index) => (
            <article key={company.name}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{company.name}</strong>
              <small>{company.type} · {company.confidence}</small>
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
          {evidence.map((item) => (
            <article key={item.id}>
              <span>{item.id}</span>
              <div>
                <strong>{item.claim}</strong>
                <p>{item.summary}</p>
                <a href={item.source_url} target={item.source_url?.startsWith('#') ? undefined : '_blank'} rel="noreferrer">
                  {item.source_title} <ArrowRight size={13} />
                </a>
              </div>
              <b>{item.confidence}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="brief-panel next-steps-panel">
        <div className="section-title">
          <LineChart size={18} />
          <h3>Recommended next steps</h3>
        </div>
        <ul className="clean-list">
          {nextSteps.map((step) => <li key={step}>{step}</li>)}
        </ul>
      </section>
    </section>
  );
}

function readSavedSnapshot(input) {
  try {
    const rawSnapshot = window.localStorage.getItem(snapshotStorageKey);
    if (!rawSnapshot) return null;
    const snapshot = JSON.parse(rawSnapshot);
    if (input && !sameSnapshotRequest(snapshot, input)) return null;
    return {
      ...snapshot,
      delivery_mode: 'Saved on device',
    };
  } catch {
    return null;
  }
}

function saveSnapshot(snapshot) {
  try {
    window.localStorage.setItem(snapshotStorageKey, JSON.stringify(snapshot));
  } catch {
    // Device storage can be unavailable in private browsing or restricted modes.
  }
}

function sameSnapshotRequest(snapshot, input) {
  return normalizeText(snapshot.topic) === normalizeText(input.topic)
    && normalizeText(snapshot.geography) === normalizeText(input.geography)
    && normalizeText(snapshot.audience) === normalizeText(input.audience);
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function buildDeviceSnapshot(input, failureReason) {
  const topic = input.topic.trim();
  const segment = localSegmentFor(topic);

  return {
    topic,
    geography: input.geography,
    audience: input.audience,
    depth: 'snapshot',
    market_category: segment.category,
    generated_at: new Date().toISOString(),
    delivery_mode: 'Device fallback',
    overall_confidence: {
      score: 48,
      label: 'Low',
      reason: 'This is a device-local continuity snapshot. It keeps the workflow usable until live public-source collection is available again.',
    },
    executive_snapshot: [
      {
        title: 'Category read',
        insight: `${topic} should be framed as ${segment.category} until live source checks confirm the category boundary.`,
        confidence: 'Low',
        supporting_evidence_ids: ['D01'],
      },
      {
        title: 'Demand signal',
        insight: segment.demand,
        confidence: 'Low',
        supporting_evidence_ids: ['D02'],
      },
      {
        title: 'Strategic angle',
        insight: segment.angle,
        confidence: 'Low',
        supporting_evidence_ids: ['D03'],
      },
    ],
    competitors: segment.competitors.map((name, index) => ({
      name,
      type: index < 2 ? 'direct candidate' : 'adjacent candidate',
      why_relevant: 'Device-local starting set that should be verified by live research.',
      confidence: 'Low',
      source_ids: ['D01'],
    })),
    buyer_pain_points: [
      {
        pain: 'The market boundary still needs live validation.',
        evidence: 'This fallback uses local category logic, not fresh public-source retrieval.',
        confidence: 'Low',
      },
      {
        pain: 'Competitor relevance may change by geography and buyer segment.',
        evidence: 'Use this as a research starting point, then rerun the live agent when connected.',
        confidence: 'Low',
      },
    ],
    opportunities: [
      {
        opportunity: segment.angle,
        why_it_matters: 'A narrow wedge gives the next live research pass a sharper hypothesis to test.',
        confidence: 'Low',
      },
    ],
    risks_and_uncertainties: [
      {
        risk: 'The live intelligence agent could not be reached.',
        why_it_matters: 'Fresh market evidence, source links, and confidence scoring require the backend and public-source access.',
        what_to_verify_next: failureReason || 'Reconnect and run the agent again.',
      },
      {
        risk: segment.caution,
        why_it_matters: 'A local fallback should not be treated as strategy-grade evidence.',
        what_to_verify_next: 'Validate competitors, buyer pain, pricing, customer proof, and recent market movement.',
      },
    ],
    evidence_ledger: [
      {
        id: 'D01',
        claim: `MarketPulse identified ${segment.category} as the likely working category for ${topic}.`,
        source_title: 'Device-local category model',
        source_url: '#method',
        source_type: 'local model',
        date: new Date().toISOString(),
        summary: 'Generated locally so the app remains usable when live research is unavailable.',
        confidence: 'Low',
        score: 48,
      },
      {
        id: 'D02',
        claim: segment.demand,
        source_title: 'Device-local demand heuristic',
        source_url: '#method',
        source_type: 'local model',
        date: new Date().toISOString(),
        summary: 'A continuity hypothesis for the next live research pass.',
        confidence: 'Low',
        score: 46,
      },
      {
        id: 'D03',
        claim: segment.angle,
        source_title: 'Device-local strategy heuristic',
        source_url: '#method',
        source_type: 'local model',
        date: new Date().toISOString(),
        summary: 'A starting strategy angle, not a sourced conclusion.',
        confidence: 'Low',
        score: 46,
      },
    ],
    source_summary: {
      adapters_queried: 0,
      records_found: 0,
      failures: [failureReason || 'Live source collection unavailable.'],
    },
    recommended_next_steps: [
      'Reconnect and run the live agent to refresh the evidence ledger.',
      'Use this fallback only as a working hypothesis.',
      'Verify the competitor set against source-backed public evidence.',
      'Save or export the live snapshot before field testing.',
    ],
  };
}

function localSegmentFor(topic) {
  const lowerTopic = topic.toLowerCase();
  if (['health', 'clinic', 'doctor', 'dental', 'patient', 'hospital'].some((term) => lowerTopic.includes(term))) {
    return {
      category: 'Healthcare operations technology',
      competitors: ['Abridge', 'Nabla', 'Suki AI', 'Freed', 'Tebra'],
      demand: 'Demand is likely tied to documentation burden, staffing pressure, and compliance-sensitive workflows.',
      angle: 'Focus on a specialty workflow where domain context and auditability matter.',
      caution: 'Healthcare claims need compliance and workflow-owner validation.',
    };
  }
  if (['fintech', 'finance', 'bank', 'payment', 'lending', 'wealth'].some((term) => lowerTopic.includes(term))) {
    return {
      category: 'Financial services technology',
      competitors: ['Plaid', 'Stripe', 'Adyen', 'Modern Treasury', 'Unit'],
      demand: 'Demand is likely strongest where the tool reduces integration friction, audit burden, or operational risk.',
      angle: 'Focus on a regulated workflow where trust and reliability are stronger differentiators than feature breadth.',
      caution: 'Compliance constraints and partner dependencies can materially change the opportunity.',
    };
  }
  if (['ai', 'automation', 'copilot', 'agent', 'llm'].some((term) => lowerTopic.includes(term))) {
    return {
      category: 'AI-enabled workflow software',
      competitors: ['Perplexity Enterprise', 'Glean', 'Hebbia', 'Harvey', 'Dust'],
      demand: 'Interest may be high, but durable demand depends on repeatable workflow value and credible proof.',
      angle: 'Focus on role-specific intelligence with traceability, workflow memory, and clear output quality.',
      caution: 'AI markets are crowded and need stronger evidence than announcement volume.',
    };
  }
  if (['saas', 'b2b', 'enterprise', 'sales', 'marketing', 'crm'].some((term) => lowerTopic.includes(term))) {
    return {
      category: 'B2B software and services',
      competitors: ['HubSpot', 'Salesforce', 'Gong', '6sense', 'Clari'],
      demand: 'Budget is most likely when the use case maps directly to revenue growth, cost reduction, or risk control.',
      angle: 'Start with one high-value buyer workflow before widening the platform story.',
      caution: 'Incumbent suites and internal workflows are likely substitutes.',
    };
  }
  return {
    category: 'Emerging business category',
    competitors: ['Incumbent suites', 'Vertical specialists', 'Agency substitutes', 'Open-source tooling', 'Internal teams'],
    demand: 'The first useful question is whether the category maps to a painful budgeted workflow.',
    angle: 'Narrow the topic around a buyer, a painful workflow, and the substitute currently absorbing the budget.',
    caution: 'Broad category labels can create false confidence without source-backed market boundaries.',
  };
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
