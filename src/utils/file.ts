import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteFile = async (filename: string) => {
  try {
    await fs.promises.stat(filename);
  // eslint-disable-next-line no-empty
  } catch {

  }

  await fs.promises.unlink(filename);
};
