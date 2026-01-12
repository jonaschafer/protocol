'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface NavItem {
  label: string
  href: string
  icon: (isActive: boolean) => React.ReactNode
}

const CalendarIcon = ({ isActive }: { isActive: boolean }) => {
  const strokeColor = isActive ? '#ffffff' : '#6B6B7B'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.66602 1.6665V4.99945" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.332 1.6665V4.99945" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.8318 3.33301H4.16647C3.2461 3.33301 2.5 4.07911 2.5 4.99948V16.6648C2.5 17.5851 3.2461 18.3313 4.16647 18.3313H15.8318C16.7521 18.3313 17.4982 17.5851 17.4982 16.6648V4.99948C17.4982 4.07911 16.7521 3.33301 15.8318 3.33301Z" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 8.33252H17.4982" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const PlanIcon = ({ isActive }: { isActive: boolean }) => {
  const strokeColor = isActive ? '#ffffff' : '#6B6B7B'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.691 1.8163C10.4739 1.71726 10.238 1.66602 9.9994 1.66602C9.76077 1.66602 9.52492 1.71726 9.30781 1.8163L2.16699 5.06591C2.01913 5.13111 1.89342 5.23789 1.80516 5.37326C1.71691 5.50863 1.66992 5.66673 1.66992 5.82833C1.66992 5.98992 1.71691 6.14803 1.80516 6.28339C1.89342 6.41876 2.01913 6.52554 2.16699 6.59074L9.31615 9.84869C9.53326 9.94772 9.7691 9.99897 10.0077 9.99897C10.2464 9.99897 10.4822 9.94772 10.6993 9.84869L17.8485 6.59907C17.9963 6.53387 18.1221 6.42709 18.2103 6.29172C18.2986 6.15636 18.3455 5.99825 18.3455 5.83666C18.3455 5.67506 18.2986 5.51696 18.2103 5.38159C18.1221 5.24623 17.9963 5.13944 17.8485 5.07425L10.691 1.8163Z" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.66602 9.99902C1.66562 10.1584 1.71094 10.3145 1.7966 10.4489C1.88226 10.5833 2.00466 10.6903 2.14929 10.7573L9.31512 14.0152C9.5311 14.113 9.76546 14.1636 10.0025 14.1636C10.2396 14.1636 10.474 14.113 10.69 14.0152L17.8391 10.7656C17.9866 10.6993 18.1116 10.5915 18.1989 10.4554C18.2862 10.3193 18.332 10.1607 18.3307 9.99902" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.66602 14.165C1.66562 14.3244 1.71094 14.4805 1.7966 14.6149C1.88226 14.7493 2.00466 14.8563 2.14929 14.9233L9.31512 18.1812C9.5311 18.279 9.76546 18.3296 10.0025 18.3296C10.2396 18.3296 10.474 18.279 10.69 18.1812L17.8391 14.9316C17.9866 14.8653 18.1116 14.7575 18.1989 14.6214C18.2862 14.4853 18.332 14.3267 18.3307 14.165" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const WeekIcon = ({ isActive }: { isActive: boolean }) => {
  const strokeColor = isActive ? '#ffffff' : '#6B6B7B'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.66602 1.6665V4.99945" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.332 1.6665V4.99945" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.8318 3.33301H4.16647C3.2461 3.33301 2.5 4.07911 2.5 4.99948V16.6648C2.5 17.5851 3.2461 18.3313 4.16647 18.3313H15.8318C16.7521 18.3313 17.4982 17.5851 17.4982 16.6648V4.99948C17.4982 4.07911 16.7521 3.33301 15.8318 3.33301Z" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 8.33252H17.4982" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66602 11.6655H6.67435" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.99805 11.6655H10.0064" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.332 11.6655H13.3404" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66602 14.998H6.67435" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.99805 14.998H10.0064" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.332 14.998H13.3404" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const DayIcon = ({ isActive }: { isActive: boolean }) => {
  const strokeColor = isActive ? '#ffffff' : '#6B6B7B'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_342_9951)">
        <path d="M9.99837 18.3312C14.6002 18.3312 18.3307 14.6007 18.3307 9.99886C18.3307 5.39703 14.6002 1.6665 9.99837 1.6665C5.39654 1.6665 1.66602 5.39703 1.66602 9.99886C1.66602 14.6007 5.39654 18.3312 9.99837 18.3312Z" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.99941 14.9983C12.7605 14.9983 14.9988 12.76 14.9988 9.99893C14.9988 7.23783 12.7605 4.99951 9.99941 4.99951C7.23831 4.99951 5 7.23783 5 9.99893C5 12.76 7.23831 14.9983 9.99941 14.9983Z" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.9985 11.6655C10.9189 11.6655 11.665 10.9194 11.665 9.99899C11.665 9.07862 10.9189 8.33252 9.9985 8.33252C9.07814 8.33252 8.33203 9.07862 8.33203 9.99899C8.33203 10.9194 9.07814 11.6655 9.9985 11.6655Z" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_342_9951">
          <rect width="19.9977" height="19.9977" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

const ExerciseIcon = ({ isActive }: { isActive: boolean }) => {
  const strokeColor = isActive ? '#ffffff' : '#6B6B7B'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.9995 11.9986L8 7.99902" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.5461 17.902C15.2336 18.2146 14.8097 18.3902 14.3677 18.3903C13.9258 18.3904 13.5018 18.2149 13.1893 17.9024C12.8767 17.5899 12.701 17.1661 12.7009 16.7241C12.7009 16.2821 12.8764 15.8582 13.1888 15.5456L11.7165 17.0187C11.4039 17.3313 10.98 17.5069 10.5379 17.5069C10.0958 17.5069 9.67188 17.3313 9.35929 17.0187C9.0467 16.7062 8.87109 16.2822 8.87109 15.8401C8.87109 15.3981 9.0467 14.9741 9.35929 14.6615L14.662 9.3588C14.9746 9.04622 15.3985 8.87061 15.8406 8.87061C16.2827 8.87061 16.7066 9.04622 17.0192 9.3588C17.3318 9.67139 17.5074 10.0953 17.5074 10.5374C17.5074 10.9795 17.3318 11.4034 17.0192 11.716L15.5461 13.1884C15.8587 12.8759 16.2826 12.7004 16.7246 12.7005C17.1665 12.7005 17.5904 12.8762 17.9029 13.1888C18.2154 13.5014 18.3909 13.9253 18.3908 14.3673C18.3907 14.8092 18.215 15.2331 17.9025 15.5456L15.5461 17.902Z" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.9146 17.9146L16.748 16.748" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.25051 3.24954L2.08398 2.08301" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.33619 10.6389C5.02361 10.9515 4.59965 11.1271 4.15758 11.1271C3.71552 11.1271 3.29156 10.9515 2.97897 10.6389C2.66638 10.3263 2.49077 9.90236 2.49077 9.4603C2.49077 9.01823 2.66638 8.59427 2.97897 8.28168L4.45213 6.80936C4.29735 6.96408 4.11362 7.0868 3.91141 7.17052C3.70921 7.25423 3.49249 7.2973 3.27364 7.29726C2.83165 7.29718 2.4078 7.12153 2.09532 6.80894C1.9406 6.65416 1.81788 6.47042 1.73416 6.26822C1.65045 6.06601 1.60738 5.8493 1.60742 5.63045C1.6075 5.18846 1.78315 4.76461 2.09574 4.45213L4.45213 2.09574C4.76461 1.78315 5.18846 1.6075 5.63045 1.60742C5.8493 1.60738 6.06601 1.65045 6.26822 1.73416C6.47042 1.81788 6.65416 1.9406 6.80894 2.09532C6.96372 2.25005 7.0865 2.43374 7.17029 2.63592C7.25408 2.83809 7.29722 3.05479 7.29726 3.27364C7.2973 3.49249 7.25423 3.70921 7.17052 3.91141C7.0868 4.11362 6.96408 4.29735 6.80936 4.45213L8.28168 2.97897C8.59427 2.66638 9.01823 2.49077 9.4603 2.49077C9.90236 2.49077 10.3263 2.66638 10.6389 2.97897C10.9515 3.29156 11.1271 3.71552 11.1271 4.15758C11.1271 4.59965 10.9515 5.02361 10.6389 5.33619L5.33619 10.6389Z" stroke={strokeColor} strokeWidth="1.66647" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const defaultNavItems: NavItem[] = [
  {
    label: 'Calendar',
    href: '/',
    icon: (isActive) => <CalendarIcon isActive={isActive} />,
  },
  {
    label: 'Plan',
    href: '/phases',
    icon: (isActive) => <PlanIcon isActive={isActive} />,
  },
  {
    label: 'Week',
    href: '/week',
    icon: (isActive) => <WeekIcon isActive={isActive} />,
  },
  {
    label: 'Day',
    href: '/day',
    icon: (isActive) => <DayIcon isActive={isActive} />,
  },
  {
    label: 'Exercise',
    href: '/exercises',
    icon: (isActive) => <ExerciseIcon isActive={isActive} />,
  },
]

interface BottomNavProps {
  preview?: boolean
}

export function BottomNav({ preview = false }: BottomNavProps = {}) {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: preview ? 'relative' : 'fixed',
        bottom: preview ? 'auto' : 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000',
        padding: '12px 0',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: preview ? 'auto' : 1000,
      }}
    >
      {defaultNavItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
        
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 12px',
              textDecoration: 'none',
              minWidth: '60px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon(isActive)}
            </div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                color: isActive ? '#ffffff' : '#6B6B7B',
                textAlign: 'center',
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
