import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
@Component({
  selector: 'app-microphone',
  templateUrl: './microphone.component.html',
  styleUrls: ['./microphone.component.scss'],
})
export class MicrophoneComponent  implements OnInit {
  descriptionForm: FormGroup;
  recognizedText!: string;
  @Output() startListening = new EventEmitter<void>();
  @Output() stopListening = new EventEmitter<void>();
  isListening = true;
  recording = false;
  constructor(private formBuilder: FormBuilder) {
    this.descriptionForm = this.formBuilder.group({
      description: ['', [Validators.required, Validators.maxLength(190)]]
    });
    SpeechRecognition.requestPermissions();
    SpeechRecognition.getSupportedLanguages();
  }

  ngOnInit() {}

  async startRecognition(){
    const {available} = await SpeechRecognition.available();
    if(available){
      this.recording = true;
      SpeechRecognition.start({
        language: "en-US",
     //   maxResults: 2,
        prompt: "Say something",
        partialResults: true,
        popup: false,
      });
      // listen to partial results
      SpeechRecognition.addListener("partialResults", (data: any) => {
        console.log("partialResults was fired", data.matches);
        if(data.matches && data.matches.length>0){
          this.recognizedText = data.matches[0];
        }
      });
    }
  }
  async stopRecognition(){
    this.recording =false;
    await SpeechRecognition.stop();
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
}
