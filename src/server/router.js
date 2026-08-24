import { getFileDetails } from './sharepoint';

export async function welcomePack(req, res) {
  try {
    const file = await getFileDetails();
    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}