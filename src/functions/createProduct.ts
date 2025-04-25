import { response } from '../utils/response';
import { z } from 'zod';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto'
import { dynamoClient } from '../clients/dynamoClients';
import { env } from '../config/env';

const schema = z.object({
    name: z.string().min(3),
    price: z.number(),
});

export async function handler(event: APIGatewayProxyEventV2)
{
    const {success, data, error} = schema.safeParse(
        JSON.parse(event.body ?? '{}')
    );

    if (!success) {
        return response(400, {errors: error?.issues})
    }

    const {name, price} = data;
    const id = randomUUID();

    const command = new PutCommand({
        TableName: env.PRODUCTS_TABLE,
        Item: {
            id,
            name,
            price,
        }
    });

    await dynamoClient.send(command);

    return response(201, {id});
}
