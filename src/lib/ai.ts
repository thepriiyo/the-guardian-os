import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function getRiskReport(jobTitle: string, skills: string, location: string) {
  const prompt = `
    Act as a Local Career Strategist. [Protocol_Time: ${new Date().toISOString()}]
    Analyze the user's job [${jobTitle}] and skills [${skills}] in the context of [${location}].
    
    1. Calculate a hyper-precise Risk Score (0-100). 
    
    [STRICT_MATH_CONSTRAINT]
    - Enforce risk_score decimal precision to exactly 2 places (e.g., 71.38). 
    - DO NOT use round numbers (avoid 65, 75, 80).
    - [GEOSPATIAL_WEIGHTING]: If ${location} density > 5000/km², increase automation risk by 4.2% to account for rapid tech infrastructure adoption.
    
    2. Suggest 3 unique Pivot Paths available within a 50km radius of [${location}].
    3. Provide an 'Income Bridge' strategy in local currency (e.g., INR if in India).
    4. List 2 local networking groups or physical locations (e.g., coworking hubs, physical institutes) where they can find mentors for this pivot.
    [STRICT_MATH_PROTOCOL]
    - Automation Risk = (Neural Delta / Human Resilience Factor) * Geospatial Exposure Multiplier.
    - Neural Delta = AI_2026_Enterprise_Benchmark (Logic: 92, Strategy: 88, Creativity: 65) - User_Logic_Score.
    - Human Resilience Factor = (User_Empathy_Score + User_Adaptability_Score) / 200.
    - Resulting risk_score MUST be linked to these 2026-calibrated variables.
    - [EFFICIENCY_PARADOX_WEIGHT]: If the role involves high data-repetition, add 8.5% to risk_score to account for Agentic AI workflow automation.

    [NEURAL_DELTA_INSIGHT_LOGIC]
    - Compare User_Score against AI_2026_Benchmarks:
      Logic(92), Strategy(88), Empathy(28), Social(48), Creativity(65), Physical(35).
    - If User_Score > Benchmark: tag = "REINFORCED".
    - If User_Score < Benchmark: tag = "VULNERABLE".
    - Provide a 1-sentence "insight" explaining the delta in the context of 2026 Agentic AI capabilities.

      Return ONLY a JSON object:
      {
        "risk_score": number (0-100),
        "analysis_summary": "string",
        "replacement_map": [
          {"subject": "Creativity", "A": number, "fullMark": 100, "tag": "REINFORCED/VULNERABLE", "insight": "1-sentence Delta Insight"},
          {"subject": "Social", "A": number, "fullMark": 100, "tag": "REINFORCED/VULNERABLE", "insight": "1-sentence Delta Insight"},
          {"subject": "Physical", "A": number, "fullMark": 100, "tag": "REINFORCED/VULNERABLE", "insight": "1-sentence Delta Insight"},
          {"subject": "Logic", "A": number, "fullMark": 100, "tag": "REINFORCED/VULNERABLE", "insight": "1-sentence Delta Insight"},
          {"subject": "Strategy", "A": number, "fullMark": 100, "tag": "REINFORCED/VULNERABLE", "insight": "1-sentence Delta Insight"},
          {"subject": "Empathy", "A": number, "fullMark": 100, "tag": "REINFORCED/VULNERABLE", "insight": "1-sentence Delta Insight"}
        ],
        "pivot_paths": [
          {"title": "string", "min_salary": number, "max_salary": number, "demand": "High/Medium/Low"}
        ],
        "local_networking": [
          {"name": "string", "location": "string in local city", "timing": "string", "code": "3-letter string"}
        ],
        "roadmap": [
          {
            "week": number,
            "title": "string",
            "type": "Analysis/Technical/Social",
            "tasks": [{"text": "string", "done": false}]
          }
        ],
        "metrics": {
          "capability_growth": "string (e.g. +12%/Mo)",
          "certainty_score": number (0-100),
          "demand_growth": "string (e.g. +24% YoY)"
        }
      }

      CRITICAL:
      - The roadmap MUST contain EXACTLY 12 weeks of tactical career pivot tasks. 
      - Do NOT stop at 4 weeks. Provide the full 12-week deployment cycle.
      - Do NOT use generic networking groups. Search for actual organizations in the user's specific city.
      - Ensure the replacement_map scores are unique to the Job Title provided.
      - Salary must be in the local currency of the user's city.
  `;

  console.log('Generating risk report for:', { jobTitle, location });
  
  try {
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      prompt: prompt,
      abortSignal: AbortSignal.timeout(90000), // 90s timeout
    });

    console.log('AI Response received length:', text.length);

    try {
      const cleanedText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('AI JSON Parse Error. Raw text snippet:', text.slice(0, 500));
      throw new Error('Intelligence payload was malformed. Please retry the scan.');
    }
  } catch (e: any) {
    console.error('AI Generation Error:', e);
    if (e.name === 'AbortError' || e.message?.includes('timeout')) {
      throw new Error('The neural link timed out due to high complexity. Please try a simpler role or retry.');
    }
    throw e;
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
    1. Scan for the most relevant and recent career news for ${role} in ${location}. 
    2. If specific local news is sparse, expand the search to regional or national trends impacting that role.
    3. Identify 3 real, active hiring firms, recruiters, or strategic agencies relevant to this sector.
    4. Synthesize a high-density Market Pulse report.

    [STRICT_URL_PROTOCOL]
    - EVERY URL and link MUST be a direct, functional result.
    - If a specific article URL is not found, construct a targeted LinkedIn or Google News search URL.
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
      tools: {
        googleSearch: google.tools.googleSearch({}),
      },
      toolChoice: 'auto', 
      prompt: prompt,
      abortSignal: AbortSignal.timeout(90000), // 90s timeout
    });
    const cleanedText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error('Pulse AI Error:', e);
    return null;
  }
}
export async function generateFullReport(jobTitle: string, location: string, assessmentData: any) {
  // GEO_INTEL Mapping Layer
  const isHighIncomeHub = ['london', 'new york', 'ny', 'sf', 'san francisco', 'singapore', 'dubai'].some(h => location.toLowerCase().includes(h));
  const isIndianHub = location.toLowerCase().includes('india') || location.toLowerCase().includes('kolkata');
  
  const geoIntel = {
    currencyLocale: isIndianHub ? 'en-IN' : 'en-US',
    currencySymbol: isIndianHub ? '₹' : '$',
    exposureRate: isHighIncomeHub ? '60%' : '26%',
    hubMultiplier: isHighIncomeHub ? 1.5 : 1.0
  };

  const currentSalary = parseInt(assessmentData.salary_target?.toString().replace(/[^0-9]/g, '')) || 80000;
  const pivotMultipliers = { alpha: 1.45, beta: 1.65, gamma: 2.10 };
  const targetGamma = currentSalary * pivotMultipliers.gamma;
  const avgPivotSalary = (currentSalary * pivotMultipliers.alpha + currentSalary * pivotMultipliers.beta + currentSalary * pivotMultipliers.gamma) / 3;
  
  const missionROI = (avgPivotSalary - currentSalary) * 3;
  const maxFinancialLoss = missionROI; // Synchronizing Penalty and ROI
  
  const formattedLoss = `${geoIntel.currencySymbol}${new Intl.NumberFormat(geoIntel.currencyLocale).format(maxFinancialLoss)}`;

  const getChapterBatch = async (batchId: number, chapters: {id: string, title: string}[]) => {
    const prompt = `
      [BATCH_PROTOCOL: ${batchId}]
      Generate 4 high-density chapters (500-600 words each) for a ${jobTitle} in ${location}.
      
      Chapters to generate:
      ${chapters.map(c => `- ${c.id}: ${c.title}`).join('\n')}
      
      [STRICT_LINK_REQUIREMENT]
      - Pivot Blueprints MUST include hyper-link payloads to real 2026 certifications:
        - Technical: AWS Certified Machine Learning Specialty, Google Professional ML Engineer.
        - Strategic: DeepLearning.AI AI For Everyone, MIT Applied AI.
        - Governance: ISO/IEC 42001 Lead Auditor, IAPP Certified AI Governance Professional (AIGP).
      - [GAMMA_HARDENING]: The Gamma Roadmap MUST include at least one High-Authority Certification link specific to ${location}.
      - [GEOSPATIAL_HUB_MAPPING]: For Chapter 09, search for the actual 'Chamber of Commerce' or 'Innovation Hub' in ${location} and the primary Industry-Specific hub within a 50km radius.
      - [MARKET_PULSE]: Chapter 12 MUST include 2026-specific insight regarding regional laws (e.g., EU AI Act, India's DPDP Act) as applicable to ${location}.

      Return ONLY a JSON array of exactly 4 objects. Content MUST be high-density (500+ words).
      [
        { "id": "Chapter_XX", "title": "CHAPTER_NAME", "content": "500+ words of content" },
        ...
      ]
    `;
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      prompt,
      abortSignal: AbortSignal.timeout(120000),
    });
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  };

  const getRoadmaps = async () => {
    const prompt = `
      Generate THREE separate 12-week roadmaps (Alpha, Beta, Gamma) for a ${jobTitle} in ${location}.
      [CONTEXTUAL_ANCHORING]
      - For every Week (1-12) in the JSON array, prefix the 'title' with [${location} | PATH_ID].
      - Alpha: Path 1 (+45% Salary)
      - Beta: Path 2 (+65% Salary)
      - Gamma: Path 3 (+110% Salary, High Difficulty, Regulatory Intensive)

      [ROADMAP_VALIDATION]
      - You MUST return a JSON object with keys "alpha", "beta", "gamma".
      - Each track MUST have exactly 12 weeks.
      - Gamma MUST include a physical address for a regulatory body in ${location}.
      - [HIGH_DENSITY_ACTION]: If a task is generated, it must be a specific action available in ${location}.

      Return ONLY JSON:
      {
        "alpha": [...12 weeks...],
        "beta": [...12 weeks...],
        "gamma": [...12 weeks...]
      }
    `;
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      prompt,
      temperature: 0.4,
      abortSignal: AbortSignal.timeout(120000),
    });
    
    let parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    
    // Sync-Gate Middleware: Length_Verification (12 Weeks)
    const isValid = (track: any[]) => track && track.length === 12 && track.every(w => w.tasks && w.tasks.length > 0);
    
    if (!isValid(parsed.alpha) || !isValid(parsed.beta) || !isValid(parsed.gamma)) {
      console.warn('Roadmap desync detected or Length_Verification failed. Re-triggering recursive sub-agent...');
      const { text: retryText } = await generateText({
        model: google('gemma-3-27b-it'),
        prompt: prompt + '\n[STRICT_LENGTH_REQUIREMENT]: EVERY track MUST have EXACTLY 12 weeks with non-empty tasks.',
        temperature: 0.85,
        abortSignal: AbortSignal.timeout(120000),
      });
      parsed = JSON.parse(retryText.replace(/```json|```/g, '').trim());
    }
    
    return parsed;
  };

  try {
    const [batch1, batch2, batch3, roadmaps] = await Promise.all([
      getChapterBatch(1, [
        { id: 'Chapter_01', title: '01. EXECUTIVE DIRECTIVE' },
        { id: 'Chapter_02', title: '02. AUTOMATION DIAGNOSTICS' },
        { id: 'Chapter_03', title: '03. NEURAL DELTA ANALYSIS' },
        { id: 'Chapter_04', title: '04. STRATEGIC PIVOT VECTORS' }
      ]),
      getChapterBatch(2, [
        { id: 'Chapter_05', title: '05. INCOME BRIDGE STRATEGY' },
        { id: 'Chapter_06', title: '06. PIVOT_BLUEPRINT_ALPHA' },
        { id: 'Chapter_07', title: '07. PIVOT_BLUEPRINT_BETA' },
        { id: 'Chapter_08', title: '08. PIVOT_BLUEPRINT_GAMMA' }
      ]),
      getChapterBatch(3, [
        { id: 'Chapter_09', title: '09. LOCAL NODE NETWORKING' },
        { id: 'Chapter_10', title: '10. INTERVIEW TACTICAL GUIDELINES' },
        { id: 'Chapter_11', title: '11. PORTFOLIO OPTIMIZATION' },
        { id: 'Chapter_12', title: '12. FUTURE MARKET HORIZON' }
      ]),
      getRoadmaps()
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
  } catch (e) {
    console.error('Full Report Parallel Error:', e);
    return null;
  }
}
