'use client'

import { useRef, useEffect, useState } from 'react'

interface StatBoxProps {
  label: string
  value: string | number
  variant?: 'dark' | 'black' // dark = #1e1e1e, black = black
  width?: 'fixed' | 'flex' | string // fixed width, flex, or specific width
  fixedWidth?: string // Specific width when width is 'fixed'
  isEditable?: boolean
  onValueChange?: (value: string) => void
  showLabel?: boolean // For editable boxes that can hide label
  labelMeasureRef?: React.RefObject<HTMLSpanElement>
  containerRef?: React.RefObject<HTMLDivElement>
  getInputWidth?: (value: string) => string
}

export function StatBox({
  label,
  value,
  variant = 'dark',
  width = 'flex',
  fixedWidth,
  isEditable = false,
  onValueChange,
  showLabel = true,
  labelMeasureRef,
  containerRef,
  getInputWidth
}: StatBoxProps) {
  const [localValue, setLocalValue] = useState(String(value))
  const internalLabelRef = useRef<HTMLSpanElement>(null)
  const internalContainerRef = useRef<HTMLDivElement>(null)
  const [internalShowLabel, setInternalShowLabel] = useState(true)

  const labelRef = labelMeasureRef || internalLabelRef
  const containerRefToUse = containerRef || internalContainerRef

  // Calculate input width for editable boxes
  const calculateInputWidth = (val: string): string => {
    if (getInputWidth) return getInputWidth(val)
    const charWidth = 28
    const minWidth = 44
    const calculatedWidth = Math.max(val.length * charWidth, minWidth)
    return `${calculatedWidth}px`
  }

  // Auto-hide label logic for editable boxes (similar to SetRow)
  useEffect(() => {
    if (isEditable && containerRefToUse.current && labelRef.current) {
      const MIN_GAP = 6
      const PADDING_LEFT = 16
      const PADDING_RIGHT = 16

      const checkLabelVisibility = () => {
        if (containerRefToUse.current && labelRef.current) {
          const containerWidth = containerRefToUse.current.offsetWidth
          const labelWidth = labelRef.current.offsetWidth
          const inputWidth = calculateInputWidth(localValue).replace('px', '')
          const availableWidth = containerWidth - PADDING_LEFT - PADDING_RIGHT
          const requiredWidth = labelWidth + MIN_GAP + parseInt(inputWidth)
          setInternalShowLabel(availableWidth >= requiredWidth)
        }
      }

      const resizeObserver = new ResizeObserver(() => {
        checkLabelVisibility()
      })

      if (containerRefToUse.current) {
        resizeObserver.observe(containerRefToUse.current)
      }

      const timeout = setTimeout(checkLabelVisibility, 0)

      return () => {
        resizeObserver.disconnect()
        clearTimeout(timeout)
      }
    }
  }, [localValue, isEditable, containerRefToUse, labelRef])

  useEffect(() => {
    setLocalValue(String(value))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onValueChange?.(newValue)
  }

  const backgroundColor = variant === 'black' ? 'black' : '#1e1e1e'
  const widthStyle = width === 'flex' 
    ? { flex: '1 1 0', minWidth: '110px' }
    : width === 'fixed' && fixedWidth
    ? { width: fixedWidth }
    : typeof width === 'string'
    ? { width }
    : { flex: '1 1 0' }

  const displayLabel = isEditable ? (showLabel !== undefined ? showLabel : internalShowLabel) : true

  return (
    <div
      ref={containerRefToUse}
      style={{
        backgroundColor,
        display: 'flex',
        height: '68px',
        alignItems: 'center',
        overflow: 'hidden',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '18px',
        paddingBottom: '18px',
        position: 'relative',
        borderRadius: '20px',
        whiteSpace: 'nowrap',
        color: 'white',
        boxSizing: 'border-box',
        ...widthStyle
      }}
      data-name="StatBox"
    >
      {/* Hidden measurement element for editable boxes */}
      {isEditable && (
        <span
          ref={labelRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            height: 'auto',
            width: 'auto',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '15px'
          }}
          aria-hidden="true"
        >
          {label}
        </span>
      )}

      {/* Label */}
      {displayLabel && (
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            lineHeight: 'normal',
            fontStyle: 'normal',
            opacity: 0.5,
            position: 'relative',
            flexShrink: 0,
            fontSize: '15px',
            color: 'white',
            margin: 0,
            marginRight: '8px',
            padding: 0
          }}
        >
          {label}
        </p>
      )}

      {/* Value - Editable or Read-only */}
      {isEditable ? (
        <input
          type="tel"
          inputMode={label === '#' ? 'decimal' : 'numeric'}
          value={localValue}
          onChange={handleChange}
          onFocus={(e) => e.target.select()}
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 500,
            lineHeight: '61.102px',
            position: 'relative',
            width: calculateInputWidth(localValue),
            fontSize: '44px',
            textAlign: 'right',
            color: 'white',
            WebkitTextFillColor: 'white',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: 0,
            margin: 0,
            marginLeft: 'auto',
            minWidth: '44px'
          }}
        />
      ) : (
        <p
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 500,
            lineHeight: '61.102px',
            position: 'relative',
            flexShrink: 0,
            fontSize: '44px',
            color: 'white',
            margin: 0,
            padding: 0,
            marginLeft: width === 'flex' ? 'auto' : undefined
          }}
        >
          {value}
        </p>
      )}
    </div>
  )
}

