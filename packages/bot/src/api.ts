import axios from 'axios';
import { WakaTimeAPIKey } from './env';

const base64ApiKey = Buffer.from(WakaTimeAPIKey).toString('base64');

const api = axios.create({
  baseURL: 'https://wakatime.com/api/v1',
  headers: { Authorization: `Basic ${base64ApiKey}` },
});

export { api };
