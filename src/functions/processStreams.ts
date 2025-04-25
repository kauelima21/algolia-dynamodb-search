import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { AlgoliaService } from "../services/AlgoliaService";
import { env } from "../config/env";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

const productsIndex = new AlgoliaService('products', env.ALGOLIA_APP_ID, env.ALGOLIA_API_KEY);

export async function handler(event: DynamoDBStreamEvent)
{
    const upsertEvents: DynamoDBRecord['eventName'][] = ['INSERT', 'MODIFY'];

    await Promise.any(event.Records.map(async (record) => {
        if (upsertEvents.includes(record.eventName) && record.dynamodb?.NewImage) {
            const object = unmarshall(record.dynamodb.NewImage as Record<string, AttributeValue>);
            await productsIndex.upsert(object.id, object);
        }

        if (record.eventName === 'REMOVE' && record.dynamodb?.OldImage?.id.S) {
            await productsIndex.destroy(record.dynamodb.OldImage.id.S);
        }
    }));
}
