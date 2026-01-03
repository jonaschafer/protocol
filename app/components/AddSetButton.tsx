'use client'

import { BaseButton } from './BaseButton'

interface AddSetButtonProps {
  onClick?: () => void
}

export function AddSetButton({ onClick }: AddSetButtonProps) {
  return (
    <BaseButton
      variant="outlined"
      onClick={onClick}
      dataName="add set"
    >
      Add set
    </BaseButton>
  )
}

