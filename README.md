# Billing Mode Flexibility for DynamoDB Tables in Serverless Framework

This plugin solves AWS CloudFormation's insistence the `ProvisionedThroughput` property *not* be present on any DynamoDB table resource if that table is declared with `BillingMode` of `PAY_PER_REQUEST`.  This is accomplished by taking the value of `BillingMode` (defaulting to `PROVISIONED` like CloudFormation) as canonical and removing the `ProvisionedThroughput` property if the table is pay-per-request.
