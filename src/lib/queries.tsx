import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

async function fetchAPI(endpoint: string) {
  //   const response = await fetch(`/api/db-queries/${endpoint}`);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/${endpoint}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
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
