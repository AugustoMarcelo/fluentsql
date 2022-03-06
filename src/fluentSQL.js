export default class FluentSQlBuilder {
  #database = []
  #limit = 0
  #select = []
  #where = []
  #orderBy = ''

  constructor({ database }) {
    this.#database = database
  }

  static for(database) {
    return new FluentSQlBuilder({ database })
  }

  limit(max) {
    this.#limit = max

    return this
  }

  select(props) {
    this.#select = props

    return this
  }

  where(query) {
    /**
     * This will transform an object like { key: 'value' } on an array like [['key', 'value']]
     */
    const [[prop, value]] = Object.entries(query)
    const whereFilter = value instanceof RegExp ? value : new RegExp(value)

    this.#where.push({ prop, filter: whereFilter })

    return this
  }

  orderBy(field) {
    this.#orderBy = field

    return this
  }

  #performWhere(item) {
    for (const { filter, prop } of this.#where) {
      if (!filter.test(item[prop])) return false
    }

    return true
  }

  #performLimit(results) {
    return this.#limit && results.length === this.#limit
  }

  build() {
    const results = []
    for (const item of this.#database) {
      if (!this.#performWhere(item)) continue

      results.push(item)

      if (this.#performLimit(results)) break
    }

    return results
  }
}