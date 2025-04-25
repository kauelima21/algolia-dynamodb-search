import { APIGatewayProxyResultV2 } from 'aws-lambda';

export function response(
    statusCode: number,
    body?: Record<string, unknown>
): APIGatewayProxyResultV2
{
    return {
        statusCode,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            'Content-Type': 'application/json',
        }
    }
}
