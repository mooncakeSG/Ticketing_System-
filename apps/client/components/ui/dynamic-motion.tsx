'use client';

import { Suspense, lazy } from 'react';

// Dynamically import framer-motion
const MotionDiv = lazy(() => import('framer-motion').then(mod => ({ default: mod.motion.div })));
const MotionButton = lazy(() => import('framer-motion').then(mod => ({ default: mod.motion.button })));
const MotionSpan = lazy(() => import('framer-motion').then(mod => ({ default: mod.motion.span })));

// Loading fallback component
const MotionFallback = ({ children, ...props }: any) => <div {...props}>{children}</div>;

// Dynamic motion components with fallbacks
export const DynamicMotionDiv = (props: any) => (
  <Suspense fallback={<MotionFallback {...props} />}>
    <MotionDiv {...props} />
  </Suspense>
);

export const DynamicMotionButton = (props: any) => (
  <Suspense fallback={<MotionFallback {...props} />}>
    <MotionButton {...props} />
  </Suspense>
);

export const DynamicMotionSpan = (props: any) => (
  <Suspense fallback={<MotionFallback {...props} />}>
    <MotionSpan {...props} />
  </Suspense>
);

// Export the motion function for direct use
export const motion = {
  div: DynamicMotionDiv,
  button: DynamicMotionButton,
  span: DynamicMotionSpan,
}; 