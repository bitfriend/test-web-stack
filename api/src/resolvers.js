const {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const short = require("short-uuid");
const moment = require("moment");

const resolvers = {
  Query: {
    findUsers: async (parent, args, context, info) => {
      const { dynamo } = context.dataSources;
      const input = {
        TableName: "superformula_users",
        Limit: args.limit || 10
      };
      const result = {
        totalItems: 0
      };
      const exclusiveStartKeys = [];
      // calculate starting keys by page and total item count
      while (true) {
        const command = new ScanCommand(input);
        const output = await dynamo.send(command);
        result.totalItems += output.Count;
        if (!output.LastEvaluatedKey) {
          break;
        }
        input.ExclusiveStartKey = output.LastEvaluatedKey;
        exclusiveStartKeys.push(unmarshall(input.ExclusiveStartKey).id);
      }
      // read the records of requested page
      if (!!args.search) {
        input.FilterExpression = "contains(#name, :name)";
        input.ExpressionAttributeNames = {
          "#name": "name"
        };
        input.ExpressionAttributeValues = marshall({
          ":name": args.search
        });
      }
      const page = args.page || 0;
      if (page === 0) {
        delete input.ExclusiveStartKey;
        const command = new ScanCommand(input);
        const output = await dynamo.send(command);
        result.items = output.Items.map(item => unmarshall(item));
      } else {
        input.ExclusiveStartKey = marshall({
          id: exclusiveStartKeys[page - 1]
        });
        const command = new ScanCommand(input);
        const output = await dynamo.send(command);
        result.items = output.Items.map(item => unmarshall(item));
      }
      return result;
    },
    showUser: async (parent, args, context, info) => {
      const { dynamo } = context.dataSources;
      const command = new GetItemCommand({
        TableName: "superformula_users",
        Key: marshall({
          id: args.id
        })
      });
      const res = await dynamo.send(command);
      if (!res.Item) {
        return null;
      }
      return unmarshall(res.Item);
    }
  },
  Mutation: {
    createUser: async (parent, args, context, info) => {
      const { dynamo } = context.dataSources;
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
        Item: marshall(res)
      });
      await dynamo.send(command);
      return res;
    },
    updateUser: async (parent, args, context, info) => {
      const { dynamo } = context.dataSources;
      const terms = [];
      const names = {};
      const values = {};
      if (args.name !== undefined) {
        terms.push("#name = :name");
        names["#name"] = "name"; // name is reserved word in dynamodb, so use ExpressionAttributeNames
        values[":name"] = args.name;
      }
      if (args.dob !== undefined) {
        terms.push("#dob = :dob");
        names["#dob"] = "dob"; // avoid this error "ExpressionAttributeNames must not be empty" from apollo client
        values[":dob"] = moment.utc(args.dob).format();
      }
      if (args.address !== undefined) {
        terms.push("#address = :address");
        names["#address"] = "address"; // avoid this error "ExpressionAttributeNames must not be empty" from apollo client
        values[":address"] = args.address;
      }
      if (args.description !== undefined) {
        terms.push("#description = :description");
        names["#description"] = "description"; // avoid this error "ExpressionAttributeNames must not be empty" from apollo client
        values[":description"] = args.description;
      }
      if (terms.length > 0) {
        terms.push("#updatedAt = :updatedAt");
        names["#updatedAt"] = "updatedAt"; // avoid this error "ExpressionAttributeNames must not be empty" from apollo client
        values[":updatedAt"] = moment.utc().format();
      }
      const command = new UpdateItemCommand({
        TableName: "superformula_users",
        Key: marshall({
          id: args.id
        }),
        UpdateExpression: "set " + terms.join(", "),
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: marshall(values),
        ReturnValues: "UPDATED_NEW"
      });
      const output = await dynamo.send(command);
      const res = unmarshall(output.Attributes);
      res.id = args.id; // required when "id" field exists in query output part
      return res;
    },
    deleteUser: async (parent, args, context, info) => {
      const { dataSources, request, h } = context;
      const command = new DeleteItemCommand({
        TableName: "superformula_users",
        Key: marshall({
          id: args.id
        })
      });
      await dataSources.dynamo.send(command);
      return {
        id: args.id
      };
    }
  }
};

module.exports = resolvers;
