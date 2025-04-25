import { Algoliasearch, algoliasearch } from "algoliasearch";

export class AlgoliaService
{
    private readonly client: Algoliasearch;

    constructor(private readonly indexName: string, appId: string, apiKey: string)
    {
        this.client = algoliasearch(appId, apiKey);
    }

    async upsert(objectID: string, object: Record<string, unknown>)
    {
        await this.client.saveObject({
            indexName: this.indexName,
            body: {objectID, ...object},
        });
    }

    async destroy(objectID: string)
    {
        await this.client.deleteObject({
            indexName: this.indexName,
            objectID,
        });
    }
}
