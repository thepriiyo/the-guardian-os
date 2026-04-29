'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export function IncomeBridgeChart({ currentSalary, projection }: { currentSalary?: string; projection?: { year: string; legacy: number; pivot: number; }[] }) {
  // Parse base salary with safety fallback
  const salaryStr = currentSalary || "80000";
  const base = parseInt(salaryStr.toString().replace(/[^0-9]/g, '')) || 80000;
  
  const data = projection || [
    { year: '2024', legacy: base, pivot: base },
    { year: '2025', legacy: base * 1.03, pivot: base * 1.10 },
    { year: '2026', legacy: base * 0.98, pivot: base * 1.25 },
    { year: '2027', legacy: base * 0.90, pivot: base * 1.45 },
    { year: '2028', legacy: base * 0.82, pivot: base * 1.70 },
    { year: '2029', legacy: base * 0.75, pivot: base * 2.10 },
  ];

  const formatValue = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-full h-full p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em]">Financial_Projection</div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter">The Cost of Inaction</h3>
        </div>
        <div className="text-right">
          <div className="text-[9px] font-mono text-red-500 uppercase tracking-widest mb-1">Projected_Loss_2029</div>
          <div className="text-2xl font-black text-red-500 italic">-{formatValue((data[5]?.pivot || 0) - (data[5]?.legacy || 0))}</div>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPivot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#ffffff30', fontSize: 10 }} 
            />
            <YAxis hide />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
                      <div className="text-[10px] font-mono text-white/40 mb-2 uppercase">{payload[0].payload.year} Projection</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 justify-between">
                          <span className="text-[9px] font-mono text-red-400 uppercase">Legacy Path</span>
                          <span className="text-sm font-bold">{formatValue(payload[0].value as number)}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <span className="text-[9px] font-mono text-blue-400 uppercase">Pivot Path</span>
                          <span className="text-sm font-bold">{formatValue(payload[1].value as number)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="legacy" 
              stroke="#ef4444" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorCurrent)" 
            />
            <Area 
              type="monotone" 
              dataKey="pivot" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorPivot)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-between text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-0.5 bg-red-500/50" /> Stagnation Vector
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-0.5 bg-blue-500" /> Acceleration Vector
        </div>
      </div>
    </div>
  );
}
