import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.arcaps.qtware',
  appName: 'qtware',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
