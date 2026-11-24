import { useMemo } from 'react';

export default function HourlyInversionChart({ hourlyData = [] }) {
  // Find max AQI to scale the bars - memoized to prevent recalculation on parent re-renders
  const maxAqi = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return 400;
    return Math.max(...hourlyData.map((d) => d.aqi), 400);
  }, [hourlyData]);

  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>24-Hour Diurnal Inversion Forecast</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              (Thermal Boundary Trapping Cycle)
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Green zone indicates the safe midday solar ventilation breakthrough. Red/purple indicates peak cold inversion caps.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
            <span className="text-slate-300">Safe Vent Window</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-600"></span>
            <span className="text-slate-300">Hazardous Inversion Peak</span>
          </div>
        </div>
      </div>

      {/* Hourly Bar Visualizer */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-end gap-1.5 min-w-[720px] h-44 pt-6 px-1">
          {hourlyData.map((d, index) => {
            const heightPercent = Math.max(12, Math.round((d.aqi / maxAqi) * 100));
            const isVent = d.isVentilationWindow;
            const isSevere = d.aqi >= 300;
            const isUnhealthy = d.aqi >= 150 && !isSevere;

            const barColor = isVent
              ? 'bg-gradient-to-t from-emerald-600 to-teal-400 border-emerald-400'
              : isSevere
              ? 'bg-gradient-to-t from-rose-900 to-rose-600 border-rose-500'
              : isUnhealthy
              ? 'bg-gradient-to-t from-orange-800 to-amber-500 border-amber-400'
              : 'bg-gradient-to-t from-slate-700 to-slate-500 border-slate-400';

            return (
              <div
                key={d.hour ?? index}
                className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[10px] font-mono px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-20">
                  <div className="font-bold">{d.timeLabel} • AQI {d.aqi}</div>
                  <div className="text-cyan-300">PM2.5: {d.pm25} µg/m³</div>
                  <div className={isVent ? 'text-emerald-400' : 'text-rose-400'}>
                    {d.inversionStrength}
                  </div>
                </div>

                {/* The Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md border-t transition-all duration-300 group-hover:brightness-125 ${barColor}`}
                />

                {/* Time Label */}
                <span className="text-[10px] font-mono text-slate-400 mt-2">
                  {d.hour % 3 === 0 ? d.timeLabel : '•'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
