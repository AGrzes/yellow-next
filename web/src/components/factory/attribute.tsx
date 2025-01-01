import { Table, TableCell, TableRow } from '@mui/material'
import lodash from 'lodash'
import React, { useMemo } from 'react'
import { EntityComponentType } from '../index.js'
const { groupBy, mapValues, upperFirst, camelCase, map } = lodash

export interface AttributeConfig {
  labelProperty: string
  valueProperty: string
  groupProperty?: string
  typeProperty?: string
}

function valueComponent(type: string) {
  switch (type) {
    case 'url':
      return ({ value }) => (
        <a href={value} target="_blank">
          {value}
        </a>
      )
    default:
      return ({ value }) => <React.Fragment>{value}</React.Fragment>
  }
}

export function attributeTable(property: string, config: AttributeConfig): EntityComponentType {
  const AttributeRow = ({ attribute }) => {
    const type = attribute[config.typeProperty] || 'default'

    const ValueComponent = valueComponent(type)
    return (
      <TableRow>
        <TableCell>{attribute[config.labelProperty]}</TableCell>
        <TableCell>
          <ValueComponent value={attribute[config.valueProperty]} />
        </TableCell>
      </TableRow>
    )
  }

  if (config.groupProperty) {
    return ({ entity, sx }) => {
      const groups = useMemo(
        () => groupBy(entity[property], (value) => value[config.groupProperty] || 'default'),
        [entity]
      )
      const groupLabels = mapValues(groups, (values, key) => upperFirst(camelCase(key)))
      const groupKeys = Object.keys(groups)
      return (
        <Table>
          {groupKeys.map((key) => (
            <>
              {groups[key].length > 0 && (
                <TableRow>
                  <TableCell colSpan={2}>{groupLabels[key]}</TableCell>
                </TableRow>
              )}
              {groups[key].map((attribute, key) => (
                <AttributeRow key={key} attribute={attribute} />
              ))}
            </>
          ))}
        </Table>
      )
    }
  } else {
    return ({ entity }) => {
      return (
        <Table>
          {entity[property].map((attribute, key) => (
            <AttributeRow key={key} attribute={attribute} />
          ))}
        </Table>
      )
    }
  }
}
