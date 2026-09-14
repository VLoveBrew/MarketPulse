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
  LineChart,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

const defaultTopic = 'AI market research tools for boutique consultants';
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
  { label: 'Confidence', value: 'Scored output', icon: ClipboardCheck },
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
    requestSnapshot({ topic: defaultTopic, geography: 'United States', audience: 'Founder' });
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

  const requestSnapshot = async (input = { topic, geography, audience }) => {
    if (input.topic.trim().length < 3 || isGenerating) return;
    setIsGenerating(true);
    setError('');

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
      setSnapshot(report);
      setHasDraftChanges(false);
    } catch (requestError) {
      setError(requestError.message);
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
          <small>{hasDraftChanges ? 'Inputs changed. Run the agent to refresh the brief.' : 'The visible brief is generated by the backend agent.'}</small>
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
          <span>{snapshot.market_category} · {snapshot.geography} · {generatedAt}</span>
        </div>
        <div className="confidence-mark">
          <strong>{snapshot.overall_confidence.score}%</strong>
          <span>{snapshot.overall_confidence.label} confidence</span>
        </div>
      </div>

      <div className="confidence-reason">
        <Gauge size={18} />
        <p>
          {snapshot.overall_confidence.reason}
          {' '}
          The agent found {snapshot.source_summary.records_found} public records across {snapshot.source_summary.adapters_queried} adapters.
        </p>
      </div>

      <div className="executive-grid">
        {snapshot.executive_snapshot.map((item) => (
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
            {snapshot.buyer_pain_points.map((item) => (
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
            {snapshot.risks_and_uncertainties.map((item) => (
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
                <a href={item.source_url} target="_blank" rel="noreferrer">
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
          {snapshot.recommended_next_steps.map((step) => <li key={step}>{step}</li>)}
        </ul>
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
