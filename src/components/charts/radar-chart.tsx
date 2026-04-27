'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const aiScore = data.B || 85; // B is usually AI
    const humanScore = data.A;
    const gap = Math.max(0, aiScore - humanScore);
    
    return (
      <div className="bg-black/90 backdrop-blur-xl border border-blue-500/30 p-4 rounded-2xl shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] min-w-[240px]">
        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1">Dimension_Analysis</div>
        <h4 className="text-xl font-black italic uppercase tracking-tighter mb-3">{data.subject}</h4>
        
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-mono text-white/40 uppercase">Human_Proficiency</span>
            <span className="text-lg font-black text-white">{humanScore}%</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-mono text-white/40 uppercase">AI_Capability_2026</span>
            <span className="text-lg font-black text-blue-400">{aiScore}%</span>
          </div>
          
          <div className="pt-3 mt-1 border-t border-white/5">
            <div className="text-[9px] font-mono text-red-500 uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Displacement_Risk
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              AI currently exceeds your proficiency by <span className="text-red-500 font-bold">{gap}%</span>. This creates a critical automation vulnerability in {data.subject.toLowerCase()}-heavy workflows.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ReplacementMapChart({ chartData = [] }: { chartData: any[] }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground text-sm italic">
        Mapping skill delta...
      </div>
    );
  }
  
  // Ensure we have AI data for comparison (B) if it's missing
  const dataWithAI = chartData.map(d => ({
    ...d,
    B: d.B || (d.subject === 'Logic' ? 95 : d.subject === 'Strategy' ? 88 : 80)
  }));

  return (
    <div className="w-full h-full flex items-center justify-center relative z-10 overflow-visible">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/[0.08] blur-[110px] rounded-full pointer-events-none z-0" />
      
      <ResponsiveContainer width="100%" height={440}>
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius={160} 
          data={dataWithAI}
          className="relative z-10"
        >
          <PolarGrid stroke="#ffffff15" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={(props: any) => {
              const { payload, x, y, cx, cy, index } = props;
              const data = dataWithAI[index];
              return (
                <g transform={`translate(${x},${y})`}>
                  <text 
                    x={0} 
                    y={0} 
                    textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'} 
                    dominantBaseline="central"
                    fill="#ffffff90"
                    fontSize={11}
                    fontWeight={800}
                    className="uppercase tracking-tighter italic"
                  >
                    {payload.value}
                  </text>
                  <text 
                    x={0} 
                    y={14} 
                    textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'} 
                    dominantBaseline="central"
                    fill="#3b82f6"
                    fontSize={13}
                    fontWeight={900}
                    className="italic"
                  >
                    {data.A}%
                  </text>
                </g>
              );
            }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Human"
            dataKey="A"
            stroke="#3b82f6"
            strokeWidth={4}
            fill="url(#radarGradient)"
            fillOpacity={0.6}
          />
          <Radar
            name="AI"
            dataKey="B"
            stroke="#ef4444"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="transparent"
            fillOpacity={0}
          />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
