/* eslint-disable react-hooks/set-state-in-render */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Mountain, MapPin, Compass, TrendingUp, Info } from 'lucide-react';

// Helper to parse altitude from text (e.g. "3,440m" -> 3440)
const parseAltitude = (text) => {
  if (!text) return null;
  const match = text.match(/(\d{1,2},?\d{3})\s*m/i);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10);
  }
  return null;
};

export default function RouteMap({ trek }) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const waypoints = useMemo(() => {
    if (!trek || !trek.itinerary || trek.itinerary.length === 0) {
      return [];
    }

    const itinerary = trek.itinerary;
    const n = itinerary.length;

    // Parse altitudes for all days
    const daysWithAlt = itinerary.map((item, index) => {
      let alt = parseAltitude(item.title) || parseAltitude(item.description);
      
      // Provide fallback defaults based on typical trek progression
      if (!alt) {
        if (index === 0) alt = 1400; // Kathmandu
        else if (index === n - 1) alt = 1400; // Return/Kathmandu
        else {
          // Linear interpolation between start (1400) and max altitude of the trek
          const maxAltVal = trek.maxAltitude ? parseInt(trek.maxAltitude.replace(/,/g, ''), 10) : 5000;
          const peakIndex = Math.floor(n * 0.7); // Assume peak is around 70% of trek duration
          if (index <= peakIndex) {
            alt = Math.round(1400 + (maxAltVal - 1400) * (index / peakIndex));
          } else {
            alt = Math.round(maxAltVal - (maxAltVal - 1400) * ((index - peakIndex) / (n - 1 - peakIndex)));
          }
        }
      }
      return {
        day: item.day,
        title: item.title,
        description: item.description,
        altitude: alt
      };
    });

    // Select 5 key milestones to display on the route map
    // We always include: Day 1, Peak Day, Final Day, and 2 other intermediate key days
    const peakIndex = daysWithAlt.reduce((maxIdx, current, idx, arr) => 
      current.altitude > arr[maxIdx].altitude ? idx : maxIdx, 0
    );

    const selectedIndices = new Set([0, peakIndex, n - 1]);

    // Fill in intermediate points if we have space
    if (n > 3) {
      // Find a point in the first half
      const mid1 = Math.floor(peakIndex / 2);
      if (mid1 > 0 && mid1 < peakIndex) selectedIndices.add(mid1);

      // Find a point in the second half
      const mid2 = peakIndex + Math.floor((n - 1 - peakIndex) / 2);
      if (mid2 > peakIndex && mid2 < n - 1) selectedIndices.add(mid2);
    }

    // Convert Set back to sorted array of days
    const milestoneDays = Array.from(selectedIndices)
      .map(idx => daysWithAlt[idx])
      .sort((a, b) => a.day - b.day);

    // Map these selected days to SVG coordinates (Width: 800, Height: 320)
    // X goes from 80 to 720
    // Y goes from 60 (highest altitude, eg 6000m) to 270 (lowest altitude, eg 1000m)
    const minAlt = Math.min(...milestoneDays.map(d => d.altitude), 1000) - 200;
    const maxAlt = Math.max(...milestoneDays.map(d => d.altitude), 5500) + 200;
    const altRange = maxAlt - minAlt;

    const mappedPoints = milestoneDays.map((d, i) => {
      const x = 80 + i * (640 / (milestoneDays.length - 1));
      // Invert Y because higher altitude = lower SVG Y coordinate
      const y = 270 - ((d.altitude - minAlt) / altRange) * 210;
      return {
        ...d,
        x: Math.round(x),
        y: Math.round(y)
      };
    });

    // Set first point as default selected if none selected
    if (!selectedPoint && mappedPoints.length > 0) {
      setSelectedPoint(mappedPoints[0]);
    }

    return mappedPoints;
  }, [trek]);

  // Generate cubic bezier path linking the points smoothly
  const pathD = useMemo(() => {
    if (waypoints.length < 2) return '';
    let d = `M ${waypoints[0].x} ${waypoints[0].y}`;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const curr = waypoints[i];
      const next = waypoints[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  }, [waypoints]);

  // Generate background filled area path
  const areaD = useMemo(() => {
    if (waypoints.length < 2) return '';
    return `${pathD} L ${waypoints[waypoints.length - 1].x} 320 L ${waypoints[0].x} 320 Z`;
  }, [waypoints, pathD]);

  if (waypoints.length === 0) return null;

  return (
    <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none z-0">
        <Compass size={180} />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
          <div>
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5 mb-1">
              <TrendingUp size={14} /> Interactive Altitude & Route Map
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Elevation Profile</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/60 backdrop-blur border border-slate-800/80 px-3.5 py-2 rounded-xl">
            <Info size={14} className="text-emerald-400 shrink-0" />
            <span>Click any waypoint on the graph below to see detailed itinerary.</span>
          </div>
        </div>

        {/* SVG Route Visualization */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="min-w-[760px] h-[340px] relative mx-auto select-none">
            {/* Grid altitude guide lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-10 opacity-15 text-[10px] text-slate-400 font-mono pl-2">
              <div className="border-b border-slate-700 w-full pb-1">MAX ELEVATION</div>
              <div className="border-b border-slate-700 w-full pb-1">HIGH PASS ZONE</div>
              <div className="border-b border-slate-700 w-full pb-1">ALPINE ZONE</div>
              <div className="border-b border-slate-700 w-full pb-1">VALLEY LEVEL</div>
            </div>

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 340">
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Shaded Area Under the Elevation Curve */}
              <motion.path
                d={areaD}
                fill="url(#areaGradient)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1 }}
              />

              {/* Connecting elevation bezier curve */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />

              {/* Animated waypoint indicator markers */}
              {waypoints.map((point, index) => {
                const isSelected = selectedPoint && selectedPoint.day === point.day;
                return (
                  <g key={point.day}>
                    {/* Hover hotspot and outer ring */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isSelected ? 14 : 9}
                      className="fill-emerald-500/20 stroke-emerald-500/50 hover:stroke-emerald-400 cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedPoint(point)}
                    />
                    {/* Core node */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      className={`${isSelected ? 'fill-white' : 'fill-emerald-400'} cursor-pointer transition-all duration-300`}
                      onClick={() => setSelectedPoint(point)}
                    />
                    {/* Tiny altitude label on top of nodes */}
                    <text
                      x={point.x}
                      y={point.y - 18}
                      textAnchor="middle"
                      className="fill-slate-300 font-bold text-[10px] font-mono pointer-events-none drop-shadow-md"
                    >
                      {point.altitude}m
                    </text>
                    {/* Day text below nodes */}
                    <text
                      x={point.x}
                      y={point.y + 22}
                      textAnchor="middle"
                      className="fill-slate-400 text-[10px] font-medium pointer-events-none"
                    >
                      Day {point.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Waypoint Detail Card */}
        {selectedPoint && (
          <motion.div
            key={selectedPoint.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl font-bold text-sm border border-emerald-500/20">
                  Day {selectedPoint.day}
                </div>
                <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <MapPin size={16} className="text-emerald-400" /> {selectedPoint.title}
                </h4>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400">Elevation Achieved</span>
                <div className="text-base font-mono font-bold text-emerald-400">{selectedPoint.altitude.toLocaleString()} meters</div>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-light">{selectedPoint.description}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
