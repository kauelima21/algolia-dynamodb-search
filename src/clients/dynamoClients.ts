import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient());
