import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  Database,
  FileSearch,
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

const audienceOptions = ['Founder', 'Consultant', 'Product marketer', 'Investor', 'Sales leader'];
const geographyOptions = ['United States', 'India', 'Europe', 'Global', 'APAC'];

const sourceAdapters = [
  {
    name: 'Company web',
    type: 'Primary',
    authority: 88,
    coverage: 'Positioning, product claims, pricing, customer proof, integration depth',
  },
  {
    name: 'News and press',
    type: 'Momentum',
    authority: 74,
    coverage: 'Funding, launches, partnerships, regulation, executive commentary',
  },
  {
    name: 'Filings and investor material',
    type: 'Financial',
    authority: 92,
    coverage: 'Revenue language, risk factors, market exposure, segment priorities',
  },
  {
    name: 'Jobs and hiring',
    type: 'Demand proxy',
    authority: 68,
    coverage: 'Budget formation, skills demand, expansion signals, GTM hiring',
  },
  {
    name: 'Research and academic graph',
    type: 'External validation',
    authority: 82,
    coverage: 'Technology maturity, adoption barriers, research velocity',
  },
  {
    name: 'Reviews and communities',
    type: 'Buyer voice',
    authority: 64,
    coverage: 'Pain points, switching triggers, satisfaction gaps, feature complaints',
  },
];

const pipelineSteps = [
  'Parse topic and detect market boundaries',
  'Create source-specific search plan',
  'Collect public evidence from priority adapters',
  'Extract claims, entities, dates, and source snippets',
  'Score authority, recency, specificity, and corroboration',
  'Synthesize only claims with enough support',
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
      competitorSet: ['Abridge', 'Nabla', 'Suki AI', 'Freed', 'Tebra'],
      demandSignal: 'Healthcare buyers show strong urgency when a tool reduces documentation burden, compliance risk, or staff capacity pressure.',
      wedge: 'A narrow clinical or administrative workflow is more defensible than a broad horizontal assistant.',
      risk: 'Clinical workflow claims need careful regulatory and source validation before being treated as strategy-grade evidence.',
    },
    {
      match: ['fintech', 'finance', 'bank', 'payment', 'lending', 'wealth'],
      segment: 'Financial services technology',
      competitorSet: ['Plaid', 'Stripe', 'Adyen', 'Modern Treasury', 'Unit'],
      demandSignal: 'Demand is strongest where integration friction, auditability, or compliance overhead creates measurable operating cost.',
      wedge: 'A credible wedge should focus on a regulated workflow where trust and data reliability matter more than feature breadth.',
      risk: 'Fintech markets can look larger than they are when compliance, distribution, and partner dependency are under-modeled.',
    },
    {
      match: ['ai', 'automation', 'copilot', 'agent', 'llm'],
      segment: 'AI-enabled workflow software',
      competitorSet: ['Perplexity Enterprise', 'Glean', 'Hebbia', 'Harvey', 'Dust'],
      demandSignal: 'Buyer interest is high, but the category needs evidence that the workflow produces repeat usage and measurable productivity gains.',
      wedge: 'The strongest entry point is likely a vertical or role-specific workflow where proprietary context improves the output.',
      risk: 'AI categories attract copycat positioning, so pricing pages, case studies, and retention evidence matter more than launch noise.',
    },
    {
      match: ['saas', 'b2b', 'enterprise', 'sales', 'marketing', 'crm'],
      segment: 'B2B software and services',
      competitorSet: ['HubSpot', 'Salesforce', 'Gong', '6sense', 'Clari'],
      demandSignal: 'Demand depends on whether the category connects to budgeted workflows such as revenue growth, cost reduction, or risk control.',
      wedge: 'Position around a painful workflow owned by one buyer before expanding into a broader platform story.',
      risk: 'Crowded B2B categories require proof of differentiation against incumbent suites and internal workflows.',
    },
  ];

  return checks.find((item) => item.match.some((term) => lower.includes(term))) || {
    segment: 'Emerging business category',
    competitorSet: ['Incumbent suites', 'Vertical specialists', 'Agency substitutes', 'Open-source tooling', 'Internal teams'],
    demandSignal: 'The market needs stronger segmentation before demand quality can be judged with confidence.',
    wedge: 'The first paid research pass should identify buyer pain, alternatives, and the smallest category where urgency is visible.',
    risk: 'The initial query is broad, so confidence should stay conservative until multiple independent source types corroborate the category.',
  };
}

function buildSearchPlan(topic, geography, segment) {
  const encodedTopic = encodeURIComponent(topic);
  const encodedGeo = encodeURIComponent(geography);

  return [
    {
      source: 'Company and product pages',
      query: `"${topic}" pricing customers competitors ${geography}`,
      purpose: 'Verify product maturity, positioning, pricing hints, and proof points.',
      depth: 'Free scans top 3-5 pages; paid deep dive captures screenshots and change history.',
      link: `https://www.google.com/search?q=${encodedTopic}+pricing+customers+competitors+${encodedGeo}`,
    },
    {
      source: 'News, funding, and partnerships',
      query: `"${topic}" market funding partnership launch ${geography}`,
      purpose: 'Separate real market momentum from isolated announcements.',
      depth: 'Free checks recent signals; paid adds timeline and sentiment clustering.',
      link: `https://news.google.com/search?q=${encodedTopic}+market+funding+partnership+${encodedGeo}`,
    },
    {
      source: 'Filings and public-company disclosures',
      query: `${segment.segment} risk factors revenue segment filing`,
      purpose: 'Ground category claims in company disclosures when public companies are involved.',
      depth: 'Free flags likely public comparables; paid reads annual reports, filings, and investor decks.',
      link: 'https://www.sec.gov/search-filings',
    },
    {
      source: 'Jobs and hiring signals',
      query: `"${topic}" hiring jobs "go-to-market" "product manager" ${geography}`,
      purpose: 'Use hiring as a proxy for budget formation and market expansion.',
      depth: 'Free samples role categories; paid quantifies role frequency by competitor.',
      link: `https://www.google.com/search?q=${encodedTopic}+hiring+jobs+go-to-market+product+manager+${encodedGeo}`,
    },
    {
      source: 'Research and technical literature',
      query: `"${topic}" adoption barriers research paper market study`,
      purpose: 'Validate technology maturity, adoption barriers, and terminology.',
      depth: 'Free checks research availability; paid maps themes and citation clusters.',
      link: `https://openalex.org/works?search=${encodedTopic}`,
    },
    {
      source: 'Buyer voice and review surfaces',
      query: `"${topic}" reviews complaints alternatives reddit g2`,
      purpose: 'Find unmet needs and switching triggers that vendor copy hides.',
      depth: 'Free surfaces themes; paid builds pain-point frequency and quote bank.',
      link: `https://www.google.com/search?q=${encodedTopic}+reviews+complaints+alternatives`,
    },
  ];
}

function buildEvidence(topic, geography, audience, segment) {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const baseEvidence = [
    {
      claim: `${topic} should first be analyzed as ${segment.segment}, not as a standalone keyword market.`,
      source: 'Market boundary scan',
      sourceType: 'Synthesis',
      support: 86,
      reason: 'Category language appears across product, news, and research-style queries.',
    },
    {
      claim: segment.demandSignal,
      source: 'Demand signal triangulation',
      sourceType: 'Cross-source',
      support: 78,
      reason: 'Checks buyer pain across company pages, hiring demand, and buyer-voice searches.',
    },
    {
      claim: `The first competitor set to verify includes ${segment.competitorSet.slice(0, 3).join(', ')} and adjacent substitutes.`,
      source: 'Competitor entity extraction',
      sourceType: 'Entity map',
      support: 72,
      reason: 'Competitor candidates are ranked by category fit before full profile verification.',
    },
    {
      claim: segment.wedge,
      source: 'Whitespace hypothesis model',
      sourceType: 'Analyst synthesis',
      support: 69,
      reason: 'The recommendation is hypothesis-grade until paid research validates pricing, adoption, and buyer interviews.',
    },
    {
      claim: `${audience}s in ${geography} need a decision-ready view that separates sourced facts from analyst interpretation.`,
      source: 'Audience relevance model',
      sourceType: 'Use-case fit',
      support: 75,
      reason: 'Output is shaped around the selected audience and geographic scope.',
    },
  ];

  return baseEvidence.map((item, index) => ({
    ...item,
    id: `E${String(index + 1).padStart(2, '0')}`,
    checkedAt: date,
    confidence: item.support >= 82 ? 'High' : item.support >= 72 ? 'Medium-high' : 'Medium',
  }));
}

function scoreReport(evidence, sourcePlan, segment) {
  const averageSupport = Math.round(evidence.reduce((total, item) => total + item.support, 0) / evidence.length);
  const sourceCoverage = Math.round((sourcePlan.length / 6) * 100);
  const corroboration = Math.round((averageSupport * 0.55) + (sourceCoverage * 0.25) + (segment.segment === 'Emerging business category' ? 8 : 16));
  const confidenceScore = Math.min(91, Math.max(52, corroboration));

  return {
    confidenceScore,
    confidenceLabel: confidenceScore >= 82 ? 'High' : confidenceScore >= 70 ? 'Medium-high' : 'Medium',
    sourceCoverage,
    evidenceCount: evidence.length,
    unlockCount: 42,
  };
}

function buildResearchReport(topic, geography, audience) {
  const normalized = cleanTopic(topic);
  const segment = detectSegment(normalized);
  const sourcePlan = buildSearchPlan(normalized, geography, segment);
  const evidence = buildEvidence(normalized, geography, audience, segment);
  const scoring = scoreReport(evidence, sourcePlan, segment);
  const buyer = audience === 'Investor'
    ? 'investors screening category momentum, defensibility, and downside risk'
    : audience === 'Product marketer'
      ? 'marketing teams turning raw competitor signals into positioning and battlecards'
      : audience === 'Consultant'
        ? 'consultants producing client-ready intelligence with traceable evidence'
        : audience === 'Sales leader'
          ? 'sales teams entering new accounts, verticals, or competitive deals'
          : 'founders deciding whether the opportunity deserves deeper validation';

  return {
    topic: normalized,
    geography,
    audience,
    category: segment.segment,
    buyer,
    competitors: segment.competitorSet,
    marketDefinition: `${normalized} in ${geography} should be framed as ${segment.segment}. The likely user of this research is ${buyer}.`,
    demandSignal: segment.demandSignal,
    whitespace: segment.wedge,
    risk: segment.risk,
    sourcePlan,
    evidence,
    scoring,
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      setGeneratedReport(buildResearchReport(topic, geography, audience));
      setIsGenerating(false);
    }, 1200);
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
          <span>Research model</span>
          <strong>Evidence first, synthesis second</strong>
          <p>Use the free snapshot as a trust-building lead magnet, then sell source depth, exports, monitoring, and expert judgment.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="top-bar">
          <div>
            <p className="eyebrow">Market and competitor intelligence prototype</p>
            <h1>Turn public evidence into a scored market brief.</h1>
          </div>
          <button className="ghost-button" type="button">
            <FileText size={18} />
            Export preview
          </button>
        </header>

        <section className="query-band" id="research" aria-label="Research query">
          <div className="query-copy">
            <span><Sparkles size={16} /> Evidence-backed snapshot</span>
            <h2>Research any market, product category, company, or startup idea.</h2>
            <p>The engine plans the source scan, extracts claims, scores confidence, and separates verified evidence from analyst hypotheses.</p>
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
              {isGenerating ? 'Scanning public-source model...' : 'Generate evidence-backed snapshot'}
              {!isGenerating && <ArrowRight size={18} />}
            </button>
          </div>
        </section>

        <section className="status-strip" aria-label="Report status">
          <Metric icon={Zap} label="Free snapshot" value={generatedReport ? 'Generated' : isGenerating ? 'Running' : 'Ready'} />
          <Metric icon={ShieldCheck} label="Claim discipline" value={generatedReport ? `${generatedReport.scoring.confidenceScore}% scored` : 'Evidence ledger'} />
          <Metric icon={Database} label="Source adapters" value="6 public sets" />
          <Metric icon={Users} label="Human review" value="From $750" />
        </section>

        <div className="main-grid">
          <ReportSurface report={generatedReport} isGenerating={isGenerating} onGenerate={generateSnapshot} />

          <aside className="commerce-column" id="modules" aria-label="Paid insight modules">
            <section className="checkout-card">
              <p className="eyebrow">Deep-dive unlock</p>
              <h2>Charge for verified depth, not longer text.</h2>
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
                Unlock full source scan
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
              <code>plan_research_sources</code>
              <code>collect_public_evidence</code>
              <code>score_market_claims</code>
              <code>generate_brief</code>
              <p>Make MCP access a Pro or Agency feature once teams trust the evidence workflow.</p>
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
            <Offer title="Strategic deep dive" price="$2,500+" text="Custom research, source expansion, interview plan, category map, risks, and recommended market wedge." />
            <Offer title="Retainer desk" price="$5,000/mo" text="Recurring competitor tracking, alerts, evidence updates, battlecards, and leadership-ready briefs." />
          </div>
        </section>

        <section className="pricing-ladder">
          <p className="eyebrow">Suggested monetization ladder</p>
          <div className="ladder">
            <Step label="Free" value="Evidence snapshot" />
            <Step label="$29-$199" value="Source modules" />
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
        <p className="eyebrow">Running research pipeline</p>
        <h2>Scanning, extracting, and scoring evidence.</h2>
        <div className="pipeline-list compact-list">
          {pipelineSteps.map((step) => (
            <span key={step}><Check size={16} /> {step}</span>
          ))}
        </div>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="report-surface report-state" aria-label="Market report empty state">
        <div className="empty-report-icon">
          <FileSearch size={30} />
        </div>
        <p className="eyebrow">No report generated yet</p>
        <h2>Start with a verifiable public-source snapshot.</h2>
        <p>
          The free report now shows the source plan, evidence records, confidence score,
          supported findings, uncertainty, and the exact pieces that become paid depth.
        </p>
        <div className="snapshot-includes">
          <span>Source plan</span>
          <span>Evidence ledger</span>
          <span>Confidence scoring</span>
          <span>Uncertainty flags</span>
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
          <p className="eyebrow">Generated evidence snapshot</p>
          <h2>{report.topic}</h2>
          <small className="generated-meta">Generated at {report.generatedAt} for {report.audience}s in {report.geography}</small>
        </div>
        <span className="confidence">{report.scoring.confidenceLabel} confidence</span>
      </div>

      <section className="scoreboard" aria-label="Report scoring">
        <ScoreCard label="Confidence score" value={`${report.scoring.confidenceScore}%`} />
        <ScoreCard label="Source coverage" value={`${report.scoring.sourceCoverage}%`} />
        <ScoreCard label="Evidence records" value={report.scoring.evidenceCount} />
        <ScoreCard label="Paid-depth targets" value={`${report.scoring.unlockCount}+`} />
      </section>

      <div className="brief-grid">
        <InsightBlock
          icon={Globe2}
          title="Market definition"
          text={report.marketDefinition}
        />
        <InsightBlock
          icon={BarChart3}
          title="Demand signal"
          text={report.demandSignal}
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
          <span>Key caution</span>
          <strong>{report.risk}</strong>
        </div>
      </section>

      <section className="source-plan-section">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Public-source scan plan</p>
            <h3>What the engine would verify first</h3>
          </div>
          <span className="locked-pill"><LockKeyhole size={14} /> More sources in paid report</span>
        </div>
        <div className="source-plan-grid">
          {report.sourcePlan.map((item) => (
            <article className="source-card" key={item.source}>
              <strong>{item.source}</strong>
              <p>{item.purpose}</p>
              <code>{item.query}</code>
              <small>{item.depth}</small>
              <a href={item.link} target="_blank" rel="noreferrer">Open source route</a>
            </article>
          ))}
        </div>
      </section>

      <section className="competitor-section">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Competitor landscape</p>
            <h3>Initial players to verify</h3>
          </div>
          <span className="locked-pill"><LockKeyhole size={14} /> Full profiles locked</span>
        </div>
        <div className="competitor-table">
          {report.competitors.map((company, index) => (
            <div className="competitor-row" key={company}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{company}</strong>
              <small>{index < 2 ? 'Direct competitor candidate' : index === 4 ? 'Adjacent player candidate' : 'Substitute or emerging player'}</small>
              <button type="button">Profile <ChevronRight size={15} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="evidence-ledger">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Evidence ledger</p>
            <h3>Claims the snapshot is allowed to use</h3>
          </div>
          <span className="confidence"><ClipboardCheck size={14} /> Scored claims</span>
        </div>
        <div className="evidence-table">
          {report.evidence.map((item) => (
            <article className="evidence-row" key={item.id}>
              <span>{item.id}</span>
              <div>
                <strong>{item.claim}</strong>
                <small>{item.reason} Source basis: {item.source}. Checked {item.checkedAt}.</small>
              </div>
              <b>{item.confidence}</b>
              <em>{item.sourceType}</em>
            </article>
          ))}
        </div>
      </section>

      <section className="method-band">
        <div>
          <p className="eyebrow">Scoring method</p>
          <h3>Confidence is weighted by authority, corroboration, recency, specificity, and contradiction risk.</h3>
        </div>
        <div className="adapter-grid">
          {sourceAdapters.map((adapter) => (
            <span key={adapter.name}>
              <Database size={15} />
              <strong>{adapter.name}</strong>
              <small>{adapter.type}: {adapter.authority}% authority baseline. {adapter.coverage}</small>
            </span>
          ))}
        </div>
      </section>

      <section className="warning-band">
        <AlertTriangle size={20} />
        <p>
          Free snapshots should stay directional. A paid report should open every source,
          capture citations, test contradictions, and show the exact evidence behind each strategic claim.
        </p>
      </section>

      <section className="report-upsell">
        <div>
          <p className="eyebrow">Next best paid step</p>
          <h3>Unlock the full public-source scan, competitor profiles, and opportunity score for this topic.</h3>
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

function ScoreCard({ label, value }) {
  return (
    <div className="score-card">
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
