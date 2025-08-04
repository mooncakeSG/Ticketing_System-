declare module 'jest-axe' {
  interface AxeResults {
    violations: Array<{
      id: string
      impact: string
      tags: string[]
      description: string
      help: string
      helpUrl: string
      nodes: Array<{
        html: string
        target: string[]
        failureSummary: string
        impact: string
        any: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
        all: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
        none: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
      }>
    }>
    passes: Array<{
      id: string
      impact: string
      tags: string[]
      description: string
      help: string
      helpUrl: string
      nodes: Array<{
        html: string
        target: string[]
        failureSummary: string
        impact: string
        any: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
        all: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
        none: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
      }>
    }>
    incomplete: Array<{
      id: string
      impact: string
      tags: string[]
      description: string
      help: string
      helpUrl: string
      nodes: Array<{
        html: string
        target: string[]
        failureSummary: string
        impact: string
        any: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
        all: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
        none: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
      }>
    }>
    inapplicable: Array<{
      id: string
      impact: string
      tags: string[]
      description: string
      help: string
      helpUrl: string
      nodes: Array<{
        html: string
        target: string[]
        failureSummary: string
        impact: string
        any: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
        all: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
        none: Array<{
          id: string
          data: any
          relatedNodes: Array<{
            target: string[]
            html: string
          }>
        }>
      }>
    }>
  }

  function axe(element: Element | null, options?: any): Promise<AxeResults>
  
  export = axe
} 