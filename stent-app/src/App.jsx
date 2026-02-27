import React, { useState, useMemo } from 'react';
import stentData from './data/stent_data.json';
import { Search, Plus, X, ChevronDown, ExternalLink, Trash2, Target, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Renkler: Koyu Mavi + Turuncu
const COLORS = {
  primary: '#1e3a5f',      // Koyu mavi
  primaryLight: '#2d4a6f',
  primaryDark: '#152a45',
  accent: '#f97316',       // Turuncu
  accentLight: '#fb923c',
  accentDark: '#ea580c',
  accentBg: '#fff7ed',
  primaryBg: '#eff6ff',
  success: '#22c55e',
  successBg: '#f0fdf4',
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiameter, setSelectedDiameter] = useState('all');
  const [comparisonList, setComparisonList] = useState([]);
  const [expandedStent, setExpandedStent] = useState(null);
  const [targetDiameter, setTargetDiameter] = useState('');

  const stentGroups = useMemo(() => {
    const groups = {};
    stentData.forEach(item => {
      if (!groups[item.Stent]) {
        groups[item.Stent] = {
          name: item.Stent,
          manufacturer: item.Manufacturer,
          diameters: []
        };
      }
      groups[item.Stent].diameters.push({
        nominal: item.Nominal_diameter,
        max: item.Overexpansion_limit,
        reference: item.Reference
      });
    });
    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const allDiameters = useMemo(() => {
    return [...new Set(stentData.map(s => s.Nominal_diameter))].sort((a, b) => a - b);
  }, []);

  // Hedef çapa ulaşabilecek stentleri bul
  const stentsReachingTarget = useMemo(() => {
    if (!targetDiameter || isNaN(parseFloat(targetDiameter))) return [];
    const target = parseFloat(targetDiameter);

    return stentData
      .filter(s => s.Overexpansion_limit !== "no data" && s.Overexpansion_limit >= target)
      .map(s => ({
        ...s,
        canReach: s.Overexpansion_limit >= target,
        margin: (s.Overexpansion_limit - target).toFixed(2)
      }))
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
      const exists = comparisonList.some(c =>
        c.Stent === stentInfo.Stent && c.Nominal_diameter === stentInfo.Nominal_diameter
      );
      if (!exists && comparisonList.length < 8) {
        setComparisonList([...comparisonList, stentInfo]);
      }
    }
  };

  const removeFromComparison = (index) => {
    setComparisonList(comparisonList.filter((_, i) => i !== index));
  };

  const chartData = comparisonList.map((s, idx) => ({
    name: `${s.Stent.substring(0, 12)}${s.Stent.length > 12 ? '...' : ''} (${s.Nominal_diameter})`,
    fullName: s.Stent,
    nominal: s.Nominal_diameter,
    maxExpansion: s.Overexpansion_limit === "no data" ? null : s.Overexpansion_limit,
    expansion: s.Overexpansion_limit === "no data" ? 0 : s.Overexpansion_limit - s.Nominal_diameter,
    index: idx
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: `2px solid ${COLORS.primary}`
        }}>
          <p style={{ fontWeight: 600, marginBottom: 8, color: COLORS.primary }}>{data.fullName}</p>
          <p style={{ color: COLORS.primary, marginBottom: 4 }}>Nominal: {data.nominal} mm</p>
          {data.maxExpansion && (
            <p style={{ color: COLORS.accent }}>Max: {data.maxExpansion} mm (+{((data.maxExpansion - data.nominal) / data.nominal * 100).toFixed(0)}%)</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      {/* Header */}
      <header style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
        borderRadius: '16px',
        padding: '24px 32px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(30, 58, 95, 0.3)'
      }}>
        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
          Stent Expansion Comparator
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
          Compare maximal expansion capacities of coronary stents
        </p>
      </header>

      {/* How to Use */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        borderLeft: `4px solid ${COLORS.primary}`
      }}>
        <p style={{ fontWeight: 700, color: COLORS.primary, fontSize: '15px', marginBottom: '12px' }}>
          How to Use
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ background: COLORS.primaryBg, color: COLORS.primary, fontWeight: 700, borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px' }}>1</span>
            <div>
              <p style={{ fontWeight: 600, color: COLORS.primary, fontSize: '13px', marginBottom: '2px' }}>Target Diameter Finder</p>
              <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.5' }}>Enter the desired vessel diameter (mm). The tool instantly shows all stents whose maximum expansion limit meets or exceeds that target.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ background: COLORS.primaryBg, color: COLORS.primary, fontWeight: 700, borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px' }}>2</span>
            <div>
              <p style={{ fontWeight: 600, color: COLORS.primary, fontSize: '13px', marginBottom: '2px' }}>Browse & Add</p>
              <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.5' }}>Search by name or manufacturer, filter by nominal diameter. Click a stent to expand it, then select a size to add it to the comparison panel (up to 8 stents).</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ background: COLORS.primaryBg, color: COLORS.primary, fontWeight: 700, borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px' }}>3</span>
            <div>
              <p style={{ fontWeight: 600, color: COLORS.primary, fontSize: '13px', marginBottom: '2px' }}>Compare</p>
              <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.5' }}>The bar chart and table show nominal vs. maximum expansion side by side. Tap the IFU link to open the manufacturer instructions for use.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Target Diameter Finder */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: COLORS.accentBg,
            padding: '10px',
            borderRadius: '10px'
          }}>
            <Target style={{ width: '24px', height: '24px', color: COLORS.accent }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: COLORS.primary, fontSize: '15px' }}>Target Diameter Finder</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Find stents that can reach your target</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '200px' }}>
            <input
              type="number"
              step="0.1"
              min="2"
              max="6"
              placeholder="e.g. 4.5"
              value={targetDiameter}
              onChange={(e) => setTargetDiameter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '40px',
                border: `2px solid ${targetDiameter ? COLORS.accent : '#e5e7eb'}`,
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 600,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: '14px'
            }}>mm</span>
          </div>

          {targetDiameter && stentsReachingTarget.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: COLORS.successBg,
              padding: '10px 16px',
              borderRadius: '10px',
              border: `1px solid ${COLORS.success}`
            }}>
              <CheckCircle style={{ width: '18px', color: COLORS.success }} />
              <span style={{ fontWeight: 600, color: COLORS.success }}>
                {stentsReachingTarget.length} stent{stentsReachingTarget.length > 1 ? 's' : ''} can reach {targetDiameter}mm
              </span>
            </div>
          )}

          {targetDiameter && stentsReachingTarget.length === 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#fef2f2',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #fca5a5'
            }}>
              <X style={{ width: '18px', color: '#ef4444' }} />
              <span style={{ fontWeight: 600, color: '#ef4444' }}>
                No stents can reach {targetDiameter}mm
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Target Results */}
      {targetDiameter && stentsReachingTarget.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 24px',
            background: COLORS.successBg,
            borderBottom: `1px solid ${COLORS.success}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontWeight: 600, color: COLORS.primary, fontSize: '15px' }}>
              Stents reaching {targetDiameter}mm target
            </h3>
            <button
              onClick={() => setTargetDiameter('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex'
              }}
            >
              <X style={{ width: '18px', color: '#6b7280' }} />
            </button>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', position: 'sticky', top: 0 }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>Stent</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>Nominal</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>Max Expansion</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: COLORS.success }}>Margin</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: COLORS.primary }}>Add</th>
                </tr>
              </thead>
              <tbody>
                {stentsReachingTarget.map((stent, idx) => {
                  const isAdded = comparisonList.some(c =>
                    c.Stent === stent.Stent && c.Nominal_diameter === stent.Nominal_diameter
                  );
                  return (
                    <tr key={idx} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <p style={{ fontWeight: 500, color: COLORS.primary, fontSize: '13px' }}>{stent.Stent}</p>
                        <p style={{ fontSize: '11px', color: '#6b7280' }}>{stent.Manufacturer}</p>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          background: COLORS.primaryBg,
                          color: COLORS.primary,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}>
                          {stent.Nominal_diameter} mm
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          background: COLORS.accentBg,
                          color: COLORS.accentDark,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}>
                          {stent.Overexpansion_limit} mm
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          color: COLORS.success,
                          fontWeight: 600,
                          fontSize: '13px'
                        }}>
                          +{stent.margin} mm
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            if (!isAdded && comparisonList.length < 8) {
                              setComparisonList([...comparisonList, stent]);
                            }
                          }}
                          disabled={isAdded}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: isAdded ? '#d1d5db' : COLORS.accent,
                            color: 'white',
                            fontWeight: 500,
                            cursor: isAdded ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isAdded ? 'Added' : <><Plus style={{ width: '14px' }} /> Add</>}
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

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Panel */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                width: '20px'
              }} />
              <input
                type="text"
                placeholder="Search stents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <select
              value={selectedDiameter}
              onChange={(e) => setSelectedDiameter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Diameters</option>
              {allDiameters.map(d => (
                <option key={d} value={d}>{d} mm</option>
              ))}
            </select>
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredStents.map(stent => (
              <div key={stent.name} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <div
                  onClick={() => setExpandedStent(expandedStent === stent.name ? null : stent.name)}
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: expandedStent === stent.name ? COLORS.primaryBg : 'white',
                    transition: 'background 0.2s'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, color: '#1f2937', marginBottom: '2px' }}>{stent.name}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{stent.manufacturer}</p>
                  </div>
                  <ChevronDown style={{
                    width: '20px',
                    color: COLORS.primary,
                    transform: expandedStent === stent.name ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s'
                  }} />
                </div>

                {expandedStent === stent.name && (
                  <div style={{ padding: '0 20px 16px', background: COLORS.primaryBg }}>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Select diameter:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {stent.diameters
                        .filter(d => selectedDiameter === 'all' || d.nominal === parseFloat(selectedDiameter))
                        .sort((a, b) => a.nominal - b.nominal)
                        .map(d => {
                          const isAdded = comparisonList.some(c =>
                            c.Stent === stent.name && c.Nominal_diameter === d.nominal
                          );
                          return (
                            <button
                              key={d.nominal}
                              onClick={() => !isAdded && addToComparison(stent.name, d)}
                              disabled={isAdded}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: isAdded ? '#d1d5db' : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
                                color: 'white',
                                fontWeight: 500,
                                cursor: isAdded ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                transition: 'transform 0.1s, box-shadow 0.1s',
                                boxShadow: isAdded ? 'none' : '0 2px 8px rgba(249, 115, 22, 0.3)'
                              }}
                            >
                              {d.nominal} mm
                              {d.max !== "no data" && (
                                <span style={{ opacity: 0.9, fontSize: '11px' }}>→{d.max}</span>
                              )}
                              {!isAdded && <Plus style={{ width: '14px' }} />}
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

        {/* Right Panel */}
        <div>
          {comparisonList.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '60px',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: COLORS.accentBg,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Plus style={{ width: '32px', color: COLORS.accent }} />
              </div>
              <h3 style={{ color: COLORS.primary, marginBottom: '8px', fontSize: '18px' }}>No Stents Selected</h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Click on a stent from the left panel and select a diameter to start comparing
              </p>
            </div>
          ) : (
            <>
              {/* Selected Tags */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  Selected Stents ({comparisonList.length}/8)
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {comparisonList.map((stent, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: COLORS.accentBg,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${COLORS.accentLight}`
                      }}
                    >
                      <span style={{ fontWeight: 500, color: COLORS.accentDark, fontSize: '13px' }}>
                        {stent.Stent} ({stent.Nominal_diameter}mm)
                      </span>
                      <button
                        onClick={() => removeFromComparison(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex'
                        }}
                      >
                        <X style={{ width: '16px', color: '#ef4444' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: COLORS.primary, marginBottom: '20px' }}>
                  Expansion Capacity Comparison
                </h3>
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
                      <XAxis type="number" domain={[0, 'dataMax + 1']} unit=" mm" tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="nominal" name="Nominal Diameter" stackId="a" fill={COLORS.primary} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="expansion" name="Expansion Range" stackId="a" fill={COLORS.accent} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: COLORS.primaryBg }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.primary }}>Stent</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: COLORS.primary }}>Manufacturer</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: COLORS.primary }}>Nominal</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: COLORS.primary }}>Max Expansion</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: COLORS.primary }}>Gain</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: COLORS.primary }}>IFU</th>
                      <th style={{ padding: '14px 16px', width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonList.map((stent, idx) => {
                      const hasMax = stent.Overexpansion_limit !== "no data";
                      const gain = hasMax ? ((stent.Overexpansion_limit - stent.Nominal_diameter) / stent.Nominal_diameter * 100).toFixed(0) : null;
                      return (
                        <tr key={idx} style={{ borderTop: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 500, color: COLORS.primary }}>{stent.Stent}</td>
                          <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: '13px' }}>{stent.Manufacturer}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <span style={{
                              background: COLORS.primaryBg,
                              color: COLORS.primary,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontWeight: 600,
                              fontSize: '13px'
                            }}>
                              {stent.Nominal_diameter} mm
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            {hasMax ? (
                              <span style={{
                                background: COLORS.accentBg,
                                color: COLORS.accentDark,
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '13px'
                              }}>
                                {stent.Overexpansion_limit} mm
                              </span>
                            ) : (
                              <span style={{ color: '#9ca3af' }}>N/A</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            {gain ? (
                              <span style={{ color: COLORS.accent, fontWeight: 600 }}>+{gain}%</span>
                            ) : (
                              <span style={{ color: '#9ca3af' }}>-</span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            {stent.Reference && (
                              <a
                                href={stent.Reference}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: COLORS.primary,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '13px'
                                }}
                              >
                                <ExternalLink style={{ width: '14px' }} />
                              </a>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <button
                              onClick={() => removeFromComparison(idx)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '6px',
                                borderRadius: '6px',
                                display: 'flex'
                              }}
                            >
                              <Trash2 style={{ width: '16px', color: '#ef4444' }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
