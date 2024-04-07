import Handlebars from 'handlebars'
import pkg from 'lodash'

const { snakeCase, kebabCase } = pkg
const handlebars = Handlebars.create()
export default handlebars

handlebars.registerHelper('snake', function (str) {
  return snakeCase(str)
})

handlebars.registerHelper('kebab', function (str) {
  return kebabCase(str)
})
