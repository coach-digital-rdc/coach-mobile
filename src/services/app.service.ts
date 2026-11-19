import axios from 'axios';
import {API_URL} from '@env';

export type AppVersions = {
  latest_version: string | null;
  min_version: string | null;
  download_url: string | null;
};

export const AppService = {
  // Versions published on the server (B28); undefined without connection
  getVersions: async (): Promise<AppVersions | undefined> => {
    try {
      const response = await axios.get<AppVersions>(`${API_URL}/app/version`, {
        timeout: 4000,
      });
      return response.data;
    } catch {
      return undefined;
    }
  },
};
