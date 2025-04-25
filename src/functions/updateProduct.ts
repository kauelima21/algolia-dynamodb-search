import { response } from '../utils/response';
import { z } from 'zod';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '../clients/dynamoClients';
import { env } from '../config/env';

const schema = z.object({
    name: z.string().min(3),
    price: z.number(),
});

export async function handler(event: APIGatewayProxyEventV2)
{
    const id = event.pathParameters?.productId;

    if (!id) {
        return response(404, {error: 'Product not found'});
    }

    const {success, data, error} = schema.safeParse(
        JSON.parse(event.body ?? '{}')
    );

    if (!success) {
        return response(400, {errors: error?.issues})
    }

    const {name, price} = data;

    const command = new UpdateCommand({
        TableName: env.PRODUCTS_TABLE,
        Key: {id},
        UpdateExpression: 'SET #name = :name, #price = :price',
        ExpressionAttributeValues: {
            ':name': name,
            ':price': price,
        },
        ExpressionAttributeNames: {
            '#name': 'name',
            '#price': 'price',
        }
    });

    await dynamoClient.send(command);

    return response(204);
}
