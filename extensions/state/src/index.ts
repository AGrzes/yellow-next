import { comment, Visitor } from '@agrzes/yellow-next-shared/dynamic/builder'
import _ from 'lodash'

export const state =
  (state: string = 'state', stateClassVisitor: Visitor = (b) => {}): Visitor =>
  (b) => {
    const stateClassName = `${b.className}${_.upperFirst(_.camelCase(state))}`
    b.property(state).oneToMany().orderBy('date').target(stateClassName).reverse(_.snakeCase(b.className))

    b.class(stateClassName)
      .internal()
      .property('date')
      .multiplicity('single')
      .property('state')
      .multiplicity('single')
      .accept(comment('description'))
      .accept(stateClassVisitor)
  }
