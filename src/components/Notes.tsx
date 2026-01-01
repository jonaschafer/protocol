import { useState, useRef, useEffect } from 'react';

interface NotesProps {
  initialValue?: string;
  onSave?: (value: string) => void;
}

export function Notes({ initialValue = '', onSave }: NotesProps) {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setShowSaved(false);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Clear saved timer if user types again
    if (savedTimerRef.current) {
      clearTimeout(savedTimerRef.current);
      savedTimerRef.current = null;
    }

    // Set new debounce timer (1 second)
    debounceTimerRef.current = setTimeout(() => {
      // Save action
      onSave?.(newValue);
      
      // Show saved indicator (fade in)
      setShowSaved(true);
      
      // Hide saved indicator after 1 second (fade out)
      savedTimerRef.current = setTimeout(() => {
        setShowSaved(false);
      }, 1000);
    }, 1000);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isIdle = !isFocused && value === '';
  const showPlaceholder = isIdle;

  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '20px',
        padding: '18px 16px 60px 16px',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        height: '200px', // Fixed height
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflow: 'hidden'
      }}
      data-name="Notes Container"
      data-node-id="232:7079"
    >
      {/* Notes Label with Saved Indicator */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'baseline',
        width: '100%',
        flexShrink: 0
      }}>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0,
            padding: 0,
            lineHeight: 'normal'
          }}
          data-node-id="232:7080"
        >
          Notes
        </p>

        {/* Saved Indicator - Same baseline as Notes */}
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            fontWeight: 400,
            color: '#059F00',
            opacity: showSaved ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          data-node-id="232:7094"
        >
          <span data-node-id="232:7088">Saved</span>
          <span>✓</span>
        </div>
      </div>

      {/* Textarea Container with Placeholder */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            fontWeight: 400,
            color: 'white',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            width: '100%',
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: 0,
            margin: 0,
            lineHeight: 'normal',
            caretColor: 'white',
            WebkitTextFillColor: 'white'
          }}
        />

        {/* Placeholder (only shown when idle) */}
        {showPlaceholder && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0,
              padding: 0,
              lineHeight: 'normal',
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              userSelect: 'none'
            }}
            data-node-id="232:7081"
          >
            Jot down yer thoughts
          </p>
        )}

      </div>
    </div>
  );
}

