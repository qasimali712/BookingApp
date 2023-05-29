import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'blank',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SpeechRecognition: {
      androidRecognitionService: 'com.getcapacitor.community.speechrecognition.SpeechRecognitionService'
    }
  }
};

export default config;
