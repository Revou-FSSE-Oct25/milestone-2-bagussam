// --- IMPORTANT: Wait for the DOM to be fully loaded before running script ---
document.addEventListener('DOMContentLoaded', () => {
    
    console.log("ArcadeFun System: ONLINE. Event listeners attached.");

    // =========================================
    // 1. NAVIGATION & VIEW FUNCTIONS
    // =========================================

    function showSection(id) {
        // Hide all section views
        document.querySelectorAll('.section-view').forEach(el => el.classList.add('hidden'));
        
        // Find target section
        const target = document.getElementById(id);
        
        if (target) {
            // Show target section
            target.classList.remove('hidden');
            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            console.error("Error: Section with ID '" + id + "' not found!");
        }
    }

    // =========================================
    // 2. ATTACH CLICK LISTENERS
    // =========================================

    // A. NAV MENU (Home, About, Games, Contact)
    const navLinks = document.querySelectorAll('.nav-btn');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor jump
            const targetView = link.getAttribute('data-view');
            showSection(targetView);
        });
    });

    // B. HERO BUTTON (Start Playing)
    const heroBtn = document.getElementById('btn-hero-start');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            showSection('games-view');
        });
    }

    // C. EJECT BUTTON (Return to games menu)
    const ejectBtn = document.getElementById('btn-eject');
    if (ejectBtn) {
        ejectBtn.addEventListener('click', () => {
            showSection('games-view');
        });
    }

    // D. LOAD GAME BUTTONS
    const playBtns = document.querySelectorAll('.btn-play');
    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameType = btn.getAttribute('data-game');
            loadGame(gameType);
        });
    });

    // E. TRANSMIT BUTTON (Contact Form)
    const transmitBtn = document.getElementById('btn-transmit');
    if (transmitBtn) {
        transmitBtn.addEventListener('click', sendMsg);
    }

    // =========================================
    // 3. GAME LOADING LOGIC
    // =========================================

    function loadGame(game) {
        // Show loader overlay
        const loader = document.getElementById('loader-overlay');
        if (loader) loader.classList.remove('hidden');
        
        // Simulate cartridge loading delay (1.5s)
        setTimeout(() => {
            // Hide loader
            if (loader) loader.classList.add('hidden');
            
            // Switch to console view
            showSection('active-game-view');
            
            // Hide all game wrappers first
            document.querySelectorAll('.game-wrapper').forEach(el => el.classList.add('hidden'));
            
            // Show specific game wrapper
            const gameEl = document.getElementById('game-'+game);
            if (gameEl) {
                gameEl.classList.remove('hidden');
            } else {
                console.error("Game wrapper not found: game-" + game);
            }
            
            // Initialize game state
            if(game === 'guessing') initGuess();
            if(game === 'rps') initRPS();
            if(game === 'clicker') initClick();
            
        }, 1500);
    }

    // Contact Message Function
    function sendMsg() {
        let n = document.getElementById('cName').value.trim(); // Name
        let e = document.getElementById('cEmail').value.trim(); // Email
        let m = document.getElementById('cMsg').value.trim();   // Message
        let feedback = document.getElementById('msgFeedback');
        
        // Simple Email Regex Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!n || !e || !m) {
            // Check for empty fields
            feedback.innerText = "🚫 SYSTEM ERROR: INVENTORY EMPTY! EQUIP NAME, EMAIL & MESSAGE TO START QUEST.";
            feedback.style.color = "red";
        } else if (!emailRegex.test(e)) {
            // Check email format
            feedback.innerText = "👾 GLITCH DETECTED: INVALID EMAIL SYNTAX! CHECK YOUR HUD AND TRY AGAIN.";
            feedback.style.color = "red";
        } else {
            // Success
            feedback.innerText = "🏆 ACHIEVEMENT UNLOCKED: MESSAGE SENT! GG WP! STAND BY FOR SERVER REPLY.";
            feedback.style.color = "#00FF00";
            
            // Optional: Clear form
            document.getElementById('cName').value = "";
            document.getElementById('cEmail').value = "";
            document.getElementById('cMsg').value = "";
        }
    }


    // =========================================
    // 4. GAMEPLAY LOGIC
    // =========================================

    // --- GAME 1: NUMBER GUESSING ---
    let gT, gAtt;

    function initGuess(){ 
        gT = Math.floor(Math.random() * 100) + 1; 
        gAtt = 5; 
        
        const resEl = document.getElementById('gRes');
        const inpEl = document.getElementById('gIn');
        const btnEl = document.getElementById('gBtn');

        if(resEl) {
            resEl.innerText = "Attempts: 5"; 
            resEl.style.color = "#00D4FF";
        }
        if(inpEl) inpEl.value = "";
        if(btnEl) btnEl.disabled = false;
    }

    // Listener for Guess Button
    const gBtn = document.getElementById('gBtn');
    if (gBtn) {
        gBtn.addEventListener('click', () => {
            let v = Number(document.getElementById('gIn').value);
            
            if (!v && v !== 0) return; // Validation

            gAtt--;
            
            let resultText = "";
            const resEl = document.getElementById('gRes');
            
            if (v === gT) {
                resultText = "ACCESS GRANTED. SYSTEM UNLOCKED.";
                resEl.style.color = "#00FF00";
                gBtn.disabled = true;
            } else if (gAtt <= 0) {
                resultText = "SYSTEM LOCKDOWN. CODE WAS: " + gT;
                resEl.style.color = "red";
                gBtn.disabled = true;
            } else {
                let hint = v > gT ? "TOO HIGH" : "TOO LOW";
                resultText = hint + " | ATTEMPTS LEFT: " + gAtt;
                resEl.style.color = "#00D4FF";
            }
            resEl.innerText = resultText;
        });
    }

    // --- GAME 2: ROCK PAPER SCISSORS ---
    function initRPS(){ 
        const rRes = document.getElementById('rRes');
        if(rRes) {
            rRes.innerText = "CHOOSE FIGHTER"; 
            rRes.innerHTML = "CHOOSE FIGHTER";
        }
    }

    const getRpsColor = (m) => {
        if(m==='rock') return '#FF4444';
        if(m==='paper') return '#FFDD00';
        return '#00D4FF';
    };

    function playRPS(p){
        let c = ['rock','paper','scissors'][Math.floor(Math.random()*3)];
        let r = "DRAW";
        
        if (
            (p === 'rock' && c === 'scissors') ||
            (p === 'paper' && c === 'rock') ||
            (p === 'scissors' && c === 'paper')
        ) {
            r = "YOU WIN";
        } else if (p !== c) {
            r = "YOU LOSE";
        }
        
        const rRes = document.getElementById('rRes');
        if(rRes) {
            rRes.innerHTML = `<span style="color:${getRpsColor(p)}">${p.toUpperCase()}</span> VS <span style="color:${getRpsColor(c)}">${c.toUpperCase()}</span><br>${r}`;
        }
    }

    // Listener for RPS Buttons
    const rpsBtns = document.querySelectorAll('.rps-btn');
    rpsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const move = btn.getAttribute('data-move');
            playRPS(move);
        });
    });

    // --- GAME 3: CLICKER BLITZ ---
    let cS = 0;
    let cA = false; 
    let cTimer;

    function initClick(){ 
        cS = 0; 
        cA = false; 
        const cTime = document.getElementById('cTime');
        const cScore = document.getElementById('cScore');
        const cBtn = document.getElementById('cBtn');
        const cRes = document.getElementById('cRes');

        if(cTime) cTime.innerText = "10"; 
        if(cScore) cScore.innerText = "0"; 
        if(cBtn) cBtn.disabled = false;
        if(cRes) cRes.innerHTML = 'VOLTAGE: <span id="cScore" style="color:#536DFE">0</span>';
    }

    const cBtn = document.getElementById('cBtn');
    if (cBtn) {
        cBtn.addEventListener('click', () => {
            const cTime = document.getElementById('cTime');
            const cRes = document.getElementById('cRes');
            const currentScoreEl = document.getElementById('cScore');

            // Start timer on first click
            if (!cA && cTime.innerText === "10") {
                cA = true; 
                let t = 10;
                
                cTimer = setInterval(() => {
                    t--; 
                    cTime.innerText = t;
                    
                    if(t <= 0){ 
                        clearInterval(cTimer); 
                        cA = false; 
                        cRes.innerHTML = "MAX VOLTAGE: " + cS; 
                        cBtn.disabled = true;
                    }
                }, 1000);
            }
            
            // Count score
            if (cA) { 
                cS++; 
                if(currentScoreEl) currentScoreEl.innerText = cS; 
            }
        });
    }

});