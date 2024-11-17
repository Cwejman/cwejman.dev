export type Imported<V> = { default: V };
export type Dir<V> = Record<string, () => Promise<Imported<V>>>;

export const resolveDir = async <V>(
  dir: Dir<V>,
  fileType: string,
): Promise<[key: string, value: V][]> =>
  await Promise.all(
    Object.entries(dir).map(async ([path, resolver]) => [
      path.split('/').pop()?.replace(fileType, '') ?? 'N/A',
      (await resolver()).default,
    ]),
  );
