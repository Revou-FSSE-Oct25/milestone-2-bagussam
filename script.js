// --- NAV & ROUTING ---
function showSection(id) {
    // Hide all main views
    document.querySelectorAll('.section-view').forEach(el => el.classList.add('hidden'));
    
    // Show the target view
    document.getElementById(id).classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function loadGame(game) {
    // Show loader
    document.getElementById('loader-overlay').classList.remove('hidden');
    
    // Simulate loading delay (1.5 seconds)
    setTimeout(() => {
        // Hide loader
        document.getElementById('loader-overlay').classList.add('hidden');
        
        // Switch to active game console view
        showSection('active-game-view');
        
        // Hide all specific game wrappers first
        document.querySelectorAll('.game-wrapper').forEach(el => el.classList.add('hidden'));
        
        // Show the specific game requested
        document.getElementById('game-'+game).classList.remove('hidden');
        
        // Initialize the game state
        if(game === 'guessing') initGuess();
        if(game === 'rps') initRPS();
        if(game === 'clicker') initClick();
        
    }, 1500);
}

function sendMsg() {
    let n = document.getElementById('cName').value;
    let feedback = document.getElementById('msgFeedback');
    
    if(n) {
        feedback.innerText = "SIGNAL RECEIVED. WELCOME, AGENT " + n.toUpperCase() + ".";
        feedback.style.color = "#00FF00";
    } else {
        feedback.innerText = "ERROR: IDENTIFY YOURSELF!";
        feedback.style.color = "red";
    }
}

// --- GAME LOGIC ---

// 1. Number Guessing Logic
let gT, gAtt;

function initGuess(){ 
    gT = Math.floor(Math.random() * 100) + 1; 
    gAtt = 5; 
    document.getElementById('gRes').innerText = "Attempts: 5"; 
    document.getElementById('gIn').value = "";
}

document.getElementById('gBtn').addEventListener('click', () => {
    let v = Number(document.getElementById('gIn').value);
    
    if (!v) return;

    gAtt--;
    
    let resultText = "";
    
    if (v === gT) {
        resultText = "ACCESS GRANTED. SYSTEM UNLOCKED.";
        document.getElementById('gRes').style.color = "#00FF00";
        document.getElementById('gBtn').disabled = true;
    } else if (gAtt <= 0) {
        resultText = "SYSTEM LOCKDOWN. CODE WAS: " + gT;
        document.getElementById('gRes').style.color = "red";
        document.getElementById('gBtn').disabled = true;
    } else {
        let hint = v > gT ? "TOO HIGH" : "TOO LOW";
        resultText = hint + " | ATTEMPTS LEFT: " + gAtt;
        document.getElementById('gRes').style.color = "#00D4FF";
    }
    
    document.getElementById('gRes').innerText = resultText;
});


// 2. Rock Paper Scissors Logic
function initRPS(){ 
    document.getElementById('rRes').innerText = "CHOOSE FIGHTER"; 
    document.getElementById('rRes').innerHTML = "CHOOSE FIGHTER";
}

function playRPS(p){
    let c = ['rock','paper','scissors'][Math.floor(Math.random()*3)];
    let r = "DRAW";
    
    // Logic
    if (
        (p === 'rock' && c === 'scissors') ||
        (p === 'paper' && c === 'rock') ||
        (p === 'scissors' && c === 'paper')
    ) {
        r = "YOU WIN";
    } else if (p !== c) {
        r = "YOU LOSE";
    }
    
    // Helper for colors
    const getColor = (m) => {
        if(m==='rock') return '#FF4444';
        if(m==='paper') return '#FFDD00';
        return '#00D4FF';
    };

    // Visual feedback
    document.getElementById('rRes').innerHTML = 
        `<span style="color:${getColor(p)}">${p.toUpperCase()}</span> VS <span style="color:${getColor(c)}">${c.toUpperCase()}</span><br>${r}`;
}


// 3. Clicker Blitz Logic
let cS = 0;
let cA = false; 
let cTimer;

function initClick(){ 
    cS = 0; 
    cA = false; 
    document.getElementById('cTime').innerText = "10"; 
    document.getElementById('cScore').innerText = "0"; 
    document.getElementById('cBtn').disabled = false;
    document.getElementById('cRes').innerHTML = 'VOLTAGE: <span id="cScore" style="color:#536DFE">0</span>';
}

document.getElementById('cBtn').addEventListener('click', () => {
    // Start timer on first click
    if (!cA && document.getElementById('cTime').innerText === "10") {
        cA = true; 
        let t = 10;
        
        cTimer = setInterval(() => {
            t--; 
            document.getElementById('cTime').innerText = t;
            
            if(t <= 0){ 
                clearInterval(cTimer); 
                cA = false; 
                document.getElementById('cRes').innerHTML = "MAX VOLTAGE: " + cS; 
                document.getElementById('cBtn').disabled = true;
            }
        }, 1000);
    }
    
    // Count clicks if active
    if (cA) { 
        cS++; 
        document.getElementById('cScore').innerText = cS; 
    }
});