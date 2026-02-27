import React from 'react';
import { Info, ExternalLink, TrendingUp, Building2 } from 'lucide-react';

export function StentDetails({ stentData }) {
    if (!stentData) return null;

    const { Stent, Manufacturer, Nominal_diameter, Overexpansion_limit, Reference } = stentData;

    const hasMaxData = Overexpansion_limit !== "no data";
    const expansionRatio = hasMaxData
        ? ((Overexpansion_limit - Nominal_diameter) / Nominal_diameter * 100).toFixed(0)
        : null;

    return (
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-foreground">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Info className="w-4 h-4 text-primary" />
                </div>
                Stent Details
            </h2>

            <div className="space-y-5 flex-1">
                {/* Stent Name - Hero */}
                <div className="pb-4 border-b border-border">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Stent Name</span>
                    <p className="text-xl font-bold text-foreground mt-1">{Stent}</p>
                </div>

                {/* Manufacturer */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground">Manufacturer</span>
                        <p className="font-medium text-foreground">{Manufacturer}</p>
                    </div>
                </div>

                {/* Diameter Values - Large Display */}
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/20">
                        <span className="text-xs font-medium text-primary uppercase tracking-wide">Nominal</span>
                        <p className="text-3xl font-bold text-primary mt-1">{Nominal_diameter}</p>
                        <span className="text-xs text-muted-foreground">mm</span>
                    </div>
                    <div className={`rounded-xl p-4 text-center border ${hasMaxData ? 'bg-accent/5 border-accent/20' : 'bg-muted border-border'}`}>
                        <span className={`text-xs font-medium uppercase tracking-wide ${hasMaxData ? 'text-accent' : 'text-muted-foreground'}`}>
                            Max Expansion
                        </span>
                        <p className={`text-3xl font-bold mt-1 ${hasMaxData ? 'text-accent' : 'text-muted-foreground'}`}>
                            {hasMaxData ? Overexpansion_limit : 'N/A'}
                        </p>
                        {hasMaxData && <span className="text-xs text-muted-foreground">mm</span>}
                    </div>
                </div>

                {/* Expansion Ratio Indicator */}
                {hasMaxData && (
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-accent" />
                                <span className="text-sm font-medium text-foreground">Expansion Capacity</span>
                            </div>
                            <span className="text-2xl font-bold text-accent">+{expansionRatio}%</span>
                        </div>
                        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(expansionRatio, 100)}%`,
                                    background: 'linear-gradient(90deg, hsl(199 89% 48%), hsl(160 84% 39%))'
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Reference Link */}
            {Reference && (
                <div className="pt-4 mt-4 border-t border-border">
                    <a
                        href={Reference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Reference (IFU)
                    </a>
                </div>
            )}
        </div>
    );
}
