import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Gauge,
  Globe2,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Unlock,
  Users,
  Zap,
} from 'lucide-react';

const moduleCatalog = [
  {
    id: 'competitor-deep-dive',
    name: 'Competitor deep dive',
    price: 29,
    icon: Building2,
    detail: 'Full profiles, positioning, pricing clues, GTM motion, strengths, and weaknesses.',
  },
  {
    id: 'market-sizing',
    name: 'Market sizing estimate',
    price: 49,
    icon: Gauge,
    detail: 'TAM, SAM, SOM assumptions with confidence bands and source traceability.',
  },
  {
    id: 'opportunity-score',
    name: 'Opportunity score',
    price: 49,
    icon: Target,
    detail: 'Attractiveness score across urgency, budget, growth, fragmentation, and defensibility.',
  },
  {
    id: 'strategic-recommendations',
    name: 'Strategic recommendations',
    price: 99,
    icon: BriefcaseBusiness,
    detail: 'Entry angles, wedge segments, pricing moves, partnership plays, and key risks.',
  },
];

const sampleSignals = [
  'Hiring demand is a useful proxy for budget formation and category momentum.',
  'Pricing-page maturity can separate real products from AI-wrapper experiments.',
  'Customer complaints are often more valuable than press releases for whitespace.',
  'A market with many narrow specialists usually rewards a vertical wedge first.',
];

const audienceOptions = ['Founder', 'Consultant', 'Product marketer', 'Investor', 'Sales leader'];
const geographyOptions = ['United States', 'India', 'Europe', 'Global', 'APAC'];

function inferResearch(topic, geography, audience) {
  const normalized = topic.trim() || 'AI tools for B2B sales teams';
  const lower = normalized.toLowerCase();
  const isAi = lower.includes('ai') || lower.includes('automation') || lower.includes('copilot');
  const isHealthcare = lower.includes('health') || lower.includes('clinic') || lower.includes('doctor') || lower.includes('dental');
  const isFinance = lower.includes('fintech') || lower.includes('finance') || lower.includes('bank') || lower.includes('payment');
  const isEnterprise = lower.includes('enterprise') || lower.includes('b2b') || lower.includes('saas');

  const category = isAi
    ? 'AI-enabled workflow software'
    : isHealthcare
      ? 'Healthcare operations technology'
      : isFinance
        ? 'Financial services technology'
        : isEnterprise
          ? 'B2B software and services'
          : 'Emerging business category';

  const competitors = isHealthcare
    ? ['Abridge', 'Nabla', 'Suki AI', 'Freed', 'Tebra']
    : isFinance
      ? ['Plaid', 'Stripe', 'Adyen', 'Modern Treasury', 'Unit']
      : isAi
        ? ['Perplexity Enterprise', 'Glean', 'Hebbia', 'Harvey', 'Dust']
        : ['Incumbent suites', 'Vertical specialists', 'Agency substitutes', 'Open-source tooling', 'Internal teams'];

  const buyer = audience === 'Investor'
    ? 'investors screening category momentum and defensibility'
    : audience === 'Product marketer'
      ? 'marketing teams shaping positioning and battlecards'
      : audience === 'Consultant'
        ? 'consultants producing client-ready intelligence faster'
        : audience === 'Sales leader'
          ? 'sales teams entering new accounts or verticals'
          : 'founders validating whether the opportunity deserves deeper work';

  return {
    topic: normalized,
    category,
    competitors,
    buyer,
    confidence: isAi || isHealthcare || isFinance || isEnterprise ? 'Medium-high' : 'Medium',
    attractiveness: isAi ? 84 : isHealthcare ? 78 : isFinance ? 74 : 69,
    urgency: isHealthcare ? 'Workflow pressure and compliance complexity create urgent buyer pain.' : isAi ? 'Teams are actively searching for productivity gains and defensible AI workflows.' : 'Demand needs segmentation before a strong wedge is obvious.',
    marketDefinition: `${normalized} in ${geography} appears to sit inside ${category}. The likely buyer is ${buyer}.`,
    whitespace: isAi
      ? 'The strongest wedge may be workflow-specific intelligence, not another general assistant.'
      : isHealthcare
        ? 'The opportunity is likely in specialty workflows where generic tools miss compliance and context.'
        : isFinance
          ? 'The opportunity depends on reducing integration friction and audit burden for a narrow use case.'
          : 'The first paid research should identify a painful buyer workflow and compare substitutes.',
  };
}

function App() {
  const [topic, setTopic] = useState('AI market research tools for boutique consultants');
  const [geography, setGeography] = useState('United States');
  const [audience, setAudience] = useState('Founder');
  const [selectedModules, setSelectedModules] = useState(['competitor-deep-dive', 'opportunity-score']);
  const [depth, setDepth] = useState('snapshot');
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedTotal = moduleCatalog
    .filter((item) => selectedModules.includes(item.id))
    .reduce((total, item) => total + item.price, 0);
  const canGenerate = topic.trim().length > 2 && !isGenerating;

  const clearReport = () => {
    setGeneratedReport(null);
    setIsGenerating(false);
  };

  const toggleModule = (id) => {
    setSelectedModules((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const generateSnapshot = () => {
    if (!canGenerate) return;
    setDepth('snapshot');
    setIsGenerating(true);

    window.setTimeout(() => {
      setGeneratedReport({
        ...inferResearch(topic, geography, audience),
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setIsGenerating(false);
    }, 900);
  };

  return (
    <main className="app-shell">
      <aside className="side-rail" aria-label="Product navigation">
        <div className="brand-lockup">
          <span className="brand-mark">MI</span>
          <div>
            <strong>MarketPulse</strong>
            <small>Intelligence Engine</small>
          </div>
        </div>
        <nav className="rail-nav">
          <a className="active" href="#research"><Search size={18} /> Research</a>
          <a href="#modules"><Unlock size={18} /> Paid modules</a>
          <a href="#mcp"><Bot size={18} /> MCP access</a>
          <a href="#consulting"><BriefcaseBusiness size={18} /> Consultant desk</a>
        </nav>
        <div className="rail-panel">
          <span>Monetization model</span>
          <strong>Free snapshot to paid insight ladder</strong>
          <p>Use the automated report as lead capture, then monetize depth, exports, tracking, and expert strategy review.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="top-bar">
          <div>
            <p className="eyebrow">Market and competitor intelligence prototype</p>
            <h1>Turn a business question into a sourced market brief.</h1>
          </div>
          <button className="ghost-button" type="button">
            <FileText size={18} />
            Export preview
          </button>
        </header>

        <section className="query-band" id="research" aria-label="Research query">
          <div className="query-copy">
            <span><Sparkles size={16} /> Free market snapshot</span>
            <h2>Research any market, product category, company, or startup idea.</h2>
          </div>
          <div className="query-controls">
            <label className="topic-field">
              <span>Research topic</span>
              <input
                value={topic}
                onChange={(event) => {
                  setTopic(event.target.value);
                  clearReport();
                }}
                placeholder="Example: EV battery recycling in India"
              />
            </label>
            <div className="control-row">
              <Select
                label="Geography"
                value={geography}
                options={geographyOptions}
                onChange={(value) => {
                  setGeography(value);
                  clearReport();
                }}
              />
              <Select
                label="Audience"
                value={audience}
                options={audienceOptions}
                onChange={(value) => {
                  setAudience(value);
                  clearReport();
                }}
              />
            </div>
            <button className="primary-button generate-button" disabled={!canGenerate} onClick={generateSnapshot} type="button">
              {isGenerating ? 'Generating snapshot...' : 'Generate free snapshot'}
              {!isGenerating && <ArrowRight size={18} />}
            </button>
          </div>
        </section>

        <section className="status-strip" aria-label="Report status">
          <Metric icon={Zap} label="Free snapshot" value={generatedReport ? 'Generated' : isGenerating ? 'Running' : 'Ready'} />
          <Metric icon={ShieldCheck} label="Claim discipline" value="Evidence ledger" />
          <Metric icon={CircleDollarSign} label="Paid unlocks" value={`$${selectedTotal || 0}`} />
          <Metric icon={Users} label="Human review" value="From $750" />
        </section>

        <div className="main-grid">
          <ReportSurface report={generatedReport} isGenerating={isGenerating} onGenerate={generateSnapshot} />

          <aside className="commerce-column" id="modules" aria-label="Paid insight modules">
            <section className="checkout-card">
              <p className="eyebrow">Deep-dive unlock</p>
              <h2>Charge for analysis modules, not longer text.</h2>
              <div className="depth-toggle" role="tablist" aria-label="Report depth">
                <button className={depth === 'snapshot' ? 'active' : ''} onClick={() => setDepth('snapshot')} type="button">Snapshot</button>
                <button className={depth === 'deep' ? 'active' : ''} onClick={() => setDepth('deep')} type="button">Deep dive</button>
              </div>

              <div className="module-list">
                {moduleCatalog.map((module) => {
                  const Icon = module.icon;
                  const active = selectedModules.includes(module.id);
                  return (
                    <button
                      className={`module-item ${active ? 'selected' : ''}`}
                      key={module.id}
                      onClick={() => toggleModule(module.id)}
                      type="button"
                    >
                      <span className="module-icon"><Icon size={18} /></span>
                      <span>
                        <strong>{module.name}</strong>
                        <small>{module.detail}</small>
                      </span>
                      <b>${module.price}</b>
                    </button>
                  );
                })}
              </div>

              <div className="total-row">
                <span>Selected insight pack</span>
                <strong>${selectedTotal}</strong>
              </div>
              <button className="primary-button" type="button">
                Unlock deep-dive report
                <ArrowRight size={18} />
              </button>
            </section>

            <section className="mcp-card" id="mcp">
              <div className="mcp-header">
                <Bot size={22} />
                <div>
                  <p className="eyebrow">Premium integration</p>
                  <h3>MCP tools for AI-native teams</h3>
                </div>
              </div>
              <code>research_market</code>
              <code>map_competitors</code>
              <code>score_opportunity</code>
              <code>generate_brief</code>
              <p>Make MCP access a Pro or Agency feature once the research workflow is valuable.</p>
            </section>
          </aside>
        </div>

        <section className="consulting-band" id="consulting">
          <div>
            <p className="eyebrow">Human consultant upgrade</p>
            <h2>For high-stakes decisions, sell expert synthesis on top of the engine.</h2>
            <p>Offer senior review, strategic options, market-entry memos, GTM recommendations, and investor-ready narratives at a lower price than traditional strategy consulting.</p>
          </div>
          <div className="offer-grid">
            <Offer title="Expert review" price="$750+" text="Refine the AI report, validate weak claims, and sharpen the strategic takeaways." />
            <Offer title="Strategic deep dive" price="$2,500+" text="Custom research, interviews if needed, category map, risks, and recommended market wedge." />
            <Offer title="Retainer desk" price="$5,000/mo" text="Recurring competitor tracking, alerts, battlecards, and leadership-ready briefs." />
          </div>
        </section>

        <section className="pricing-ladder">
          <p className="eyebrow">Suggested monetization ladder</p>
          <div className="ladder">
            <Step label="Free" value="Snapshot" />
            <Step label="$29-$199" value="Paid modules" />
            <Step label="$149/mo" value="Pro workspace" />
            <Step label="$999/mo" value="Agency + MCP" />
            <Step label="$2.5k+" value="Consulting" />
          </div>
        </section>
      </section>
    </main>
  );
}

function ReportSurface({ report, isGenerating, onGenerate }) {
  if (isGenerating) {
    return (
      <section className="report-surface report-state" aria-label="Market report generation">
        <div className="generating-mark">
          <Sparkles size={28} />
        </div>
        <p className="eyebrow">Generating free snapshot</p>
        <h2>Building the first market read.</h2>
        <div className="generation-steps">
          <span><Check size={16} /> Defining the market boundary</span>
          <span><Check size={16} /> Mapping likely competitor types</span>
          <span><Check size={16} /> Estimating signal strength and confidence</span>
        </div>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="report-surface report-state" aria-label="Market report empty state">
        <div className="empty-report-icon">
          <FileText size={30} />
        </div>
        <p className="eyebrow">No report generated yet</p>
        <h2>Start with the free market snapshot.</h2>
        <p>
          The first output gives the user a useful market definition, demand signal,
          competitor shortlist, and upgrade prompts for deeper paid analysis.
        </p>
        <div className="snapshot-includes">
          <span>Market definition</span>
          <span>Initial competitors</span>
          <span>Demand signal</span>
          <span>Confidence level</span>
        </div>
        <button className="secondary-action" onClick={onGenerate} type="button">
          Generate sample snapshot
          <ArrowRight size={16} />
        </button>
      </section>
    );
  }

  return (
    <section className="report-surface" aria-label="Market report">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Generated free snapshot</p>
          <h2>{report.topic}</h2>
          <small className="generated-meta">Generated at {report.generatedAt}</small>
        </div>
        <span className="confidence">{report.confidence} confidence</span>
      </div>

      <div className="brief-grid">
        <InsightBlock
          icon={Globe2}
          title="Market definition"
          text={report.marketDefinition}
        />
        <InsightBlock
          icon={BarChart3}
          title="Demand signal"
          text={report.urgency}
        />
        <InsightBlock
          icon={Layers3}
          title="Whitespace hypothesis"
          text={report.whitespace}
        />
      </div>

      <section className="snapshot-summary">
        <div>
          <span>Category</span>
          <strong>{report.category}</strong>
        </div>
        <div>
          <span>Likely buyer</span>
          <strong>{report.buyer}</strong>
        </div>
        <div>
          <span>Attractiveness</span>
          <strong>{report.attractiveness}/100</strong>
        </div>
      </section>

      <section className="competitor-section">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Competitor landscape</p>
            <h3>Initial players to investigate</h3>
          </div>
          <span className="locked-pill"><LockKeyhole size={14} /> Full profiles locked</span>
        </div>
        <div className="competitor-table">
          {report.competitors.map((company, index) => (
            <div className="competitor-row" key={company}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{company}</strong>
              <small>{index < 2 ? 'Direct competitor' : index === 4 ? 'Adjacent player' : 'Substitute or emerging player'}</small>
              <button type="button">Preview <ChevronRight size={15} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="evidence-band">
        <div>
          <p className="eyebrow">Evidence ledger</p>
          <h3>Every claim should resolve to sources, timestamps, and confidence.</h3>
        </div>
        <ul>
          {sampleSignals.map((signal) => <li key={signal}>{signal}</li>)}
        </ul>
      </section>

      <section className="report-upsell">
        <div>
          <p className="eyebrow">Next best paid step</p>
          <h3>Unlock deeper competitor profiles and opportunity scoring for this topic.</h3>
        </div>
        <button className="primary-button" type="button">
          Choose deep-dive modules
          <ArrowRight size={18} />
        </button>
      </section>
    </section>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InsightBlock({ icon: Icon, title, text }) {
  return (
    <article className="insight-block">
      <Icon size={20} />
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Offer({ title, price, text }) {
  return (
    <article className="offer-card">
      <strong>{title}</strong>
      <span>{price}</span>
      <p>{text}</p>
      <button type="button">Request scope <MessageSquareText size={15} /></button>
    </article>
  );
}

function Step({ label, value }) {
  return (
    <div className="ladder-step">
      <span>{label}</span>
      <strong>{value}</strong>
      <Check size={16} />
    </div>
  );
}

export default App;
