/*
 * ============================================================
 * Welcome Pack POC - Node Proxy
 * ============================================================
 *
 * Configuration is loaded from the project's .env file.
 *
 * Flow:
 *
 * AEK
 *   ->
 * Node Proxy
 *   ->
 * Microsoft Entra
 *   ->
 * Microsoft Graph
 *   ->
 * SharePoint
 *   ->
 * PDF
 * ============================================================
 */

/*
 * ============================================================
 * Load .env configuration
 * ============================================================
 */

/*
 * ============================================================
 * Welcome Pack POC - Node Proxy
 * ============================================================
 */

const express =
  require("express");

const cors =
  require("cors");


/*
 * Load configuration from welcome_config.js
 */

const config =
  require("../config/welcome_config");


const app =
  express();


/*
 * ============================================================
 * Configuration
 * ============================================================
 */
const TENANT_ID =
  config.TENANT_ID;

const CLIENT_ID =
  config.CLIENT_ID;

const CLIENT_SECRET =
  config.CLIENT_SECRET;

const SITE_ID =
  config.SITE_ID;

const DRIVE_ID =
  config.DRIVE_ID;

const DOCUMENT_LIBRARY_NAME =
  config.DOCUMENT_LIBRARY_NAME;

const CAMPUS =
  config.CAMPUS;

const DOCUMENT_TYPE =
  config.DOCUMENT_TYPE;

const DOCUMENT_TYPE_FIELD =
  config.DOCUMENT_TYPE_FIELD;

const CAMPUS_FIELD =
  config.CAMPUS_FIELD;

const PORT =
  config.PORT;

const AEK_ORIGIN =
  config.AEK_ORIGIN;
/*
 * ============================================================
 * Validate required configuration
 * ============================================================
 */

// const requiredSettings = {
//   TENANT_ID: TENANT_ID,

//   CLIENT_ID: CLIENT_ID,

//   CLIENT_SECRET: CLIENT_SECRET,

//   SITE_ID: SITE_ID,

//   DRIVE_ID: DRIVE_ID,

//   DOCUMENT_LIBRARY_NAME: DOCUMENT_LIBRARY_NAME,
// };

// const missingSettings = Object.keys(requiredSettings).filter(function (key) {
//   return !requiredSettings[key];
// });

// if (missingSettings.length > 0) {
//   console.error("==========================================");

//   console.error("WELCOME PACK CONFIGURATION ERROR");

//   console.error("Missing .env settings:");

//   missingSettings.forEach(function (key) {
//     console.error(" - " + key);
//   });

//   console.error("==========================================");

//   process.exit(1);
// }

/*
 * ============================================================
 * Show non-sensitive startup configuration
 * ============================================================
 */

console.log("==========================================");

console.log("Welcome Pack configuration loaded");

console.log("Campus:", CAMPUS);

console.log("Document Type:", DOCUMENT_TYPE);

console.log("Library:", DOCUMENT_LIBRARY_NAME);

console.log("Document Type Field:", DOCUMENT_TYPE_FIELD);

console.log("Campus Field:", CAMPUS_FIELD);

console.log("AEK Origin:", AEK_ORIGIN);

console.log("==========================================");

/*
 * IMPORTANT:
 *
 * Never log:
 *
 * CLIENT_SECRET
 * access token
 */

/*
 * ============================================================
 * Express / CORS
 * ============================================================
 */

app.use(
  cors({
    origin: AEK_ORIGIN,
  }),
);

app.use(express.json());

/*
 * ============================================================
 * Microsoft token cache
 * ============================================================
 */

let cachedAccessToken = null;

let cachedTokenExpiry = 0;

/*
 * ============================================================
 * getGraphToken()
 * ============================================================
 */

async function getGraphToken() {
  if (cachedAccessToken && Date.now() < cachedTokenExpiry) {
    console.log("[AUTH] Using cached Microsoft token");

    return cachedAccessToken;
  }

  console.log("[AUTH] Requesting Microsoft Graph token");

  const tokenUrl =
    "https://login.microsoftonline.com/" + TENANT_ID + "/oauth2/v2.0/token";

  const body = new URLSearchParams();

  body.append("client_id", CLIENT_ID);

  body.append("client_secret", CLIENT_SECRET);

  body.append("scope", "https://graph.microsoft.com/.default");

  body.append("grant_type", "client_credentials");

  const response = await fetch(tokenUrl, {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: body.toString(),
  });

  console.log("[AUTH] HTTP status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.error("[AUTH] Microsoft authentication failed:");

    console.error(errorText);

    throw new Error("Microsoft authentication failed. HTTP " + response.status);
  }

  const result = await response.json();

  if (!result.access_token) {
    throw new Error("Microsoft did not return access_token");
  }

  cachedAccessToken = result.access_token;

  cachedTokenExpiry = Date.now() + (result.expires_in - 60) * 1000;

  console.log("[AUTH] Microsoft Graph token received");

  return cachedAccessToken;
}

/*
 * ============================================================
 * graphGetJson()
 * ============================================================
 */

async function graphGetJson(url) {
  const token = await getGraphToken();

  console.log("[GRAPH] GET:", url);

  const response = await fetch(url, {
    method: "GET",

    headers: {
      Authorization: "Bearer " + token,

      Accept: "application/json",
    },
  });

  console.log("[GRAPH] HTTP status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.error("[GRAPH] Request failed:");

    console.error(errorText);

    throw new Error("Microsoft Graph request failed. HTTP " + response.status);
  }

  return response.json();
}

/*
 * ============================================================
 * Find SharePoint document library
 * ============================================================
 */

async function getDocumentLibrary() {
  console.log("[SHAREPOINT] Looking for library:", DOCUMENT_LIBRARY_NAME);

  const url =
    "https://graph.microsoft.com/v1.0" + "/sites/" + SITE_ID + "/lists";

  const result = await graphGetJson(url);

  const lists = result.value || [];

  const library = lists.find(function (item) {
    return (
      item.displayName === DOCUMENT_LIBRARY_NAME ||
      item.name === DOCUMENT_LIBRARY_NAME
    );
  });

  if (!library) {
    console.error("[SHAREPOINT] Library not found.");

    console.error("[SHAREPOINT] Available lists:");

    lists.forEach(function (item) {
      console.error(" -", item.displayName, "|", item.name, "|", item.id);
    });

    throw new Error(
      'Document library "' + DOCUMENT_LIBRARY_NAME + '" was not found.',
    );
  }

  console.log("[SHAREPOINT] Library found:", library.displayName);

  return library;
}

/*
 * ============================================================
 * Get SharePoint library items
 * ============================================================
 */

async function getAllLibraryItems(listId) {
  let url =
    "https://graph.microsoft.com/v1.0" +
    "/sites/" +
    SITE_ID +
    "/lists/" +
    listId +
    "/items?$expand=fields";

  const allItems = [];

  while (url) {
    const result = await graphGetJson(url);

    if (result.value) {
      allItems.push(...result.value);
    }

    url = result["@odata.nextLink"] || null;
  }

  console.log("[SHAREPOINT] Items retrieved:", allItems.length);

  return allItems;
}

/*
 * ============================================================
 * Normalize SharePoint values
 * ============================================================
 */

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim().toLowerCase();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (typeof value === "object") {
    if (value.LookupValue) {
      return normalizeValue(value.LookupValue);
    }

    if (value.value) {
      return normalizeValue(value.value);
    }
  }

  return String(value).trim().toLowerCase();
}

/*
 * ============================================================
 * Compare field value
 * ============================================================
 */

function fieldMatches(fieldValue, expectedValue) {
  const actual = normalizeValue(fieldValue);

  const expected = normalizeValue(expectedValue);

  if (Array.isArray(actual)) {
    return actual.includes(expected);
  }

  return actual === expected;
}

/*
 * ============================================================
 * Find matching Welcome Pack
 * ============================================================
 */

async function findWelcomePackItem() {
  console.log("==========================================");

  console.log("[WELCOME PACK] Searching SharePoint");

  console.log("[WELCOME PACK] Document Type:", DOCUMENT_TYPE);

  console.log("[WELCOME PACK] Campus:", CAMPUS);

  console.log("==========================================");

  const library = await getDocumentLibrary();

  const items = await getAllLibraryItems(library.id);
  console.log("========== SHAREPOINT FIELD DEBUG ==========");

  items.forEach(function (item, index) {
    console.log("ITEM " + (index + 1));

    console.log(JSON.stringify(item.fields, null, 2));
  });

  console.log("============================================");

  console.log("========== SHAREPOINT FIELD DEBUG ==========");

  items.forEach(function (item, index) {
    console.log("ITEM " + (index + 1), item.fields);
  });

  console.log("============================================");

  const matchingItem = items.find(function (item) {
    const fields = item.fields || {};

    const documentType = fields[DOCUMENT_TYPE_FIELD];

    const campus = fields[CAMPUS_FIELD];

    return (
      fieldMatches(documentType, DOCUMENT_TYPE) && fieldMatches(campus, CAMPUS)
    );
  });

  if (!matchingItem) {
    throw new Error("No WelcomePack document was found for Campus " + CAMPUS);
  }

  console.log("[WELCOME PACK] Matching document found");

  return {
    library: library,

    listItem: matchingItem,
  };
}

/*
 * ============================================================
 * Convert ListItem -> DriveItem
 * ============================================================
 */

async function getDriveItem(listId, listItemId) {
  const url =
    "https://graph.microsoft.com/v1.0" +
    "/sites/" +
    SITE_ID +
    "/lists/" +
    listId +
    "/items/" +
    listItemId +
    "/driveItem";

  return graphGetJson(url);
}

/*
 * ============================================================
 * Resolve Welcome Pack
 * ============================================================
 */

async function resolveWelcomePack() {
  const result = await findWelcomePackItem();

  const driveItem = await getDriveItem(result.library.id, result.listItem.id);

  const driveId =
    driveItem.parentReference && driveItem.parentReference.driveId
      ? driveItem.parentReference.driveId
      : DRIVE_ID;

  return {
    campus: CAMPUS,

    documentType: DOCUMENT_TYPE,

    fileName: driveItem.name,

    fileSize: driveItem.size,

    driveId: driveId,

    driveItemId: driveItem.id,
  };
}

/*
 * ============================================================
 * Health endpoint
 * ============================================================
 */

app.get(
  "/api/health",

  function (req, res) {
    res.json({
      success: true,

      message: "Welcome Pack proxy is running",
    });
  },
);

/*
 * ============================================================
 * Welcome Pack metadata
 * ============================================================
 */

app.get(
  "/api/welcome-pack/info",

  async function (req, res) {
    try {
      const document = await resolveWelcomePack();

      res.json({
        success: true,

        available: true,

        campus: document.campus,

        documentType: document.documentType,

        fileName: document.fileName,

        fileSize: document.fileSize,
      });
    } catch (error) {
      console.error(error);

      res.status(404).json({
        success: false,

        available: false,

        campus: CAMPUS,

        documentType: DOCUMENT_TYPE,

        message: error.message,
      });
    }
  },
);

/*
 * ============================================================
 * Welcome Pack PDF content
 * ============================================================
 */

app.get(
  "/api/welcome-pack/content",

  async function (req, res) {
    try {
      const document = await resolveWelcomePack();

      const token = await getGraphToken();

      const contentUrl =
        "https://graph.microsoft.com/v1.0" +
        "/drives/" +
        document.driveId +
        "/items/" +
        document.driveItemId +
        "/content";

      console.log("[PDF] Retrieving:", document.fileName);

      const pdfResponse = await fetch(contentUrl, {
        method: "GET",

        headers: {
          Authorization: "Bearer " + token,
        },

        redirect: "follow",
      });

      if (!pdfResponse.ok) {
        throw new Error("Unable to retrieve PDF. HTTP " + pdfResponse.status);
      }

      const arrayBuffer = await pdfResponse.arrayBuffer();

      const pdfBuffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", "application/pdf");

      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + document.fileName.replace(/"/g, "") + '"',
      );

      res.setHeader(
        "Cache-Control",
        "private, no-store, no-cache, must-revalidate",
      );

      res.setHeader("Pragma", "no-cache");

      res.setHeader("Expires", "0");

      res.setHeader("Content-Length", pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      console.error("[PDF] Failed:");

      console.error(error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,

          message: error.message,
        });
      }
    }
  },
);

/*
 * ============================================================
 * Start proxy
 * ============================================================
 */

app.listen(
  PORT,

  function () {
    console.log("==========================================");

    console.log("Welcome Pack POC Proxy Running");

    console.log("http://localhost:" + PORT);

    console.log("==========================================");
  },
);
