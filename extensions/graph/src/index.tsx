import { usePrint } from '@agrzes/yellow-next-web/layout'
import { Paper } from '@mui/material'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraphCanvas, GraphEdge, GraphNode, GraphSceneProps } from 'reagraph'

interface GraphEvents {
  onNodeDoubleClick?: (node) => string | void
}

interface UnifiedGraphSource {
  graph(entity): { nodes: GraphNode[]; edges: GraphEdge[] }
}

interface GraphSource {
  nodes(entity): GraphNode[]
  edges(entity): GraphEdge[]
}

type GraphConfig = (UnifiedGraphSource | GraphSource) & GraphEvents

export function entityGraph(source: GraphConfig) {
  return ({ entity }) => {
    const navigate = useNavigate()
    const isPrint = usePrint()
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
    const onNodeDoubleClick: GraphSceneProps['onNodeDoubleClick'] = (node, event) => {
      const target = source.onNodeDoubleClick?.(node.data)
      if (target) {
        navigate(target)
      }
    }

    return (
      !isPrint && (
        <Paper sx={{ height: 400, position: 'relative' }}>
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            labelType="all"
            sizingType="default"
            onNodeDoubleClick={onNodeDoubleClick}
          />
        </Paper>
      )
    )
  }
}
