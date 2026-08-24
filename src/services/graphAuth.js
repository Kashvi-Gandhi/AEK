import config from "../config/welcome_config";


/*
 * Cache the Microsoft Graph token in memory.
 *
 * This prevents us requesting a new token for every Graph call.
 */
let cachedToken = null;
let tokenExpires = 0;


/*
 * ============================================================
 * getGraphToken()
 * ============================================================
 *
 * Gets an application access token from Microsoft Entra.
 *
 * NOTE:
 * Client credentials in browser JavaScript is being used ONLY
 * because this is a tightly controlled disposable POC.
 */
export async function getGraphToken() {

  /*
   * Return cached token when it is still valid.
   */
  if (
    cachedToken &&
    Date.now() < tokenExpires
  ) {

    console.log(
      "[AUTH] Using cached Microsoft Graph token"
    );

    return cachedToken;
  }


  console.log(
    "[AUTH] Requesting Microsoft Graph token..."
  );


  const tokenUrl =
    `https://login.microsoftonline.com/` +
    `${config.tenantId}/oauth2/v2.0/token`;


  const body = new URLSearchParams();

  body.append(
    "client_id",
    config.clientId
  );

  body.append(
    "client_secret",
    config.clientSecret
  );

  body.append(
    "scope",
    "https://graph.microsoft.com/.default"
  );

  body.append(
    "grant_type",
    "client_credentials"
  );


  try {

    const response = await fetch(
      tokenUrl,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },

        body: body.toString()
      }
    );


    console.log(
      "[AUTH] Token HTTP status:",
      response.status
    );


    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "[AUTH] Microsoft authentication error:",
        errorText
      );

      throw new Error(
        `Microsoft authentication failed. HTTP ${response.status}`
      );
    }


    const result =
      await response.json();


    if (!result.access_token) {

      throw new Error(
        "Microsoft did not return an access token."
      );
    }


    cachedToken =
      result.access_token;


    /*
     * Expire our cached copy 60 seconds before
     * Microsoft says the token expires.
     */
    tokenExpires =
      Date.now() +
      ((result.expires_in - 60) * 1000);


    console.log(
      "[AUTH] Microsoft Graph authentication successful"
    );


    /*
     * NEVER console.log the actual access token.
     */
    return cachedToken;

  } catch (error) {

    console.error(
      "[AUTH] Authentication failed:",
      error
    );

    throw error;
  }
}