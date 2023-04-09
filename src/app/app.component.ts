import { Component } from '@angular/core';

declare var webkitSpeechRecognition: any;
declare var SpeechSynthesisUtterance: any;
declare var speechSynthesis: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bank';
  recognition: any;
  transcription: string = '';
  transcript: string = '';
  confidence: string = '';
  welcomeText: string ='';
  utterance:any;
  helpText = '';
  accounts='';
  others='';
  services='';
  statement='';
  cards='';

  ngOnInit(){
      
  }
  
  sayInVoice(text:any){
    this.utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(this.utterance);
  }

  helpYourself(){
    this.helpText = 'How can i help you ?';
    this.sayInVoice('How can I help you , please Specify');
    this.sayInVoice('ACCOUNTS'); 
    this.accounts ='1.ACCOUNTS';
    this.sayInVoice('OTHER'); 
    this.others ='2. OTHER';
    this.sayInVoice('SERVICES'); 
    this.services ='3. SERVICES';
    this.sayInVoice('STATEMENT'); 
    this.statement ='4. STATEMENT';
    this.sayInVoice('CARDS'); 
    this.cards ='5. CARDS';

    setTimeout(()=>{
      this.startRecognition();
    },6000);
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
    this.recognition.onstart = function() {
      this.transcription = "listening, please speak...";
      console.log(this.transcription);
    };

    // this.recognition.onspeechend = ()=> {
    //   this.transcription = "stopped listening, hope you are done...";
    //   console.log(this.transcription);
    //   // this.recognition.stop();
    // }

    this.recognition.onresult =(event: any)=> {
      this.transcript = event.results[0][0].transcript;
      this.confidence = event.results[0][0].confidence;
      console.log(this.transcript, this.confidence);
      if(this.transcript.trim() === 'cards'){
        this.sayInVoice('Okay Your value is accepted');
      }
      if(this.transcript.trim() === 'accounts'){
        this.sayInVoice('Okay Your value is accepted');
        this.sayInVoice('Please select any of these');
        this.sayInVoice('Show Transactions, Check Balance, Last Transaction, Credit Card Limit, Pending Bill and Send Money');
      }

    };

    this.recognition.start();
  }
}



