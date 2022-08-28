import { useQuery, QueryOptions } from "@tanstack/react-query";
import { FetchClientProfile, fetchClientProfile } from "../../api/clientApi";

export const useClientProfileQuery = (
  { clientId }: { clientId: string | number },
  queryOpts?: QueryOptions<FetchClientProfile>
) => {
  return useQuery(["client", "profile"], () => fetchClientProfile({ clientId }), queryOpts);
};