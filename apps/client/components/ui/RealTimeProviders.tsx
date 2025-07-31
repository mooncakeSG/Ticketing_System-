'use client';

import React from 'react';
import { RealTimeNotification, WebSocketStatus } from './RealTimeNotification';
import { OfflineIndicator, OfflineActionsIndicator } from './OfflineIndicator';
import { useKeyboardShortcuts } from './KeyboardShortcuts';

interface RealTimeProvidersProps {
  children: React.ReactNode;
}

export function RealTimeProviders({ children }: RealTimeProvidersProps) {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <>
      {children}
      <RealTimeNotification />
      <OfflineIndicator />
      <OfflineActionsIndicator />
      <div className="fixed bottom-4 right-4 z-50">
        <WebSocketStatus />
      </div>
    </>
  );
} 