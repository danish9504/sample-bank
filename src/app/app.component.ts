import { Component } from '@angular/core';

import { DataServiceService } from './data-service.service';
import { ThisReceiver } from '@angular/compiler';

declare var webkitSpeechRecognition: any;
declare var SpeechSynthesisUtterance: any;
declare var speechSynthesis: any;
declare var $: any;

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

  helpTitle: string = '';
  liText = '';

  ngOnInit() {
    $(document).on('keypress', (e:any)=> {
      if (e.which == 13) {
        this.helpYourself();
      }
    });
  }

  sayInVoice(text: any) {
    this.utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(this.utterance);
  }



  helpYourself() {
    if (this.accountNumber) {
      this.bank();
    } else {
      this.helpTitle = 'Please select you account type';
      this.sayInVoice(this.helpTitle);
      this.getAccoutsType();
    }
  }

  changeText() {
    this.helpTitle = 'hello my name in ram';
  }

  getAccoutsType() {
    this.liText = '';
    this.dataService.getDataFromApi('account/all').subscribe((data: any) => {
      let acTyp = '';
      data.forEach((element: any) => {
        console.log(element['accountType']);
        acTyp += element['accountType'] + ', ';
        this.liText += `<li>${element['accountType']}</li>`;
      });
      this.sayInVoice(acTyp);
      this.utterance.addEventListener('end', () => {
        this.rcgdVoice = this.startRecognitionNew();
        this.recognition.onresult = (event: any) => {
          this.transcript = event.results[0][0].transcript;
          if (this.transcript == 'savings') {
            this.accountNumber = data[0]['accountNumber'];
            this.bank();
          }
          else if (this.transcript == 'current') {
            this.accountNumber = data[1]['accountNumber'];
            this.bank();
          }
          else {
            this.sayInVoice('Please select account type from above option');
            this.rcgdVoice = this.startRecognitionNew();
            this.recognition.onresult = (event: any) => {
              this.transcript = event.results[0][0].transcript;
              if (this.transcript == 'savings') {
                this.accountNumber = data[0]['accountNumber'];
                this.bank();
              }
              if (this.transcript == 'current') {
                this.accountNumber = data[1]['accountNumber'];
                this.bank();
              }
              else {
                this.sayInVoice('Please select account type from above option');
              }
            }
          }
        }
      })
    })
  }

  bank() {
    this.helpTitle = 'How can I help you, please Specify';
    $('#business-tagline-final').text('How can I help you, please Specify');
    this.sayInVoice(this.helpTitle);
    this.dataService.getDataFromApi('/bank').subscribe((data: any) => {
      const map1 = data.map((value: any) => `<li>${value}</li>`);
      data = data.join(', ');
      console.log(data);
      this.liText = data;
      $('#ul-lst').html(map1);
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


  account(type: any) {
    this.helpTitle = 'Your value is accepted. Choose one of these';
    $('#business-tagline-final').text('Choose one of these');
    console.log(this.helpTitle);
    this.sayInVoice(this.helpTitle);
    this.dataService.getDataFromApi(`/bank/options/{inputValue}?inputValue=${type}`).subscribe((data: any) => {
      const map1 = data.map((value: any) => `<li>${value}</li>`);
      data = data.join(', ');
      $('#ul-lst').html(map1);
      this.sayInVoice(data);
      this.utterance.addEventListener('end', () => {
        this.rcgdVoice = this.startRecognitionNew();
        this.recognition.onresult = (event: any) => {
          this.transcript = event.results[0][0].transcript;
          console.log(this.transcript);
          if (this.transcript == 'show balance' || this.transcript.includes("balance")) {
            this.showAccountBalace();
          }
          else if (this.transcript == 'show transaction' || this.transcript.includes("show")) {
            this.showTrasaction();
          }
          else if (this.transcript == 'last transaction' || this.transcript.includes("last")) {
            this.lastTrasaction();
          }
          else if (this.transcript == 'send money' || this.transcript.includes("send") || this.transcript.includes("money")) {
            this.sendMoney();
          }
        }
      });
    });
  }

  showAccountBalace() {
    this.dataService.getDataFromApi(`account/balance/?accountNumber=${this.accountNumber}`).subscribe((data: any) => {
      $('#business-tagline-final').text('');
      this.sayInVoice(data);
      $('#ul-lst').html(data);
      console.log(data[0]);
    });
  }

  showTrasaction() {
    this.dataService.getDataFromApi(`account/transactions?accountNumber=${this.accountNumber}`).subscribe((data: any) => {
      $('#business-tagline-final').text('All Trasaction');
      const map1 = data.map((value: any) => `<li>${value}</li>`);
      this.sayInVoice(data);
      $('#ul-lst').html(map1);
    });
  }

  lastTrasaction() {
    this.dataService.getDataFromApi(`account/lastTransactionForVoive?accountNumber=${this.accountNumber}`).subscribe((data: any) => {
      $('#business-tagline-final').text('Last Trasaction');
      const map1 = data.map((value: any) => `<li>${value}</li>`);
      this.sayInVoice(data);
      $('#ul-lst').html(map1);
    });
  }

  allPayeeList: any;
  payee: any;
  amount = 3000;
  securityCode: any;
  sendMoney() {
    this.sayInVoice('your value is accepted');
    $('#business-tagline-final').text('Choose the payee');
    this.sayInVoice('choose the payee');
    this.dataService.getDataFromApi(`payees`).subscribe((data: any) => {
      const map1 = data.map((value: any) => `<li>${value.payeeName}</li>`);

      data.forEach((value: any) => {
        this.allPayeeList = value.payeeName
      });
      this.sayInVoice(this.allPayeeList);
      this.utterance.addEventListener('end', () => {
        this.rcgdVoice = this.startRecognitionNew();
        this.recognition.onresult = (event: any) => {
          this.transcript = event.results[0][0].transcript;
          this.payee = this.transcript;
          this.sayInVoice(`${this.payee} is selected`);
          this.utterance.addEventListener('end', () => {
            this.specifyAmount();
          });
        }
      });

      $('#ul-lst').html(map1);

    });
  }

  specifyAmount() {
    this.sayInVoice('Specify Amount');
    this.utterance.addEventListener('end', () => {
      this.rcgdVoice = this.startRecognitionNew();
      this.recognition.onresult = (event: any) => {
        this.transcript = event.results[0][0].transcript;
        $('#business-tagline-final').text(`You specify ${this.amount}`);
        this.sayInVoice('You specify tree thousands.');

        this.utterance.addEventListener('end', () => {
          this.sayInVoice('Say okay to confirm. No to cancel.');
          this.utterance.addEventListener('end', () => {
            this.rcgdVoice = this.startRecognitionNew();
            this.recognition.onresult = (event: any) => {
              let cofirmation = event.results[0][0].transcript;
              console.log(cofirmation);
              console.log(event.results[0]);
              if (cofirmation = 'okay' || cofirmation.includes('ok')) {
                this.proceedTosecurityCode();
              }
              else {
                this.sayInVoice('You have cancel the trasaction');
              }
            }
          });
        });
      }
    });
  }

  confirmation() {
    this.rcgdVoice = this.startRecognitionNew();
    this.recognition.onresult = (event: any) => {
      this.transcript = event.results[0][0].transcript;
      console.log(this.transcript);
      if (this.transcript.includes('yes')) {
        this.proceedTosecurityCode();
      }
      else {
        this.sayInVoice('You have cancel the trasaction');
      }
    }
  }

  proceedTosecurityCode() {
    this.sayInVoice('Please specify security code');
    this.utterance.addEventListener('end', () => {
      this.rcgdVoice = this.startRecognitionNew();
      this.recognition.onresult = (event: any) => {
        this.securityCode = event.results[0][0].transcript;
        this.securityCode = this.securityCode.toUpperCase()
        this.confirmPayment();
      }
    });
  }

  confirmPayment() {
    this.sayInVoice('Security code is accepted');

    this.dataService.getDataFromApi(`account/sendMoney/{accountNumber}/{amount}/{payee}?accountNumber=${this.accountNumber}&amount=${this.amount}&payee=${this.payee}&securityCode=${this.securityCode}`).subscribe((data: any) => {

      $('#business-tagline-final').text(data[0]);
      this.sayInVoice(data[0]);
    });

    $('#ul-lst').html('');

  }


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
