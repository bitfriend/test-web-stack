"use strict";

require("dotenv").config();
const short = require("short-uuid");
const faker = require("faker");
const moment = require("moment");

const {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  ListTablesCommand,
  PutItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function deleteTable() {
  try {
    const data = await client.send(new ListTablesCommand({}));
    if (data.TableNames.includes("superformula_users")) {
      const command = new DeleteTableCommand({
        TableName: "superformula_users"
      });
      await client.send(command);
    }
  } catch (e) {
    console.log(e);
  }
}

async function createTable() {
  try {
    const command = new CreateTableCommand({
      TableName: "superformula_users",
      AttributeDefinitions: [{
        AttributeName: "id",
        AttributeType: "S"
      }],
      KeySchema: [{
        AttributeName: "id",
        KeyType: "HASH"
      }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      StreamSpecification: {
        StreamEnabled: false
      }
    });
    await client.send(command);
  } catch (e) {
    console.log(e);
  }
}

async function writeRecords() {
  for (let i = 0; i < 40; i++) {
    const dob = faker.date.past(10, new Date(2001, 0, 1)); // 1991 ~ 2000
    const createdAt = faker.date.past(10, new Date(2001, 0, 1)); // 1991 ~ 2000
    const updatedAt = faker.date.past(10, new Date(2001, 0, 1)); // 1991 ~ 2000

    try {
      const command = new PutItemCommand({
        TableName: "superformula_users",
        Item: marshall({
          id: short.generate(),
          name: faker.name.findName(),
          dob: moment.utc(dob).format(),
          address: `${faker.address.city()} ${faker.address.state()} ${faker.address.zipCode()}`,
          description: faker.lorem.sentence(10),
          createdAt: moment.utc(createdAt).format(),
          updatedAt: moment.utc(updatedAt).format()
        })
      });
      await client.send(command);
    } catch (e) {
      console.log(e);
    }
  }
}

const delay = (miliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, miliseconds);
  });
}

(async () => {
  await deleteTable();
  await delay(2000); // avoid failure in creating
  await createTable();
  await delay(6000); // avoid failure in writing
  await writeRecords();
})();
