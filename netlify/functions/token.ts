import { builder, type Handler } from "@netlify/functions";

import { getAccessTokenHandler } from "../../helpers/getAccessTokenHandler";

const tokenHandler: Handler = async (event, ctx) => {
  const requestParams = new URLSearchParams(event.rawQuery);

  const requestClientIds = requestParams.getAll("client_id");
  const requestBookingTypes = requestParams.getAll("reference_type");
  const requestBookingIds = requestParams.getAll("reference_id");
  const requestIp = event.headers["x-nf-client-connection-ip"] ?? event.headers["client-ip"];

  return await getAccessTokenHandler({
    qa: false,
    clientIdSet: requestClientIds,
    referenceTypeSet: requestBookingTypes,
    referenceIdSet: requestBookingIds,
    requestIp,
  });
};

const handler = builder(tokenHandler);

export { handler };
