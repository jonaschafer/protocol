'use client'

import { BaseLabeledContent } from './BaseLabeledContent'

interface NotesProps {
  initialValue?: string;
  onSave?: (value: string) => void;
}

export function Notes({ initialValue = '', onSave }: NotesProps) {
  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '20px',
        padding: '18px 16px 60px 16px',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflow: 'hidden'
      }}
      data-name="Notes Container"
      data-node-id="232:7079"
    >
      <BaseLabeledContent
        label="Notes"
        content={initialValue}
        variant="editable"
        contentFont="inter"
        placeholder="Jot down yer thoughts"
        onSave={onSave}
        showSavedIndicator={true}
        containerStyle={{
          flex: 1,
          minHeight: 0,
          paddingTop: '0',
          paddingBottom: '0',
          gap: '10px'
        }}
      />
    </div>
  )
}

