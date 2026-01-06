'use client'

import { StatBox } from './StatBox'

interface RunHeaderStatBoxProps {
  label: string
  value: string | number
  width?: 'fixed' | 'flex' | string
  fixedWidth?: string
}

export function RunHeaderStatBox({
  label,
  value,
  width = 'flex',
  fixedWidth
}: RunHeaderStatBoxProps) {
  return (
    <StatBox
      label={label}
      value={value}
      variant="black"
      width={width}
      fixedWidth={fixedWidth}
      isEditable={false}
    />
  )
}



