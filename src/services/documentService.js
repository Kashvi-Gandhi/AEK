import config from "../config/welcome_config";

/**
 * Fetches document metadata (availability, name, size) from proxy
 */
export async function getWelcomePackInfo(
  campus = config.DEFAULT_CAMPUS,
  documentType = config.DEFAULT_DOC_TYPE
) {
  const params = new URLSearchParams({ campus, documentType });
  const url = `${config.PROXY_URL}/welcome-pack/info?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || result.error || "Failed to load document info");
  }

  return result;
}

/**
 * Fetches PDF binary ArrayBuffer stream from proxy
 */
export async function getWelcomePackContent(
  campus = config.DEFAULT_CAMPUS,
  documentType = config.DEFAULT_DOC_TYPE
) {
  const params = new URLSearchParams({ campus, documentType });
  const url = `${config.PROXY_URL}/welcome-pack/content?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/pdf"
    }
  });

  if (!response.ok) {
    let message = "Unable to download document content.";
    try {
      const errorJson = await response.json();
      if (errorJson.message) message = errorJson.message;
    } catch (e) {
      /* ignore non-json errors */
    }
    throw new Error(message);
  }

  return response.arrayBuffer();
}












// import config from "../config/welcome_config";

// /**
//  * Fetches user details from AIFS API using contactID and returns ParticipantType (Campus)
//  */
// // export async function getParticipantType(contactId = config.CONTACT_ID) {
// //   const url = `${config.AIFS_API_URL}?contactID=${encodeURIComponent(contactId)}`;

// //   const response = await fetch(url, {
// //     method: "GET",
// //     headers: {
// //       "Accept": "application/json",
// //       "X-CAMPUS-M-API-KEY": config.X_CAMPUS_M_API_KEY
// //     }
// //   });

// //   const result = await response.json();

// //   if (!response.ok) {
// //     throw new Error(result.message || result.error || "Failed to fetch user attributes from AIFS");
// //   }

// //   // Safely extract ParticipantType from applicationList array
// //   const participantType = result?.applicationList?.[0]?.ParticipantType;

// //   if (!participantType) {
// //     throw new Error("ParticipantType not found in application response.");
// //   }

// //   return participantType;
// // }

// export async function getParticipantType(contactId = config.CONTACT_ID) {
//   const url = `${config.PROXY_URL}/user-details?contactID=${encodeURIComponent(contactId)}`;

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