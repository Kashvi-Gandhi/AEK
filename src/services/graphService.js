import {
  getGraphToken
} from "./graphAuth";


const GRAPH_ROOT =
  "https://graph.microsoft.com/v1.0";


/*
 * ============================================================
 * graphGet()
 * ============================================================
 *
 * Performs an authenticated GET request against
 * Microsoft Graph.
 *
 * Parameter:
 *   path
 *
 * Example:
 *   /sites/{siteId}/lists
 */
export async function graphGet(path) {

  const token =
    await getGraphToken();


  const url =
    path.startsWith("http")
      ? path
      : `${GRAPH_ROOT}${path}`;


  console.log(
    "[GRAPH] GET:",
    url
  );


  const response =
    await fetch(
      url,
      {
        method: "GET",

        headers: {
          "Authorization":
            `Bearer ${token}`,

          "Accept":
            "application/json"
        }
      }
    );


  console.log(
    "[GRAPH] HTTP status:",
    response.status
  );


  if (!response.ok) {

    let errorText = "";

    try {

      errorText =
        await response.text();

    } catch (e) {

      errorText =
        "Unable to read Graph error response";
    }


    console.error(
      "[GRAPH] Request failed:",
      errorText
    );


    throw new Error(
      `Microsoft Graph request failed. HTTP ${response.status}`
    );
  }


  return response;
}


/*
 * ============================================================
 * graphGetJson()
 * ============================================================
 *
 * Convenience function when we know Graph will return JSON.
 */
export async function graphGetJson(path) {

  const response =
    await graphGet(path);

  return response.json();
}