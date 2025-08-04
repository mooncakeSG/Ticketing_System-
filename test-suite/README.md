# Peppermint Testing Suite - Phase 5

## Overview
Comprehensive testing framework for the Peppermint Ticketing System UI upgrade.

## Test Categories

### 1. Unit Tests
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing
- API client testing

### 2. Integration Tests
- Page component testing
- Form submission testing
- API integration testing
- State management testing

### 3. E2E Tests
- User workflow testing
- Cross-browser compatibility
- Mobile responsiveness testing
- Performance testing

### 4. Accessibility Tests
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation testing
- Color contrast validation

## Running Tests

```bash
# Run all tests
npm run test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:a11y

# Run tests with coverage
npm run test:coverage
```

## Test Structure
```
test-suite/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   ├── pages/
│   └── forms/
├── e2e/
│   ├── workflows/
│   └── performance/
└── accessibility/
    ├── wcag/
    └── screen-reader/
```

## Coverage Targets
- Unit Tests: 90%+
- Integration Tests: 80%+
- E2E Tests: Critical paths only
- Accessibility: 100% WCAG compliance 