import { response } from '../utils/response';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { env } from '../config/env';
import { AlgoliaService } from "../services/AlgoliaService";

export async function handler(event: APIGatewayProxyEventV2)
{
    const query = event.queryStringParameters?.query;

    if (!query) {
        return response(404, {error: 'Search term is required!'});
    }

    const productsIndex = new AlgoliaService('products', env.ALGOLIA_APP_ID, env.ALGOLIA_API_KEY);
    const data = await productsIndex.search(query);

    return response(200, { data });
}
