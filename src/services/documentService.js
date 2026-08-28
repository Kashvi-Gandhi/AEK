// import config from "../config/pocConfig";

// import {
//   graphGetJson
// } from "./graphService";


// /*
//  * ============================================================
//  * getDocumentLibrary()
//  * ============================================================
//  *
//  * Retrieves the SharePoint lists/libraries for our Site and
//  * finds the configured document library.
//  *
//  * This means you only need the LIBRARY NAME in pocConfig.js.
//  * You do not need to manually find the ListId.
//  */
// export async function getDocumentLibrary() {

//   console.log(
//     "[DOCUMENT] Looking for SharePoint library:",
//     config.documentLibraryName
//   );


//   const path =
//     `/sites/${encodeURIComponent(config.siteId)}` +
//     `/lists`;


//   const result =
//     await graphGetJson(path);


//   console.log(
//     "[DOCUMENT] SharePoint lists/libraries:",
//     result.value
//   );


//   const library =
//     (result.value || []).find(
//       item =>
//         item.name ===
//           config.documentLibraryName ||
//         item.displayName ===
//           config.documentLibraryName
//     );


//   if (!library) {

//     console.error(
//       "[DOCUMENT] Could not find library:",
//       config.documentLibraryName
//     );

//     console.error(
//       "[DOCUMENT] Available libraries:",
//       (result.value || []).map(
//         item => ({
//           id: item.id,
//           name: item.name,
//           displayName: item.displayName
//         })
//       )
//     );


//     throw new Error(
//       `SharePoint document library ` +
//       `"${config.documentLibraryName}" was not found.`
//     );
//   }


//   console.log(
//     "[DOCUMENT] Library found:",
//     library.displayName || library.name
//   );

//   console.log(
//     "[DOCUMENT] Library/List ID:",
//     library.id
//   );


//   return library;
// }


// /*
//  * ============================================================
//  * getLibraryItems()
//  * ============================================================
//  *
//  * Gets the SharePoint items AND expands their custom
//  * SharePoint metadata fields.
//  *
//  * Microsoft Graph supports expanding the fields relationship
//  * for SharePoint ListItems.
//  */
// export async function getLibraryItems(
//   listId
// ) {

//   console.log(
//     "[DOCUMENT] Retrieving document metadata..."
//   );


//   const path =
//     `/sites/${encodeURIComponent(config.siteId)}` +
//     `/lists/${encodeURIComponent(listId)}` +
//     `/items?$expand=fields`;


//   const result =
//     await graphGetJson(path);


//   const items =
//     result.value || [];


//   console.log(
//     "[DOCUMENT] Number of items returned:",
//     items.length
//   );


//   /*
//    * VERY USEFUL FOR FIRST TEST.
//    *
//    * Open Chrome DevTools -> Console.
//    * Expand this result if our field names need checking.
//    */
//   console.log(
//     "[DOCUMENT] SharePoint items and fields:",
//     items
//   );


//   return items;
// }


// /*
//  * ============================================================
//  * findDocument()
//  * ============================================================
//  *
//  * Finds:
//  *
//  * DocumentType = requested document type
//  * AND
//  * Campus = requested campus
//  */
// export async function findDocument(
//   documentType,
//   campus
// ) {

//   console.log(
//     "=========================================="
//   );

//   console.log(
//     "[DOCUMENT] Starting document search"
//   );

//   console.log(
//     "[DOCUMENT] DocumentType:",
//     documentType
//   );

//   console.log(
//     "[DOCUMENT] Campus:",
//     campus
//   );

//   console.log(
//     "=========================================="
//   );


//   /*
//    * STEP 1:
//    * Find SharePoint library.
//    */
//   const library =
//     await getDocumentLibrary();


//   /*
//    * STEP 2:
//    * Get items and custom metadata.
//    */
//   const items =
//     await getLibraryItems(
//       library.id
//     );


//   /*
//    * STEP 3:
//    * Find matching item.
//    *
//    * For the POC we deliberately filter in JavaScript.
//    *
//    * This keeps the SharePoint query simple and makes
//    * debugging internal column names much easier.
//    */
//   const matchingItem =
//     items.find(item => {

//       const fields =
//         item.fields || {};


//       const itemDocumentType =
//         fields[
//           config.documentTypeField
//         ];


//       const itemCampus =
//         fields[
//           config.campusField
//         ];


//       console.log(
//         "[DOCUMENT] Checking item:",
//         fields.FileLeafRef ||
//           fields.Title ||
//           item.id,
//         "| DocumentType:",
//         itemDocumentType,
//         "| Campus:",
//         itemCampus
//       );


//       /*
//        * Convert values to strings and trim them so minor
//        * whitespace differences don't break our POC.
//        *
//        * We also compare case-insensitively.
//        */
//       return (

//         String(
//           itemDocumentType || ""
//         )
//           .trim()
//           .toLowerCase()

//         ===

//         String(
//           documentType || ""
//         )
//           .trim()
//           .toLowerCase()

//         &&

//         String(
//           itemCampus || ""
//         )
//           .trim()
//           .toLowerCase()

//         ===

//         String(
//           campus || ""
//         )
//           .trim()
//           .toLowerCase()
//       );
//     });


//   if (!matchingItem) {

//     console.error(
//       "[DOCUMENT] No matching document found."
//     );

//     console.error(
//       "[DOCUMENT] Expected:",
//       {
//         documentType:
//           documentType,

//         campus:
//           campus,

//         documentTypeField:
//           config.documentTypeField,

//         campusField:
//           config.campusField
//       }
//     );


//     console.error(
//       "[DOCUMENT] Look at the previous " +
//       "'SharePoint items and fields' console output."
//     );


//     throw new Error(
//       `No ${documentType} document was found ` +
//       `for campus ${campus}.`
//     );
//   }


//   console.log(
//     "[DOCUMENT] Matching SharePoint item found:",
//     matchingItem
//   );


//   return {
//     library: library,
//     listItem: matchingItem
//   };
// }


// /*
//  * ============================================================
//  * getDriveItem()
//  * ============================================================
//  *
//  * Converts the matching SharePoint ListItem into a DriveItem.
//  *
//  * Microsoft Graph supports:
//  *
//  * /sites/{siteId}/lists/{listId}/items/{itemId}/driveItem
//  */
// export async function getDriveItem(
//   listId,
//   listItemId
// ) {

//   console.log(
//     "[DOCUMENT] Retrieving DriveItem..."
//   );


//   const path =
//     `/sites/${encodeURIComponent(config.siteId)}` +
//     `/lists/${encodeURIComponent(listId)}` +
//     `/items/${encodeURIComponent(listItemId)}` +
//     `/driveItem`;


//   const driveItem =
//     await graphGetJson(path);


//   console.log(
//     "[DOCUMENT] DriveItem found:",
//     {
//       id:
//         driveItem.id,

//       name:
//         driveItem.name,

//       size:
//         driveItem.size
//     }
//   );


//   return driveItem;
// }


// /*
//  * ============================================================
//  * getDownloadUrl()
//  * ============================================================
//  *
//  * IMPORTANT:
//  *
//  * Browser JavaScript should NOT call:
//  *
//  * /drives/{driveId}/items/{fileId}/content
//  *
//  * directly because Graph returns a 302 redirect and the
//  * Authorization/CORS combination can fail in browser apps.
//  *
//  * Instead we retrieve DriveItem metadata and obtain:
//  *
//  * @microsoft.graph.downloadUrl
//  *
//  * This is a temporary pre-authenticated URL.
//  */
// export async function getDownloadUrl(
//   driveItemId
// ) {

//   console.log(
//     "[DOCUMENT] Requesting temporary PDF URL..."
//   );


//   const path =
//     `/drives/${encodeURIComponent(config.driveId)}` +
//     `/items/${encodeURIComponent(driveItemId)}`;


//   const driveItem =
//     await graphGetJson(path);


//   const downloadUrl =
//     driveItem[
//       "@microsoft.graph.downloadUrl"
//     ];


//   if (!downloadUrl) {

//     console.error(
//       "[DOCUMENT] DriveItem response:",
//       driveItem
//     );


//     throw new Error(
//       "Microsoft Graph did not return a temporary download URL."
//     );
//   }


//   console.log(
//     "[DOCUMENT] Temporary PDF URL received."
//   );


//   /*
//    * DO NOT console.log(downloadUrl).
//    *
//    * It is a temporary pre-authenticated URL.
//    */
//   return downloadUrl;
// }


// /*
//  * ============================================================
//  * downloadPdf()
//  * ============================================================
//  *
//  * Downloads the actual PDF using Microsoft's temporary
//  * pre-authenticated download URL.
//  *
//  * IMPORTANT:
//  * We intentionally DO NOT send our Authorization header here.
//  */
// export async function downloadPdf(
//   downloadUrl
// ) {

//   console.log(
//     "[DOCUMENT] Retrieving PDF bytes..."
//   );


//   const response =
//     await fetch(
//       downloadUrl,
//       {
//         method: "GET"
//       }
//     );


//   console.log(
//     "[DOCUMENT] PDF HTTP status:",
//     response.status
//   );


//   if (!response.ok) {

//     throw new Error(
//       `Unable to retrieve PDF. HTTP ${response.status}`
//     );
//   }


//   const blob =
//     await response.blob();


//   console.log(
//     "[DOCUMENT] PDF retrieved successfully."
//   );

//   console.log(
//     "[DOCUMENT] Content type:",
//     blob.type
//   );

//   console.log(
//     "[DOCUMENT] Size:",
//     blob.size,
//     "bytes"
//   );


//   return blob;
// }


// /*
//  * ============================================================
//  * getWelcomePack()
//  * ============================================================
//  *
//  * MAIN FUNCTION CALLED BY OUR AEK SCREEN.
//  *
//  * Complete flow:
//  *
//  * Campus
//  *   ↓
//  * Find SharePoint library
//  *   ↓
//  * Get metadata
//  *   ↓
//  * Find DocumentType + Campus
//  *   ↓
//  * Convert ListItem -> DriveItem
//  *   ↓
//  * Obtain temporary Graph download URL
//  *   ↓
//  * Retrieve PDF bytes
//  *   ↓
//  * Return Blob to AEK
//  */
// export async function getWelcomePack() {

//   console.log(
//     "=========================================="
//   );

//   console.log(
//     "WELCOME PACK POC STARTED"
//   );

//   console.log(
//     "Campus:",
//     config.campus
//   );

//   console.log(
//     "Document Type:",
//     config.documentType
//   );

//   console.log(
//     "=========================================="
//   );


//   /*
//    * Find matching SharePoint ListItem.
//    */
//   const result =
//     await findDocument(
//       config.documentType,
//       config.campus
//     );


//   /*
//    * Convert ListItem to DriveItem.
//    */
//   const driveItem =
//     await getDriveItem(
//       result.library.id,
//       result.listItem.id
//     );


//   /*
//    * Retrieve temporary preauthenticated URL.
//    */
//   const downloadUrl =
//     await getDownloadUrl(
//       driveItem.id
//     );


//   /*
//    * Retrieve actual PDF.
//    */
//   const pdfBlob =
//     await downloadPdf(
//       downloadUrl
//     );


//   console.log(
//     "=========================================="
//   );

//   console.log(
//     "WELCOME PACK POC SUCCESS"
//   );

//   console.log(
//     "File:",
//     driveItem.name
//   );

//   console.log(
//     "=========================================="
//   );


//   return {

//     blob:
//       pdfBlob,

//     fileName:
//       driveItem.name,

//     campus:
//       config.campus,

//     documentType:
//       config.documentType
//   };
// }





















































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