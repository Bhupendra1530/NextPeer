"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { PROGRAM_CATEGORIES, PROGRAMS } from "@/data/programs";
import ProgramCard from "./ProgramCard";

export default function ProgramsExplorer() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPrograms = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return PROGRAMS.filter((program) => {
      const matchesCategory =
        activeCategory === "all" || program.category === activeCategory;

      const matchesSearch =
        searchTerm === "" ||
        program.title.toLowerCase().includes(searchTerm) ||
        program.subtitle.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const activeCategoryLabel =
    PROGRAM_CATEGORIES.find(
      (category) => category.slug === activeCategory
    )?.label || "All Programs";

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("all");
  };

  return (
    <section className="bg-slate-50 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}

        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
            Explore your options
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Find the program that fits
            <span className="text-blue-600"> your goals.</span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
            Explore practical programs designed to help you build
            industry-relevant skills through structured learning and projects.
          </p>
        </div>

        {/* Search */}

        <div className="mx-auto mt-9 max-w-2xl">
          <div className="relative">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search AI, Python, Cloud, Data Analytics..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 transition-colors hover:text-slate-700"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}

        <div className="mt-8 flex gap-2 overflow-x-auto pb-3 sm:justify-center">
          {PROGRAM_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.slug;

            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/15"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                }`}
              >
                <Icon size={15} />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Results heading */}

        <div className="mt-10 flex items-end justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              {activeCategoryLabel}
            </p>

            <h3 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {filteredPrograms.length}
              {filteredPrograms.length === 1 ? " Program" : " Programs"}
            </h3>
          </div>

          {(search || activeCategory !== "all") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-blue-600 transition-colors hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Program Grid */}

        {filteredPrograms.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.slug}
                program={program}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Search size={20} />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              No programs found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              We couldn&apos;t find a program matching your search.
              Try another keyword or browse all programs.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
            >
              View All Programs
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
