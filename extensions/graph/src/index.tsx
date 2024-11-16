import { Paper } from '@mui/material'
import React, { useMemo } from 'react'
import { GraphCanvas, GraphEdge, GraphNode } from 'reagraph'

interface UnifiedGraphSource {
  graph(entity): { nodes: GraphNode[]; edges: GraphEdge[] }
}

interface GraphSource {
  nodes(entity): GraphNode[]
  edges(entity): GraphEdge[]
}

type GraphConfig = UnifiedGraphSource | GraphSource

export function entityGraph(source: GraphConfig) {
  return ({ entity }) => {
    const { nodes, edges } = useMemo(() => {
      if ('graph' in source) {
        return source.graph(entity)
      } else {
        return {
          nodes: source.nodes(entity),
          edges: source.edges(entity),
        }
      }
    }, [entity])
    return (
      <Paper sx={{ height: 400, position: 'relative' }}>
        <GraphCanvas nodes={nodes} edges={edges} labelType="all" sizingType="default" />
      </Paper>
    )
  }
}
