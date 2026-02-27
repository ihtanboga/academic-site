import React, { useState, useMemo } from 'react';
import { Trash2, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export function ComparisonTable({ stents, onRemove }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const sortedStents = useMemo(() => {
        if (!sortConfig.key) return stents;

        return [...stents].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            // Handle "no data" for Overexpansion_limit
            if (sortConfig.key === 'Overexpansion_limit') {
                aVal = aVal === "no data" ? -1 : aVal;
                bVal = bVal === "no data" ? -1 : bVal;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [stents, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-3.5 h-3.5 text-primary" />
            : <ArrowDown className="w-3.5 h-3.5 text-primary" />;
    };

    if (stents.length === 0) return null;

    // Find max expansion value for progress bars
    const maxExpansion = Math.max(...stents.map(s =>
        s.Overexpansion_limit === "no data" ? 0 : s.Overexpansion_limit
    ));

    const columns = [
        { key: 'Manufacturer', label: 'Manufacturer', sortable: true },
        { key: 'Stent', label: 'Stent', sortable: true },
        { key: 'Nominal_diameter', label: 'Nominal (mm)', sortable: true },
        { key: 'Overexpansion_limit', label: 'Max Expansion (mm)', sortable: true },
        { key: 'Reference', label: 'Reference', sortable: false },
        { key: 'action', label: '', sortable: false },
    ];

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 sticky top-0 z-10">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={`p-4 font-semibold text-foreground ${col.sortable ? 'cursor-pointer hover:bg-muted transition-colors select-none' : ''
                                        } ${col.key === 'action' ? 'w-16 text-right' : ''}`}
                                    onClick={() => col.sortable && requestSort(col.key)}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.label}
                                        {col.sortable && getSortIcon(col.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStents.map((stent, index) => {
                            const hasMaxData = stent.Overexpansion_limit !== "no data";
                            const expansionPercent = hasMaxData
                                ? (stent.Overexpansion_limit / maxExpansion) * 100
                                : 0;
                            const isHighest = hasMaxData && stent.Overexpansion_limit === maxExpansion;
                            const originalIndex = stents.findIndex(s =>
                                s.Stent === stent.Stent &&
                                s.Nominal_diameter === stent.Nominal_diameter &&
                                s.Manufacturer === stent.Manufacturer
                            );

                            return (
                                <tr
                                    key={`${stent.Stent}-${stent.Nominal_diameter}-${index}`}
                                    className={`
                                        border-b border-border last:border-b-0
                                        hover:bg-primary/5 transition-colors
                                        ${index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}
                                    `}
                                >
                                    <td className="p-4 text-muted-foreground">{stent.Manufacturer}</td>
                                    <td className="p-4 font-semibold text-foreground">{stent.Stent}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center justify-center w-12 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                                            {stent.Nominal_diameter}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 max-w-[120px]">
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${expansionPercent}%`,
                                                            background: hasMaxData
                                                                ? 'linear-gradient(90deg, hsl(199 89% 48%), hsl(160 84% 39%))'
                                                                : 'hsl(var(--muted))'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <span className={`font-bold min-w-[48px] ${isHighest
                                                    ? 'text-accent'
                                                    : hasMaxData
                                                        ? 'text-foreground'
                                                        : 'text-muted-foreground'
                                                }`}>
                                                {hasMaxData ? stent.Overexpansion_limit : 'N/A'}
                                            </span>
                                            {isHighest && (
                                                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                                                    Best
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {stent.Reference && (
                                            <a
                                                href={stent.Reference}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                IFU
                                            </a>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => onRemove(originalIndex)}
                                            className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                            title="Remove from comparison"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Summary footer */}
            <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    {stents.length} stent{stents.length !== 1 ? 's' : ''} in comparison
                </span>
                <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                        Highest expansion: <span className="font-bold text-accent">{maxExpansion} mm</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
