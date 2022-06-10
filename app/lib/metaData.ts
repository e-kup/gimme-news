import ogs, { ErrorResult, SuccessResult } from 'open-graph-scraper';
import { MetaData, OGMetaDataResult } from '~/types';

const isOgsSuccessResponse = (
  response: ErrorResult | SuccessResult,
): response is SuccessResult => {
  const { result, error } = response;
  return !error && !result.error;
};

export const getOGMetaData = async (
  url: string,
): Promise<OGMetaDataResult | undefined> => {
  const urlMetaData = await ogs({ url });
  if (isOgsSuccessResponse(urlMetaData)) {
    return urlMetaData.result;
  }
  console.log(`couldn't get metadata of url: ${url}`);
};

export const mapMetaData = (metaData: OGMetaDataResult): MetaData => ({
  description: metaData.ogDescription ?? '',
  imageUrl: Array.isArray(metaData?.ogImage)
    ? metaData.ogImage[0].url
    : metaData?.ogImage?.url,
});

export const getUrlMetaData = async (
  url: string,
): Promise<MetaData | undefined> => {
  const ogMetaData = await getOGMetaData(url);
  return ogMetaData ? mapMetaData(ogMetaData) : undefined;
};
