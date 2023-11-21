const express = require('express')
const { sequelize, DynamodbClient } = require('./database/connection');
const userRouter = require('./routes/user');
const { CreateTableCommand,DescribeTableCommand } = require ('@aws-sdk/client-dynamodb');

const app = express()
const PORT = 3000;

sequelize.sync()
  .then(() => {
     console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });


  const tableName = 'user'

  async function tableExists(tableName) {
    try {
      await DynamodbClient.send(new DescribeTableCommand({ TableName: tableName }));
      return true; 
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        return false; 
      }
      console.log('error--->>>>',error)
      throw error; 
    }
  }
  
  async function createTableIfNotExists() {
    if (!(await tableExists(tableName))) {
     
      const createTableCommand = new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'N' }, 
          { AttributeName: 'first_name', AttributeType: 'S' }, 
          { AttributeName: 'last_name', AttributeType: 'S' }, 
          { AttributeName: 'username', AttributeType: 'S' }, 
          { AttributeName: 'email', AttributeType: 'S' }, 
          { AttributeName: 'password', AttributeType: 'S' }, 
          { AttributeName: 'phone_number', AttributeType: 'S' }, 
        ],
        KeySchema: [
          { AttributeName: 'id', KeyType: 'HASH' }, // id is pk
          // { AttributeName: 'first_name', KeyType: 'RANGE' },
          // { AttributeName: 'last_name', KeyType: 'RANGE' },
          // { AttributeName: 'email', KeyType: 'RANGE' },
          // { AttributeName: 'username', KeyType: 'RANGE' },
          // { AttributeName: 'password', KeyType: 'RANGE' },
          // { AttributeName: 'phone_number', KeyType: 'RANGE' },
       
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      });
  
      await DynamodbClient.send(createTableCommand);
      console.log(`Table ${tableName} created successfully.`);
    } else {
      console.log(`Table ${tableName} already exists.`);
    }
  }
  
  
//createTableIfNotExists(); 

app.use(express.json())
app.use('/api/users', userRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });