import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!projectId) return null;
  if (!_client) {
    _client = createClient({ projectId, dataset, apiVersion, useCdn: true });
  }
  return _client;
}

export const client = {
  fetch: async <T>(query: string, params?: QueryParams): Promise<T> => {
    const c = getClient();
    if (!c) return ([] as unknown) as T;
    return params ? c.fetch<T>(query, params) : c.fetch<T>(query);
  },
};
