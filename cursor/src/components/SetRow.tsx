import { useState, useRef, useEffect } from "react";

interface SetRowProps {
  id: string;
  setNumber: number;
  reps: string;
  weight: string;
  onDelete: (id: string) => void;
}

export function SetRow({ id, setNumber, reps, weight, onDelete }: SetRowProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef(0);

  const SWIPE_THRESHOLD = -120; // How far to swipe before revealing delete button
  const DELETE_THRESHOLD = -180; // How far to swipe to auto-delete

  // Keep ref in sync with state
  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      // Only allow leftward swipe (negative values)
      if (diff < 0) {
        const newOffset = Math.max(diff, -250);
        dragOffsetRef.current = newOffset;
        setDragOffset(newOffset);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      const currentOffset = dragOffsetRef.current;
      // Auto-delete if swiped far enough
      if (currentOffset < DELETE_THRESHOLD) {
        onDelete(id);
        setDragOffset(0);
      } else if (currentOffset < SWIPE_THRESHOLD) {
        // Show delete button but don't auto-delete
        setDragOffset(SWIPE_THRESHOLD);
      } else {
        // Snap back
        setDragOffset(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startX, id, onDelete]);

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const diff = touch.clientX - startX;
      // Only allow leftward swipe (negative values)
      if (diff < 0) {
        const newOffset = Math.max(diff, -250);
        dragOffsetRef.current = newOffset;
        setDragOffset(newOffset);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      const currentOffset = dragOffsetRef.current;
      // Auto-delete if swiped far enough
      if (currentOffset < DELETE_THRESHOLD) {
        onDelete(id);
        setDragOffset(0);
      } else if (currentOffset < SWIPE_THRESHOLD) {
        // Show delete button but don't auto-delete
        setDragOffset(SWIPE_THRESHOLD);
      } else {
        // Snap back
        setDragOffset(0);
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startX, id, onDelete]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleDeleteClick = () => {
    onDelete(id);
  };

  return (
    <div
      ref={containerRef}
      className="h-[68px] overflow-clip relative shrink-0 w-full"
    >
      {/* Main content - slides left */}
      <div
        className="absolute flex gap-[10px] items-center top-0 h-full w-full cursor-grab active:cursor-grabbing select-none"
        style={{
          left: `${dragOffset}px`,
          transition: isDragging ? "none" : "left 0.3s ease-out",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex flex-row items-center shrink-0 h-full">
          <div className="bg-[rgba(30,30,30,0.6)] flex h-full items-center justify-center px-[16px] relative rounded-[10px] shrink-0 w-[42px]">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic opacity-50 relative shrink-0 text-[15px] text-nowrap text-white">
              {setNumber}
            </p>
          </div>
        </div>

        <div className="bg-[#1e1e1e] flex-1 min-w-[140px] h-full relative rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between px-[16px] h-full text-nowrap text-white">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic opacity-50 relative shrink-0 text-[15px]">
              Reps
            </p>
            <p className="font-['Inter_Tight:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[44px] text-right">
              {reps}
            </p>
          </div>
        </div>

        <div className="bg-[#1e1e1e] flex-1 min-w-[100px] h-full relative rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between px-[16px] h-full text-nowrap text-white">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic opacity-50 relative shrink-0 text-[15px]">
              #
            </p>
            <p className="font-['Inter_Tight:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[44px] text-right">
              {weight}
            </p>
          </div>
        </div>
      </div>

      {/* Delete button - revealed when swiping */}
      <button
        onClick={handleDeleteClick}
        className="absolute bg-[#d51c1c] h-[68px] left-[129px] overflow-clip rounded-[20px] top-0 w-[233px] flex items-center justify-center"
        style={{
          opacity: dragOffset < -60 ? 1 : 0,
          transition: isDragging ? "opacity 0.1s" : "opacity 0.3s",
        }}
        aria-label="Delete set"
      >
        <svg
          className="size-[24px]"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9"
            fill="white"
          />
          <path
            d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9H20Z"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M21 6H15.375M15.375 6V4C15.375 2.89543 14.4796 2 13.375 2H10.625C9.52043 2 8.625 2.89543 8.625 4V6M15.375 6H8.625M3 6H8.625"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </div>
  );
}

