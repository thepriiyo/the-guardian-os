'use client';

import jsPDF from 'jspdf';
import { Assessment } from '@/types';

export const generateTacticalPDF = async (assessment: Assessment, aiReport?: any) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const report = assessment.report_data;
  if (!report) return;

  // --- STYLING DEFAULTS (TACTICAL HARDENING) ---
  const DARK_BG = [3, 7, 18];
  const BLUE_TEXT = [59, 130, 246];
  const WHITE_TEXT = [255, 255, 255];
  const SLATE_TEXT = [100, 116, 139];
  const FONT_MONO = 'courier'; 
  
  const formatINR = (val: number) => {
    const isIndianHub = assessment.location.toLowerCase().includes('india') || assessment.location.toLowerCase().includes('kolkata');
    const config = isIndianHub ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(config, { 
      style: 'currency', 
      currency: isIndianHub ? 'INR' : 'USD', 
      maximumFractionDigits: 0 
    }).format(val).replace('INR', '₹');
  };

  const formatLakhs = (val: number) => {
    if (val === 0) return '₹0L';
    return '₹' + (val / 100000).toFixed(1) + 'L';
  };

  const Sanitize = (val: any): string => {
    if (val === null || val === undefined) return '';
    return typeof val === 'object' ? JSON.stringify(val) : String(val);
  };

  const formatCurrencyUniversal = (val: number) => {
    const isIndianHub = assessment.location.toLowerCase().includes('india') || assessment.location.toLowerCase().includes('kolkata');
    const locale = isIndianHub ? 'en-IN' : 'en-US';
    const currency = isIndianHub ? 'INR' : 'USD';
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency, 
      maximumSignificantDigits: 3 
    }).format(val).replace('INR', '₹');
  };

  const drawTextWithLinks = (text: string, x: number, y: number, maxWidth: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, i: number) => {
      const currentY = y + (i * 5);
      doc.text(line, x, currentY);
      
      if (line.includes('http')) {
        const words = line.split(' ');
        let currentX = x;
        words.forEach(word => {
          const cleanUrl = word.replace(/[(),]/g, '');
          if (cleanUrl.startsWith('http')) {
            doc.setTextColor(BLUE_TEXT[0], BLUE_TEXT[1], BLUE_TEXT[2]);
            doc.link(currentX, currentY - 3, doc.getTextWidth(cleanUrl), 5, { url: cleanUrl });
          }
          currentX += doc.getTextWidth(word + ' ');
        });
        doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
      }
    });
    return lines.length * 5;
  };

  const setBG = () => {
    doc.setFillColor(DARK_BG[0], DARK_BG[1], DARK_BG[2]);
    doc.rect(0, 0, 210, 297, 'F');
  };

  const drawHeader = (title: string, sub: string) => {
    doc.setFont(FONT_MONO, 'bold');
    doc.setTextColor(BLUE_TEXT[0], BLUE_TEXT[1], BLUE_TEXT[2]);
    doc.setFontSize(8);
    doc.text(`THE GUARDIAN // COMMAND_CENTER // ${sub.toUpperCase()}`, 20, 15);
    
    doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
    doc.setFontSize(18);
    doc.text(title.toUpperCase(), 20, 25);
    
    doc.setFontSize(7);
    doc.setTextColor(SLATE_TEXT[0], SLATE_TEXT[1], SLATE_TEXT[2]);
    doc.text(`SESSION_ID: ${assessment.id.slice(0, 16).toUpperCase()}`, 190, 15, { align: 'right' });
    
    doc.setDrawColor(BLUE_TEXT[0], BLUE_TEXT[1], BLUE_TEXT[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 28, 60, 28);
  };

  const drawFooter = (pageNum: number) => {
    doc.setFont(FONT_MONO, 'normal');
    doc.setFontSize(7);
    doc.setTextColor(SLATE_TEXT[0], SLATE_TEXT[1], SLATE_TEXT[2]);
    const footerText = `CONFIDENTIAL // SESSION_ID: ${assessment.id.slice(0, 16).toUpperCase()} // PAGE ${pageNum}`;
    doc.text(footerText, 105, 285, { align: 'center' });
  };

  let pageCount = 1;

  // --- PAGE 1: COVER ---
  setBG();
  doc.setDrawColor(BLUE_TEXT[0], BLUE_TEXT[1], BLUE_TEXT[2]);
  doc.circle(105, 120, 80, 'S');
  doc.circle(105, 120, 85, 'S');
  
  doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
  doc.setFont(FONT_MONO, 'bold');
  doc.setFontSize(50);
  doc.text('THE', 105, 130, { align: 'center' });
  doc.text('GUARDIAN', 105, 150, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont(FONT_MONO, 'normal');
  doc.setTextColor(SLATE_TEXT[0], SLATE_TEXT[1], SLATE_TEXT[2]);
  doc.text('SUPER-MASSIVE TACTICAL CAREER DOSSIER', 105, 165, { align: 'center' });
  
  doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
  doc.setFontSize(22);
  doc.text(assessment.job_title.toUpperCase(), 105, 200, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(BLUE_TEXT[0], BLUE_TEXT[1], BLUE_TEXT[2]);
  doc.text(`REGION: ${assessment.location.toUpperCase()} // STRATEGIC_INTEL_PAYLOAD`, 105, 210, { align: 'center' });
  drawFooter(pageCount++);

  // --- PAGE 2: TACTICAL INDEX (TOC) ---
  doc.addPage();
  setBG();
  drawHeader('Tactical Index', 'System_Manifest');
  
  const tocItems = [
    { title: '01. Executive Survival Directive', p: 3 },
    { title: '02. Automation Risk HUD', p: 4 },
    { title: '03. Neural Advantage Spectrum', p: 5 },
    { title: '04. Strategic Pivot Vectors', p: 6 },
    { title: '05. AI Intelligence Stream', p: 7 },
    { title: '06. 12-Week Deployment Map', p: 19 },
    { title: '07. Mission Conclusion', p: 21 }
  ];
  
  tocItems.forEach((item, i) => {
    doc.setFont(FONT_MONO, 'normal');
    doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
    doc.setFontSize(11);
    doc.text(item.title.toUpperCase(), 20, 60 + (i * 12));
    doc.text(item.p.toString().padStart(2, '0'), 190, 60 + (i * 12), { align: 'right' });
    doc.setDrawColor(31, 41, 55);
    doc.line(20, 63 + (i * 12), 190, 63 + (i * 12));
  });
  drawFooter(pageCount++);

  // --- PAGE 3: EXECUTIVE SUMMARY (Chapter 1) ---
  const ch1 = aiReport?.chapters?.find((c: any) => c.id === 'Chapter_01') || { title: '01. EXECUTIVE DIRECTIVE', content: report.analysis_summary };
  doc.addPage();
  setBG();
  drawHeader(ch1.title, 'Strategic_Directives');
  doc.setFont(FONT_MONO, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
  const ch1Lines = doc.splitTextToSize(ch1.content, 175);
  doc.text(ch1Lines, 20, 50);
  
  // Interactive Link Support
  const urls = ch1.content.match(/https?:\/\/[^\s]+/g) || [];
  urls.forEach((url: string) => {
    // This is a simplified link detection for the directive page
  });

  drawFooter(pageCount++);

  // --- PAGE 4: AUTOMATION RISK HUD (Gauge) ---
  doc.addPage();
  setBG();
  drawHeader('Automation Risk HUD', 'Diagnostic_Phase_1');
  
  const centerX = 105;
  const centerY = 100;
  const radius = 50;
  
  // Gauge Vector
  doc.setDrawColor(31, 41, 55);
  doc.setLineWidth(5);
  for (let i = 0; i <= 50; i++) {
    const a1 = Math.PI + (i / 50) * Math.PI;
    const a2 = Math.PI + ((i + 1) / 50) * Math.PI;
    doc.line(centerX + Math.cos(a1) * radius, centerY + Math.sin(a1) * radius, centerX + Math.cos(a2) * radius, centerY + Math.sin(a2) * radius);
  }
  doc.setDrawColor(239, 68, 68);
  const angleLimit = report.risk_score;
  for (let i = 0; i <= angleLimit; i++) {
    const a1 = Math.PI + (i / 100) * Math.PI;
    const a2 = Math.PI + ((i + 1) / 100) * Math.PI;
    doc.line(centerX + Math.cos(a1) * radius, centerY + Math.sin(a1) * radius, centerX + Math.cos(a2) * radius, centerY + Math.sin(a2) * radius);
  }
  
  doc.setTextColor(239, 68, 68);
  doc.setFontSize(50);
  doc.text(`${report.risk_score}%`, centerX, centerY + 25, { align: 'center' });
  
  doc.setTextColor(239, 68, 68);
  doc.setFont(FONT_MONO, 'bold');
  doc.setFontSize(14);
  doc.text('3-YEAR MISSION FAILURE PENALTY:', centerX, centerY + 50, { align: 'center' });
  doc.setFontSize(22);
  doc.text(aiReport?.cost_of_inaction || '₹0L', centerX, centerY + 62, { align: 'center' });
  
  doc.setFont(FONT_MONO, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(SLATE_TEXT[0], SLATE_TEXT[1], SLATE_TEXT[2]);
  const formattedExposure = Sanitize(aiReport?.exposure_rate || 'ANALYZING...');
  doc.text(`EXPOSURE RATE: ${formattedExposure}`, centerX, centerY + 72, { align: 'center' });
  drawFooter(pageCount++);

  // --- PAGE 5: NEURAL ADVANTAGE SPECTRUM (Radar) ---
  doc.addPage();
  setBG();
  drawHeader('Neural Advantage Spectrum', 'Diagnostic_Phase_2');
  
  const radarX = 105;
  const radarY = 120;
  const radarSize = 60;
  const points = report.replacement_map.length;
  
  // Radar Vector
  doc.setDrawColor(31, 41, 55);
  doc.setLineWidth(0.5);
  for (let j = 1; j <= 4; j++) {
    const scale = j / 4;
    for (let i = 0; i < points; i++) {
      const a1 = (i / points) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((i + 1) / points) * Math.PI * 2 - Math.PI / 2;
      doc.line(radarX + Math.cos(a1) * radarSize * scale, radarY + Math.sin(a1) * radarSize * scale, radarX + Math.cos(a2) * radarSize * scale, radarY + Math.sin(a2) * radarSize * scale);
    }
  }
  doc.setDrawColor(BLUE_TEXT[0], BLUE_TEXT[1], BLUE_TEXT[2]);
  doc.setLineWidth(1.5);
  for (let i = 0; i < points; i++) {
    const a1 = (i / points) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / points) * Math.PI * 2 - Math.PI / 2;
    const val1 = report.replacement_map[i].A / 100;
    const val2 = report.replacement_map[(i + 1) % points].A / 100;
    doc.line(radarX + Math.cos(a1) * radarSize * val1, radarY + Math.sin(a1) * radarSize * val1, radarX + Math.cos(a2) * radarSize * val2, radarY + Math.sin(a2) * radarSize * val2);
    const subject = report.replacement_map[i].subject;
    const score = report.replacement_map[i].A;
    const isExceeding = (report.replacement_map[i] as any).tag === 'REINFORCED';

    doc.setFontSize(8);
    if (isExceeding) {
      doc.setTextColor(34, 197, 94); // Tactical Green
      doc.setFont(FONT_MONO, 'bold');
    } else {
      doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
      doc.setFont(FONT_MONO, 'normal');
    }
    
    const tag = (report.replacement_map[i] as any).tag || (isExceeding ? 'REINFORCED' : 'VULNERABLE');
    const label = `${subject.toUpperCase()}: ${score}%`;
    const tagX = radarX + Math.cos(a1) * (radarSize + 22);
    const tagY = radarY + Math.sin(a1) * (radarSize + 22);
    
    doc.text(label, tagX, tagY, { align: 'center' });
    
    doc.setFontSize(6);
    doc.setTextColor(isExceeding ? 34 : 239, isExceeding ? 197 : 68, isExceeding ? 94 : 68);
    doc.text(`[${tag}]`, tagX, tagY + 4, { align: 'center' });
  }

  doc.setFont(FONT_MONO, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
  doc.text('// COMMANDERS NOTE: NEURAL RESILIENCE', 105, 220, { align: 'center' });
  
  doc.setFont(FONT_MONO, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(SLATE_TEXT[0], SLATE_TEXT[1], SLATE_TEXT[2]);
  
  // High-Density Delta Insights
  const insights = report.replacement_map.slice(0, 3).map((m: any) => `- ${m.subject}: ${m.insight || 'Mission critical proficiency delta detected.'}`);
  doc.text(insights, 35, 230);

  // Logic vs AI Benchmark 2026
  doc.setFont(FONT_MONO, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(239, 68, 68);
  doc.text('// NEURAL_BENCHMARK: LOGIC_CORE_V_AI_2026', 105, 260, { align: 'center' });
  doc.setFont(FONT_MONO, 'normal');
  doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
  const logicText = (report.replacement_map.find((m: any) => m.subject === 'Logic') as any)?.insight || `Logic Delta detected. Direct LLM displacement vulnerability is high. Your strategic survival depends on pivoting toward Empathy-heavy dimensions.`;
  const logicLines = doc.splitTextToSize(logicText, 140);
  doc.text(logicLines, 105, 266, { align: 'center' });
  
  drawFooter(pageCount++);

  // --- PAGE 6: STRATEGIC PIVOT VECTORS ---
  const formatCurrency = (val: any) => {
    const num = parseInt(Sanitize(val).replace(/[^0-9]/g, '')) || 0;
    return formatCurrencyUniversal(num);
  };

  doc.addPage();
  setBG();
  drawHeader('Strategic Pivot Vectors', 'Diagnostic_Phase_3');
  report.pivot_paths.forEach((path: any, i: number) => {
    const y = 60 + (i * 60);
    doc.setTextColor(BLUE_TEXT[0], BLUE_TEXT[1], BLUE_TEXT[2]);
    doc.setFontSize(10);
    doc.text(`VECTOR 0${i + 1}`, 20, y);
    doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
    doc.setFontSize(18);
    doc.text(path.title.toUpperCase(), 20, y + 10);
    doc.setFontSize(10);
    doc.setTextColor(SLATE_TEXT[0], SLATE_TEXT[1], SLATE_TEXT[2]);
    const salaryStr = path.min_salary ? `${formatLakhs(path.min_salary)} - ${formatLakhs(path.max_salary)}` : formatCurrency(path.salary);
    doc.text(`Est. Comp: ${salaryStr} // Demand: ${path.demand}`, 20, y + 20);
  });
  drawFooter(pageCount++);

  // --- PAGES 7-18: AI INTEL STREAM (Chapters 2-12) ---
  const aiChapters = aiReport?.chapters?.filter((c: any) => c.id !== 'Chapter_01') || [];
  aiChapters.forEach((chapter: any) => {
    doc.addPage();
    setBG();
    drawHeader(chapter.title, 'AI_Intelligence_Stream');
    doc.setFont(FONT_MONO, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
    const lines = doc.splitTextToSize(chapter.content, 175);
    let y = 50;
    lines.forEach((line: string) => {
      if (y > 270) {
        doc.setDrawColor(31, 41, 55);
        doc.line(20, 272, 190, 272);
        drawFooter(pageCount++);
        doc.addPage();
        setBG();
        drawHeader(chapter.title, 'AI_Stream_Continued');
        y = 50;
      }
      
      const height = drawTextWithLinks(Sanitize(line), 20, y, 175);
      y += height;
    });
    drawFooter(pageCount++);
  });

  // --- PAGES 19-24: TRIPLE-TRACK DEPLOYMENT MAPS (Multi-Column Table) ---
  const roadmaps = aiReport?.roadmaps || { alpha: report.roadmap, beta: [], gamma: [] };
  
  const renderRoadmapTable = (title: string, data: any[]) => {
    if (!data || data.length === 0) return;
    doc.addPage();
    setBG();
    drawHeader(title, 'Mission_Execution_Plan');
    
    let y = 50;
    const MARGIN = 20;
    const COL_WIDTH = 55;
    const ROW_HEIGHT = 20;
    const PADDING = 5; // 14pt approx 5mm

    // Draw Table Headers
    doc.setFontSize(8);
    doc.setTextColor(BLUE_TEXT[0], BLUE_TEXT[1], BLUE_TEXT[2]);
    doc.text('WEEK', MARGIN, y);
    doc.text('OBJECTIVE', MARGIN + 20, y);
    doc.text('TASKS', MARGIN + 80, y);
    doc.line(MARGIN, y + 2, 190, y + 2);
    y += 10;

    data.forEach((week: any, i: number) => {
      const tasks = week.tasks || [];
      const titleLines = doc.splitTextToSize(week.title || 'Mission Objective Pending', 50);
      const taskTexts = tasks.slice(0, 3).map((t: any) => {
        const text = typeof t === 'object' ? t.text : (t || 'Task Processing...');
        return doc.splitTextToSize(`[ ] ${text}`, 100);
      });
      
      const rowHeight = Math.max(titleLines.length * 5, taskTexts.reduce((acc: number, t: any[]) => acc + t.length * 5, 0)) + 10;

      if (y + rowHeight > 270) {
        drawFooter(pageCount++);
        doc.addPage();
        setBG();
        drawHeader(title, 'Execution_Continued');
        y = 50;
        
        // Redraw Headers
        doc.setFontSize(8);
        doc.setTextColor(BLUE_TEXT[0], BLUE_TEXT[1], BLUE_TEXT[2]);
        doc.text('WEEK', MARGIN, y);
        doc.text('OBJECTIVE', MARGIN + 20, y);
        doc.text('TASKS', MARGIN + 80, y);
        doc.line(MARGIN, y + 2, 190, y + 2);
        y += 10;
      }

      doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
      doc.setFontSize(9);
      const weekNum = (week.week || i + 1).toString().padStart(2, '0');
      doc.text(weekNum, MARGIN, y);
      
      doc.text(titleLines, MARGIN + 20, y);
      
      let taskY = y;
      if (tasks.length === 0 || tasks.some((t: any) => typeof t === 'string' && t.includes('OFFLINE'))) {
        doc.setTextColor(239, 68, 68);
        doc.text('[!] MISSION_INTEL_PENDING // RE-LINKING...', MARGIN + 80, y);
        doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
      } else {
        taskTexts.forEach((lines: any) => {
          doc.text(lines, MARGIN + 80, taskY);
          taskY += lines.length * 5;
        });
      }
      
      y += rowHeight;
      doc.setDrawColor(31, 41, 55);
      doc.line(MARGIN, y - 2, 190, y - 2);
    });
    drawFooter(pageCount++);
  };

  renderRoadmapTable('DEPLOYMENT: ALPHA (PATH 1)', roadmaps.alpha);
  renderRoadmapTable('DEPLOYMENT: BETA (PATH 2)', roadmaps.beta);
  renderRoadmapTable('DEPLOYMENT: GAMMA (PATH 3)', roadmaps.gamma);

  // --- FINAL PAGE: MISSION CONCLUSION ---
  doc.addPage();
  setBG();
  drawHeader('Mission Conclusion', 'Tactical_Outro');
  
  // Tactical Gain HUD
  const currentSal = parseInt((assessment as any).income_target?.toString().replace(/[^0-9]/g, '') || '0') || 0;
  const bestPivot = Math.max(...report.pivot_paths.map((p: any) => p.max_salary || 0));
  const threeYearGain = (bestPivot - currentSal) * 3;

  doc.setFillColor(31, 41, 55);
  doc.roundedRect(20, 50, 170, 40, 5, 5, 'F');
  doc.setFont(FONT_MONO, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(34, 197, 94); // Tactical Green
  doc.text('// MISSION_ROI: 3-YEAR TACTICAL GAIN', 105, 62, { align: 'center' });
  doc.setFontSize(28);
  doc.text(formatCurrencyUniversal(threeYearGain), 105, 80, { align: 'center' });

  doc.setFont(FONT_MONO, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(WHITE_TEXT[0], WHITE_TEXT[1], WHITE_TEXT[2]);
  const finalSummary = doc.splitTextToSize(report.analysis_summary, 175);
  doc.text(finalSummary, 20, 105);
  
  doc.setTextColor(SLATE_TEXT[0], SLATE_TEXT[1], SLATE_TEXT[2]);
  doc.setFontSize(8);
  doc.text('STATUS: MISSION_SUCCESS // PAYLOAD_DELIVERED', 105, 270, { align: 'center' });
  
  drawFooter(pageCount++);

  // SAVE
  const safeJobTitle = (assessment.job_title || 'OPERATIVE')
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 40);

  const finalName = `Guardian_Dossier_${safeJobTitle}.pdf`;
  console.log(`INITIATING_DOWNLOAD: ${finalName}`);
  doc.save(finalName);
};
