const Flexbilling = require('../index.js');

describe('serverless-plugin-dynamodb-flexbilling', () => {
  function makeTable(props = {}) {
    return {
      Type: 'AWS::DynamoDB::Table',
      Properties: props,
    };
  }
  
  it('finds DynamoDB table resources', () => {
    const tables = [makeTable(), makeTable()];
    const subject = new Flexbilling({
      service: {
        config: {},
        provider: {},
        package: {},
        functions: {},
        resources: {
          Resources: {
            Table0: tables[0],
            Table1: tables[1],
            NotTable: {},
          }
        },
      }
    });
    
    const remainingTables = new Set(tables);
    for (var table of subject.dynamodbTables()) {
      expect(remainingTables.has(table)).toBeTruthy();
      remainingTables.delete(table);
    }
    expect(remainingTables.size).toBe(0);
  });
  
  it('finds DynamoDB table resources when "resources" is an Array', () => {
    const tables = [makeTable({marker: 0}), makeTable({marker: 1})];
    const subject = new Flexbilling({
      service: {
        resources: [
          {Resources: {Table0: tables[0]}},
          {Resources: {Table1: tables[1]}},
        ],
      }
    });
    
    const remainingTables = new Set(tables);
    for (var table of subject.dynamodbTables()) {
      expect(remainingTables.has(table)).toBeTruthy();
      remainingTables.delete(table);
    }
    expect(remainingTables).toEqual(new Set());
    expect(remainingTables.size).toBe(0);
  });
});
