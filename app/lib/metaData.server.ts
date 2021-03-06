import type { ErrorResult, SuccessResult } from 'open-graph-scraper';
import ogs from 'open-graph-scraper';
import type { MetaData, OGMetaDataResult } from '~/types';

const isOgsSuccessResponse = (
  response: ErrorResult | SuccessResult,
): response is SuccessResult => {
  const { result, error } = response;
  return !error && !result.error;
};

export const getOGMetaData = async (
  url: string,
): Promise<OGMetaDataResult | undefined> => {
  try {
    const urlMetaData = await ogs({ url });
    if (isOgsSuccessResponse(urlMetaData)) {
      return urlMetaData.result;
    }
  } catch (e) {
    console.log(`couldn't get metadata of url: ${url}`);
  }
};

const validateImageUrl = (url: string | undefined): string | undefined => {
  if (!url || !url.startsWith('https')) return undefined;
  return url;
};

export const mapMetaData = (metaData: OGMetaDataResult): MetaData => ({
  description: metaData.ogDescription ?? '',
  imageUrl: Array.isArray(metaData?.ogImage)
    ? validateImageUrl(metaData.ogImage[0].url)
    : validateImageUrl(metaData?.ogImage?.url),
});

export const getUrlMetaData = async (
  url: string,
): Promise<MetaData | undefined> => {
  const ogMetaData = await getOGMetaData(url);
  return ogMetaData ? mapMetaData(ogMetaData) : undefined;
};
