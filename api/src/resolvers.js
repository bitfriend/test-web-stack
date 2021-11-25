const { GetItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const db = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const resolvers = {
  Query: {
    users: async (parent, args, context, info) => {
      const command = new ScanCommand({
        TableName: "superformula_users",
        Limit: 10
      });
      try {
        const res = await db.send(command);
        return res.Items.map(item => ({
          id: item.id.S,
          name: item.name.S,
          dob: item.dob.S,
          address: item.address.S,
          description: item.description.S,
          createdAt: item.createdAt.S,
          updatedAt: item.updatedAt.S
        }));
      } catch (e) {
        console.log(e);
      }
    },
    user: async (parent, args, context, info) => {
      const command = new GetItemCommand({
        TableName: "superformula_users",
        Key: {
          id: {
            S: args.id
          }
        }
      });
      try {
        const res = await db.send(command);
        return {
          id: res.Item.id.S,
          name: res.Item.name.S,
          dob: res.Item.dob.S,
          address: res.Item.address.S,
          description: res.Item.description.S,
          createdAt: res.Item.createdAt.S,
          updatedAt: res.Item.updatedAt.S
        };
      } catch (e) {
        console.log(e);
      }
    }
  }
};

module.exports = resolvers;
