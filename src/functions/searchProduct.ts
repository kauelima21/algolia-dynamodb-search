import { response } from '../utils/response';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { env } from '../config/env';
import { AlgoliaService } from "../services/AlgoliaService";
import { z } from 'zod';

const schema = z.object({
    query: z.string().min(1),
    page: z.coerce.number().min(1).optional().default(1),
    perPage: z.coerce.number().min(2).max(10).optional().default(10),
});

export async function handler(event: APIGatewayProxyEventV2)
{
    const { success, data, error } = schema.safeParse(event.queryStringParameters);

    if (!success) {
        return response(400, { errors: error?.issues })
    }

    const { query, page, perPage } = data;

    const productsIndex = new AlgoliaService('products', env.ALGOLIA_APP_ID, env.ALGOLIA_API_KEY);
    const searchResult = await productsIndex.search({
        query,
        page: page - 1,
        perPage
    });

    return response(200, searchResult);
}
