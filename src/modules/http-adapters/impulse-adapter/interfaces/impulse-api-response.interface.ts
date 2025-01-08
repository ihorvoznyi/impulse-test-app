export interface IImpulseApiResponse {
  timestamp: string;
  data: {
    csv: string;
    pagination: {
      next: string;
    };
  };
}
