'use client'

import { BaseLabeledContent } from './BaseLabeledContent'

interface NutritionSectionProps {
  label: string
  content: string
}

export function NutritionSection({ label, content }: NutritionSectionProps) {
  return (
    <BaseLabeledContent
      label={label}
      content={content}
      variant="read-only"
      contentFont="mono"
      gap="2px"
      paddingTop="5px"
      paddingBottom="17px"
    />
  )
}

