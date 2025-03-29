import React from 'react'
import { useLoaderData, useParams } from 'react-router-dom'

export function withParams(Component: React.ComponentType<any>) {
  return (props: any) => {
    const params = useParams()
    return <Component {...props} {...params} />
  }
}

export function withLoader(Component: React.ComponentType<any>) {
  return (props: any) => {
    const loader = useLoaderData() as object
    return <Component {...props} {...loader} />
  }
}

export function withParamsAndLoader(Component: React.ComponentType<any>) {
  return (props: any) => {
    const params = useParams()
    const loader = useLoaderData() as object
    return <Component {...props} {...params} {...loader} />
  }
}
