import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Document } from './Document'

export function PathDocument() {
  const { '*': path } = useParams()
  return <Document path={path} />
}
