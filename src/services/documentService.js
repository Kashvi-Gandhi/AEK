// import config from "../config/welcome_config";

// export async function getParticipantType(contactId = config.CONTACT_ID) {
//   const url = `${config.PROXY_URL}/welcome-pack/user-details?contactID=${encodeURIComponent(contactId)}`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Accept": "application/json"
//     }
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Failed to fetch user attributes");
//   }

//   const participantType = result?.applicationList?.[0]?.ParticipantType;

//   if (!participantType) {
//     throw new Error("ParticipantType not found in response.");
//   }

//   return participantType;
// }

// /**
//  * Fetches document metadata (availability, name, size) from proxy
//  */
// export async function getWelcomePackInfo(
//   campus = config.DEFAULT_CAMPUS,
//   documentType = config.DEFAULT_DOC_TYPE
// ) {
//   const params = new URLSearchParams({ campus, documentType });
//   const url = `${config.PROXY_URL}/welcome-pack/info?${params.toString()}`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Accept": "application/json"
//     }
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || result.error || "Failed to load document info");
//   }

//   return result;
// }

// /**
//  * Fetches PDF binary ArrayBuffer stream from proxy
//  */
// export async function getWelcomePackContent(
//   campus = config.DEFAULT_CAMPUS,
//   documentType = config.DEFAULT_DOC_TYPE
// ) {
//   const params = new URLSearchParams({ campus, documentType });
//   const url = `${config.PROXY_URL}/welcome-pack/content?${params.toString()}`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Accept": "application/pdf"
//     }
//   });

//   if (!response.ok) {
//     let message = "Unable to download document content.";
//     try {
//       const errorJson = await response.json();
//       if (errorJson.message) message = errorJson.message;
//     } catch (e) {
//       /* ignore non-json errors */
//     }
//     throw new Error(message);
//   }

//   return response.arrayBuffer();
// }













 



import config from "../config/welcome_config";
import { request } from "@ombiel/aek-lib";

/**
 * Gets the participant type / campus from the AEK server.
 *
 * React does NOT send the contact ID.
 *
 * The AEK .ect file gets the contact ID directly
 * from CMAuth and uses it to call Azure.
 */
export async function getParticipantType() {
  return new Promise((resolve, reject) => {
    request
      .action("getParticipantType")
      .end((err, response) => {
        if (err) {
          reject(
            new Error(
              err.message || "Failed to fetch user attributes"
            )
          );
          return;
        }

        const result = response && response.body;

        if (!result) {
          reject(
            new Error("Empty response received from server.")
          );
          return;
        }

        const participantType =
          result?.applicationList?.[0]?.ParticipantType;

        if (!participantType) {
          reject(
            new Error("ParticipantType not found in response.")
          );
          return;
        }

        resolve(participantType);
      });
  });
}


/**
 * Gets Welcome Pack information from the AEK server.
 *
 * Temporary version:
 * campus and document type are still handled
 * server-side in the .ect file.
 */
export async function getWelcomePackInfo() {
  return new Promise((resolve, reject) => {
    request
      .action("getWelcomePackInfo")
      .end((err, response) => {
        if (err) {
          reject(
            new Error(
              err.message ||
                "Failed to load document info"
            )
          );
          return;
        }

        const result = response && response.body;

        if (!result) {
          reject(
            new Error("Empty response received from server.")
          );
          return;
        }

        resolve(result);
      });
  });
}


/**
 * Gets the Welcome Pack PDF from the AEK server.
 *
 * We will test this after the user-details
 * and document-info flows are working.
 */
export async function getWelcomePackContent() {
  return new Promise((resolve, reject) => {
    request
      .action("getWelcomePackContent")
      .end((err, response) => {
        if (err) {
          reject(
            new Error(
              err.message ||
                "Unable to download document content."
            )
          );
          return;
        }

        if (!response || !response.body) {
          reject(
            new Error(
              "No document content was returned by the server."
            )
          );
          return;
        }

        resolve(response.body);
      });
  });
}