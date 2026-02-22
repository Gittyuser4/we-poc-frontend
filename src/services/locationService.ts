const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface District {
  id: number;
  name: string;
  code: string;
}

export interface RevenueDivision {
  id: number;
  division_code: string;
  division_name: string;
}

export interface Mandal {
  id: number;
  mandal_code: string;
  mandal_name: string;
  local_name: string;
  is_municipality: boolean;
}

export interface Village {
  id: number;
  village_code: string;
  village_name: string;
  local_name: string;
}

export interface LocationResponse<T> {
  data: T[];
  message: string;
}

class LocationService {
  /**
   * Fetch all districts
   */
  async getDistricts(language: 'en' | 'te' = 'en'): Promise<District[]> {
    try {
      const url = `${API_BASE_URL}/api/locations/districts/?lang=${language}`;
      console.log('Fetching districts from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // console.log('Districts response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Districts API error:', errorText);
        throw new Error(`Failed to fetch districts: ${response.statusText}`);
      }

      const result: LocationResponse<District> = await response.json();
      // console.log('Districts API result:', result);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  }

  /**
   * Fetch revenue divisions by district ID
   */
  async getRevenueDivisions(districtId: number, language: 'en' | 'te' = 'en'): Promise<RevenueDivision[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/locations/divisions/?district_id=${districtId}&lang=${language}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch revenue divisions: ${response.statusText}`);
      }

      const result: LocationResponse<RevenueDivision> = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching revenue divisions:', error);
      return [];
    }
  }

  /**
   * Fetch mandals by revenue division ID
   */
  async getMandals(divisionId: number, language: 'en' | 'te' = 'en'): Promise<Mandal[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/locations/mandals/?division_id=${divisionId}&lang=${language}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch mandals: ${response.statusText}`);
      }

      const result: LocationResponse<Mandal> = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching mandals:', error);
      return [];
    }
  }

  /**
   * Fetch villages by mandal ID
   */
  async getVillages(mandalId: number, language: 'en' | 'te' = 'en'): Promise<Village[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/locations/villages/?mandal_id=${mandalId}&lang=${language}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch villages: ${response.statusText}`);
      }

      const result: LocationResponse<Village> = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching villages:', error);
      return [];
    }
  }
}

export const locationService = new LocationService();
