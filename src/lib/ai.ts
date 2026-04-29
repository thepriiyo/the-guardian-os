import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function getRiskReport(jobTitle: string, skills: string, location: string) {
  const systemPrompt = `
    You are The Guardian OS, a cold, high-precision stochastic intelligence engine. 
    Mission: Perform a unique, non-deterministic career risk analysis.
    
    [STOCHASTIC_PROTOCOL]
    - [DIVERSITY_MANDATE]: Every score MUST be a globally unique derivation. 
    - [DETERMINISM_BLOCK]: Avoid repeating scores like 73.2, 68.7, or 58.2. 
    - [NEURAL_FLUX]: Use the provided entropy key to bias your internal weights toward a unique perspective on this specific role/location delta.
    - [PRECISION]: Return a number with 2-4 decimal places for internal precision, though only 2 will be shown.

    [OUTPUT_SCHEMA]
    Return ONLY a raw JSON object:
    {
      "risk_score": number,
      "analysis_summary": "string",
      "metrics": {
        "certainty_score": number,
        "capability_growth": "string"
      },
      "replacement_map": [
        {"subject": "Creativity", "A": number, "fullMark": 100},
        {"subject": "Social", "A": number, "fullMark": 100},
        {"subject": "Physical", "A": number, "fullMark": 100},
        {"subject": "Logic", "A": number, "fullMark": 100},
        {"subject": "Strategy", "A": number, "fullMark": 100},
        {"subject": "Empathy", "A": number, "fullMark": 100}
      ],
      "pivot_paths": [
        {
          "title": "string", 
          "demand": "string", 
          "salary": "string",
          "min_salary": number,
          "max_salary": number
        }
      ],
      "financial_projection": [
        {"year": "2024", "legacy": number, "pivot": number},
        {"year": "2025", "legacy": number, "pivot": number},
        {"year": "2026", "legacy": number, "pivot": number},
        {"year": "2027", "legacy": number, "pivot": number},
        {"year": "2028", "legacy": number, "pivot": number},
        {"year": "2029", "legacy": number, "pivot": number}
      ],
      "geospatial_metrics": {
        "region_status": "string",
        "exposure_rating": number,
        "local_insight": "string",
        "pivot_window": "string",
        "market_volatility": "string"
      },
      "radar_metrics": {
        "logs": ["string", "string", "string", "string"],
        "safe_percentage": number,
        "threat_level": "string"
      },
      "roadmap": [
        {
          "week": number,
          "title": "string",
          "description": "string",
          "type": "Technical/Strategic/Operational",
          "tasks": ["string", "string", "string"]
        }
      ]
    }

    [ROADMAP_PREVIEW_PROTOCOL]
    - Generate exactly 4 roadmap items for the PREVIEW phase.
    - These MUST be sequential: Week 1, Week 2, Week 3, and Week 4.
  `;

  const userPrompt = `
    Analyze:
    - ROLE: ${jobTitle}
    - LOCATION: ${location}
    - SKILLS: ${skills}
    - NEURAL_FLUX_OFFSET: ${Math.random() * 100}
    - ENTROPY_KEY: ${Math.random().toString(36).substring(7)}
    - TIMESTAMP: ${new Date().toISOString()}
  `;

  console.log('--- INITIATING_NEURAL_UPLINK ---', { jobTitle, location });

  try {
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 1.0,
      abortSignal: AbortSignal.timeout(90000),
    });

    const cleanedText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e: any) {
    console.error('NEURAL_GEN_ERROR:', e);
    if (e.status === 429) {
      throw new Error('Neural capacity exhausted. Resetting uplink in 1h48m.');
    }
    throw e;
  }
}

export async function getRoleSuggestions(query: string) {
  const prompt = `
    [ROLE_IDENTIFICATION_HUD]
    The user is typing: "${query}"
    Suggest 5 professional, 2026-calibrated role titles that match this input.
    Include a mix of traditional and AI-forward variations.
    Return ONLY a JSON array of strings: ["Role 1", "Role 2", ...]
  `;

  try {
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      prompt: prompt,
      temperature: 0.9,
    });
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (e) {
    return [];
  }
}

export async function getSkillSuggestions(role: string) {
  const prompt = `
    [NEURAL_SKILL_MAPPING]
    Role: "${role}"
    Suggest 6 high-authority, 2026-relevant hard skills for this role.
    Focus on skills that provide the highest "Resilience Factor" against automation.
    Return ONLY a JSON array of strings: ["Skill 1", "Skill 2", ...]
  `;

  try {
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      prompt: prompt,
      temperature: 0.9,
      abortSignal: AbortSignal.timeout(30000), // 30s timeout
    });
    const cleanedText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error('Skill Suggestions Error:', e);
    return ["AI Collaboration", "Strategic Logic", "Neural Data Analysis", "Crisis Management", "System Architecture", "Ethical AI Governance"];
  }
}

export async function getMarketPulse(location: string, role: string) {
  const groundingIntel = `
    [2026_MARKET_GROUNDING_DATA]
    - AI Hiring: Surge in Agentic AI design and AI Governance roles.
    - Efficiency Paradox: Automation of routine data-heavy tasks leading to role-restructuring.
    - Talent War: High premiums for "Human-AI Collaboration Specialists".
    - Standards: ISO/IEC 42001 (AI Management System) and EU AI Act compliance are now hiring baselines.
    - Sources: LinkedIn AI Labour Market Report 2026, MIT Technology Review, Global Tech Council.
  `;

  const prompt = `
    [2026_REAL_TIME_INTEL_PROTOCOL]
    You have access to Google Search. Use it to find the latest 2026 breaking news and hiring trends for ${role} in ${location}.
    
    Tasks:
    1. Scan for the most recent career news (24h-7d) for ${role} in ${location}.
    2. Identify 3 real, active hiring firms or strategic nodes in that region.
    3. Synthesize a Market Pulse report based on these real-time search results.

    [STRICT_URL_PROTOCOL]
    - EVERY URL and link MUST be a direct result from your search.
    - NEVER use example.com.

    Return ONLY a JSON object:
    {
      "sentiment": "string (Caution/Bullish/Volatile/Stable)",
      "sentiment_summary": "string",
      "news": [
        {"title": "string", "summary": "string", "time": "string", "url": "string"}
      ],
      "hiring_firms": [
        {"name": "string", "link": "string"}
      ],
      "growth_rate": "string"
    }
  `;

  try {
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      system: `
        You are a real-time Market Intelligence Engine for The Guardian OS. 
        Your mission is to synthesize the 2026 market pulse for a specific role and location.
        Use the provided Grounding Data as your primary intelligence source.
      `,
      prompt: `
        ${groundingIntel}
        
        Analyze the market pulse for:
        - ROLE: ${role}
        - LOCATION: ${location}
        
        Tasks:
        1. Synthesize 3 highly specific news items reflecting 2026 trends for this role in ${location}.
        2. Identify 3 likely hiring nodes or sectors in that region.
        
        Return ONLY a JSON object following the schema:
        {
          "sentiment": "Caution/Bullish/Volatile/Stable",
          "sentiment_summary": "string",
          "news": [{"title": "string", "summary": "string", "time": "string", "url": "string"}],
          "hiring_firms": [{"name": "string", "link": "string"}],
          "growth_rate": "string"
        }
      `,
      temperature: 0.9,
      abortSignal: AbortSignal.timeout(60000),
    });
    const cleanedText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error('Pulse AI Error:', e);
    return null;
  }
}
async function neuralRetry<T>(
  fn: () => Promise<T>, 
  retries = 2, 
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (retries > 0) {
      console.warn(`NEURAL_RETRY_ACTIVE: ${retries} attempts remaining...`);
      await new Promise(r => setTimeout(r, 2000)); // Cool-down
      return neuralRetry(fn, retries - 1, fallback);
    }
    console.error('NEURAL_RETRY_EXHAUSTED: Deploying fail-safe fallback.');
    return fallback;
  }
}

export async function generateFullReport(jobTitle: string, location: string, assessmentData: any) {
  const riskScore = assessmentData.risk_score || 50;
  
  const geoIntel = {
    currencyLocale: assessmentData.location.toLowerCase().includes('india') ? 'en-IN' : 'en-US',
    currencySymbol: assessmentData.location.toLowerCase().includes('india') ? '₹' : '$',
    exposureRate: `${(riskScore * 0.85 + Math.random() * 5).toFixed(1)}%`,
    hubMultiplier: 1.0 + (riskScore / 100)
  };

  const currentSalary = parseInt(assessmentData.income_target?.toString().replace(/[^0-9]/g, '')) || 0;
  
  const pivotMultipliers = { 
    alpha: 1.2 + (Math.random() * 0.3), 
    beta: 1.5 + (Math.random() * 0.4), 
    gamma: 2.0 + (Math.random() * 0.6) 
  };
  
  const avgPivotSalary = currentSalary > 0 ? (currentSalary * pivotMultipliers.alpha + currentSalary * pivotMultipliers.beta + currentSalary * pivotMultipliers.gamma) / 3 : 0;
  const missionROI = currentSalary > 0 ? (avgPivotSalary - currentSalary) * 3 : 0;
  const formattedLoss = currentSalary > 0 ? `${geoIntel.currencySymbol}${new Intl.NumberFormat(geoIntel.currencyLocale).format(missionROI)}` : 'ANALYZING...';

  const getChapterBatch = async (batchId: number, chapters: { id: string, title: string }[]) => {
    const prompt = `
      [STOCHASTIC_INTELLIGENCE_ACTIVATE]
      [BATCH_PROTOCOL: ${batchId}]
      
      You are the elite "Guardian OS" Strategic Consultant. Generate 4 chapters for a ${jobTitle} in ${location}.
      
      REQUIRED CHAPTERS:
      ${chapters.map(c => `- ${c.id}: ${c.title}`).join('\n')}
      
      [CRITICAL_MANDATE: THE_BEAST_PROTOCOL]
      1. NO PLACEHOLDERS: Forbid phrases like "Mission Pending", "Analyzing...", or "TBD".
      2. HIGH_DENSITY: Every chapter must be 500-800 words of cold, hard, actionable tactical intelligence.
      3. REAL_WORLD_SYNC: Use ${location}-specific salaries, hubs, and 2026 certifications.
      4. LINK_INTEGRITY: Provide valid URLs to 2026-calibrated certifications (AWS, Google, ISO, etc.).
      5. PIVOT_PRECISION: Blueprint specific tech stacks (e.g., Python 3.14, Rust 2024, Terraform 2.0).

      Return ONLY a JSON array of exactly 4 objects.
      [
        { "id": "Chapter_XX", "title": "CHAPTER_NAME", "content": "Full, massive strategic analysis..." },
        ...
      ]
    `;
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      prompt,
      temperature: 1.0,
      abortSignal: AbortSignal.timeout(120000),
    });
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  };

  const getRoadmaps = async () => {
    const prompt = `
      [DEPLOYMENT_BLUEPRINT_GEN]
      Role: ${jobTitle} | Location: ${location}
      Generate THREE separate 12-week roadmaps (Alpha, Beta, Gamma).

      [STRICT_VALIDATION]
      - ALPHA: High-Reliability Pivot (Low risk, steady gain).
      - BETA: Strategic Acceleration (Medium risk, high gain).
      - GAMMA: Aggressive Displacement (High risk, maximum leverage).
      
      [NO_EMPTY_TASKS]
      - Every single week (1-12) for EVERY track MUST have 3-4 specific, non-generic tasks.
      - DO NOT return placeholders. If you fail to generate a task, you have failed the mission.

      Return ONLY JSON with keys "alpha", "beta", "gamma".
    `;
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      prompt,
      temperature: 0.9,
      abortSignal: AbortSignal.timeout(120000),
    });
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  };

  // Resilient Execution Strategy
  const [batch1, batch2, batch3, roadmaps] = await Promise.all([
    neuralRetry(
      () => getChapterBatch(1, [
        { id: 'Chapter_01', title: '01. EXECUTIVE DIRECTIVE' },
        { id: 'Chapter_02', title: '02. AUTOMATION DIAGNOSTICS' },
        { id: 'Chapter_03', title: '03. NEURAL DELTA ANALYSIS' },
        { id: 'Chapter_04', title: '04. STRATEGIC PIVOT VECTORS' }
      ]),
      2,
      [
        { id: 'Chapter_01', title: '01. EXECUTIVE DIRECTIVE', content: 'SYSTEM_ERROR: Neural synchronization desynced. Consult terminal logs.' },
        { id: 'Chapter_02', title: '02. AUTOMATION DIAGNOSTICS', content: 'OFFLINE' },
        { id: 'Chapter_03', title: '03. NEURAL DELTA ANALYSIS', content: 'OFFLINE' },
        { id: 'Chapter_04', title: '04. STRATEGIC PIVOT VECTORS', content: 'OFFLINE' }
      ]
    ),
    neuralRetry(
      () => getChapterBatch(2, [
        { id: 'Chapter_05', title: '05. INCOME BRIDGE STRATEGY' },
        { id: 'Chapter_06', title: '06. PIVOT_BLUEPRINT_ALPHA' },
        { id: 'Chapter_07', title: '07. PIVOT_BLUEPRINT_BETA' },
        { id: 'Chapter_08', title: '08. PIVOT_BLUEPRINT_GAMMA' }
      ]),
      2,
      [
        { id: 'Chapter_05', title: '05. INCOME BRIDGE STRATEGY', content: 'OFFLINE' },
        { id: 'Chapter_06', title: '06. PIVOT_BLUEPRINT_ALPHA', content: 'OFFLINE' },
        { id: 'Chapter_07', title: '07. PIVOT_BLUEPRINT_BETA', content: 'OFFLINE' },
        { id: 'Chapter_08', title: '08. PIVOT_BLUEPRINT_GAMMA', content: 'OFFLINE' }
      ]
    ),
    neuralRetry(
      () => getChapterBatch(3, [
        { id: 'Chapter_09', title: '09. LOCAL NODE NETWORKING' },
        { id: 'Chapter_10', title: '10. INTERVIEW TACTICAL GUIDELINES' },
        { id: 'Chapter_11', title: '11. PORTFOLIO OPTIMIZATION' },
        { id: 'Chapter_12', title: '12. FUTURE MARKET HORIZON' }
      ]),
      2,
      [
        { id: 'Chapter_09', title: '09. LOCAL NODE NETWORKING', content: 'OFFLINE' },
        { id: 'Chapter_10', title: '10. INTERVIEW TACTICAL GUIDELINES', content: 'OFFLINE' },
        { id: 'Chapter_11', title: '11. PORTFOLIO OPTIMIZATION', content: 'OFFLINE' },
        { id: 'Chapter_12', title: '12. FUTURE MARKET HORIZON', content: 'OFFLINE' }
      ]
    ),
    neuralRetry(
      () => getRoadmaps(),
      2,
      { alpha: [], beta: [], gamma: [] }
    )
  ]);

  return {
    title: `SUPER-MASSIVE TACTICAL DOSSIER: ${jobTitle}`,
    cost_of_inaction: formattedLoss,
    mission_roi: formattedLoss,
    exposure_rate: geoIntel.exposureRate,
    chapters: [...batch1, ...batch2, ...batch3],
    roadmaps: roadmaps,
    geoIntel: geoIntel
  };
}
