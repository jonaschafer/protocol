import { useState } from "react";
import { SetRow } from "./components/SetRow";

const imgVector2 = "http://localhost:3845/assets/c24f1a3b65b272297985dee3f6e1d47d23f8a1d2.svg";
const imgVector1 = "http://localhost:3845/assets/7f0015a0b82616599b038003c3c51dc8da02970f.svg";

interface ExerciseSet {
  id: string;
  setNumber: number;
  reps: string;
  weight: string;
}

export default function Component03ExerciseView() {
  const [sets, setSets] = useState<ExerciseSet[]>([
    { id: "1", setNumber: 1, reps: "8", weight: "145" },
    { id: "2", setNumber: 2, reps: "6", weight: "145" },
    { id: "3", setNumber: 3, reps: "7", weight: "145" },
  ]);

  const handleDeleteSet = (id: string) => {
    setSets((prevSets) => {
      const filtered = prevSets.filter((set) => set.id !== id);
      // Auto-renumber sets after deletion
      return filtered.map((set, index) => ({
        ...set,
        setNumber: index + 1,
      }));
    });
  };

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: ExerciseSet = {
      id: Date.now().toString(),
      setNumber: sets.length + 1,
      reps: lastSet ? lastSet.reps : "8",
      weight: lastSet ? lastSet.weight : "145",
    };
    setSets([...sets, newSet]);
  };

  return (
    <div className="bg-black border border-[rgba(255,255,255,0.2)] border-solid overflow-clip relative rounded-tl-[30px] rounded-tr-[30px] size-full" data-name="03_ExerciseView" data-node-id="210:5482">
      <div className="absolute content-stretch flex flex-col items-start left-[19.5px] top-[47.5px] w-[362px]" data-node-id="210:5483">
        <div className="content-stretch flex flex-col gap-[12px] items-start justify-center pb-[26px] pt-[14px] px-0 relative shrink-0 text-nowrap text-white w-full" data-name="Header" data-node-id="210:5484">
          <p className="font-['Instrument_Sans:Medium',sans-serif] font-medium leading-none relative shrink-0 text-[26px] text-right" data-node-id="210:5485" style={{ fontVariationSettings: "'wdth' 100" }}>
            Trap Bar Deadlift
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic opacity-50 relative shrink-0 text-[15px] text-center" data-node-id="210:5486">
            30 seconds rest between sets
          </p>
        </div>
        <div className="h-0 relative shrink-0 w-full" data-node-id="210:5487">
          <div className="absolute inset-[-0.5px_-0.14%]">
            <img alt="" className="block max-w-none size-full" src={imgVector2} />
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-node-id="210:5488">
          <div className="content-stretch flex flex-col gap-[10px] items-start not-italic overflow-clip pl-0 pr-[16px] py-[20px] relative shrink-0 text-white w-full" data-name="Notes Container" data-node-id="210:5489">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] opacity-50 relative shrink-0 text-[15px] w-full" data-node-id="210:5490">
              Cues
            </p>
            <p className="font-['IBM_Plex_Mono:Regular',sans-serif] leading-[1.49] relative shrink-0 text-[13px] w-full" data-node-id="210:5491">{`6-8" step height, but 24" is ideal. Slow, controlled eccentric (3-sec lower). Focus on knee tracking over toes. `}</p>
          </div>
          
          {/* Sets */}
          {sets.map((set) => (
            <SetRow
              key={set.id}
              id={set.id}
              setNumber={set.setNumber}
              reps={set.reps}
              weight={set.weight}
              onDelete={handleDeleteSet}
            />
          ))}

          {/* Add Set & Log Buttons */}
          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-node-id="210:5519">
            <button
              onClick={handleAddSet}
              className="relative rounded-[20px] shrink-0 w-full border border-solid border-white bg-transparent"
            >
              <div className="content-stretch flex items-center justify-center overflow-clip px-0 py-[20px] relative rounded-[inherit] w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[61.102px] not-italic relative shrink-0 text-[15px] text-center text-nowrap text-white">
                  Add set
                </p>
              </div>
            </button>
            <div className="bg-white content-stretch flex h-[68px] items-center justify-center overflow-clip px-0 py-[40px] relative rounded-[20px] shrink-0 w-full" data-name="Done Container" data-node-id="210:5520">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[61.102px] not-italic relative shrink-0 text-[#1e1e1e] text-[15px] text-center text-nowrap" data-node-id="210:5521">
                Log
              </p>
            </div>
          </div>

          <div className="bg-[rgba(30,30,30,0.6)] content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[10px] items-start leading-[normal] not-italic overflow-clip pb-[60px] pt-[18px] px-[16px] relative rounded-[20px] shrink-0 text-[15px] text-white w-full" data-name="Notes Container" data-node-id="210:5522">
            <p className="opacity-50 relative shrink-0 w-full" data-node-id="210:5523">
              Notes
            </p>
            <p className="relative shrink-0 w-full" data-node-id="210:5524">
              Boy, these are hard!
            </p>
          </div>
        </div>
      </div>
      <div className="absolute h-0 left-[calc(50%+0.5px)] top-[12.5px] translate-x-[-50%] w-[81px]" data-node-id="210:5525">
        <div className="absolute inset-[-2.5px_-3.09%]">
          <img alt="" className="block max-w-none size-full" src={imgVector1} />
        </div>
      </div>
    </div>
  );
}
