export function parseArgs(args: string = ''): Record<string, string> {
  return args.split('&').reduce(
    (acc, pair) => {
      const [key, value] = pair.split('=');
      if (key) {
        acc[key] = value || '';
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}
