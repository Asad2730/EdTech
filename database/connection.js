const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { Sequelize } = require('sequelize');

exports.sequelize = new Sequelize('edtech', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres',
});



exports.DynamodbClient = new DynamoDBClient(
  {
    region: "us-east-1",
    credentials: {
      accessKeyId: `AKIASI3BBXCLV52QCQPX`,
      secretAccessKey: `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`,
    },

  }
);


