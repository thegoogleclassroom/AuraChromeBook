/* ===== ECHO OS CORE JAVASCRIPT ===== */
/* Complete reconstructed script.js - All interactive functionality */

// ==================== GLOBAL STATE ====================
let currentZIndex = 100;
let activeWindows = [];
let installedApps = [];
let installedGames = [];
let favorites = [];
let recentApps = [];
let currentDesk = 0;
let desks = [{name: 'Desk 1', windows: []}];
let currentUser = null;
let accounts = [];
let isDarkTheme = true;
let batterySaver = false;
let mediaState = { playing: false, track: '', artist: '', currentTime: 0, duration: 0 };
let currentCalendarDate = new Date();
let launcherContextTarget = null;
let currentStoreCategory = 'all';
let currentSidebarCategory = 'games';
let currentPlayStoreTab = 'home';
let setupData = {};
let updateCountdown = 5;
let updateTimer = null;

// ==================== GAME/APPS DATA ====================
const ALL_GAMES = [
    { id: 'infinitecraft', name: 'Infinite Craft', icon: '⚗️', src: 'Games/infinitecraft.html', category: 'simulation', desc: 'Combine elements to create new ones in this creative sandbox game.' },
    { id: 'paperio', name: 'Paper.io', icon: '📄', src: 'Games/paperio.html', category: 'arcade', desc: 'Capture territory and eliminate opponents in this addictive io game.' },
    { id: 'parkingfury', name: 'Parking Fury', icon: '🅿️', src: 'Games/parkingfury.html', category: 'simulation', desc: 'Test your parking skills in challenging scenarios.' },
    { id: 'granny3', name: 'Granny 3', icon: '👵', src: 'Games/granny3.html', category: 'horror', desc: 'Escape from Granny's haunted house in this terrifying horror game.' },
    { id: 'fridaynightfunk', name: 'Friday Night Funkin', icon: '🎤', src: 'Games/FridayNightFunk.html', category: 'arcade', desc: 'Rhythm-based battle game with catchy tunes and challenging beats.' },
    { id: 'geometrydash', name: 'Geometry Dash', icon: '📐', src: 'Games/Geo-Dash.html', category: 'arcade', desc: 'Jump and fly through dangerous passages in this rhythm-based platformer.' },
    { id: 'smashcarts', name: 'Smash Carts', icon: '🏎️', src: 'Games/smash carts.html', category: 'racing', desc: 'Kart racing battle royale with weapons and power-ups.' },
    { id: 'eaglercraft', name: 'Eaglercraft', icon: '⛏️', src: 'Games/Eaglercraft.html', category: 'simulation', desc: 'Browser-based Minecraft clone with multiplayer support.' },
    { id: 'fnae', name: 'Five Nights at Epstein's', icon: '🐻', src: "Games/Five Nights at Epstein's.html", category: 'horror', desc: 'Survive the night in this parody horror game.' },
    { id: 'granny', name: 'Granny', icon: '👵', src: 'Games/Granny.html', category: 'horror', desc: 'Classic horror escape game from the terrifying Granny.' },
    { id: 'escaperoad', name: 'Escape Road', icon: '🚗', src: 'Games/Escape Road.html', category: 'racing', desc: 'Drive and escape from pursuing police in high-speed chases.' },
    { id: 'escaperoad2', name: 'Escape Road 2', icon: '🏎️', src: 'Games/Escape Road 2.html', category: 'racing', desc: 'Sequel with more vehicles, bigger maps, and intense police chases.' },
    { id: 'solarsmash', name: 'Solar Smash', icon: '🪐', src: 'Games/Solar Smash.html', category: 'simulation', desc: 'Destroy planets with various weapons and watch the destruction.' },
    { id: 'brainrot', name: 'Steal a Brainrot', icon: '🧠', src: 'Games/Steal a Brainrot.html', category: 'arcade', desc: 'Funny meme-based game with brainrot characters.' },
    { id: 'ragdollhit', name: 'Ragdoll Hit', icon: '🥊', src: 'Games/Ragdoll Hit.html', category: 'action', desc: 'Physics-based fighting game with ragdoll mechanics.' },
    { id: 'ragdollarchers', name: 'Ragdoll Archers', icon: '🏹', src: 'Games/Ragdoll Archers.html', category: 'action', desc: 'Archery battle game with realistic ragdoll physics.' },
    { id: '99nights', name: '99 Nights in the Forest', icon: '🌲', src: 'Games/99 Nights.html', category: 'horror', desc: 'Survive 99 nights in a dark and dangerous forest.' },
    { id: 'rocketleague', name: 'Rocket League', icon: '⚽', src: 'Games/Rocket League.html', category: 'sports', desc: 'Soccer with rocket-powered cars in this high-octane sports game.' },
    { id: 'bballrandom', name: 'Basketball Random', icon: '🏀', src: 'Games/Basketball Random.html', category: 'sports', desc: 'Randomized basketball game with unpredictable physics.' },
    { id: 'bballbros', name: 'Basketball Bros', icon: '🏀', src: 'Games/Basketball Bros.html', category: 'sports', desc: 'Arcade-style basketball game with Bros characters.' },
    { id: 'bballlegend', name: 'Basketball Legend', icon: '🏀', src: 'Games/Basketball Legend.html', category: 'sports', desc: 'Become a basketball legend in this career simulation.' },
    { id: 'roblox', name: 'Roblox', icon: '🟥', src: 'Games/Roblox.html', category: 'simulation', desc: 'Play millions of games created by the community.' },
    { id: 'gtavice', name: 'GTA III: Vice City', icon: '🚔', src: 'Games/GTA-Vice.html', category: 'action', desc: 'Classic open-world action game set in Vice City.' },
    { id: 'pixelfruits', name: 'Pixel Fruits', icon: '🍎', src: 'Games/PixelFruit.html', category: 'arcade', desc: 'Merge fruits in this addictive puzzle game.' },
    { id: 'aceattorney', name: 'Ace Attorney', icon: '⚖️', src: 'Games/aceattorney.html', category: 'simulation', desc: 'Courtroom drama visual novel game.' },
    { id: 'callofduty', name: 'Call of Duty', icon: '🔫', src: 'Games/callofdutymodern.html', category: 'action', desc: 'First-person shooter with intense modern warfare action.' },
    { id: 'stateio', name: 'State.io', icon: '🗺️', src: 'Games/stateio.html', category: 'strategy', desc: 'Conquer states and expand your territory in this strategy game.' },
    { id: 'undertaleyellow', name: 'Undertale Yellow', icon: '💛', src: 'Games/undertaleyellow.html', category: 'rpg', desc: 'Fan-made Undertale prequel with original story.' },
    { id: 'yanderesim', name: 'Yandere Simulator', icon: '🔪', src: 'Games/yanderesim.html', category: 'simulation', desc: 'Stealth action game about eliminating rivals for your senpai.' },
    { id: 'doodlejump', name: 'Doodle Jump', icon: '🐰', src: 'Games/DoodleJump.html', category: 'arcade', desc: 'Jump endlessly upward in this classic mobile game.' },
    { id: 'drivingsimulator', name: 'Driving Simulator', icon: '🚗', src: 'Games/Driving Simulator.html', category: 'simulation', desc: 'Realistic driving simulation with various vehicles.' },
    { id: 'effingzombies', name: 'Effing Zombies', icon: '🧟', src: 'Games/effing zombies.html', category: 'action', desc: 'Survive waves of zombies in this action shooter.' },
    { id: 'granny2', name: 'Granny 2', icon: '👵', src: 'Games/granny2.html', category: 'horror', desc: 'The terrifying sequel to Granny with new areas and puzzles.' },
    { id: 'pokemon', name: 'Pokemon', icon: '⚡', src: 'Games/pokemon-wip.html', category: 'rpg', desc: 'Classic Pokemon RPG adventure in your browser.' },
    { id: '1v1lol', name: '1v1.LOL', icon: '🔫', src: 'Games/1v1 LOL.html', category: 'action', desc: 'Build and battle in this fast-paced third-person shooter.' },
    { id: 'bitlife', name: 'Bitlife', icon: '📱', src: 'Games/bitlife.html', category: 'simulation', desc: 'Live your virtual life from birth to death making choices.' },
    { id: 'footballbros', name: 'Football Bros', icon: '🏈', src: 'Games/football-bros.html', category: 'sports', desc: 'Arcade-style football game with Retro Bowl vibes.' }
];

const ALL_APPS = [
    { id: 'discord', name: 'Discord', icon: '💬', src: 'Apps/Discord.html', category: 'apps', desc: 'Chat and voice communication platform for gamers.' },
    { id: 'echoflix', name: 'EchoFlix', icon: '🎬', src: 'Apps/EchoFlix.html', category: 'apps', desc: 'Stream movies and TV shows in your browser.' },
    { id: 'echomusic', name: 'Echo Music', icon: '🎵', src: 'Apps/EchoOS Music.html', category: 'apps', desc: 'Music streaming and discovery platform.' },
    { id: 'robloxanimator', name: 'Roblox Animator V1.7', icon: '🎬', src: 'Apps/Roblox Animator.html', category: 'apps', desc: 'Create and animate Roblox characters.' },
    { id: 'chrome', name: 'Chrome', icon: '🌐', src: 'Apps/ChromeReworked.html', category: 'apps', desc: 'Web browser for surfing the internet.' }
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initOS();
});

function initOS() {
    loadSettings();
    loadAccounts();
    initClock();
    initBattery();
    initCalendar();
    initDesktopIcons();
    initWindowManager();
    initContextMenu();
    initLauncherContextMenu();
    initTaskbarDrag();
    initFileExplorer();
    initCalculator();
    initNotepad();
    initPlayStore();
    initLinkCreator();
    initMediaControl();
    initDeskSystem();
    initBrightnessSlider();
    initWallpaperUpload();
    initKeyboardShortcuts();
    initCalendarModalClose();

    // Boot sequence
    setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) {
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.style.display = 'none';
                checkFirstBoot();
            }, 500);
        }
    }, 2000);
}


// ==================== SETTINGS & STORAGE ====================
function loadSettings() {
    const theme = localStorage.getItem('echoos_theme');
    if (theme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        isDarkTheme = false;
    }

    const wallpaper = localStorage.getItem('echoos_wallpaper');
    if (wallpaper) {
        document.getElementById('desktop').style.backgroundImage = `url('${wallpaper}')`;
    }

    const cloak = localStorage.getItem('echoos_cloak');
    if (cloak) {
        changeTabCloak(cloak);
        const selector = document.getElementById('cloak-selector');
        if (selector) selector.value = cloak;
    }

    const abSetting = localStorage.getItem('echoos_aboutblank');
    if (abSetting) {
        aboutBlankSetting = abSetting;
        const abSelect = document.getElementById('aboutblank-setting');
        if (abSelect) abSelect.value = abSetting;
        const blockedMsg = document.getElementById('aboutblank-blocked-msg');
        if (blockedMsg) blockedMsg.style.display = abSetting === 'never' ? 'block' : 'none';
    }

    installedApps = JSON.parse(localStorage.getItem('echoos_installed_apps') || '[]');
    installedGames = JSON.parse(localStorage.getItem('echoos_installed_games') || '[]');
    favorites = JSON.parse(localStorage.getItem('echoos_favorites') || '[]');
    recentApps = JSON.parse(localStorage.getItem('echoos_recent_apps') || '[]');

    const savedDesks = localStorage.getItem('echoos_desks');
    if (savedDesks) {
        desks = JSON.parse(savedDesks);
    }
}

function saveSettings() {
    localStorage.setItem('echoos_installed_apps', JSON.stringify(installedApps));
    localStorage.setItem('echoos_installed_games', JSON.stringify(installedGames));
    localStorage.setItem('echoos_favorites', JSON.stringify(favorites));
    localStorage.setItem('echoos_recent_apps', JSON.stringify(recentApps));
    localStorage.setItem('echoos_desks', JSON.stringify(desks));
}

// ==================== ACCOUNT SYSTEM ====================
function loadAccounts() {
    accounts = JSON.parse(localStorage.getItem('echoos_accounts') || '[]');
}

function saveAccounts() {
    localStorage.setItem('echoos_accounts', JSON.stringify(accounts));
}

function showAccountModal() {
    const modal = document.getElementById('account-modal');
    if (modal) modal.style.display = 'flex';
    const signinView = document.getElementById('account-signin-view');
    const createView = document.getElementById('account-create-view');
    const error = document.getElementById('account-error');
    if (signinView) signinView.style.display = 'block';
    if (createView) createView.style.display = 'none';
    if (error) error.textContent = '';
}

function showCreateAccount() {
    document.getElementById('account-signin-view').style.display = 'none';
    document.getElementById('account-create-view').style.display = 'block';
    document.getElementById('account-error').textContent = '';
}

function showSignIn() {
    document.getElementById('account-signin-view').style.display = 'block';
    document.getElementById('account-create-view').style.display = 'none';
    document.getElementById('account-error').textContent = '';
}

function updateEmailPreview() {
    const username = document.getElementById('create-username-input').value;
    const preview = document.getElementById('email-preview');
    if (preview) preview.textContent = username ? `${username}@echoos.com` : '';
}

function createAccount() {
    const name = document.getElementById('create-name-input').value.trim();
    const username = document.getElementById('create-username-input').value.trim();
    const password = document.getElementById('create-password-input').value;
    const confirm = document.getElementById('create-confirm-input').value;
    const errorEl = document.getElementById('account-error');

    if (!name || !username || !password) {
        errorEl.textContent = 'Please fill in all fields.';
        return;
    }

    if (password !== confirm) {
        errorEl.textContent = 'Passwords do not match.';
        return;
    }

    const email = `${username}@echoos.com`;
    if (accounts.find(a => a.email === email)) {
        errorEl.textContent = 'An account with this email already exists.';
        return;
    }

    const account = { name, username, email, password, avatar: '👤' };
    accounts.push(account);
    saveAccounts();

    currentUser = account;
    localStorage.setItem('echoos_current_account', JSON.stringify(account));

    document.getElementById('account-modal').style.display = 'none';
    showLoadingScreen(account);
}

function signInAccount() {
    const email = document.getElementById('account-email-input').value.trim();
    const password = document.getElementById('account-password-input').value;
    const errorEl = document.getElementById('account-error');

    const account = accounts.find(a => a.email === email && a.password === password);
    if (!account) {
        errorEl.textContent = 'Invalid email or password.';
        return;
    }

    currentUser = account;
    localStorage.setItem('echoos_current_account', JSON.stringify(account));

    document.getElementById('account-modal').style.display = 'none';
    showLoadingScreen(account);
}

function showLoadingScreen(account) {
    const loadingScreen = document.getElementById('account-loading-screen');
    if (!loadingScreen) return;

    loadingScreen.style.display = 'flex';
    const avatar = document.getElementById('loading-avatar');
    const email = document.getElementById('loading-email');
    if (avatar) avatar.textContent = account.avatar || '👤';
    if (email) email.textContent = account.email;

    const progress = document.getElementById('loading-progress');
    const details = document.getElementById('loading-details');
    const steps = ['Initializing...', 'Loading preferences...', 'Restoring apps...', 'Preparing desktop...', 'Welcome!'];

    let step = 0;
    const interval = setInterval(() => {
        step++;
        if (progress) progress.style.width = `${(step / steps.length) * 100}%`;
        if (details) details.textContent = steps[step - 1];
        if (step >= steps.length) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                showLockScreen();
            }, 500);
        }
    }, 400);
}

function loadCurrentAccount() {
    const saved = localStorage.getItem('echoos_current_account');
    if (saved) {
        currentUser = JSON.parse(saved);
    }
}

function switchAccount() {
    const settingsWin = document.getElementById('settings-window');
    if (settingsWin) settingsWin.style.display = 'none';
    showAccountModal();
}

function signOutAccount() {
    currentUser = null;
    localStorage.removeItem('echoos_current_account');
    location.reload();
}

// ==================== LOCK SCREEN ====================
function showLockScreen() {
    if (!currentUser) return;

    const lockScreen = document.getElementById('lock-screen');
    if (!lockScreen) return;

    lockScreen.style.display = 'flex';

    const usernameEl = document.getElementById('echo-lock-username');
    const emailEl = document.getElementById('echo-lock-email');
    const passInput = document.getElementById('lock-password');
    const errorEl = document.getElementById('lock-error');
    const securityHint = document.getElementById('security-hint');

    if (usernameEl) usernameEl.textContent = currentUser.name;
    if (emailEl) emailEl.textContent = currentUser.email;
    if (passInput) passInput.value = '';
    if (errorEl) errorEl.style.display = 'none';
    if (securityHint) securityHint.style.display = 'none';

    updateLockAccountsList();
}

function updateLockAccountsList() {
    const list = document.getElementById('lock-accounts-list');
    if (!list) return;

    list.innerHTML = '';

    accounts.forEach(acc => {
        const item = document.createElement('div');
        item.className = `lock-account-item ${acc.email === currentUser.email ? 'active' : ''}`;
        item.innerHTML = `
            <div class="lock-account-avatar">${acc.avatar || '👤'}</div>
            <div class="lock-account-info">
                <div class="lock-account-name">${acc.name}</div>
                <div class="lock-account-email">${acc.email}</div>
            </div>
            <button class="lock-account-remove" onclick="event.stopPropagation(); removeAccount('${acc.email}')">×</button>
        `;
        item.onclick = () => {
            currentUser = acc;
            localStorage.setItem('echoos_current_account', JSON.stringify(acc));
            showLockScreen();
        };
        list.appendChild(item);
    });
}

function removeAccount(email) {
    accounts = accounts.filter(a => a.email !== email);
    saveAccounts();
    if (currentUser && currentUser.email === email) {
        currentUser = accounts[0] || null;
        if (currentUser) {
            localStorage.setItem('echoos_current_account', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('echoos_current_account');
        }
    }
    updateLockAccountsList();
}

function showAccountModalFromLock() {
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen) lockScreen.style.display = 'none';
    showAccountModal();
}

function unlockOS() {
    const password = document.getElementById('lock-password').value;
    const savedPass = localStorage.getItem('echoos_password');
    const errorEl = document.getElementById('lock-error');

    if (savedPass && password !== savedPass) {
        if (errorEl) errorEl.style.display = 'block';
        return;
    }

    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen) lockScreen.style.display = 'none';

    const hasSeenUpdate = localStorage.getItem('echoos_seen_update_v18');
    if (!hasSeenUpdate) {
        showUpdateModal();
    }
}

function showSecurityQuestion() {
    const question = localStorage.getItem('echoos_security_question');
    const hint = document.getElementById('security-hint');
    const text = document.getElementById('lock-question-text');

    if (hint) hint.style.display = 'block';
    if (text) {
        text.textContent = question || 'No security question set. Please contact support.';
    }
}

function lockSystem() {
    showLockScreen();
}

// ==================== SETUP / OOBE ====================
function processSetupStep1() {
    const name = document.getElementById('setup-name-input').value.trim();
    if (!name) {
        alert('Please enter your name.');
        return;
    }
    setupData.name = name;
    document.getElementById('setup-step-1').classList.remove('active');
    document.getElementById('setup-step-2').classList.add('active');
}

function processSetupStep2(skip) {
    if (!skip) {
        const pass = document.getElementById('setup-pass-input').value;
        if (pass) {
            localStorage.setItem('echoos_password', pass);
        }
    }
    document.getElementById('setup-step-2').classList.remove('active');
    document.getElementById('setup-step-3').classList.add('active');
}

function finalizeSetup() {
    localStorage.setItem('echoos_setup_complete', 'true');
    localStorage.setItem('echoos_user_name', setupData.name);
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('welcome-modal').style.display = 'flex';
}

function closeWelcomeModal() {
    document.getElementById('welcome-modal').style.display = 'none';
    showAccountModal();
}

// ==================== UPDATE MODAL ====================
function showUpdateModal() {
    const modal = document.getElementById('update-modal');
    if (!modal) return;
    modal.style.display = 'flex';

    const btn = document.getElementById('update-continue-btn');
    if (!btn) return;

    btn.disabled = true;
    btn.classList.remove('active');
    updateCountdown = 5;
    btn.textContent = `Continue (${updateCountdown})`;

    updateTimer = setInterval(() => {
        updateCountdown--;
        if (updateCountdown <= 0) {
            clearInterval(updateTimer);
            btn.disabled = false;
            btn.classList.add('active');
            btn.textContent = 'Continue';
            btn.onclick = closeUpdateModal;
        } else {
            btn.textContent = `Continue (${updateCountdown})`;
        }
    }, 1000);
}

function closeUpdateModal() {
    const modal = document.getElementById('update-modal');
    if (modal) modal.style.display = 'none';
    localStorage.setItem('echoos_seen_update_v18', 'true');
}

// ==================== ABOUT:BLANK ====================
function handleAboutBlank(choice) {
    const modal = document.getElementById('aboutblank-modal');
    if (modal) modal.style.display = 'none';

    if (choice === 'always') {
        localStorage.setItem('echoos_aboutblank', 'always');
        goIntoAboutBlank();
    } else if (choice === 'once') {
        goIntoAboutBlank();
    } else if (choice === 'block') {
        localStorage.setItem('echoos_aboutblank', 'never');
    }
}

function goIntoAboutBlank() {
    const url = window.location.href;
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head><title>New Tab</title></head>
            <body style="margin:0;padding:0;">
                <iframe src="${url}" style="width:100vw;height:100vh;border:none;"></iframe>
            </body>
            </html>
        `);
        newWindow.document.close();
    }
}

function saveAboutBlankSetting() {
    const val = document.getElementById('aboutblank-setting').value;
    localStorage.setItem('echoos_aboutblank', val);
    aboutBlankSetting = val;

    const blockedMsg = document.getElementById('aboutblank-blocked-msg');
    if (blockedMsg) blockedMsg.style.display = val === 'never' ? 'block' : 'none';
}


// ==================== WINDOW MANAGEMENT ====================
function openApp(windowId) {
    const win = document.getElementById(windowId);
    if (!win) {
        // Try to find the item data and create window dynamically
        const allItems = [...ALL_GAMES, ...ALL_APPS];
        const item = allItems.find(i => i.id + '-window' === windowId || i.id === windowId.replace('-window', ''));
        if (item) {
            ensureWindowExists(item.id, item.name, item.icon, item.src);
            // Try again after creating
            setTimeout(() => {
                const newWin = document.getElementById(windowId);
                if (newWin) {
                    activateWindow(newWin, windowId);
                }
            }, 50);
            return;
        }
        console.warn('Window not found:', windowId);
        return;
    }

    activateWindow(win, windowId);
}

function activateWindow(win, windowId) {
    // Lazy load iframe if data-src exists
    const iframe = win.querySelector('iframe[data-src]');
    if (iframe && !iframe.src) {
        iframe.src = iframe.getAttribute('data-src');
    }

    win.style.display = 'flex';
    win.style.zIndex = ++currentZIndex;
    win.classList.remove('minimized');

    if (!activeWindows.includes(windowId)) {
        activeWindows.push(windowId);
    }

    updateTaskbar();
    addToRecent(windowId);

    // Desk management
    if (!desks[currentDesk].windows.includes(windowId)) {
        desks[currentDesk].windows.push(windowId);
    }
    updateDeskVisibility();
}

function closeApp(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    win.style.display = 'none';
    win.classList.remove('minimized', 'fullscreen');

    activeWindows = activeWindows.filter(id => id !== windowId);

    // Unload iframe to save memory
    const iframe = win.querySelector('iframe');
    if (iframe) {
        iframe.src = '';
    }

    updateTaskbar();

    // Remove from desk
    desks[currentDesk].windows = desks[currentDesk].windows.filter(id => id !== windowId);
    updateDeskVisibility();
}

function minimizeApp(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.classList.add('minimized');
    updateTaskbar();
}

function maximizeApp(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.classList.toggle('fullscreen');
}

function toggleApp(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.style.display === 'none' || win.classList.contains('minimized')) {
        openApp(windowId);
    } else if (win.style.zIndex < currentZIndex) {
        win.style.zIndex = ++currentZIndex;
    } else {
        minimizeApp(windowId);
    }
}

function updateTaskbar() {
    document.querySelectorAll('.app-icon').forEach(icon => {
        const windowId = icon.id.replace('taskbar-', '');
        const win = document.getElementById(windowId);

        if (win && win.style.display !== 'none' && !win.classList.contains('minimized')) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

function initWindowManager() {
    document.querySelectorAll('.window').forEach(win => {
        const header = win.querySelector('.window-header');
        if (!header) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.win-btn')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = win.offsetLeft;
            startTop = win.offsetTop;
            win.classList.add('dragging');
            win.style.zIndex = ++currentZIndex;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            win.style.left = `${startLeft + e.clientX - startX}px`;
            win.style.top = `${startTop + e.clientY - startY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                win.classList.remove('dragging');
            }
        });

        win.addEventListener('mousedown', () => {
            win.style.zIndex = ++currentZIndex;
        });
    });
}

// ==================== DESK SYSTEM ====================
function initDeskSystem() {
    updateDeskIndicator();
}

function addNewDesk() {
    const newDeskNum = desks.length + 1;
    desks.push({ name: `Desk ${newDeskNum}`, windows: [] });
    switchToDesk(desks.length - 1);
}

function switchToDesk(index) {
    if (index < 0 || index >= desks.length) return;

    // Hide current desk windows
    desks[currentDesk].windows.forEach(id => {
        const win = document.getElementById(id);
        if (win) win.classList.add('desk-hidden');
    });

    currentDesk = index;

    // Show new desk windows
    desks[currentDesk].windows.forEach(id => {
        const win = document.getElementById(id);
        if (win) win.classList.remove('desk-hidden');
    });

    updateDeskIndicator();
    saveSettings();
}

function switchToPrevDesk() {
    if (currentDesk > 0) switchToDesk(currentDesk - 1);
}

function switchToNextDesk() {
    if (currentDesk < desks.length - 1) switchToDesk(currentDesk + 1);
}

function updateDeskIndicator() {
    const indicator = document.getElementById('current-desk-name');
    if (indicator) indicator.textContent = desks[currentDesk].name;
}

function updateDeskVisibility() {
    desks.forEach((desk, idx) => {
        desk.windows.forEach(id => {
            const win = document.getElementById(id);
            if (win) {
                if (idx === currentDesk) {
                    win.classList.remove('desk-hidden');
                } else {
                    win.classList.add('desk-hidden');
                }
            }
        });
    });
}

// ==================== LAUNCHER ====================
function toggleMenu() {
    const menu = document.getElementById('launcher-menu');
    if (!menu) return;

    if (menu.style.display === 'none' || !menu.style.display) {
        menu.style.display = 'flex';
        updateLauncherRecent();
    } else {
        menu.style.display = 'none';
    }
}

function updateLauncherRecent() {
    const recentSection = document.getElementById('launcher-recent');
    const recentList = document.getElementById('launcher-recent-list');

    if (!recentSection || !recentList) return;

    if (recentApps.length === 0) {
        recentSection.style.display = 'none';
        return;
    }

    recentSection.style.display = 'block';
    recentList.innerHTML = '';

    recentApps.slice(0, 5).forEach(appId => {
        const item = document.querySelector(`.launcher-item[data-app-id="${appId}"]`);
        if (item) {
            const clone = item.cloneNode(true);
            clone.onclick = () => {
                openApp(appId);
                toggleMenu();
            };
            recentList.appendChild(clone);
        }
    });
}

function addToRecent(windowId) {
    recentApps = recentApps.filter(id => id !== windowId);
    recentApps.unshift(windowId);
    if (recentApps.length > 10) recentApps.pop();
    saveSettings();
}

function filterLauncher() {
    const query = document.getElementById('launcher-search').value.toLowerCase();
    document.querySelectorAll('.launcher-item').forEach(item => {
        const name = (item.getAttribute('data-name') || '').toLowerCase();
        item.style.display = name.includes(query) ? 'flex' : 'none';
    });
}

// ==================== CONTEXT MENUS ====================
function initContextMenu() {
    const menu = document.getElementById('context-menu');
    if (!menu) return;

    document.getElementById('desktop').addEventListener('contextmenu', (e) => {
        if (e.target.closest('.window') || e.target.closest('#taskbar')) return;
        e.preventDefault();
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.style.display = 'block';
    });

    document.addEventListener('click', () => {
        menu.style.display = 'none';
    });
}

function initLauncherContextMenu() {
    const menu = document.getElementById('launcher-context-menu');
    if (!menu) return;

    const launcherList = document.getElementById('launcher-list');
    if (!launcherList) return;

    launcherList.addEventListener('contextmenu', (e) => {
        const item = e.target.closest('.launcher-item');
        if (!item) return;
        e.preventDefault();
        launcherContextTarget = item;
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.style.display = 'block';
    });

    document.addEventListener('click', () => {
        menu.style.display = 'none';
    });
}

function launcherContextAction(action) {
    if (!launcherContextTarget) return;
    const appId = launcherContextTarget.getAttribute('data-app-id');
    const name = launcherContextTarget.getAttribute('data-name');

    if (action === 'open') {
        openApp(appId);
        toggleMenu();
    } else if (action === 'addToShelf') {
        showNotification('Added to Shelf', `${name} pinned to taskbar.`);
    } else if (action === 'uninstall') {
        launcherContextTarget.remove();
        showNotification('Uninstalled', 'App has been removed from launcher.');
    }
}

// ==================== DESKTOP ICONS ====================
function initDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        icon.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = icon.offsetLeft;
            startTop = icon.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            icon.style.left = `${startLeft + e.clientX - startX}px`;
            icon.style.top = `${startTop + e.clientY - startY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    });
}

// ==================== TASKBAR DRAG ====================
function initTaskbarDrag() {
    let draggedItem = null;

    document.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('dragstart', (e) => {
            draggedItem = icon;
            icon.classList.add('dragging-icon');
        });

        icon.addEventListener('dragend', () => {
            icon.classList.remove('dragging-icon');
            draggedItem = null;
        });
    });

    const appIcons = document.getElementById('app-icons');
    if (appIcons) {
        appIcons.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
    }
}

// ==================== CLOCK & CALENDAR ====================
function initClock() {
    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const clock = document.getElementById('clock');
        if (clock) clock.textContent = `${hours}:${minutes}`;
    }
    update();
    setInterval(update, 1000);
}

function initCalendar() {
    function update() {
        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayEl = document.getElementById('calendar-day');
        const dateEl = document.getElementById('calendar-date');
        if (dayEl) dayEl.textContent = now.getDate();
        if (dateEl) dateEl.textContent = months[now.getMonth()];
    }
    update();
    setInterval(update, 60000);
}

function toggleCalendar() {
    const modal = document.getElementById('calendar-modal');
    if (!modal) return;

    if (modal.style.display === 'none' || !modal.style.display) {
        modal.style.display = 'flex';
        renderCalendar();
    } else {
        modal.style.display = 'none';
    }
}

function renderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const header = document.getElementById('calendar-month-year');
    if (header) header.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const container = document.getElementById('calendar-days');
    if (!container) return;
    container.innerHTML = '';

    const today = new Date();

    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        container.appendChild(day);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            day.classList.add('today');
        }
        day.textContent = i;
        container.appendChild(day);
    }

    const remaining = (7 - ((firstDay + daysInMonth) % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        container.appendChild(day);
    }
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendar();
}


// ==================== BATTERY ====================
function initBattery() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            updateBatteryDisplay(battery);
            battery.addEventListener('levelchange', () => updateBatteryDisplay(battery));
            battery.addEventListener('chargingchange', () => updateBatteryDisplay(battery));
        });
    } else {
        const qsText = document.getElementById('qs-battery-text');
        const taskbarBat = document.getElementById('taskbar-battery');
        const qsIcon = document.getElementById('qs-battery-icon');
        if (qsText) qsText.textContent = '100%';
        if (taskbarBat) taskbarBat.textContent = '🔋';
        if (qsIcon) qsIcon.textContent = '🔋';
    }
}

function updateBatteryDisplay(battery) {
    const level = Math.round(battery.level * 100);
    const charging = battery.charging;

    const qsText = document.getElementById('qs-battery-text');
    const taskbarBat = document.getElementById('taskbar-battery');
    const qsIcon = document.getElementById('qs-battery-icon');

    if (qsText) qsText.textContent = `${level}%`;
    if (taskbarBat) taskbarBat.textContent = charging ? '⚡' : (level < 20 ? '🪫' : '🔋');
    if (qsIcon) qsIcon.textContent = charging ? '⚡' : (level < 20 ? '🪫' : '🔋');
}

// ==================== QUICK SETTINGS ====================
function toggleQuickSettings() {
    const qs = document.getElementById('quick-settings');
    if (!qs) return;
    qs.style.display = qs.style.display === 'none' || !qs.style.display ? 'block' : 'none';
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('echoos_theme', isDarkTheme ? 'dark' : 'light');
    const themeText = document.getElementById('theme-text');
    if (themeText) themeText.textContent = isDarkTheme ? 'Dark Theme' : 'Light Theme';
}

function toggleBatterySaver() {
    batterySaver = !batterySaver;
    const btn = document.getElementById('battery-saver-btn');
    if (btn) btn.classList.toggle('active', batterySaver);

    const desktop = document.getElementById('desktop');
    if (desktop) {
        if (batterySaver) {
            desktop.style.filter = 'brightness(0.7)';
            showNotification('Battery Saver', 'Battery saver mode is now active.');
        } else {
            desktop.style.filter = 'brightness(1)';
        }
    }
}

// ==================== NOTIFICATIONS ====================
function showNotification(title, message, icon = '🔔') {
    const container = document.getElementById('notification-toast-container');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `
        <div class="notif-icon">${icon}</div>
        <div class="notif-content">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
    `;
    container.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 4000);
}

// ==================== FILE EXPLORER ====================
function initFileExplorer() {
    renderFileGrid();
}

function renderFileGrid() {
    const grid = document.getElementById('file-explorer-grid');
    if (!grid) return;

    const files = JSON.parse(localStorage.getItem('echoos_files') || '[]');
    grid.innerHTML = '';

    if (files.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--sys-text-muted); padding: 40px;">No files yet. Create a document in Wordpad to save files here.</div>';
        return;
    }

    files.forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <div class="f-icon">📄</div>
            <span>${file.name}</span>
        `;
        item.onclick = () => openFile(file);
        grid.appendChild(item);
    });
}

function openFile(file) {
    openApp('wordpad-window');
    const editor = document.getElementById('wordpad-editor');
    if (editor) editor.innerHTML = file.content || '';
}

// ==================== CALCULATOR ====================
let calcExpression = '0';

function initCalculator() {
    // Calculator is ready
}

function calcPress(key) {
    if (calcExpression === '0' && key !== '.') {
        calcExpression = key;
    } else {
        calcExpression += key;
    }
    const display = document.getElementById('calc-display');
    if (display) display.value = calcExpression;
}

function calcClear() {
    calcExpression = '0';
    const display = document.getElementById('calc-display');
    if (display) display.value = calcExpression;
}

function calcEval() {
    try {
        const result = eval(calcExpression.replace('×', '*').replace('÷', '/'));
        calcExpression = String(result);
        const display = document.getElementById('calc-display');
        if (display) display.value = calcExpression;
    } catch {
        calcExpression = 'Error';
        const display = document.getElementById('calc-display');
        if (display) display.value = calcExpression;
    }
}

// ==================== NOTEPAD ====================
function initNotepad() {
    // Notepad is ready
}

function notepadSave() {
    const editor = document.getElementById('wordpad-editor');
    if (!editor) return;

    const content = editor.innerHTML;
    const files = JSON.parse(localStorage.getItem('echoos_files') || '[]');
    const name = `Document ${files.length + 1}.txt`;
    files.push({ name, content, date: new Date().toISOString() });
    localStorage.setItem('echoos_files', JSON.stringify(files));
    renderFileGrid();
    showNotification('Saved', `Document saved as ${name}`);
}

function notepadSaveAs() {
    const editor = document.getElementById('wordpad-editor');
    if (!editor) return;

    const content = editor.innerHTML;
    const name = prompt('Enter file name:', 'Document.txt');
    if (!name) return;

    const files = JSON.parse(localStorage.getItem('echoos_files') || '[]');
    files.push({ name, content, date: new Date().toISOString() });
    localStorage.setItem('echoos_files', JSON.stringify(files));
    renderFileGrid();
    showNotification('Saved', `Document saved as ${name}`);
}

function notepadOpen() {
    showNotification('Info', 'Use the Files app to open saved documents.');
}


// ==================== PLAY STORE ====================
function initPlayStore() {
    const psUsername = document.getElementById('ps-username');
    if (psUsername && currentUser) {
        psUsername.textContent = currentUser.name;
    }

    renderPlayStoreSidebar();
    renderPlayStoreHome();
    renderPlayStoreLibrary();
    renderPlayStoreStore();
    renderPlayStoreFavorites();
}

function renderPlayStoreSidebar() {
    const gameList = document.getElementById('ps-game-list');
    const appList = document.getElementById('ps-app-list');

    if (gameList) {
        gameList.innerHTML = '';
        ALL_GAMES.forEach(game => {
            const item = document.createElement('div');
            item.className = 'ps-game-item';
            item.innerHTML = `
                <div class="ps-game-icon">${game.icon}</div>
                <span>${game.name}</span>
            `;
            item.onclick = () => showPlayStoreDetail(game, 'game');
            gameList.appendChild(item);
        });
    }

    if (appList) {
        appList.innerHTML = '';
        ALL_APPS.forEach(app => {
            const item = document.createElement('div');
            item.className = 'ps-game-item';
            item.innerHTML = `
                <div class="ps-game-icon">${app.icon}</div>
                <span>${app.name}</span>
            `;
            item.onclick = () => showPlayStoreDetail(app, 'app');
            appList.appendChild(item);
        });
    }
}

function switchSidebarCategory(cat) {
    currentSidebarCategory = cat;
    const gamesBtn = document.getElementById('ps-sidebar-games-btn');
    const appsBtn = document.getElementById('ps-sidebar-apps-btn');
    const gameList = document.getElementById('ps-game-list');
    const appList = document.getElementById('ps-app-list');

    if (cat === 'games') {
        if (gamesBtn) {
            gamesBtn.style.background = 'var(--ps-primary)';
            gamesBtn.style.color = 'white';
        }
        if (appsBtn) {
            appsBtn.style.background = 'rgba(255,255,255,0.05)';
            appsBtn.style.color = '#9aa0a6';
        }
        if (gameList) gameList.style.display = 'flex';
        if (appList) appList.style.display = 'none';
    } else {
        if (appsBtn) {
            appsBtn.style.background = 'var(--ps-primary)';
            appsBtn.style.color = 'white';
        }
        if (gamesBtn) {
            gamesBtn.style.background = 'rgba(255,255,255,0.05)';
            gamesBtn.style.color = '#9aa0a6';
        }
        if (gameList) gameList.style.display = 'none';
        if (appList) appList.style.display = 'flex';
    }
}

function showPlayStoreTab(tab) {
    currentPlayStoreTab = tab;

    document.querySelectorAll('.ps-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });

    document.querySelectorAll('.ps-tab').forEach(t => {
        t.classList.remove('active');
        t.style.display = 'none';
    });

    const activeTab = document.getElementById(`ps-tab-${tab}`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.display = 'block';
    }

    if (tab === 'library') renderPlayStoreLibrary();
    if (tab === 'store') renderPlayStoreStore();
    if (tab === 'favorites') renderPlayStoreFavorites();
}

function renderPlayStoreHome() {
    const featured = document.getElementById('ps-featured-game');
    if (featured) {
        const game = ALL_GAMES[Math.floor(Math.random() * ALL_GAMES.length)];
        featured.innerHTML = `
            <div class="ps-featured-banner">
                <div class="ps-featured-overlay">
                    <div class="ps-featured-tags">
                        <span class="ps-tag">${game.category}</span>
                        <span class="ps-tag full">Free</span>
                    </div>
                    <h2 class="ps-featured-title">${game.name}</h2>
                    <button class="ps-play-btn" onclick="installAndPlay('${game.id}', 'game')">▶ Play Now</button>
                    <button class="ps-more-btn" onclick="showPlayStoreDetailById('${game.id}', 'game')">⋮</button>
                </div>
            </div>
        `;
    }

    const recentSection = document.getElementById('ps-recent-section');
    const recentGrid = document.getElementById('ps-recent-grid');

    if (recentSection && recentGrid && installedGames.length > 0) {
        recentSection.style.display = 'block';
        recentGrid.innerHTML = '';

        installedGames.slice(0, 6).forEach(id => {
            const game = ALL_GAMES.find(g => g.id === id);
            if (game) {
                recentGrid.innerHTML += createStoreCard(game, 'game', true);
            }
        });
    } else if (recentSection) {
        recentSection.style.display = 'none';
    }

    const homeEmpty = document.getElementById('ps-home-empty');
    const homeContent = document.getElementById('ps-home-content');

    if (installedGames.length === 0) {
        if (homeEmpty) homeEmpty.style.display = 'block';
        if (homeContent) homeContent.style.display = 'none';
    } else {
        if (homeEmpty) homeEmpty.style.display = 'none';
        if (homeContent) homeContent.style.display = 'block';
    }
}

function renderPlayStoreLibrary() {
    const grid = document.getElementById('ps-library-grid');
    const empty = document.getElementById('ps-library-empty');

    if (!grid) return;

    const allInstalled = [...installedGames, ...installedApps];

    if (allInstalled.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }

    if (empty) empty.style.display = 'none';
    grid.innerHTML = '';

    allInstalled.forEach(id => {
        const game = ALL_GAMES.find(g => g.id === id);
        const app = ALL_APPS.find(a => a.id === id);
        const item = game || app;
        if (item) {
            const type = game ? 'game' : 'app';
            grid.innerHTML += createLibCard(item, type);
        }
    });
}

function renderPlayStoreStore() {
    const grid = document.getElementById('ps-store-grid');
    if (!grid) return;

    const searchInput = document.getElementById('ps-store-search');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    let games = ALL_GAMES;
    if (currentStoreCategory !== 'all') {
        games = games.filter(g => g.category === currentStoreCategory);
    }
    if (query) {
        games = games.filter(g => g.name.toLowerCase().includes(query));
    }

    grid.innerHTML = '';
    games.forEach(game => {
        grid.innerHTML += createStoreCard(game, 'game', installedGames.includes(game.id));
    });

    // Apps section
    const appsGrid = document.getElementById('ps-apps-store-grid');
    const appsEmpty = document.getElementById('ps-apps-store-empty');

    if (appsGrid) {
        let apps = ALL_APPS;
        if (currentStoreCategory === 'apps') {
            apps = ALL_APPS;
        } else if (currentStoreCategory !== 'all') {
            apps = [];
        }
        if (query) {
            apps = apps.filter(a => a.name.toLowerCase().includes(query));
        }

        if (apps.length === 0) {
            appsGrid.innerHTML = '';
            if (appsEmpty) appsEmpty.style.display = 'block';
        } else {
            if (appsEmpty) appsEmpty.style.display = 'none';
            appsGrid.innerHTML = '';
            apps.forEach(app => {
                appsGrid.innerHTML += createStoreCard(app, 'app', installedApps.includes(app.id));
            });
        }
    }
}

function renderPlayStoreFavorites() {
    const grid = document.getElementById('ps-favorites-grid');
    const empty = document.getElementById('ps-favorites-empty');

    if (!grid) return;

    if (favorites.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }

    if (empty) empty.style.display = 'none';
    grid.innerHTML = '';

    favorites.forEach(id => {
        const game = ALL_GAMES.find(g => g.id === id);
        const app = ALL_APPS.find(a => a.id === id);
        const item = game || app;
        if (item) {
            const type = game ? 'game' : 'app';
            grid.innerHTML += createStoreCard(item, type, true);
        }
    });
}

function createStoreCard(item, type, installed) {
    const isFav = favorites.includes(item.id);
    return `
        <div class="ps-store-card" onclick="showPlayStoreDetailById('${item.id}', '${type}')">
            <div class="card-icon">${item.icon}</div>
            <div class="card-title">${item.name}</div>
            <div class="card-meta">${item.category} ${installed ? '✓ Installed' : ''}</div>
            <div class="install-overlay" onclick="event.stopPropagation()">
                <button onclick="installItem('${item.id}', '${type}')">${installed ? '✓ Installed' : '⬇ Install'}</button>
                <button onclick="toggleFavorite('${item.id}')">${isFav ? '★ Favorited' : '☆ Favorite'}</button>
            </div>
        </div>
    `;
}

function createLibCard(item, type) {
    return `
        <div class="ps-lib-card" onclick="openApp('${item.id}-window')">
            <div class="lib-icon">${item.icon}</div>
            <div class="lib-title">${item.name}</div>
            <div class="lib-playtime">Click to play</div>
        </div>
    `;
}

function showPlayStoreDetail(item, type) {
    const overlay = document.getElementById('ps-detail-overlay');
    const content = document.getElementById('ps-detail-content');
    if (!overlay || !content) return;

    const isInstalled = type === 'game' ? installedGames.includes(item.id) : installedApps.includes(item.id);
    const isFav = favorites.includes(item.id);

    content.innerHTML = `
        <div class="ps-detail-banner">
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:80px;background:linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%);">${item.icon}</div>
        </div>
        <div class="ps-detail-icon">${item.icon}</div>
        <h1 class="ps-detail-title">${item.name}</h1>
        <div class="ps-detail-meta">
            <span>${item.category}</span>
            <span>Free</span>
            <span>Web Game</span>
        </div>
        <div class="ps-detail-actions">
            <button class="ps-detail-btn play" onclick="installAndPlay('${item.id}', '${type}')">${isInstalled ? '▶ Play' : '⬇ Install & Play'}</button>
            <button class="ps-detail-btn install" onclick="toggleFavorite('${item.id}')">${isFav ? '★ Favorited' : '☆ Favorite'}</button>
        </div>
        <div class="ps-detail-stats">
            <div class="ps-detail-stat">
                <div class="stat-value">4.5★</div>
                <div class="stat-label">Rating</div>
            </div>
            <div class="ps-detail-stat">
                <div class="stat-value">1M+</div>
                <div class="stat-label">Downloads</div>
            </div>
            <div class="ps-detail-stat">
                <div class="stat-value">Web</div>
                <div class="stat-label">Platform</div>
            </div>
        </div>
        <p class="ps-detail-desc">${item.desc}</p>
        <div class="ps-detail-controls">
            <h4>Controls</h4>
            <p>Mouse and keyboard controls. Fullscreen recommended for best experience.</p>
        </div>
    `;

    overlay.style.transform = 'translateX(0)';
}

function showPlayStoreDetailById(id, type) {
    const item = type === 'game' ? ALL_GAMES.find(g => g.id === id) : ALL_APPS.find(a => a.id === id);
    if (item) showPlayStoreDetail(item, type);
}

function closePlayStoreDetail() {
    const overlay = document.getElementById('ps-detail-overlay');
    if (overlay) overlay.style.transform = 'translateX(100%)';
}

function installItem(id, type) {
    if (type === 'game') {
        if (!installedGames.includes(id)) {
            installedGames.push(id);
            const game = ALL_GAMES.find(g => g.id === id);
            if (game) {
                ensureWindowExists(game.id, game.name, game.icon, game.src);
            }
        }
    } else {
        if (!installedApps.includes(id)) {
            installedApps.push(id);
            const app = ALL_APPS.find(a => a.id === id);
            if (app) {
                ensureWindowExists(app.id, app.name, app.icon, app.src);
            }
        }
    }
    saveSettings();
    renderPlayStoreStore();
    renderPlayStoreLibrary();
    showNotification('Installed', 'App has been installed successfully! 🎉');
}

function installAndPlay(id, type) {
    installItem(id, type);

    const item = type === 'game' ? ALL_GAMES.find(g => g.id === id) : ALL_APPS.find(a => a.id === id);
    if (item) {
        const windowId = `${item.id}-window`;
        setTimeout(() => {
            openApp(windowId);
        }, 100);
        closePlayStoreDetail();
        showPlayStoreTab('library');
    }
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        showNotification('Removed', 'Removed from favorites.');
    } else {
        favorites.push(id);
        showNotification('Added', 'Added to favorites! ⭐');
    }
    saveSettings();
    renderPlayStoreFavorites();
    renderPlayStoreStore();
}

function filterPlayStoreGames() {
    renderPlayStoreStore();
}

function filterStoreCategory(cat) {
    currentStoreCategory = cat;
    document.querySelectorAll('.ps-category').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-cat') === cat);
    });
    renderPlayStoreStore();
}

function clearPlayStoreData() {
    if (confirm('This will clear all installed apps, games, and favorites. Continue?')) {
        installedApps = [];
        installedGames = [];
        favorites = [];
        saveSettings();
        renderPlayStoreLibrary();
        renderPlayStoreStore();
        renderPlayStoreFavorites();
        showNotification('Cleared', 'All Play Store data has been cleared.');
    }
}


// ==================== LINK CREATOR ====================
function initLinkCreator() {
    renderLinkHistory();
}

function generateLink() {
    const urlInput = document.getElementById('lc-url');
    const titleInput = document.getElementById('lc-title');
    if (!urlInput) return;

    const url = urlInput.value.trim();
    const title = titleInput ? titleInput.value.trim() : 'Untitled Link';

    if (!url) {
        showNotification('Error', 'Please enter a URL.');
        return;
    }

    const linkData = { url, title, date: new Date().toISOString() };
    const history = JSON.parse(localStorage.getItem('echoos_link_history') || '[]');
    history.unshift(linkData);
    localStorage.setItem('echoos_link_history', JSON.stringify(history));

    const output = document.getElementById('lc-output');
    const result = document.getElementById('lc-result');
    if (output) output.value = url;
    if (result) result.style.display = 'block';

    renderLinkHistory();
    showNotification('Created', 'Link created successfully! 🔗');
}

function copyLink() {
    const output = document.getElementById('lc-output');
    if (!output) return;

    output.select();
    document.execCommand('copy');
    showNotification('Copied', 'Link copied to clipboard! 📋');
}

function renderLinkHistory() {
    const list = document.getElementById('lc-history-list');
    if (!list) return;

    const history = JSON.parse(localStorage.getItem('echoos_link_history') || '[]');
    list.innerHTML = '';

    if (history.length === 0) {
        list.innerHTML = '<div style="color: var(--sys-text-muted); font-size: 12px;">No links created yet.</div>';
        return;
    }

    history.slice(0, 5).forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px;background:rgba(128,128,128,0.05);border-radius:8px;font-size:12px;';
        div.innerHTML = `
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">${item.title}</span>
            <button onclick="window.open('${item.url}', '_blank')" style="background:var(--sys-primary);color:white;border:none;padding:4px 10px;border-radius:12px;cursor:pointer;font-size:11px;">Open</button>
        `;
        list.appendChild(div);
    });
}

// ==================== MEDIA CONTROL ====================
function initMediaControl() {
    // Media control initialization
}

function toggleMediaModal() {
    const modal = document.getElementById('media-control-modal');
    if (modal) modal.classList.toggle('show');
}

function mediaTogglePlay() {
    mediaState.playing = !mediaState.playing;
    const btn = document.getElementById('media-play-btn');
    if (btn) btn.textContent = mediaState.playing ? '⏸' : '▶';

    const mediaBtn = document.getElementById('media-control-btn');
    if (mediaBtn) mediaBtn.classList.toggle('visible', mediaState.playing);
}

function mediaPrev() {
    showNotification('Media', 'Previous track (demo) ⏮');
}

function mediaNext() {
    showNotification('Media', 'Next track (demo) ⏭');
}

function seekMedia(e) {
    const bar = document.getElementById('media-progress-bar');
    const fill = document.getElementById('media-progress-fill');
    if (!bar || !fill) return;

    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    fill.style.width = `${percent * 100}%`;
}

// ==================== SETTINGS ====================
function setWallpaper(src) {
    const desktop = document.getElementById('desktop');
    if (desktop) desktop.style.backgroundImage = `url('${src}')`;
    localStorage.setItem('echoos_wallpaper', src);
    showNotification('Wallpaper', 'Wallpaper updated successfully! 🖼️');
}

function changeTabCloak(value) {
    const cloaks = {
        echo: { title: 'Echo OS' },
        classroom: { title: 'Google Classroom' },
        docs: { title: 'Google Docs' },
        slides: { title: 'Google Slides' },
        drive: { title: 'Google Drive' },
        canvas: { title: 'Canvas' },
        clever: { title: 'Clever' },
        khan: { title: 'Khan Academy' },
        ixl: { title: 'IXL' },
        quizlet: { title: 'Quizlet' },
        desmos: { title: 'Desmos' },
        wikipedia: { title: 'Wikipedia' },
        britannica: { title: 'Britannica' },
        codewars: { title: 'Codewars' },
        github: { title: 'GitHub' },
        stackoverflow: { title: 'Stack Overflow' },
        chess: { title: 'Chess.com' },
        coolmath: { title: 'Cool Math Games' },
        poki: { title: 'Poki' },
        scratch: { title: 'Scratch' },
        codeorg: { title: 'Code.org' },
        typing: { title: 'Typing.com' },
        nitrotype: { title: 'Nitro Type' },
        prodigy: { title: 'Prodigy' },
        readworks: { title: 'ReadWorks' },
        newsela: { title: 'Newsela' },
        nearpod: { title: 'Nearpod' },
        edpuzzle: { title: 'Edpuzzle' },
        blooket: { title: 'Blooket' },
        gimkit: { title: 'Gimkit' },
        kahoot: { title: 'Kahoot!' },
        fleckle: { title: 'Fleckle' },
        flocabulary: { title: 'Flocabulary' }
    };

    const cloak = cloaks[value] || cloaks.echo;
    document.title = cloak.title;

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = cloak.title;

    const cloakStatus = document.getElementById('cloak-status');
    if (cloakStatus) cloakStatus.textContent = `Current: ${cloak.title}`;

    localStorage.setItem('echoos_cloak', value);
}

function saveSecuritySettings() {
    const password = document.getElementById('set-password');
    const question = document.getElementById('set-question');
    const answer = document.getElementById('set-answer');

    if (password && password.value) localStorage.setItem('echoos_password', password.value);
    if (question && question.value) localStorage.setItem('echoos_security_question', question.value);
    if (answer && answer.value) localStorage.setItem('echoos_security_answer', answer.value);

    const msg = document.getElementById('security-save-msg');
    if (msg) {
        msg.style.display = 'block';
        setTimeout(() => { msg.style.display = 'none'; }, 3000);
    }

    showNotification('Security', 'Security settings saved! 🔒');
}

function factoryReset() {
    if (confirm('WARNING: This will erase ALL data including accounts, files, settings, and installed apps. This cannot be undone. Are you sure?')) {
        if (confirm('Are you absolutely sure? All your data will be permanently deleted.')) {
            localStorage.clear();
            location.reload();
        }
    }
}

// ==================== DYNAMIC WINDOW CREATION ====================
function ensureWindowExists(id, name, icon, src) {
    const windowId = `${id}-window`;
    let existing = document.getElementById(windowId);
    if (existing) return;

    // Create window element
    const win = document.createElement('div');
    win.className = 'window';
    win.id = windowId;
    win.style.cssText = 'display: none; width: 800px; height: 600px;';
    win.innerHTML = `
        <div class="window-header" id="${windowId}-header">
            <span class="window-title">${icon} ${name}</span>
            <div>
                <button class="win-btn" onclick="minimizeApp('${windowId}')">−</button>
                <button class="win-btn" onclick="maximizeApp('${windowId}')">□</button>
                <button class="win-btn close-btn" onclick="closeApp('${windowId}')">✕</button>
            </div>
        </div>
        <div class="window-content">
            <iframe data-src="${src}" src="" width="100%" height="100%" frameborder="0" allow="fullscreen; pointer-lock; keyboard-map;"></iframe>
        </div>
    `;

    const desktop = document.getElementById('desktop');
    if (desktop) desktop.appendChild(win);

    // Add taskbar icon
    const appIcons = document.getElementById('app-icons');
    if (appIcons) {
        const btn = document.createElement('button');
        btn.className = 'app-icon';
        btn.id = `taskbar-${windowId}`;
        btn.draggable = true;
        btn.title = name;
        btn.textContent = icon;
        btn.onclick = () => toggleApp(windowId);
        appIcons.appendChild(btn);
    }

    // Add launcher item
    const launcherList = document.getElementById('launcher-list');
    if (launcherList) {
        const item = document.createElement('div');
        item.className = 'launcher-item';
        item.setAttribute('data-app-id', windowId);
        item.setAttribute('data-icon', icon);
        item.setAttribute('data-name', name);
        item.onclick = () => openApp(windowId);
        item.innerHTML = `<div class="l-icon">${icon}</div><span class="l-text">${name}</span>`;
        launcherList.appendChild(item);
    }

    // Re-init window manager for new window
    initWindowManager();
}

function initInstalledItems() {
    installedGames.forEach(id => {
        const game = ALL_GAMES.find(g => g.id === id);
        if (game) ensureWindowExists(game.id, game.name, game.icon, game.src);
    });

    installedApps.forEach(id => {
        const app = ALL_APPS.find(a => a.id === id);
        if (app) ensureWindowExists(app.id, app.name, app.icon, app.src);
    });
}

// ==================== WALLPAPER UPLOAD ====================
function initWallpaperUpload() {
    const wallpaperUpload = document.getElementById('wallpaper-upload');
    if (wallpaperUpload) {
        wallpaperUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    setWallpaper(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// ==================== BRIGHTNESS SLIDER ====================
function initBrightnessSlider() {
    const brightnessSlider = document.getElementById('brightness-slider');
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', function() {
            const value = this.value;
            const desktop = document.getElementById('desktop');
            if (desktop) desktop.style.filter = `brightness(${value}%)`;
        });
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'F4') {
            e.preventDefault();
            const activeWin = activeWindows[activeWindows.length - 1];
            if (activeWin) closeApp(activeWin);
        }

        if (e.key === 'Escape') {
            const launcher = document.getElementById('launcher-menu');
            const qs = document.getElementById('quick-settings');
            const calendar = document.getElementById('calendar-modal');
            const media = document.getElementById('media-control-modal');

            if (launcher) launcher.style.display = 'none';
            if (qs) qs.style.display = 'none';
            if (calendar) calendar.style.display = 'none';
            if (media) media.classList.remove('show');
        }
    });
}

// ==================== CALENDAR MODAL CLOSE ====================
function initCalendarModalClose() {
    document.addEventListener('click', function(e) {
        const calendarModal = document.getElementById('calendar-modal');
        if (calendarModal && calendarModal.style.display === 'flex' && e.target === calendarModal) {
            calendarModal.style.display = 'none';
        }
    });
}

// ==================== FIRST BOOT CHECK ====================
function checkFirstBoot() {
    const hasSetup = localStorage.getItem('echoos_setup_complete');
    const hasAccount = localStorage.getItem('echoos_current_account');
    const aboutBlankPref = localStorage.getItem('echoos_aboutblank');

    if (aboutBlankPref === 'always') {
        goIntoAboutBlank();
        return;
    }

    if (!hasSetup) {
        const setupScreen = document.getElementById('setup-screen');
        if (setupScreen) setupScreen.style.display = 'flex';
    } else if (!hasAccount) {
        showAccountModal();
    } else {
        loadCurrentAccount();
        showLockScreen();
    }
}

// ==================== CONSOLE MESSAGE ====================
console.log('%c🔷 Echo OS', 'font-size: 24px; font-weight: bold; color: #1a73e8;');
console.log('%cWelcome to Echo OS - Your Web Operating System', 'font-size: 14px; color: #5f6368;');
console.log('%cVersion 1.0 Development Build', 'font-size: 12px; color: #9aa0a6;');
