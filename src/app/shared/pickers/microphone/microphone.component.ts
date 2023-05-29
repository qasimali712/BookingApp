import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

@Component({
  selector: 'app-microphone',
  templateUrl: './microphone.component.html',
  styleUrls: ['./microphone.component.scss'],
})
export class MicrophoneComponent implements OnInit {
  descriptionForm: FormGroup;
  recognizedText: string;
  recording: boolean;

  constructor(private formBuilder: FormBuilder) {
    this.descriptionForm = this.formBuilder.group({
      description: ['', [Validators.required, Validators.maxLength(190)]],
    });
    this.recognizedText = '';
    this.recording = false;
  }

  ngOnInit() {}

  async startRecognition() {
    try {
      const { available } = await SpeechRecognition.available();
      if (available) {
        this.recording = true;
        await SpeechRecognition.start({
          language: 'en-US',
          maxResults: 2,
          prompt: 'Say something',
          partialResults: true,
          popup: false,
        });
        // Listen to partial results
        SpeechRecognition.addListener('partialResults', (data: any) => {
          console.log('Partial results:', data.matches);
          if (data.matches && data.matches.length > 0) {
            this.recognizedText = data.matches[0];
          }
        });
      } else {
        console.error('Speech recognition not available');
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
    }
  }

  async stopRecognition() {
    this.recording = false;
    await SpeechRecognition.stop();
  }
}


// toggleListening() {
  //   if (this.isListening) {
  //     this.stopListening.emit();
  //     this.isListening = false;
  //   } else {
  //     this.startListening.emit();
  //     this.isListening = true;
  //   }
  // }
