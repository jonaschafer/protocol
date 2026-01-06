'use client'

import { useState, useRef, useEffect } from 'react'

interface BaseLabeledContentProps {
  label: string
  content?: string // For read-only or controlled editable
  variant?: 'editable' | 'read-only'
  contentFont?: 'inter' | 'mono' // inter = 15px Inter, mono = 13px IBM Plex Mono
  placeholder?: string
  onSave?: (value: string) => void
  onValueChange?: (value: string) => void
  showSavedIndicator?: boolean
  containerStyle?: React.CSSProperties
  gap?: string // Gap between label and content
  paddingTop?: string
  paddingBottom?: string
}

export function BaseLabeledContent({
  label,
  content = '',
  variant = 'read-only',
  contentFont = variant === 'editable' ? 'inter' : 'mono',
  placeholder,
  onSave,
  onValueChange,
  showSavedIndicator = false,
  containerStyle,
  gap = '2px',
  paddingTop = '14px',
  paddingBottom = '0'
}: BaseLabeledContentProps) {
  const [value, setValue] = useState(content)
  const [isFocused, setIsFocused] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setValue(content)
  }, [content])

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onValueChange?.(newValue)
    setShowSaved(false)

    if (onSave) {
      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Clear saved timer if user types again
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current)
        savedTimerRef.current = null
      }

      // Set new debounce timer (1 second)
      debounceTimerRef.current = setTimeout(() => {
        onSave(newValue)
        
        if (showSavedIndicator) {
          // Show saved indicator (fade in)
          setShowSaved(true)
          
          // Hide saved indicator after 1 second (fade out)
          savedTimerRef.current = setTimeout(() => {
            setShowSaved(false)
          }, 1000)
        }
      }, 1000)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const isIdle = !isFocused && value === ''
  const showPlaceholder = isIdle && placeholder && variant === 'editable'

  const contentFontStyle = contentFont === 'mono'
    ? {
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '13px',
        lineHeight: 1.49
      }
    : {
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px',
        lineHeight: 'normal'
      }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        alignItems: 'flex-start',
        justifyContent: 'center',
        fontStyle: 'normal',
        paddingTop,
        paddingBottom,
        paddingLeft: 0,
        paddingRight: 0,
        position: 'relative',
        flexShrink: 0,
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        ...containerStyle
      }}
    >
      {/* Label */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'baseline',
        width: '100%',
        flexShrink: 0,
        gap: '8px',
        minWidth: 0
      }}>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            lineHeight: 'normal',
            fontStyle: 'normal',
            opacity: 0.5,
            position: 'relative',
            flexShrink: 1,
            minWidth: 0,
            fontSize: '15px',
            color: 'white',
            margin: 0,
            padding: 0
          }}
        >
          {label}
        </p>

        {/* Saved Indicator - Only for editable with indicator */}
        {variant === 'editable' && showSavedIndicator && (
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
              gap: '6px',
              flexShrink: 0,
              marginRight: '0'
            }}
          >
            <span>Saved</span>
            <span>✓</span>
          </div>
        )}
      </div>

      {/* Content */}
      {variant === 'editable' ? (
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              ...contentFontStyle,
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
              caretColor: 'white',
              WebkitTextFillColor: 'white'
            }}
          />
          {showPlaceholder && (
            <p
              style={{
                ...contentFontStyle,
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0,
                padding: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              {placeholder}
            </p>
          )}
        </div>
      ) : (
        <p
          style={{
            ...contentFontStyle,
            fontWeight: 400,
            position: 'relative',
            flexShrink: 0,
            width: '100%',
            minWidth: 0,
            color: 'white',
            margin: 0,
            padding: 0,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            boxSizing: 'border-box'
          }}
        >
          {content}
        </p>
      )}
    </div>
  )
}

