import { response } from '../utils/response';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient } from '../clients/dynamoClients';
import { env } from '../config/env';

export async function handler(event: APIGatewayProxyEventV2)
{
    const id = event.pathParameters?.productId;

    if (!id) {
        return response(404, {error: 'Product not found'});
    }

    const command = new DeleteCommand({
        TableName: env.PRODUCTS_TABLE,
        Key: {id},
    });

    await dynamoClient.send(command);

    return response(204);
}
