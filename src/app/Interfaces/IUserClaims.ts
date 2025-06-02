export interface IUserClaims { 
    id: string;    // name must match the claim name
    role: string | null;
    name: string | null;
    tokenExpDate: number| null; // Optional: If the token contains an expiration claim
    permissions: string[]| null
  }

