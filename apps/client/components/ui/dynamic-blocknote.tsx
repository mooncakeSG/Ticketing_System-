'use client';

import { Suspense, lazy } from 'react';

// Dynamically import BlockNote components
const BlockNoteView = lazy(() => import('@blocknote/mantine').then(mod => ({ default: mod.BlockNoteView })));

// Loading fallback component
const BlockNoteFallback = ({ children, ...props }: any) => (
  <div className="min-h-[200px] bg-gray-800 rounded-md p-4 animate-pulse">
    <div className="h-4 bg-gray-700 rounded mb-2"></div>
    <div className="h-4 bg-gray-700 rounded mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
  </div>
);

// Dynamic BlockNote components with fallbacks
export const DynamicBlockNoteView = (props: any) => (
  <Suspense fallback={<BlockNoteFallback {...props} />}>
    <BlockNoteView {...props} />
  </Suspense>
);

// Export types for convenience
export type { PartialBlock } from '@blocknote/core'; 