import { useState } from "react";
import { ChevronRight, ChevronDown, ArrowUpDown, Sparkles } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import type {
  EstimateFeature,
  Complexity,
} from "@/../product/sections/ai-driven-first-pass-estimation/types";

interface FeatureBreakdownProps {
  features: EstimateFeature[];
  expandedFeatureIds: Set<string>;
  onExpandFeature?: (featureId: string) => void;
  onCollapseFeature?: (featureId: string) => void;
}

type SortKey = "name" | "complexity" | "likely" | "confidence";
type SortDirection = "asc" | "desc";

const COMPLEXITY_ORDER: Record<Complexity, number> = {
  low: 0,
  medium: 1,
  high: 2,
  very_high: 3,
};

const COMPLEXITY_STYLES: Record<Complexity, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  high: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400",
  very_high:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
};

const COMPLEXITY_LABELS: Record<Complexity, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
  very_high: "V.High",
};

function confidenceColor(c: number): string {
  if (c >= 0.8) return "text-emerald-600 dark:text-emerald-400";
  if (c >= 0.6) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function sortFeatures(
  features: EstimateFeature[],
  key: SortKey,
  dir: SortDirection,
): EstimateFeature[] {
  const sorted = [...features].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "complexity":
        cmp = COMPLEXITY_ORDER[a.complexity] - COMPLEXITY_ORDER[b.complexity];
        break;
      case "likely":
        cmp = a.hours.likely - b.hours.likely;
        break;
      case "confidence":
        cmp = a.confidence - b.confidence;
        break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export function FeatureBreakdown({
  features,
  expandedFeatureIds,
  onExpandFeature,
  onCollapseFeature,
}: FeatureBreakdownProps) {
  const [sortKey, setSortKey] = useState<SortKey>("likely");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = sortFeatures(features, sortKey, sortDir);
  const totalLikely = features.reduce((sum, f) => sum + f.hours.likely, 0);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-[12px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Feature Breakdown
          </h2>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300 dark:text-zinc-600">
            {features.length}
          </span>
        </div>
        <span className="font-['JetBrains_Mono',monospace] text-[11px] text-zinc-400 dark:text-zinc-500">
          {totalLikely.toLocaleString()}h total
        </span>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
        <div className="w-5 shrink-0" />
        <ColumnHeader
          label="Feature"
          sortKey="name"
          active={sortKey === "name"}
          direction={sortKey === "name" ? sortDir : undefined}
          onSort={handleSort}
          className="flex-1"
        />
        <ColumnHeader
          label="Complexity"
          sortKey="complexity"
          active={sortKey === "complexity"}
          direction={sortKey === "complexity" ? sortDir : undefined}
          onSort={handleSort}
          className="w-20 text-center"
        />
        <ColumnHeader
          label="Low"
          sortKey="likely"
          active={false}
          onSort={() => handleSort("likely")}
          className="hidden w-14 text-right sm:block"
          noIcon
        />
        <ColumnHeader
          label="Likely"
          sortKey="likely"
          active={sortKey === "likely"}
          direction={sortKey === "likely" ? sortDir : undefined}
          onSort={handleSort}
          className="w-14 text-right"
        />
        <ColumnHeader
          label="High"
          sortKey="likely"
          active={false}
          onSort={() => handleSort("likely")}
          className="hidden w-14 text-right sm:block"
          noIcon
        />
        <ColumnHeader
          label="Conf"
          sortKey="confidence"
          active={sortKey === "confidence"}
          direction={sortKey === "confidence" ? sortDir : undefined}
          onSort={handleSort}
          className="w-14 text-right"
        />
      </div>

      {/* Rows */}
      <div>
        {sorted.map((feature) => {
          const isExpanded = expandedFeatureIds.has(feature.id);
          return (
            <Collapsible
              key={feature.id}
              open={isExpanded}
              onOpenChange={(open) => {
                if (open) onExpandFeature?.(feature.id);
                else onCollapseFeature?.(feature.id);
              }}
            >
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/20">
                  <div className="w-5 shrink-0">
                    {isExpanded ? (
                      <ChevronDown
                        size={14}
                        className="text-zinc-400 dark:text-zinc-500"
                      />
                    ) : (
                      <ChevronRight
                        size={14}
                        className="text-zinc-300 dark:text-zinc-600"
                      />
                    )}
                  </div>
                  <span className="flex-1 truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                    {feature.name}
                  </span>
                  <span
                    className={`w-20 text-center rounded-md border px-2.5 py-0.5 text-[11px] font-medium ${COMPLEXITY_STYLES[feature.complexity]}`}
                  >
                    {COMPLEXITY_LABELS[feature.complexity]}
                  </span>
                  <span className="hidden w-14 text-right font-['JetBrains_Mono',monospace] text-[12px] text-zinc-400 sm:block dark:text-zinc-500">
                    {feature.hours.low}
                  </span>
                  <span className="w-14 text-right font-['JetBrains_Mono',monospace] text-[12px] font-medium text-zinc-900 dark:text-zinc-100">
                    {feature.hours.likely}
                  </span>
                  <span className="hidden w-14 text-right font-['JetBrains_Mono',monospace] text-[12px] text-zinc-400 sm:block dark:text-zinc-500">
                    {feature.hours.high}
                  </span>
                  <span
                    className={`w-14 text-right font-['JetBrains_Mono',monospace] text-[12px] font-medium ${confidenceColor(feature.confidence)}`}
                  >
                    {Math.round(feature.confidence * 100)}%
                  </span>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-11 mr-6 mb-3 mt-1 border-l-2 border-blue-200 py-3 pl-4 dark:border-blue-800">
                  {/* Description */}
                  <p className="mb-3 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {feature.description}
                  </p>

                  {/* Assumptions */}
                  {feature.assumptions.length > 0 && (
                    <div className="mb-3">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                          Assumptions
                        </span>
                        <Badge
                          variant="outline"
                          className="border-blue-200 bg-blue-50/50 font-['JetBrains_Mono',monospace] text-[10px] text-blue-600 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          <Sparkles size={9} className="mr-0.5" />
                          AI
                        </Badge>
                      </div>
                      <ul className="space-y-1">
                        {feature.assumptions.map((a, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[12px] text-zinc-600 dark:text-zinc-400"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300 dark:bg-blue-700" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dependencies */}
                  {feature.dependencies.length > 0 && (
                    <div>
                      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Dependencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {feature.dependencies.map((dep, i) => (
                          <span
                            key={i}
                            className="rounded bg-zinc-100 px-2.5 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </section>
  );
}

function ColumnHeader({
  label,
  sortKey,
  active,
  onSort,
  className,
  noIcon,
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  direction?: SortDirection;
  onSort: (key: SortKey) => void;
  className?: string;
  noIcon?: boolean;
}) {
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-0.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
        active
          ? "text-zinc-600 dark:text-zinc-300"
          : "text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400"
      } ${className || ""}`}
    >
      {label}
      {!noIcon && (
        <ArrowUpDown
          size={10}
          className={
            active ? "text-blue-500" : "text-zinc-300 dark:text-zinc-600"
          }
        />
      )}
    </button>
  );
}
