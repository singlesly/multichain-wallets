export interface ApplicationResponse {
  id: string;
  name: string;
  authId: string;

  secretKey?: string;

  owner: {
    id?: string;
    address?: string;
  };
}
