'use client'

import { ReactNode, useState } from 'react'

interface BaseButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'outlined' | 'filled'
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  isActive?: boolean
  activeBackgroundColor?: string
  activeTextColor?: string
  dataName?: string
}

export function BaseButton({
  children,
  onClick,
  variant = 'filled',
  backgroundColor,
  textColor,
  borderColor,
  isActive = false,
  activeBackgroundColor,
  activeTextColor,
  dataName
}: BaseButtonProps) {
  const [isClicked, setIsClicked] = useState(false)

  // Handle click with visual feedback for outlined variant
  const handleClick = () => {
    if (variant === 'outlined') {
      setIsClicked(true)
      // Reset after 200ms
      setTimeout(() => {
        setIsClicked(false)
      }, 200)
    }
    onClick?.()
  }

  // Determine styles based on variant
  const getStyles = () => {
    if (variant === 'outlined') {
      return {
        border: `1px solid ${borderColor || 'white'}`,
        background: isClicked ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        color: textColor || 'white',
        transition: 'background-color 0.15s ease-out'
      }
    } else {
      // filled variant
      const bgColor = isActive && activeBackgroundColor 
        ? activeBackgroundColor 
        : backgroundColor || 'white'
      const txtColor = isActive && activeTextColor
        ? activeTextColor
        : textColor || (bgColor === 'white' ? '#1e1e1e' : 'white')
      
      return {
        border: 'none',
        background: bgColor,
        color: txtColor
      }
    }
  }

  const styles = getStyles()

  return (
    <button
      onClick={handleClick}
      style={{
        ...styles,
        display: 'flex',
        height: '68px',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: '20px',
        paddingBottom: '20px',
        position: 'relative',
        borderRadius: '20px',
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer'
      }}
      data-name={dataName}
    >
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          lineHeight: '61.102px',
          fontStyle: 'normal',
          position: 'relative',
          flexShrink: 0,
          fontSize: '15px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          color: styles.color,
          margin: 0,
          padding: 0
        }}
      >
        {children}
      </p>
    </button>
  )
}

