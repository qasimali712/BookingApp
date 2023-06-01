import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-microphone',
  templateUrl: './microphone.component.html',
  styleUrls: ['./microphone.component.scss'],
})
export class MicrophoneComponent implements OnInit {
  descriptionForm: FormGroup;
  recognizedText: string;
  recording: boolean;
  speechRecognitionAvailable: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private platform: Platform,
    private change: ChangeDetectorRef
  ) {
    this.descriptionForm = this.formBuilder.group({
      description: ['', [Validators.required, Validators.maxLength(200)]],
    });
    this.recognizedText = '';
    this.recording = false;
    this.speechRecognitionAvailable = false;
    this.requestSpeechRecognitionPermission();
  }

  ngOnInit() {}

  async requestSpeechRecognitionPermission() {
    if (Capacitor.isPluginAvailable('SpeechRecognition')) {
      try {
        const permissionResult = await SpeechRecognition.requestPermission();
        this.speechRecognitionAvailable = true;
      } catch (error) {
        console.error('Speech recognition permission error:', error);
      }
    } else {
      console.error('Speech recognition not available');
    }
  }

  async startRecognition() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      if (this.speechRecognitionAvailable) {
        try {
          const  available  = await SpeechRecognition.available();
          if (available) {
            this.recording = true;
            SpeechRecognition.start({
              language: 'en-US',
              prompt: 'Say something',
              popup: true,
            });
            // Listen to partial results
            SpeechRecognition.addListener('partialResults', (data: any) => {
              console.log('Partial results was fired:', data.matches);
              if (data.matches && data.matches.length > 0) {
                this.recognizedText = data.matches[0];
                this.change.detectChanges();
              }
            });
          } else {
            console.error('Speech recognition not available');
          }
        } catch (error) {
          console.error('Speech recognition error:', error);
        }
      }
      else {
        console.error('Speech recognition not available');
      }
    }
  }

  async stopRecognition() {
    this.recording = false;
    await SpeechRecognition.stop();
  }

  speakText() {
    TextToSpeech.speak({
      text: this.recognizedText,
    });
  }
}
