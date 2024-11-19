import { useSuspenseQuery } from "@tanstack/react-query";

async function fetchAPI(endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  if (process.env.NODE_ENV === "development") {
    console.log(new Date().toLocaleTimeString(), " - queries.ts - Fetching API:", `${baseUrl}/api/${endpoint}`);
  }
  try {
    const response = await fetch(`${baseUrl}/api/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        purpose: "prefetch",
      },
      credentials: "include",
      mode: "cors",
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(new Date().toLocaleTimeString() + " - queries.ts - Unauthorized");
      }
      const errorText = await response.text();
      console.error(new Date().toLocaleTimeString(), " - queries.ts - API Error Response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (process.env.NODE_ENV === "development") {
      console.log(new Date().toLocaleTimeString(), " - queries.ts - Content Type:", contentType);
    }
    return await response.json();
  } catch (error) {
    console.error(new Date().toLocaleTimeString(), " - queries.ts - API Error:", error);
    throw error;
  }
}

export function useAddressOverview() {
  return useSuspenseQuery({
    queryKey: ["addressOverview"],
    queryFn: () => fetchAPI("address-overview"),
  });
}

export function useSiteOverview() {
  return useSuspenseQuery({
    queryKey: ["siteOverview"],
    queryFn: () => fetchAPI("site-overview"),
  });
}

export function useAddressInfo() {
  return useSuspenseQuery({
    queryKey: ["addressInfo"],
    queryFn: () => fetchAPI("address-info"),
  });
}

export function useTargetActualDifference() {
  return useSuspenseQuery({
    queryKey: ["targetActual"],
    queryFn: () => fetchAPI("target-actual-difference"),
  });
}

export function useSamplingRoundStatus() {
  return useSuspenseQuery({
    queryKey: ["samplingStatus"],
    queryFn: () => fetchAPI("sampling-round-status"),
  });
}

export function useDashboardStats() {
  return useSuspenseQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => fetchAPI("dashboard-stats"),
  });
}

export function useGetUsers() {
  return useSuspenseQuery({
    queryKey: ["getUsers"],
    queryFn: () => fetchAPI("get-users"),
  });
}
