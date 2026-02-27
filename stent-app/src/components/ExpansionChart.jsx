import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export function ExpansionChart({ stents }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (stents.length === 0) return (
        <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card">
            <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Add stents to see comparison chart</p>
            </div>
        </div>
    );

    // Find min and max values for scale
    const allValues = stents.flatMap(s => [
        s.Nominal_diameter,
        s.Overexpansion_limit === "no data" ? s.Nominal_diameter : s.Overexpansion_limit
    ]);
    const minVal = Math.floor(Math.min(...allValues) - 0.5);
    const maxVal = Math.ceil(Math.max(...allValues) + 0.5);
    const range = maxVal - minVal;

    const getPercentage = (value) => ((value - minVal) / range) * 100;

    // Generate scale markers
    const scaleMarkers = [];
    for (let i = minVal; i <= maxVal; i += 0.5) {
        scaleMarkers.push(i);
    }

    return (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Expansion Capacity Comparison
            </h3>

            {/* Scale header */}
            <div className="relative h-8 mb-2 ml-48">
                <div className="absolute inset-x-0 flex justify-between text-xs text-muted-foreground">
                    {scaleMarkers.filter((_, i) => i % 2 === 0).map(val => (
                        <span key={val} style={{ position: 'absolute', left: `${getPercentage(val)}%`, transform: 'translateX(-50%)' }}>
                            {val}
                        </span>
                    ))}
                </div>
            </div>

            {/* Stent bars */}
            <div className="space-y-4">
                {stents.map((stent, index) => {
                    const nominal = stent.Nominal_diameter;
                    const max = stent.Overexpansion_limit === "no data" ? null : stent.Overexpansion_limit;
                    const hasData = max !== null;
                    const expansionRatio = hasData ? ((max - nominal) / nominal * 100).toFixed(0) : null;
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={`${stent.Stent}-${stent.Nominal_diameter}-${index}`}
                            className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${isHovered ? 'bg-muted/50' : ''}`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Stent info */}
                            <div className="w-44 flex-shrink-0">
                                <p className="font-medium text-sm truncate" title={stent.Stent}>{stent.Stent}</p>
                                <p className="text-xs text-muted-foreground truncate">{stent.Manufacturer}</p>
                            </div>

                            {/* Range bar */}
                            <div className="flex-1 relative h-10">
                                {/* Background track */}
                                <div className="absolute inset-0 bg-muted rounded-full" />

                                {/* Grid lines */}
                                <div className="absolute inset-0">
                                    {scaleMarkers.map(val => (
                                        <div
                                            key={val}
                                            className="absolute top-0 bottom-0 w-px bg-border"
                                            style={{ left: `${getPercentage(val)}%` }}
                                        />
                                    ))}
                                </div>

                                {hasData ? (
                                    <>
                                        {/* Expansion range bar */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 h-6 rounded-full transition-all duration-300"
                                            style={{
                                                left: `${getPercentage(nominal)}%`,
                                                width: `${getPercentage(max) - getPercentage(nominal)}%`,
                                                background: 'linear-gradient(90deg, hsl(199 89% 48%), hsl(160 84% 39%))'
                                            }}
                                        />

                                        {/* Nominal marker */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-md z-10 transition-transform duration-200"
                                            style={{
                                                left: `${getPercentage(nominal)}%`,
                                                transform: `translateX(-50%) translateY(-50%) ${isHovered ? 'scale(1.2)' : 'scale(1)'}`
                                            }}
                                        />

                                        {/* Max marker */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent border-2 border-white shadow-md z-10 transition-transform duration-200"
                                            style={{
                                                left: `${getPercentage(max)}%`,
                                                transform: `translateX(-50%) translateY(-50%) ${isHovered ? 'scale(1.2)' : 'scale(1)'}`
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {/* Only nominal marker when no max data */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-muted-foreground border-2 border-white shadow-md z-10"
                                            style={{
                                                left: `${getPercentage(nominal)}%`,
                                                transform: 'translateX(-50%) translateY(-50%)'
                                            }}
                                        />
                                    </>
                                )}

                                {/* Hover tooltip */}
                                {isHovered && (
                                    <div
                                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs whitespace-nowrap z-20 shadow-lg"
                                    >
                                        <span className="font-medium">{nominal}mm</span>
                                        {hasData && (
                                            <>
                                                <span className="mx-1.5 text-muted-foreground">→</span>
                                                <span className="font-medium text-accent">{max}mm</span>
                                                <span className="ml-2 text-muted-foreground">(+{expansionRatio}%)</span>
                                            </>
                                        )}
                                        {!hasData && <span className="ml-2 text-muted-foreground">(no max data)</span>}
                                    </div>
                                )}
                            </div>

                            {/* Values */}
                            <div className="w-28 flex-shrink-0 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <span className="text-sm font-bold text-primary">{nominal}</span>
                                    {hasData && (
                                        <>
                                            <span className="text-muted-foreground">→</span>
                                            <span className="text-sm font-bold text-accent">{max}</span>
                                        </>
                                    )}
                                    {!hasData && <span className="text-xs text-muted-foreground">N/A</span>}
                                </div>
                                {hasData && (
                                    <span className="text-xs text-muted-foreground">+{expansionRatio}%</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">Nominal Diameter</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-xs text-muted-foreground">Max Expansion</span>
                </div>
            </div>
        </div>
    );
}
