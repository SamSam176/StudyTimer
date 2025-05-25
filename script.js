//Variabili globali
let timer = null;
let IsRunning = false;
let sessione = "study";
let tempo_rim = 1500; // 25min

let TimerCount = 0;
let SessioniCompletate = 0;
let TempoLavoroTot = 0;

const audioCambioSessione = new Audio("audio/avviso.mp3");

//Collegamento codice HTML
const TimerDisplay = document.getElementById("timer");
const TempoSessione = document.getElementById("sessione");

const start_t = document.getElementById("start");
const pause_t = document.getElementById("pause");
const reset_t = document.getElementById("reset");

const StudyInput = document.getElementById("durata_studio");
const ShortBreakInput = document.getElementById("durata_pausa_b");
const LongBreakInput = document.getElementById("durata_pausa_l");

const DisplayCompletate = document.getElementById("sessioni_completate");
const DisplayTempoTot = document.getElementById("tempo_studio_tot");

//Funzione aggiornamento timer
function AggiornaTimerDisplay() {
  const minuti = String(Math.floor(tempo_rim / 60)).padStart(2, '0'); //Calc min
  const secondi = String(tempo_rim % 60).padStart(2, '0'); //Calc sec
  TimerDisplay.textContent = `${minuti}:${secondi}`;
}

//Funzione modifica tempi
function ImpTempoSessione() { //Converte stringhe in interi
  const study = parseInt(StudyInput.value);
  const short = parseInt(ShortBreakInput.value);
  const long = parseInt(LongBreakInput.value);

  //Controllo errore
  if ([study, short, long].some(val => isNaN(val) || val < 1)) {
    alert("Inserisci durate valide maggiori di zero.");
    return false;
  }

  //Imposta tempo in base alla scelta
  if (sessione === "study") {
    tempo_rim = study * 60;
  } else if (sessione === "short") {
    tempo_rim = short * 60;
  } else {
    tempo_rim = long * 60;
  }

  return true;
}

//Funzione aggiorna testo in base alla sessione attiva
function AggiornaTestoSessione() {
  TempoSessione.textContent =
    sessione === "study" ? "Sessione di studio" :
    sessione === "short" ? "Pausa breve" :
    "Pausa lunga";
}

//Funzione avvio timer
function AvviaTimer() {
  if (IsRunning) return;

  if (tempo_rim <= 0) {
    if (!ImpTempoSessione()) return;
    AggiornaTestoSessione();
    AggiornaTimerDisplay();
  }

  if (tempo_rim <= 0) {
    alert("Errore: Durata della sessione non valida.");
    return;
  }

  IsRunning = true;

  //Avvia timer
  timer = setInterval(() => {
    if (tempo_rim > 0) {
      tempo_rim--;
      AggiornaTimerDisplay();
    } else {
      //A tempo scaduto
      clearInterval(timer);
      IsRunning = false;

      //Riproduci audio a fine sessione
      clearInterval(timer);
      IsRunning = false;
      audioCambioSessione.play();

      //Aggiornamento statistiche
      if (sessione === "study") {
        SessioniCompletate++;
        TempoLavoroTot += parseInt(StudyInput.value);
        DisplayCompletate.textContent = SessioniCompletate;
        DisplayTempoTot.textContent = TempoLavoroTot;

        TimerCount++;
        sessione = (TimerCount % 4 === 0) ? "long" : "short"; //Avvio pausa lunga ogni 4 sessioni
      } else {
        sessione = "study"; //Ritorno allo studio dopo una pausa
      }
      //Imposta nuova sessione e riavvia automaticamente
      if (ImpTempoSessione()) {
        AggiornaTestoSessione();
        AggiornaTimerDisplay();
        AvviaTimer();
      }
    }
  }, 1000);
}

//Funzione pausa timer
function StopTimer() {
  clearInterval(timer);
  IsRunning = false;
}

//Funzione reset timer
function ResetTimer() {
  clearInterval(timer);
  IsRunning = false;
  sessione = "study";
  TimerCount = 0;
  if (ImpTempoSessione()) {
    AggiornaTestoSessione();
    AggiornaTimerDisplay();
  }
}

//Collegamento pulsanti e input
start_t.addEventListener("click", AvviaTimer); //Avvia
pause_t.addEventListener("click", StopTimer); //Pausa
reset_t.addEventListener("click", ResetTimer); //Reset

StudyInput.addEventListener("change", ResetTimer); //Cambia durata studio e resetta
ShortBreakInput.addEventListener("change", ResetTimer); //Cambia pausa breve e resetta
LongBreakInput.addEventListener("change", ResetTimer); //Cambia pausa lunga e resetta

ResetTimer(); //Reset all'avvio
