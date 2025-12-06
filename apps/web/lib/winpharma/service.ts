import axios from 'axios';
import * as qs from 'qs';
import { parseStringPromise } from 'xml2js';
import iconv from 'iconv-lite';
import * as zlib from 'zlib';
import * as util from 'util';
import { ParsedXml } from './types';
import { getStockXmlRequest } from './xml';

const gzip = util.promisify(zlib.gzip);

const WIN_URL = "https://sec.winpharma.com/webpasserelle";
const WIN_LOGIN = "dessalines";
const WIN_PASSWORD = "5inS1ed6A";

// Helper: Encode XML (Gzip + Base64)
async function encodeXml(xml: string): Promise<string> {
    try {
        const buffer = await gzip(xml);
        return buffer.toString('base64');
    } catch (err) {
        console.error('Error compressing XML:', err);
        throw err;
    }
}

export async function fetchWinPharmaStock(): Promise<ParsedXml> {
    console.log('Fetching stock from WinPharma...');

    const xml = getStockXmlRequest();
    const encodedXml = await encodeXml(xml);

    const content = {
        login: WIN_LOGIN,
        password: WIN_PASSWORD,
        data: encodedXml
    };

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Connection': 'close',
            'Accept-Encoding': 'gzip'
        }
    };

    const url = `${WIN_URL}/stock/`;

    // Add small delay to avoid "Busy pharmacy" error
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const response = await axios.post(url, qs.stringify(content), {
            ...config,
            responseType: 'arraybuffer' // Important for decoding ISO-8859-1
        });

        // Decode response
        const decoded = iconv.decode(Buffer.from(response.data), 'ISO-8859-1');

        // Parse XML
        const result = await parseStringPromise(decoded);
        return result as ParsedXml;
    } catch (error: any) {
        console.error('WinPharma Fetch Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            try {
                const buffer = error.response.data;
                const decoded = iconv.decode(Buffer.from(buffer), 'ISO-8859-1');
                // Try to unzip if it looks like gzip
                if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
                    zlib.gunzip(buffer, (err, result) => {
                        if (!err) {
                            console.error('Decoded Gzip Error Body:', result.toString());
                        } else {
                            console.error('Raw Error Body:', decoded);
                        }
                    });
                } else {
                    console.error('Error Body:', decoded);
                }
            } catch (e) {
                console.error('Could not decode error body');
            }
        }
        throw error;
    }
}
