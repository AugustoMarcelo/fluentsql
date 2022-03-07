import data from '../database/data.json';
import FluentSQLBuilder from './fluentSQL.js';

const result = FluentSQLBuilder.for(data)
  .where({ registered: /^(2021|2022)/ })
  .where({ category: /^(security|developer|quality assurance)$/ })
  .where({ phone: /\((84|910)\)/ })
  .select(['name', 'company', 'phone', 'category', 'registered'])
  .orderBy('category')
  .limit(2)
  .build();

console.table(result);
