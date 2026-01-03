'use client'

import { StatBox } from './StatBox'

interface SetRowStatBoxProps {
  label: string
  value: string
  onValueChange?: (value: string) => void
  containerRef?: React.RefObject<HTMLDivElement>
  labelMeasureRef?: React.RefObject<HTMLSpanElement>
  getInputWidth?: (value: string) => string
  showLabel?: boolean
}

export function SetRowStatBox({
  label,
  value,
  onValueChange,
  containerRef,
  labelMeasureRef,
  getInputWidth,
  showLabel
}: SetRowStatBoxProps) {
  return (
    <StatBox
      label={label}
      value={value}
      variant="dark"
      width="flex"
      isEditable={true}
      onValueChange={onValueChange}
      showLabel={showLabel}
      containerRef={containerRef}
      labelMeasureRef={labelMeasureRef}
      getInputWidth={getInputWidth}
    />
  )
}

