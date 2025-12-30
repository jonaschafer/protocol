'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Trash2, Plus } from 'lucide-react';

interface SetData {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
}

interface WafflePantzProps {
  exerciseName?: string;
  restTime?: string;
  cues?: string;
  initialSets?: Omit<SetData, 'id'>[];
}

function SetRow({
  set,
  onDelete,
}: {
  set: SetData;
  onDelete: () => void;
}) {
  const x = useMotionValue(0);
  const deleteThreshold = -80;
  const revealThreshold = -40;

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < deleteThreshold) {
      onDelete();
    } else if (info.offset.x < revealThreshold) {
      x.set(revealThreshold);
    } else {
      x.set(0);
    }
  };

  const deleteButtonOpacity = useTransform(
    x,
    [0, revealThreshold],
    [0, 1]
  );

  return (
    <div className="relative overflow-hidden">
      {/* Delete Button Background */}
      <motion.div
        className="absolute right-0 top-0 h-[68px] flex items-center justify-end pr-4"
        style={{ opacity: deleteButtonOpacity }}
      >
        <button
          onClick={onDelete}
          className="bg-red-500 h-[68px] w-[68px] flex items-center justify-center rounded-[20px]"
        >
          <Trash2 className="w-6 h-6 text-white" />
        </button>
      </motion.div>

      {/* Swipeable Set Row */}
      <motion.div
        className="flex gap-2.5 items-center relative"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {/* Set Number */}
        <div className="flex items-center justify-center w-[42px] h-[68px] bg-[#1e1e1e]/60 rounded-[10px]">
          <span className="text-[15px] leading-[18px] opacity-50">
            {set.setNumber}
          </span>
        </div>

        {/* Reps */}
        <div className="flex-1 min-w-[140px] h-[68px] bg-[#1e1e1e] rounded-[20px] px-4 py-4.5 flex items-center justify-between">
          <span className="text-[15px] leading-[18px] opacity-50">
            Reps
          </span>
          <span
            className="text-[44px] leading-[61px] font-medium"
            style={{ fontFamily: 'var(--font-inter-tight, sans-serif)' }}
          >
            {set.reps}
          </span>
        </div>

        {/* Weight */}
        <div className="flex-1 min-w-[140px] h-[68px] bg-[#1e1e1e] rounded-[20px] px-4 py-4.5 flex items-center justify-between">
          <span className="text-[15px] leading-[18px] opacity-50">
            #
          </span>
          <span
            className="text-[44px] leading-[61px] font-medium"
            style={{ fontFamily: 'var(--font-inter-tight, sans-serif)' }}
          >
            {set.weight}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function WafflePantz({
  exerciseName = "Trap Bar Deadlift",
  restTime = "30 seconds rest between sets",
  cues = "6-8\" step height, but 24\" is ideal. Slow, controlled eccentric (3-sec lower). Focus on knee tracking over toes.",
  initialSets = [
    { setNumber: 1, reps: 8, weight: 145 },
    { setNumber: 2, reps: 6, weight: 145 },
    { setNumber: 3, reps: 4, weight: 145 },
  ]
}: WafflePantzProps) {
  const [sets, setSets] = useState<SetData[]>(
    initialSets.map((set, index) => ({
      ...set,
      id: `set-${Date.now()}-${index}`,
    }))
  );

  const handleDeleteSet = (id: string) => {
    setSets(prevSets => {
      const filtered = prevSets.filter(set => set.id !== id);
      return filtered.map((set, index) => ({
        ...set,
        setNumber: index + 1,
      }));
    });
  };

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: SetData = {
      id: `set-${Date.now()}`,
      setNumber: sets.length + 1,
      reps: lastSet?.reps || 8,
      weight: lastSet?.weight || 0,
    };
    setSets([...sets, newSet]);
  };

  return (
    <div className="w-full max-w-[362px] mx-auto bg-transparent text-white">
      {/* Header */}
      <div className="flex flex-col items-center pt-3.5 pb-6.5 gap-3">
        <h1
          className="text-[26px] leading-[26px] font-medium text-right"
          style={{ fontFamily: 'var(--font-instrument-sans, sans-serif)' }}
        >
          {exerciseName}
        </h1>
        <p className="text-[15px] leading-[18px] text-center opacity-50">
          {restTime}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-white opacity-20 rounded" />

      {/* Cues Section */}
      <div className="py-5 pr-4">
        <p className="text-[15px] leading-[18px] opacity-50 mb-2.5">
          Cues
        </p>
        <p
          className="text-[13px] leading-[19.37px] whitespace-pre-wrap"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        >
          {cues}
        </p>
      </div>

      {/* Sets */}
      <div className="flex flex-col gap-2.5">
        {sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            onDelete={() => handleDeleteSet(set.id)}
          />
        ))}
      </div>

      {/* Add Set Button */}
      <button
        onClick={handleAddSet}
        className="w-full mt-4 h-[68px] bg-[#1e1e1e] rounded-[20px] flex items-center justify-center gap-2 hover:bg-[#2a2a2a] transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="text-[15px] leading-[18px]">Add set</span>
      </button>
    </div>
  );
}
