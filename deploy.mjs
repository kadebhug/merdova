import { Client } from 'basic-ftp';
import { readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FTP Configuration
const FTP_CONFIG = {
  host: 'ftp.merdova.com',
  port: 21,
  user: 'info@merdova.com',
  password: process.env.FTP_PASSWORD || '',
  secure: false, // Set to true for FTPS
  secureOptions: undefined,
};

// Remote directory on FTP server (default: public_html)
const REMOTE_DIR = process.env.FTP_REMOTE_DIR || 'public_html';

// Local directory to upload
const LOCAL_DIR = join(__dirname, 'dist');

async function uploadDirectory(client, localPath, remoteBasePath) {
  const files = await readdir(localPath);

  for (const file of files) {
    const localFilePath = join(localPath, file);
    const remoteFilePath = remoteBasePath ? `${remoteBasePath}/${file}` : file;
    const stats = await stat(localFilePath);

    // Build absolute path
    const absolutePath = remoteFilePath.startsWith('/') ? remoteFilePath : `/${remoteFilePath}`;

    if (stats.isDirectory()) {
      console.log(`Creating directory: ${absolutePath}`);
      try {
        // Ensure directory exists (this may change directory)
        await client.ensureDir(absolutePath);
      } catch (error) {
        // Directory might already exist, continue
        console.log(`Directory ${absolutePath} already exists or error: ${error.message}`);
      }
      // Always return to root after directory operations
      await client.cd('/');
      // Continue with the full path for recursive calls
      await uploadDirectory(client, localFilePath, remoteFilePath);
    } else {
      console.log(`Uploading: ${file} -> ${absolutePath}`);
      // Ensure we're in root before uploading (in case previous operation changed directory)
      await client.cd('/');
      await client.uploadFrom(localFilePath, absolutePath);
    }
  }
}

async function deploy() {
  const client = new Client();
  client.ftp.verbose = true; // Enable verbose logging

  try {
    // Check if password is provided
    if (!FTP_CONFIG.password) {
      console.error('❌ Error: FTP_PASSWORD environment variable is not set.');
      console.error('   Please set it before running the deploy script:');
      console.error('   Windows: set FTP_PASSWORD=your_password');
      console.error('   Linux/Mac: export FTP_PASSWORD=your_password');
      process.exit(1);
    }

    console.log('🔌 Connecting to FTP server...');
    await client.access(FTP_CONFIG);
    console.log('✅ Connected successfully!');

    // Ensure remote directory exists, then return to root
    console.log(`📁 Ensuring remote directory exists: ${REMOTE_DIR}`);
    const remoteAbsolutePath = REMOTE_DIR.startsWith('/') ? REMOTE_DIR : `/${REMOTE_DIR}`;
    await client.ensureDir(remoteAbsolutePath);
    // Return to root directory to maintain consistent state
    await client.cd('/');

    console.log('📤 Starting upload...');
    // Use REMOTE_DIR as base path, uploadDirectory will handle absolute paths
    await uploadDirectory(client, LOCAL_DIR, REMOTE_DIR);

    console.log('✅ Upload completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

// Run deployment
deploy();

