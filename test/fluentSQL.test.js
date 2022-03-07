import { expect, describe, test } from '@jest/globals';
import FluentSQlBuilder from '../src/fluentSQL';

const data = [
  {
    id: 0,
    name: 'marceloaugusto',
    category: 'developer',
  },
  {
    id: 1,
    name: 'bananinha',
    category: 'developer',
  },
  {
    id: 2,
    name: 'laranjinha',
    category: 'security',
  },
];

describe('Test suite for FluentSQl Builder', () => {
  test('#for should return a FLuentSQLBuilder instance', () => {
    const result = FluentSQlBuilder.for(data);
    const expected = new FluentSQlBuilder({ database: data });
    expect(result).toStrictEqual(expected);
  });

  test('#build should return the empty object instance', () => {
    const result = FluentSQlBuilder.for(data).build();
    const expected = data;
    expect(result).toStrictEqual(expected);
  });

  test('#limit given a collection it should limit results', () => {
    const result = FluentSQlBuilder.for(data).limit(1).build();
    const expected = [data[0]];
    expect(result).toStrictEqual(expected);
  });

  test('#where given a collection it should filter data', () => {
    const result = FluentSQlBuilder.for(data)
      .where({
        category: /^dev/,
      })
      .build();
    const expected = data.filter(
      ({ category }) => category.slice(0, 3) === 'dev'
    );
    expect(result).toStrictEqual(expected);
  });

  test('#select given a collection it should return only specific fields', () => {
    const result = FluentSQlBuilder.for(data)
      .select(['name', 'category'])
      .build();
    const expected = data.map(({ name, category }) => ({ name, category }));
    expect(result).toStrictEqual(expected);
  });

  test('#orderBy given a collection it should order results by field', () => {
    const result = FluentSQlBuilder.for(data).orderBy('name').build();
    const expected = [
      {
        id: 1,
        name: 'bananinha',
        category: 'developer',
      },
      {
        id: 2,
        name: 'laranjinha',
        category: 'security',
      },
      {
        id: 0,
        name: 'marceloaugusto',
        category: 'developer',
      },
    ];
    expect(result).toStrictEqual(expected);
  });

  test('pipeline', () => {
    const result = FluentSQlBuilder.for(data)
      .where({ category: 'developer' })
      .where({ name: /m/ })
      .select(['name', 'id'])
      .orderBy('id')
      .build();

    const expected = data
      .filter(({ id }) => id === 0)
      .map(({ id, name }) => ({ id, name }));
    expect(result).toStrictEqual(expected);
  });
});
