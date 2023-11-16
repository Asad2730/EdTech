const  { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { Sequelize } = require('sequelize');

exports.sequelize = new Sequelize('edtech', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres',
});



exports.dynamodbClient = new DynamoDBClient({ region: 'your-region' });
