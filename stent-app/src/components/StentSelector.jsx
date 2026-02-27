import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export function StentSelector({ data, onAdd, currentSelection, onSelectionChange }) {
    const [stents, setStents] = useState([]);
    const [diameters, setDiameters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const s = [...new Set(data.map(item => item.Stent))].sort();
        setStents(s);
    }, [data]);

    useEffect(() => {
        if (currentSelection.stent) {
            const d = [...new Set(data
                .filter(item => item.Stent === currentSelection.stent)
                .map(item => item.Nominal_diameter))].sort((a, b) => a - b);
            setDiameters(d);
        } else {
            setDiameters([]);
        }
    }, [currentSelection.stent, data]);

    const handleStentChange = (e) => {
        const selectedStentName = e.target.value;
        const foundItem = data.find(item => item.Stent === selectedStentName);
        const manufacturer = foundItem ? foundItem.Manufacturer : '';
        onSelectionChange({ manufacturer, stent: selectedStentName, diameter: '' });
        setSearchTerm('');
    };

    const handleDiameterChange = (e) => {
        onSelectionChange({ ...currentSelection, diameter: e.target.value });
    };

    const canAdd = currentSelection.stent && currentSelection.diameter;

    // Filter stents based on search
    const filteredStents = searchTerm
        ? stents.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
        : stents;

    return (
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Search className="w-4 h-4 text-primary" />
                </div>
                Select Stent
            </h2>

            <div className="space-y-5">
                {/* Stent Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        Stent Name
                    </label>
                    <div className="relative">
                        <select
                            className="w-full h-12 px-4 pr-10 rounded-xl bg-background border border-input
                                     text-foreground text-base font-medium
                                     focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none
                                     appearance-none cursor-pointer transition-all
                                     hover:border-primary/50"
                            value={currentSelection.stent}
                            onChange={handleStentChange}
                        >
                            <option value="" className="text-muted-foreground">Choose a stent...</option>
                            {filteredStents.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                    {currentSelection.manufacturer && (
                        <p className="mt-2 text-xs text-muted-foreground">
                            Manufacturer: <span className="font-medium text-foreground">{currentSelection.manufacturer}</span>
                        </p>
                    )}
                </div>

                {/* Diameter Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        Nominal Diameter
                    </label>
                    <div className="relative">
                        <select
                            className={cn(
                                "w-full h-12 px-4 pr-10 rounded-xl bg-background border border-input",
                                "text-foreground text-base font-medium",
                                "focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none",
                                "appearance-none transition-all",
                                !currentSelection.stent
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer hover:border-primary/50"
                            )}
                            value={currentSelection.diameter}
                            onChange={handleDiameterChange}
                            disabled={!currentSelection.stent}
                        >
                            <option value="" className="text-muted-foreground">
                                {currentSelection.stent ? 'Select diameter...' : 'Select stent first'}
                            </option>
                            {diameters.map(d => (
                                <option key={d} value={d}>{d} mm</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Quick diameter buttons */}
                    {currentSelection.stent && diameters.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {diameters.map(d => (
                                <button
                                    key={d}
                                    onClick={() => onSelectionChange({ ...currentSelection, diameter: d.toString() })}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                        currentSelection.diameter === d.toString()
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                    )}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Button */}
                <div className="pt-4">
                    <button
                        onClick={onAdd}
                        disabled={!canAdd}
                        className={cn(
                            "flex items-center justify-center gap-2 w-full h-12 rounded-xl font-semibold text-base transition-all",
                            canAdd
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-[0.98]"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        <Plus className="w-5 h-5" />
                        Add to Comparison
                    </button>
                </div>
            </div>
        </div>
    );
}
