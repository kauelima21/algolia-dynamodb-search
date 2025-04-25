import { Algoliasearch, algoliasearch } from "algoliasearch";

export class AlgoliaService
{
    private readonly client: Algoliasearch;

    constructor(private readonly indexName: string, appId: string, apiKey: string)
    {
        this.client = algoliasearch(appId, apiKey);
    }

    async search(query: string) {
        const { hits } = await this.client.searchSingleIndex({
            indexName: this.indexName,
            searchParams: {
                query,
            },
        });

        return hits;
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
