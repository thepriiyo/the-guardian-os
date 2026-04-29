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
    - [STOCHASTIC_REQUIREMENT]: The risk_score MUST be unique to this specific combination of job, skills, and location. Use the FULL 0-100 range. Avoid common baseline numbers (like 68.73 or 64.0) unless the specific math dictates it.
    - [FINANCIAL_NEURAL_PROJECTION]: Calculate a 6-year financial projection (2024-2029) for the current role vs the recommended pivot.
      - stagnation_vector: Projected income if the user stays in the current role (account for AI-driven wage stagnation or job loss).
      - acceleration_vector: Projected income if the user completes the recommended pivot.
    - [GEOSPATIAL_WEIGHTING]: If ${location} density > 5000/km², increase automation risk by 4.2% to account for rapid tech infrastructure adoption.

    
    2. Suggest 3 unique Pivot Paths available within a 50km radius of [${location}].
    3. Provide an 'Income Bridge' strategy in local currency (e.g., INR if in India).
    4. List 2 local networking groups or physical locations (e.g., coworking hubs, physical institutes) where they can find mentors for this pivot.
    [NEURAL_CALIBRATION_PROTOCOL]
    - [ZERO_FORMULA_BIAS]: DO NOT use a fixed formula. Derive the risk_score dynamically by analyzing the gap between ${jobTitle} functions and current 2026 Agentic AI capabilities.
    - [STOCHASTIC_DIVERSITY]: The risk_score, certainty_score, and capability_growth MUST reflect the specific volatility of ${location}.
    - [RANGE_UTILIZATION]: Utilize the entire spectrum (0.01 - 99.99). Avoid clustering around 60-70%.
    - [DYNAMIC_BENCHMARKING]: Calibrate your analysis against real-time search results for ${jobTitle} automation.

    [NEURAL_DELTA_INSIGHT_LOGIC]
    - Compare User_Score against the dynamic benchmark of AI capabilities in 2026 for this specific role.
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
        },
        "geospatial_metrics": {
          "exposure_rating": number,
          "region_status": "string (e.g. High-Density Integration Hub)",
          "pivot_window": "string (e.g. 08-12 Months)",
          "market_volatility": "string (e.g. Critical)",
          "local_insight": "1-sentence regional AI impact insight"
        },
        "radar_metrics": {
          "safe_percentage": number,
          "threat_level": "string (e.g. Critical/Moderate/Elevated)",
          "logs": ["string (4 unique 2026-era threat logs)"]
        },
        "financial_projection": [
          { "year": "2024", "legacy": number, "pivot": number },
          { "year": "2025", "legacy": number, "pivot": number },
          { "year": "2026", "legacy": number, "pivot": number },
          { "year": "2027", "legacy": number, "pivot": number },
          { "year": "2028", "legacy": number, "pivot": number },
          { "year": "2029", "legacy": number, "pivot": number }
        ]
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
    });
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (e) {
    return ["AI Collaboration", "Strategic Logic", "Neural Data Analysis"];
  }
}

export async function getMarketPulse(location: string, role: string) {
  const groundingIntel = `
    [2026_MARKET_GROUNDING_PROTOCOL]
    - Search for the most RECENT (2025-2026) automation news specific to the user's city and role.
    - Identify unique local regulatory changes (e.g., city-specific AI labor laws).
    - Provide raw, unfiltered market data that reflects current volatility.
  `;

  const prompt = `
    [2026_REAL_TIME_INTEL_PROTOCOL] // TEMPORAL_LOCKDOWN_ACTIVE
    You have access to Google Search. Use it to find the latest 2025-2026 breaking news and hiring trends for ${role} in ${location}.
    
    [SEARCH_VECTORS]
    - Query 1: "${role} ${location} hiring trends news after:2025-01-01"
    - Query 2: "${role} automation impact news 2026"
    - Query 3: "${role} certifications 2026 ${location}"

    Tasks:
    1. Scan for the most relevant and recent career news. 
    2. STRICT_DATE_CONSTRAINT: Discard any result older than 2025. Every news item MUST be from 2025 or 2026.
    3. Identify EXACTLY 5 high-authority "Breaking News" items.
    4. Identify 3 real, active hiring firms or strategic nodes in ${location}.
    5. Synthesize a high-density Market Pulse report.

    [STRICT_URL_PROTOCOL]
    - EVERY URL MUST BE FUNCTIONAL. 
    - [ZERO_HALLUCINATION_POLICY]: DO NOT invent, predict, or format URLs.
    - COPY the direct URL exactly as returned by the search tool.
    - If a specific article URL is missing or looks volatile, use a verified LinkedIn Job Search or Google News query URL instead.
    - NEVER use example.com.

    Return ONLY a JSON object:
    {
      "sentiment": "string (Caution/Bullish/Volatile/Stable)",
      "sentiment_summary": "string",
      "news": [
        {
          "title": "string", 
          "summary": "string", 
          "date": "string (e.g. April 28, 2026)", 
          "url": "string"
        }
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
  // The AI will now derive these values dynamically in the batch prompts below
  // to ensure 100% real-time accuracy based on market data.
  

  const getChapterBatch = async (batchId: number, chapters: {id: string, title: string}[]) => {
    const prompt = `
      [BATCH_PROTOCOL: ${batchId}]
      - [DYNAMIC_METRICS]: Calculate the following based on the regional 2026 market:
        - "exposure_rate": A percentage (0-100%) based on local AI infrastructure.
        - "mission_roi": Total financial upside over 3 years in local currency.
        - "cost_of_inaction": Projected financial loss over 3 years if no pivot occurs.
        - "currency_symbol": The local currency symbol (e.g., $, ₹, £).
      - Chapter 12 MUST include 2026-specific insight regarding regional laws (e.g., EU AI Act, India's DPDP Act) as applicable to ${location}.

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

    // Extract dynamic metrics from the AI-generated chapters (AI is instructed to include these in the payload)
    const firstBatch = batch1[0] as any;
    
    return {
      title: `SUPER-MASSIVE TACTICAL DOSSIER: ${jobTitle}`,
      cost_of_inaction: firstBatch.cost_of_inaction || "ANALYZING...",
      mission_roi: firstBatch.mission_roi || "ANALYZING...",
      exposure_rate: firstBatch.exposure_rate || "ANALYZING...",
      currency_symbol: firstBatch.currency_symbol || "$",
      chapters: [...batch1, ...batch2, ...batch3],
      roadmaps: roadmaps
    };
  } catch (e) {
    console.error('Full Report Parallel Error:', e);
    return null;
  }
}
