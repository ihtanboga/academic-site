import React, { useState, useMemo, useEffect } from 'react';
import stentData from './data/stent_data.json';
import { Search, Plus, X, ChevronDown, ExternalLink, Trash2, Target, CheckCircle, List, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  primary: '#1e3a5f',
  primaryLight: '#2d4a6f',
  primaryDark: '#152a45',
  accent: '#f97316',
  accentLight: '#fb923c',
  accentDark: '#ea580c',
  accentBg: '#fff7ed',
  primaryBg: '#eff6ff',
  success: '#22c55e',
  successBg: '#f0fdf4',
};

const MOBILE_BREAKPOINT = 900;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiameter, setSelectedDiameter] = useState('all');
  const [comparisonList, setComparisonList] = useState([]);
  const [expandedStent, setExpandedStent] = useState(null);
  const [targetDiameter, setTargetDiameter] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stentGroups = useMemo(() => {
    const groups = {};
    stentData.forEach(item => {
      if (!groups[item.Stent]) {
        groups[item.Stent] = { name: item.Stent, manufacturer: item.Manufacturer, diameters: [] };
      }
      groups[item.Stent].diameters.push({ nominal: item.Nominal_diameter, max: item.Overexpansion_limit, reference: item.Reference });
    });
    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const allDiameters = useMemo(() => {
    return [...new Set(stentData.map(s => s.Nominal_diameter))].sort((a, b) => a - b);
  }, []);

  const stentsReachingTarget = useMemo(() => {
    if (!targetDiameter || isNaN(parseFloat(targetDiameter))) return [];
    const target = parseFloat(targetDiameter);
    return stentData
      .filter(s => s.Overexpansion_limit !== 'no data' && s.Overexpansion_limit >= target)
      .map(s => ({ ...s, canReach: true, margin: (s.Overexpansion_limit - target).toFixed(2) }))
      .sort((a, b) => a.Nominal_diameter - b.Nominal_diameter);
  }, [targetDiameter]);

  const filteredStents = useMemo(() => {
    return stentGroups.filter(stent => {
      const matchesSearch = stent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stent.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDiameter = selectedDiameter === 'all' ||
        stent.diameters.some(d => d.nominal === parseFloat(selectedDiameter));
      return matchesSearch && matchesDiameter;
    });
  }, [stentGroups, searchTerm, selectedDiameter]);

  const addToComparison = (stentName, diameter) => {
    const stentInfo = stentData.find(s => s.Stent === stentName && s.Nominal_diameter === diameter.nominal);
    if (stentInfo) {
      const exists = comparisonList.some(c => c.Stent === stentInfo.Stent && c.Nominal_diameter === stentInfo.Nominal_diameter);
      if (!exists && comparisonList.length < 8) setComparisonList([...comparisonList, stentInfo]);
    }
  };

  const removeFromComparison = (index) => setComparisonList(comparisonList.filter((_, i) => i !== index));

  const chartData = comparisonList.map((s) => ({
    name: (s.Stent.length > (isMobile ? 10 : 14) ? s.Stent.substring(0, isMobile ? 10 : 14) + '…' : s.Stent) + ' (' + s.Nominal_diameter + ')',
    fullName: s.Stent,
    nominal: s.Nominal_diameter,
    maxExpansion: s.Overexpansion_limit === 'no data' ? null : s.Overexpansion_limit,
    expansion: s.Overexpansion_limit === 'no data' ? 0 : s.Overexpansion_limit - s.Nominal_diameter,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: 'white', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '2px solid ' + COLORS.primary }}>
          <p style={{ fontWeight: 600, marginBottom: 8, color: COLORS.primary }}>{data.fullName}</p>
          <p style={{ color: COLORS.primary, marginBottom: 4 }}>Nominal: {data.nominal} mm</p>
          {data.maxExpansion && <p style={{ color: COLORS.accent }}>Max: {data.maxExpansion} mm (+{((data.maxExpansion - data.nominal) / data.nominal * 100).toFixed(0)}%)</p>}
        </div>
      );
    }
    return null;
  };

  const card = { background: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' };

  return (
    <div style={{ minHeight: '100vh', padding: isMobile ? '12px' : '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '10px' }}>
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '999px',
            border: '1px solid #cbd5e1',
            background: 'rgba(255,255,255,0.9)',
            color: COLORS.primary,
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          ← Main Site
        </a>
      </div>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, ' + COLORS.primary + ' 0%, ' + COLORS.primaryLight + ' 100%)', borderRadius: '16px', padding: isMobile ? '16px 20px' : '24px 32px', marginBottom: '16px', boxShadow: '0 4px 20px rgba(30,58,95,0.3)' }}>
        <h1 style={{ color: 'white', fontSize: isMobile ? '20px' : '28px', fontWeight: 700, marginBottom: '4px' }}>Stent Expansion Comparator</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Compare maximal expansion capacities of coronary stents</p>
      </header>

      {/* How to Use – desktop only */}
      {!isMobile && (
        <div style={{ ...card, padding: '20px 24px', marginBottom: '16px', borderLeft: '4px solid ' + COLORS.primary }}>
          <p style={{ fontWeight: 700, color: COLORS.primary, fontSize: '15px', marginBottom: '12px' }}>How to Use</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { n: 1, title: 'Target Diameter Finder', text: 'Enter the desired vessel diameter (mm). Shows all stents that can reach or exceed that target.' },
              { n: 2, title: 'Browse & Add', text: 'Search by name or manufacturer, filter by nominal diameter. Tap to expand, then add to compare (up to 8).' },
              { n: 3, title: 'Compare', text: 'The bar chart and table show nominal vs. max expansion side by side. Tap IFU for manufacturer instructions.' },
            ].map(({ n, title, text }) => (
              <div key={n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ background: COLORS.primaryBg, color: COLORS.primary, fontWeight: 700, borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px' }}>{n}</span>
                <div>
                  <p style={{ fontWeight: 600, color: COLORS.primary, fontSize: '13px', marginBottom: '2px' }}>{title}</p>
                  <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.5' }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target Diameter Finder */}
      <div style={{ ...card, padding: isMobile ? '14px 16px' : '20px 24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ background: COLORS.accentBg, padding: '8px', borderRadius: '10px', flexShrink: 0 }}>
            <Target style={{ width: '20px', height: '20px', color: COLORS.accent }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: COLORS.primary, fontSize: '14px' }}>Target Diameter Finder</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Find stents that can reach your target</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: isMobile ? '100%' : '180px', maxWidth: isMobile ? '220px' : 'none' }}>
            <input
              type="number" step="0.1" min="2" max="6" placeholder="e.g. 4.5"
              value={targetDiameter}
              onChange={(e) => setTargetDiameter(e.target.value)}
              style={{ width: '100%', padding: '10px 40px 10px 14px', border: '2px solid ' + (targetDiameter ? COLORS.accent : '#e5e7eb'), borderRadius: '10px', fontSize: '16px', fontWeight: 600, outline: 'none' }}
            />
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '13px' }}>mm</span>
          </div>
          {targetDiameter && stentsReachingTarget.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: COLORS.successBg, padding: '8px 12px', borderRadius: '10px', border: '1px solid ' + COLORS.success }}>
              <CheckCircle style={{ width: '16px', color: COLORS.success, flexShrink: 0 }} />
              <span style={{ fontWeight: 600, color: COLORS.success, fontSize: '13px' }}>
                {stentsReachingTarget.length} stent{stentsReachingTarget.length > 1 ? 's' : ''} → {targetDiameter}mm
              </span>
            </div>
          )}
          {targetDiameter && stentsReachingTarget.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', padding: '8px 12px', borderRadius: '10px', border: '1px solid #fca5a5' }}>
              <X style={{ width: '16px', color: '#ef4444', flexShrink: 0 }} />
              <span style={{ fontWeight: 600, color: '#ef4444', fontSize: '13px' }}>No stents reach {targetDiameter}mm</span>
            </div>
          )}
        </div>
      </div>

      {/* Target Results */}
      {targetDiameter && stentsReachingTarget.length > 0 && (
        <div style={{ ...card, marginBottom: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: COLORS.successBg, borderBottom: '1px solid ' + COLORS.success, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ fontWeight: 600, color: COLORS.primary, fontSize: '14px' }}>Stents reaching {targetDiameter}mm</h3>
            <button onClick={() => setTargetDiameter('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
              <X style={{ width: '16px', color: '#6b7280' }} />
            </button>
          </div>
          <div style={{ maxHeight: '260px', overflowY: 'auto', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '380px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', position: 'sticky', top: 0 }}>
                  {['Stent', 'Nominal', 'Max', 'Margin', 'Add'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Stent' ? 'left' : 'center', fontSize: '11px', fontWeight: 600, color: COLORS.primary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stentsReachingTarget.map((stent, idx) => {
                  const isAdded = comparisonList.some(c => c.Stent === stent.Stent && c.Nominal_diameter === stent.Nominal_diameter);
                  return (
                    <tr key={idx} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <p style={{ fontWeight: 500, color: COLORS.primary, fontSize: '12px' }}>{stent.Stent}</p>
                        <p style={{ fontSize: '11px', color: '#6b7280' }}>{stent.Manufacturer}</p>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ background: COLORS.primaryBg, color: COLORS.primary, padding: '3px 7px', borderRadius: '6px', fontWeight: 600, fontSize: '11px' }}>{stent.Nominal_diameter}</span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ background: COLORS.accentBg, color: COLORS.accentDark, padding: '3px 7px', borderRadius: '6px', fontWeight: 600, fontSize: '11px' }}>{stent.Overexpansion_limit}</span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ color: COLORS.success, fontWeight: 600, fontSize: '12px' }}>+{stent.margin}</span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <button
                          onClick={() => { if (!isAdded && comparisonList.length < 8) setComparisonList([...comparisonList, stent]); }}
                          disabled={isAdded}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: isAdded ? '#d1d5db' : COLORS.accent, color: 'white', fontWeight: 500, cursor: isAdded ? 'not-allowed' : 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          {isAdded ? '✓' : <><Plus style={{ width: '12px' }} />Add</>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Tab Bar */}
      {isMobile && (
        <div style={{ display: 'flex', background: 'white', borderRadius: '12px', padding: '4px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('browse')}
            style={{ flex: 1, padding: '10px', borderRadius: '9px', border: 'none', background: activeTab === 'browse' ? COLORS.primary : 'transparent', color: activeTab === 'browse' ? 'white' : '#6b7280', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}>
            <List style={{ width: '16px' }} /> Browse
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            style={{ flex: 1, padding: '10px', borderRadius: '9px', border: 'none', background: activeTab === 'compare' ? COLORS.primary : 'transparent', color: activeTab === 'compare' ? 'white' : '#6b7280', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}>
            <BarChart2 style={{ width: '16px' }} />
            Compare
            {comparisonList.length > 0 && (
              <span style={{ background: COLORS.accent, color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '12px' }}>{comparisonList.length}</span>
            )}
          </button>
        </div>
      )}

      {/* Main 2-col layout */}
      <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: 'minmax(300px, 34vw) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>

        {/* LEFT: Browse Panel */}
        {(!isMobile || activeTab === 'browse') && (
          <div style={{ ...card, overflow: 'hidden', marginBottom: isMobile ? '12px' : 0 }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '18px' }} />
                <input
                  type="text" placeholder="Search stents..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px 11px 40px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <select
                value={selectedDiameter}
                onChange={(e) => setSelectedDiameter(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', background: 'white', cursor: 'pointer', outline: 'none' }}>
                <option value="all">All Diameters</option>
                {allDiameters.map(d => <option key={d} value={d}>{d} mm</option>)}
              </select>
            </div>
            <div style={{ maxHeight: isMobile ? '420px' : '560px', overflowY: 'auto' }}>
              {filteredStents.map(stent => (
                <div key={stent.name} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <div
                    onClick={() => setExpandedStent(expandedStent === stent.name ? null : stent.name)}
                    style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: expandedStent === stent.name ? COLORS.primaryBg : 'white', transition: 'background 0.2s' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: '#1f2937', marginBottom: '2px', fontSize: '14px', overflowWrap: 'anywhere' }}>{stent.name}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', overflowWrap: 'anywhere' }}>{stent.manufacturer}</p>
                    </div>
                    <ChevronDown style={{ width: '18px', color: COLORS.primary, transform: expandedStent === stent.name ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </div>
                  {expandedStent === stent.name && (
                    <div style={{ padding: '0 16px 14px', background: COLORS.primaryBg }}>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Select diameter:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {stent.diameters
                          .filter(d => selectedDiameter === 'all' || d.nominal === parseFloat(selectedDiameter))
                          .sort((a, b) => a.nominal - b.nominal)
                          .map(d => {
                            const isAdded = comparisonList.some(c => c.Stent === stent.name && c.Nominal_diameter === d.nominal);
                            return (
                              <button
                                key={d.nominal}
                                onClick={() => {
                                  if (!isAdded) {
                                    addToComparison(stent.name, d);
                                    if (isMobile) setActiveTab('compare');
                                  }
                                }}
                                disabled={isAdded}
                                style={{ padding: '7px 13px', borderRadius: '8px', border: 'none', background: isAdded ? '#d1d5db' : 'linear-gradient(135deg, ' + COLORS.accent + ', ' + COLORS.accentDark + ')', color: 'white', fontWeight: 500, cursor: isAdded ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', boxShadow: isAdded ? 'none' : '0 2px 8px rgba(249,115,22,0.3)' }}>
                                {d.nominal} mm
                                {d.max !== 'no data' && <span style={{ opacity: 0.9, fontSize: '11px' }}>→{d.max}</span>}
                                {!isAdded && <Plus style={{ width: '13px' }} />}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT: Compare Panel */}
        {(!isMobile || activeTab === 'compare') && (
          <div>
            {comparisonList.length === 0 ? (
              <div style={{ ...card, padding: isMobile ? '40px 20px' : '60px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', background: COLORS.accentBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Plus style={{ width: '28px', color: COLORS.accent }} />
                </div>
                <h3 style={{ color: COLORS.primary, marginBottom: '8px', fontSize: '17px' }}>No Stents Selected</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {isMobile ? 'Go to Browse tab, tap a stent and select a diameter.' : 'Click a stent from the left panel and select a diameter.'}
                </p>
                {isMobile && (
                  <button onClick={() => setActiveTab('browse')} style={{ marginTop: '16px', padding: '10px 24px', background: COLORS.primary, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                    Go to Browse
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Selected Tags */}
                <div style={{ ...card, padding: '16px', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>Selected Stents ({comparisonList.length}/8)</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {comparisonList.map((stent, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: COLORS.accentBg, padding: '6px 10px', borderRadius: '8px', border: '1px solid ' + COLORS.accentLight, minWidth: 0 }}>
                        <span style={{ fontWeight: 500, color: COLORS.accentDark, fontSize: '12px', overflowWrap: 'anywhere' }}>{stent.Stent} ({stent.Nominal_diameter}mm)</span>
                        <button onClick={() => removeFromComparison(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}>
                          <X style={{ width: '14px', color: '#ef4444' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div style={{ ...card, padding: '20px', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: COLORS.primary, marginBottom: '16px' }}>Expansion Capacity Comparison</h3>
                  <div style={{ height: isMobile ? Math.max(200, comparisonList.length * 48) + 'px' : '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: isMobile ? 8 : 20, right: 20, top: 5, bottom: 5 }}>
                        <XAxis type="number" domain={[0, 'dataMax + 1']} unit=" mm" tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="name" width={isMobile ? 88 : 140} tick={{ fontSize: isMobile ? 9 : 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        {!isMobile && <Legend />}
                        <Bar dataKey="nominal" name="Nominal Diameter" stackId="a" fill={COLORS.primary} />
                        <Bar dataKey="expansion" name="Expansion Range" stackId="a" fill={COLORS.accent} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Table */}
                <div style={{ ...card, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '400px' : 'auto' }}>
                      <thead>
                        <tr style={{ background: COLORS.primaryBg }}>
                          <th style={{ padding: '12px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>Stent</th>
                          {!isMobile && <th style={{ padding: '12px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>Manufacturer</th>}
                          <th style={{ padding: '12px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>Nominal</th>
                          <th style={{ padding: '12px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>Max</th>
                          <th style={{ padding: '12px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>Gain</th>
                          <th style={{ padding: '12px 12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>IFU</th>
                          <th style={{ padding: '12px 8px', width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonList.map((stent, idx) => {
                          const hasMax = stent.Overexpansion_limit !== 'no data';
                          const gain = hasMax ? ((stent.Overexpansion_limit - stent.Nominal_diameter) / stent.Nominal_diameter * 100).toFixed(0) : null;
                          return (
                            <tr key={idx} style={{ borderTop: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '12px 12px', fontWeight: 500, color: COLORS.primary, fontSize: '13px', overflowWrap: 'anywhere' }}>
                                {stent.Stent}
                                {isMobile && <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 400, marginTop: '2px' }}>{stent.Manufacturer}</div>}
                              </td>
                              {!isMobile && <td style={{ padding: '12px 12px', color: '#6b7280', fontSize: '12px' }}>{stent.Manufacturer}</td>}
                              <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                                <span style={{ background: COLORS.primaryBg, color: COLORS.primary, padding: '3px 8px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap' }}>{stent.Nominal_diameter} mm</span>
                              </td>
                              <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                                {hasMax
                                  ? <span style={{ background: COLORS.accentBg, color: COLORS.accentDark, padding: '3px 8px', borderRadius: '6px', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap' }}>{stent.Overexpansion_limit} mm</span>
                                  : <span style={{ color: '#9ca3af' }}>N/A</span>}
                              </td>
                              <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                                {gain ? <span style={{ color: COLORS.accent, fontWeight: 600, fontSize: '13px' }}>+{gain}%</span> : <span style={{ color: '#9ca3af' }}>-</span>}
                              </td>
                              <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                                {stent.Reference && (
                                  <a href={stent.Reference} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.primary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                                    <ExternalLink style={{ width: '14px' }} />
                                  </a>
                                )}
                              </td>
                              <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                <button onClick={() => removeFromComparison(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '6px', display: 'flex' }}>
                                  <Trash2 style={{ width: '15px', color: '#ef4444' }} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
