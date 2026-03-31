export const buildIconProxyUrl = (pageId?: string): string => {
  if (!pageId) {
    return '/api/icon';
  }

  return `/api/icon?pageId=${encodeURIComponent(pageId)}`;
};

export const getIconUrl = async (pageId?: string) => {
  const icon = await fetch(buildIconProxyUrl(pageId)).then(res => res.text());
  return icon ?? '/icon.svg';
};
