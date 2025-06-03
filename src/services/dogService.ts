
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}

export interface SearchResult {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface Match {
  match: string;
}

export const dogService = {
  async getBreeds(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch breeds: ${response.status}`);
    }

    return response.json();
  },

  async searchDogs(params: SearchParams): Promise<SearchResult> {
    const queryParams = new URLSearchParams();
    
    if (params.breeds?.length) {
      params.breeds.forEach(breed => queryParams.append('breeds', breed));
    }
    if (params.zipCodes?.length) {
      params.zipCodes.forEach(zip => queryParams.append('zipCodes', zip));
    }
    if (params.ageMin !== undefined) {
      queryParams.append('ageMin', params.ageMin.toString());
    }
    if (params.ageMax !== undefined) {
      queryParams.append('ageMax', params.ageMax.toString());
    }
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }
    if (params.from) {
      queryParams.append('from', params.from);
    }
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }

    const response = await fetch(`${API_BASE_URL}/dogs/search?${queryParams}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to search dogs: ${response.status}`);
    }

    return response.json();
  },

  async getDogs(ids: string[]): Promise<Dog[]> {
    const response = await fetch(`${API_BASE_URL}/dogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dogs: ${response.status}`);
    }

    return response.json();
  },

  async getMatch(dogIds: string[]): Promise<Match> {
    const response = await fetch(`${API_BASE_URL}/dogs/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dogIds),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get match: ${response.status}`);
    }

    return response.json();
  },
};
