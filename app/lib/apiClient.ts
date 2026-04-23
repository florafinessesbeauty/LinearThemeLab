import { ApiClient } from "@linearthemelab/shared";

export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
});
