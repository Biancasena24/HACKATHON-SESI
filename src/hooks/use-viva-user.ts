import { useRouteContext } from "@tanstack/react-router";

/** Signed-in user inside the protected area. */
export function useVivaUser() {
  return useRouteContext({ from: "/_authenticated" }).user;
}
