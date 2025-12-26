'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllExercises } from '@/lib/supabase';
import type { ExerciseLibrary } from '@/lib/types';

export default function LibraryPage() {
  const [exercises, setExercises] = useState<ExerciseLibrary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [showBodyPartsFilter, setShowBodyPartsFilter] = useState(false);
  const [showEquipmentFilter, setShowEquipmentFilter] = useState(false);

  useEffect(() => {
    async function loadExercises() {
      setIsLoading(true);
      const data = await getAllExercises();
      setExercises(data as ExerciseLibrary[]);
      setIsLoading(false);
    }
    loadExercises();
  }, []);

  // Get unique body parts and equipment from all exercises
  const allBodyParts = useMemo(() => {
    const parts = new Set<string>();
    exercises.forEach((ex) => ex.body_parts.forEach((p) => parts.add(p)));
    return Array.from(parts).sort();
  }, [exercises]);

  const allEquipment = useMemo(() => {
    const equipment = new Set<string>();
    exercises.forEach((ex) => ex.equipment.forEach((e) => equipment.add(e)));
    return Array.from(equipment).sort();
  }, [exercises]);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      // Search filter
      if (
        searchQuery &&
        !exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Body parts filter
      if (
        selectedBodyParts.length > 0 &&
        !selectedBodyParts.some((part) => exercise.body_parts.includes(part))
      ) {
        return false;
      }

      // Equipment filter
      if (
        selectedEquipment.length > 0 &&
        !selectedEquipment.some((eq) => exercise.equipment.includes(eq))
      ) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty && exercise.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [exercises, searchQuery, selectedBodyParts, selectedEquipment, selectedDifficulty]);

  const toggleBodyPart = (part: string) => {
    setSelectedBodyParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const toggleEquipment = (eq: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBodyParts([]);
    setSelectedEquipment([]);
    setSelectedDifficulty('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse and search {exercises.length} exercises
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {/* Body Parts Filter */}
          <div className="relative">
            <button
              onClick={() => setShowBodyPartsFilter(!showBodyPartsFilter)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                selectedBodyParts.length > 0
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              Body Parts {selectedBodyParts.length > 0 && `(${selectedBodyParts.length})`} ▼
            </button>
            <AnimatePresence>
              {showBodyPartsFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 bg-white border rounded-lg shadow-lg p-3 min-w-[200px] max-h-64 overflow-y-auto z-20"
                >
                  {allBodyParts.map((part) => (
                    <label key={part} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBodyParts.includes(part)}
                        onChange={() => toggleBodyPart(part)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{part}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Equipment Filter */}
          <div className="relative">
            <button
              onClick={() => setShowEquipmentFilter(!showEquipmentFilter)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                selectedEquipment.length > 0
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              Equipment {selectedEquipment.length > 0 && `(${selectedEquipment.length})`} ▼
            </button>
            <AnimatePresence>
              {showEquipmentFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 left-0 bg-white border rounded-lg shadow-lg p-3 min-w-[200px] max-h-64 overflow-y-auto z-20"
                >
                  {allEquipment.map((eq) => (
                    <label key={eq} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEquipment.includes(eq)}
                        onChange={() => toggleEquipment(eq)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{eq}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium ${
              selectedDifficulty
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Clear Filters */}
          {(searchQuery || selectedBodyParts.length > 0 || selectedEquipment.length > 0 || selectedDifficulty) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredExercises.length} of {exercises.length} exercises
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading exercises...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No exercises found</p>
            {(searchQuery || selectedBodyParts.length > 0 || selectedEquipment.length > 0 || selectedDifficulty) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Exercise Cards */}
        <div className="space-y-3">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: ExerciseLibrary }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
    advanced: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 capitalize">
              💪 {exercise.name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {/* Body Parts */}
              {exercise.body_parts.length > 0 && (
                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200 capitalize">
                  {exercise.body_parts.join(', ')}
                </span>
              )}
              {/* Equipment */}
              {exercise.equipment.length > 0 && (
                <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded border border-amber-200 capitalize">
                  {exercise.equipment.join(', ')}
                </span>
              )}
              {/* Difficulty */}
              {exercise.difficulty && (
                <span
                  className={`px-2 py-1 rounded border capitalize ${
                    difficultyColors[exercise.difficulty] ||
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}
                >
                  {exercise.difficulty}
                </span>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            ▼
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200"
          >
            <div className="p-4 space-y-4">
              {/* Description */}
              {exercise.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </h4>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                </div>
              )}

              {/* Instructions */}
              {exercise.instructions && exercise.instructions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Instructions
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    {exercise.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Target Muscles */}
              {exercise.target_muscles && exercise.target_muscles.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Target Muscles
                  </h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {exercise.target_muscles.join(', ')}
                  </p>
                </div>
              )}

              {/* Secondary Muscles */}
              {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Secondary Muscles
                  </h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {exercise.secondary_muscles.join(', ')}
                  </p>
                </div>
              )}

              {/* Image/GIF Demo */}
              {(exercise.external_video_url || exercise.demo_file_path) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Demonstration
                  </h4>
                  <img
                    src={
                      exercise.external_video_url ||
                      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/exercises/${exercise.demo_file_path}`
                    }
                    alt={exercise.name}
                    className="rounded-lg border border-gray-200 max-w-xs"
                  />
                </div>
              )}

              {/* Add to Protocol Button (Placeholder) */}
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Add to Protocol feature coming soon!');
                }}
              >
                Add to Protocol
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
