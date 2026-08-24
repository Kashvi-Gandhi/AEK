import 'dotenv/config';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';

const credential = new ClientSecretCredential(
  process.env.TENANT_ID,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

const graphClient = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const token = await credential.getToken('https://graph.microsoft.com/.default');
      return token.token;
    }
  }
});

export async function getFileDetails() {
  const driveId = process.env.SHAREPOINT_DRIVE_ID;
  const fileId = process.env.FILE_ID;

  // Retrieve drive item details including name, preview URL, and direct download link
  const fileData = await graphClient
    .api(`/drives/${driveId}/items/${fileId}`)
    .get();

  return {
    name: fileData.name,
    webUrl: fileData.webUrl,
    downloadUrl: fileData['@microsoft.graph.downloadUrl']
  };
}