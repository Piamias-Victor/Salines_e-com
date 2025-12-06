import * as xml2js from 'xml2js';
import { getToday } from './utils';

// Hardcoded for now as per user provided value, or could be env var
const WIN_PHARMA_NB = "202021655";

export interface BelDemandeParams {
    date: string;
    version: string;
    format: string;
}

export enum BelDemandeFormat {
    format = 'FORMAT',
    request = 'REQUEST'
}

export const getBelDemandeParams = (format: BelDemandeFormat): BelDemandeParams => {
    return {
        date: getToday(),
        version: '1.1',
        format
    };
};

export const getStockXmlRequest = (): string => {
    const data = {
        beldemande: {
            $: getBelDemandeParams(BelDemandeFormat.request),
            request: {
                $: {
                    type: 'SSTOCK',
                    num_pharma: parseInt(WIN_PHARMA_NB, 10)
                }
            }
        }
    };

    const builder = new xml2js.Builder({
        renderOpts: { 'pretty': false },
        headless: false,
        cdata: true,
        xmldec: { 'version': '1.0', 'encoding': 'UTF-8' }
    });
    return builder.buildObject(data);
};
