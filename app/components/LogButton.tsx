'use client'

import { BaseButton } from './BaseButton'

interface LogButtonProps {
  onClick?: () => void
  isLogged?: boolean
}

export function LogButton({ onClick, isLogged = false }: LogButtonProps) {
  return (
    <BaseButton
      variant="filled"
      backgroundColor="white"
      textColor="#1e1e1e"
      isActive={isLogged}
      activeBackgroundColor="#059F00"
      activeTextColor="#ffffff"
      onClick={onClick}
      dataName="log"
    >
      {isLogged ? 'Done' : 'Log'}
    </BaseButton>
  )
}



