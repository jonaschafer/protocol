'use client'

import { BottomNav } from '../components/BottomNav'

export default function NavPreview() {
  return (
    <div
      style={{
        backgroundColor: '#000000',
        minHeight: '100vh',
        padding: '40px 20px',
        paddingBottom: '100px', // Extra padding for bottom nav
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
      }}
    >
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '24px',
          fontWeight: 500,
          color: 'white',
          textAlign: 'center',
        }}
      >
        Bottom Navigation Preview
      </div>
      
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          maxWidth: '600px',
        }}
      >
        This page demonstrates the bottom navigation component. Scroll down to see how it stays fixed at the bottom, and click the navigation items to see the active states.
      </div>

      {/* Add some content to demonstrate scrolling */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                fontWeight: 500,
                color: 'white',
                marginBottom: '8px',
              }}
            >
              Content Section {i + 1}
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              This is sample content to demonstrate scrolling. The bottom navigation will remain fixed at the bottom of the viewport as you scroll through this content.
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
