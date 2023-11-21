const { DynamodbClient } = require('../database/connection');
const User = require('../models/user');
const { CreateTableCommand,PutItemCommand,GetItemCommand,UpdateItemCommand,DeleteItemCommand,ScanCommand  } = require ('@aws-sdk/client-dynamodb');

const tableName = 'user'

exports.createUser = async(req,res) =>{ 
    try {
        const { first_name,last_name,username,email,password,phone_number } = req.body;
        const newUser = await User.create(req.body);
        
        const addUserCommand = new PutItemCommand({
            TableName: tableName,
            Item: {
              id: { S: newUser.id },
              first_name: { S: first_name },
              last_name: { S: last_name },
              username: { S: username },
              email: { S: email },
              password: { S: password },
              phone_number: { S: phone_number },
            },
          });
       
        const rs = await DynamodbClient.send(addUserCommand);
        res.status(201).json(rs);
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Internal Server Error");
      }
}


exports.getAllUsers= async(req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).send("Internal Server Error");
    }
  }


  exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    try {
      const [updatedRowsCount, updatedUser] = await User.update(req.body, {
        where: { id: userId },
        returning: true, 
      });

      if (updatedRowsCount > 0) {
        res.status(200).json(updatedUser[0]);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send("Internal Server Error");
    }
  }


  exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedRowCount = await User.destroy({
        where: { id: userId },
      });

      if (deletedRowCount > 0) {
        res.status(204).send(); 
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  exports.getUserById = async (req, res)=> {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error getting user by ID:", error);
      res.status(500).send("Internal Server Error");
    }
  }