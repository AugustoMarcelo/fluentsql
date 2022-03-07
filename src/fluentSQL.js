export default class FluentSQlBuilder {
  #database = [];
  #limit = 0;
  #select = [];
  #where = [];
  #orderBy = '';

  constructor({ database }) {
    this.#database = database;
  }

  static for(database) {
    return new FluentSQlBuilder({ database });
  }

  limit(max) {
    this.#limit = max;

    return this;
  }

  select(props) {
    this.#select = props;

    return this;
  }

  where(query) {
    /**
     * This will transform an object like { key: 'value' } on an array like [['key', 'value']]
     */
    const [[prop, value]] = Object.entries(query);
    const whereFilter = value instanceof RegExp ? value : new RegExp(value);

    this.#where.push({ prop, filter: whereFilter });

    return this;
  }

  orderBy(field) {
    this.#orderBy = field;

    return this;
  }

  #performWhere(item) {
    for (const { filter, prop } of this.#where) {
      if (!filter.test(item[prop])) return false;
    }

    return true;
  }

  #performLimit(results) {
    return this.#limit && results.length === this.#limit;
  }

  #performSelect(item) {
    const mappedItem = {};
    const entries = Object.entries(item);

    for (const [key, value] of entries) {
      if (this.#select.length && !this.#select.includes(key)) continue;

      mappedItem[key] = value;
    }

    return mappedItem;
  }

  #performOrderBy(results) {
    if (!this.#orderBy) return results;

    return results.sort((prev, next) => {
      return prev[this.#orderBy]
        .toString()
        .localeCompare(next[this.#orderBy].toString());
    });
  }

  build() {
    const results = [];

    for (const item of this.#database) {
      if (!this.#performWhere(item)) continue;

      const mappedItem = this.#performSelect(item);

      results.push(mappedItem);

      if (this.#performLimit(results)) break;
    }

    const orderedResults = this.#performOrderBy(results);

    return orderedResults;
  }
}
