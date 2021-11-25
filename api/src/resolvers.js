const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const short = require("short-uuid");
const moment = require("moment");

const db = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const resolvers = {
  Query: {
    findUsers: async (parent, args, context, info) => {
      const command = new ScanCommand({
        TableName: "superformula_users",
        Limit: 10
      });
      const output = await db.send(command);
      return output.Items.map(({ id, name, dob, address, description, createdAt, updatedAt }) => ({
        id: id.S,
        name: name.S,
        dob: dob.S,
        address: address.S,
        description: description.S,
        createdAt: createdAt.S,
        updatedAt: updatedAt.S
      }));
    },
    showUser: async (parent, args, context, info) => {
      const command = new GetItemCommand({
        TableName: "superformula_users",
        Key: {
          id: { S: args.id }
        }
      });
      const { Item: { id, name, dob, address, description, createdAt, updatedAt } } = await db.send(command);
      return {
        id: id.S,
        name: name.S,
        dob: dob.S,
        address: address.S,
        description: description.S,
        createdAt: createdAt.S,
        updatedAt: updatedAt.S
      };
    },
    createUser: async (parent, args, context, info) => {
      const res = {
        id: short.generate(),
        name: args.name,
        dob: moment.utc(args.dob).format(),
        address: args.address,
        description: args.description,
        createdAt: moment.utc().format(),
        updatedAt: moment.utc().format()
      };
      const command = new PutItemCommand({
        TableName: "superformula_users",
        Item: {
          id: { S: res.id },
          name: { S: res.name },
          dob: { S: res.dob },
          address: { S: res.address },
          description: { S: res.description },
          createdAt: { S: res.createdAt },
          updatedAt: { S: res.updatedAt }
        }
      });
      await db.send(command);
      return res;
    },
    updateUser: async (parent, args, context, info) => {
      const terms = [];
      const names = {};
      const values = {};
      if (args.name !== undefined) {
        terms.push("#name = :name");
        names["#name"] = "name"; // name is reserved word in dynamodb, so use ExpressionAttributeNames
        values[":name"] = { S: args.name };
      }
      if (args.dob !== undefined) {
        terms.push("dob = :dob");
        values[":dob"] = { S: moment.utc(args.dob).format() };
      }
      if (args.address !== undefined) {
        terms.push("address = :address");
        values[":address"] = { S: args.address };
      }
      if (args.description !== undefined) {
        terms.push("description = :description");
        values[":description"] = { S: args.description };
      }
      const command = new UpdateItemCommand({
        TableName: "superformula_users",
        Key: {
          id: { S: args.id }
        },
        UpdateExpression: "set " + terms.join(", "),
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "UPDATED_NEW"
      });
      const output = await db.send(command);
      console.log(output.Attributes);
      const res = {
        id: args.id // required when "id" field exists in query output part
      };
      for (let key in output.Attributes) {
        res[key] = output.Attributes[key].S;
      }
      return res;
    }
  }
};

module.exports = resolvers;
