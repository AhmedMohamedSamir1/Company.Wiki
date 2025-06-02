export function toQueryString<T extends Record<string, any>>(params: T): string {
    const queryParts: string[] = [];
  
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
        const value = encodeURIComponent(params[key].toString());
        queryParts.push(`${encodeURIComponent(key)}=${value}`);
      }
    }
  
    return queryParts.join("&");
  }
  