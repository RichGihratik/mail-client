export type NameLoaderData = {
  name: string;
};

export function isValidNameLoaderData(data: unknown): data is NameLoaderData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    typeof data.name === 'string'
  );
}
