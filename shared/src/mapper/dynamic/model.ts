import { ModelOptions } from '../../access/dynamic/model.js'

export interface MapperOptions extends ModelOptions {
  roots: Record<string, string>
}
