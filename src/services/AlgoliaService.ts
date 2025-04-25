import { Algoliasearch, algoliasearch } from "algoliasearch";

interface ISearchParams {
    query: string
    page: number
    perPage: number
}

export class AlgoliaService
{
    private readonly client: Algoliasearch;

    constructor(private readonly indexName: string, appId: string, apiKey: string)
    {
        this.client = algoliasearch(appId, apiKey);
    }

    async search({ query, page, perPage }: ISearchParams) {
        const { hits, nbHits, nbPages } = await this.client.searchSingleIndex({
            indexName: this.indexName,
            searchParams: {
                query,
                page,
                hitsPerPage: perPage,
            },
        });

        return {
            results: hits,
            totalItems: nbHits,
            totalPages: nbPages
        };
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
