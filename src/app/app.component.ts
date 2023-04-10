import { Component } from '@angular/core';

import { DataServiceService } from './data-service.service';
import { ThisReceiver } from '@angular/compiler';

declare var webkitSpeechRecognition: any;
declare var SpeechSynthesisUtterance: any;
declare var speechSynthesis: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private dataService: DataServiceService) { }
  title = 'bank';
  recognition: any;
  transcription: string = '';
  transcript: string = '';
  confidence: string = '';
  welcomeText: string = '';
  utterance: any;
  helpText = '';
  accounts = '';
  others = '';
  services = '';
  statement = '';
  cards = '';
  rcgdVoice: any;
  accountNumber: any;

  helpTitle='';
  liText='';

  ngOnInit() {

  }

  sayInVoice(text: any) {
    this.utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(this.utterance);
  }



  helpYourself() {
    this.helpTitle = 'Please select you account type';
    this.sayInVoice(this.helpTitle);
    this.getAccoutsType();    
  }

  getAccoutsType() {
    this.dataService.getDataFromApi('account/all').subscribe((data: any) => {
      let acTyp = '';
      data.forEach((element: any) => {
        console.log(element['accountType']);
        acTyp += element['accountType'] + ', ';
        this.liText+=`<li>${element['accountType']}</li>`;
      });
      this.sayInVoice(acTyp);
      this.utterance.addEventListener('end', () => {
        this.rcgdVoice = this.startRecognitionNew();
        this.recognition.onresult = (event: any) => {
          this.transcript = event.results[0][0].transcript;
          console.log(this.transcript);
          if (this.transcript == 'savings') {
            this.accountNumber = data[0]['accountNumber'];
            this.bank();
          }
          if (this.transcript == 'current') {
            this.accountNumber = data[1]['accountNumber'];
            this.bank();
          }
        }
      })
    })
  }

  bank() {
    this.helpTitle='How can I help you, please Specify';
    this.sayInVoice(this.title);
    this.dataService.getDataFromApi('/bank').subscribe((data: any) => {
      data = data.join(', ');
      this.liText=data;
      this.sayInVoice(data);
      this.utterance.addEventListener('end', () => {
        this.rcgdVoice = this.startRecognitionNew();
        this.recognition.onresult = (event: any) => {
          this.transcript = event.results[0][0].transcript;
          console.log(this.transcript);
          if (this.transcript == 'account') {
            this.account('ACCOUNT');
          }
        }
      });
    });
  }


  account(type:any){
    this.helpTitle = 'Your value is accepted. Choose one of these';
    this.sayInVoice(this.helpTitle);
    this.dataService.getDataFromApi(`/bank/options/{inputValue}?inputValue=${type}`).subscribe((data: any) => {
      data = data.join(', ')
      this.sayInVoice(data);
      this.utterance.addEventListener('end', () => {
        this.rcgdVoice = this.startRecognitionNew();
        this.recognition.onresult = (event: any) => {
          this.transcript = event.results[0][0].transcript;
          console.log(this.transcript);
          if (this.transcript == 'show balance' || this.transcript == 'so balance') {
             this.showAccountBalace();
          }
        }
      });
    });
  }

  showAccountBalace() {
    this.dataService.getDataFromApi(`account/balance/?accountNumber=73084635`).subscribe((data: any) => {
      this.sayInVoice(data);
      console.log(data[0]);
    });
  }


  // startRecognition() {
  //   this.recognition = new webkitSpeechRecognition(); // for Safari
  //   // this.recognition = new SpeechRecognition(); // for other browsers
  //   this.recognition.continuous = true;
  //   this.recognition.interimResults = true;

  //   this.recognition.onresult = (event: any) => {
  //     for (let i = event.resultIndex; i < event.results.length; i++) {
  //       if (event.results[i].isFinal) {
  //         this.transcription += event.results[i][0].transcript;
  //       }
  //     }
  //   };

  //   this.recognition.onend = () => {
  //     console.log('Recognition ended');
  //   };

  //   this.recognition.start();
  // }

  startRecognition() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.onstart = function () {
      this.transcription = "listening, please speak...";
      console.log(this.transcription);
    };

    // this.recognition.onspeechend = ()=> {
    //   this.transcription = "stopped listening, hope you are done...";
    //   console.log(this.transcription);
    //   // this.recognition.stop();
    // }

    this.recognition.onresult = (event: any) => {
      this.transcript = event.results[0][0].transcript;
      this.confidence = event.results[0][0].confidence;
      console.log(this.transcript, this.confidence);
      if (this.transcript.trim() === 'cards') {
        this.sayInVoice('Okay Your value is accepted');
      }
      if (this.transcript.trim() === 'account') {
        this.sayInVoice('Okay Your value is accepted.');
        this.sayInVoice('Please select your account type');
        this.dataService.getDataFromApi('account/all').subscribe((data: any) => {
          let acTyp = '';
          data.forEach((element: any) => {
            console.log(element['accountType']);
            acTyp += element['accountType'] + ', ';
          });
          this.sayInVoice(acTyp);
          setTimeout(() => {
            this.startRecognition();
          }, 5000);
        });
      }

      if (this.transcript.trim() === 'savings') {
        this.sayInVoice('Your saving account has been selected');
      }
      if (this.transcript.trim() === 'current') {
        this.sayInVoice('Your current account has been selected');
      }
    };

    this.recognition.start();
  }

  startRecognitionNew() {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.onstart = function () {
      this.transcription = "listening, please speak...";
      console.log(this.transcription);
    };

    this.recognition.start();
  }

}
