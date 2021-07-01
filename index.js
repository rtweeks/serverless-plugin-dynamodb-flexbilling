'use strict';

class ServerlessPluginDynamodbFlexbilling {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    // this.commands = {
    //   welcome: {
    //     usage: 'Helps you start your first Serverless plugin',
    //     lifecycleEvents: ['hello', 'world'],
    //     options: {
    //       message: {
    //         usage:
    //           'Specify the message you want to deploy ' +
    //           '(e.g. "--message \'My Message\'" or "-m \'My Message\'")',
    //         required: true,
    //         shortcut: 'm',
    //       },
    //     },
    //   },
    // };

    this.hooks = {
      'before:print:print': this.fixResources.bind(this),
      'before:package:initialize': this.fixResources.bind(this),
      'before:remove:remove': this.fixResources.bind(this),
      'before:offline:start:init': this.fixResources.bind(this),
      'before:offline:start': this.fixResources.bind(this),
    };
    
    this.pluginName = 'serverless-plugin-dynamodb-flexbilling';
  }

  // beforeWelcome() {
  //   this.serverless.cli.log('Hello from Serverless!');
  // }
  
  fixResources() {
    for (let tableDef of this.dynamodbTables()) {
      const tableProps = tableDef.Properties;
      if (!tableProps) continue;
      if (tableProps.BillingMode === 'PAY_PER_REQUEST') {
        delete tableProps.ProvisionedThroughput;
        for (var gsi of (tableProps.GlobalSecondaryIndexes || [])) {
          delete gsi.ProvisionedThroughput;
        }
      }
    }
  }
  
  *dynamodbTables() {
    const slsResources = this.serverless.service.resources;
    const resources = (
      Array.isArray(slsResources)
      ? Object.assign({}, ...slsResources.map(
        slsResGroup => (slsResGroup.Resources || {})
      ))
      : slsResources.Resources || {}
    );
    for (let resourceDef of Object.values(resources)) {
      if (resourceDef.Type === 'AWS::DynamoDB::Table') {
        yield resourceDef;
      }
    }
  }
}

module.exports = ServerlessPluginDynamodbFlexbilling;
