// ===== ECHO OS CORE JAVASCRIPT =====
// Complete reconstructed JavaScript for Echo OS v1.0

// --- GLOBAL STATE ---
let currentUser = null;
let accounts = JSON.parse(localStorage.getItem('echo_accounts') || '[]');
let currentAccountIndex = parseInt(localStorage.getItem('echo_current_account') || '-1');
let setupComplete = localStorage.getItem('echo_setup_complete') === 'true';
let userPassword = localStorage.getItem('echo_password') || '';
let securityQuestion = localStorage.getItem('echo_security_question') || '';
let securityAnswer = localStorage.getItem('echo_security_answer') || '';
let installedApps = JSON.parse(localStorage.getItem('echo_installed_apps') || '[]');
let favorites = JSON.parse(localStorage.getItem('echo_favorites') || '[]');
let recentApps = JSON.parse(localStorage.getItem('echo_recent_apps') || '[]');
let playTime = JSON.parse(localStorage.getItem('echo_playtime') || '{}');
let files = JSON.parse(localStorage.getItem('echo_files') || '[]');
let wallpaper = localStorage.getItem('echo_wallpaper') || '';
let theme = localStorage.getItem('echo_theme') || 'dark';
let aboutBlankSetting = localStorage.getItem('echo_aboutblank') || 'ask';
let aboutBlankBlocked = localStorage.getItem('echo_aboutblank_blocked') === 'true';
let batterySaver = localStorage.getItem('echo_battery_saver') === 'true';
let linkHistory = JSON.parse(localStorage.getItem('echo_link_history') || '[]');
let activeWindows = [];
let minimizedWindows = [];
let zIndexCounter = 100;
let currentDesk = 0;
let desks = JSON.parse(localStorage.getItem('echo_desks') || '[{"name":"Desk 1","windows":[]}]');
let mediaPlayer = null;
let isPlaying = false;
let currentTrack = null;
let calendarCurrentDate = new Date();
let launcherContextTarget = null;
let playStoreGames = [];
let playStoreApps = [];
let currentStoreCategory = 'all';
let currentSidebarCategory = 'games';
let currentPlayStoreTab = 'home';

// --- BOOT SEQUENCE ---
document.addEventListener('DOMContentLoaded', function() {
    document.body.setAttribute('data-theme', theme);
    if (wallpaper) {
        document.getElementById('desktop').style.backgroundImage = "url('" + wallpaper + "')";
    }
    initPlayStoreData();
    updateClock();
    setInterval(updateClock, 1000);
    updateCalendarWidget();
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            updateBatteryDisplay(battery);
            battery.addEventListener('levelchange', function() {
                updateBatteryDisplay(battery);
            });
        });
    }
    setTimeout(function() {
        document.getElementById('boot-screen').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('boot-screen').style.display = 'none';
            if (aboutBlankBlocked) {
                continueBoot();
            } else if (aboutBlankSetting === 'always') {
                goIntoAboutBlank();
                return;
            } else if (aboutBlankSetting === 'ask') {
                document.getElementById('aboutblank-modal').style.display = 'flex';
                return;
            } else {
                continueBoot();
            }
        }, 500);
    }, 2000);
});

function continueBoot() {
    if (accounts.length > 0 && currentAccountIndex >= 0) {
        showAccountLoading();
    } else if (!setupComplete) {
        document.getElementById('setup-screen').style.display = 'flex';
    } else {
        showLockScreen();
    }
}

function showAccountLoading() {
    const account = accounts[currentAccountIndex];
    document.getElementById('loading-email').textContent = account.email;
    document.getElementById('loading-avatar').textContent = account.avatar || '👤';
    document.getElementById('account-loading-screen').style.display = 'flex';
    let progress = 0;
    const steps = ['Initializing...', 'Loading preferences...', 'Loading apps...', 'Preparing desktop...', 'Welcome back!'];
    let stepIndex = 0;
    const interval = setInterval(function() {
        progress += 20;
        document.getElementById('loading-progress').style.width = progress + '%';
        if (stepIndex < steps.length) {
            document.getElementById('loading-details').textContent = steps[stepIndex];
            stepIndex++;
        }
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(function() {
                document.getElementById('account-loading-screen').style.display = 'none';
                showLockScreen();
            }, 500);
        }
    }, 400);
}

function handleAboutBlank(choice) {
    document.getElementById('aboutblank-modal').style.display = 'none';
    if (choice === 'always') {
        localStorage.setItem('echo_aboutblank', 'always');
        aboutBlankSetting = 'always';
        goIntoAboutBlank();
    } else if (choice === 'once') {
        goIntoAboutBlank();
    } else if (choice === 'no') {
        continueBoot();
    } else if (choice === 'block') {
        localStorage.setItem('echo_aboutblank_blocked', 'true');
        aboutBlankBlocked = true;
        continueBoot();
    }
}

function goIntoAboutBlank() {
    const win = window.open('about:blank', '_blank');
    if (win) {
        win.document.write('<html><head><title>Echo OS</title></head><body style="margin:0;padding:0;"><iframe src="' + window.location.href + '" style="width:100vw;height:100vh;border:none;"></iframe></body></html>');
        win.document.close();
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#202124;color:white;font-family:sans-serif;"><h1>Echo OS opened in about:blank</h1></div>';
    } else {
        continueBoot();
    }
}

function closeUpdateModal() {
    document.getElementById('update-modal').style.display = 'none';
}

let updateCountdown = 5;
setTimeout(function() {
    const updateBtn = document.getElementById('update-continue-btn');
    if (updateBtn) {
        const countdownInterval = setInterval(function() {
            updateCountdown--;
            if (updateCountdown <= 0) {
                updateBtn.textContent = 'Continue';
                updateBtn.disabled = false;
                updateBtn.classList.add('active');
                clearInterval(countdownInterval);
            } else {
                updateBtn.textContent = 'Continue (' + updateCountdown + ')';
            }
        }, 1000);
    }
}, 100);

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
    document.getElementById('email-preview').textContent = username ? username + '@echoos.com' : '';
}

function createAccount() {
    const name = document.getElementById('create-name-input').value.trim();
    const username = document.getElementById('create-username-input').value.trim();
    const password = document.getElementById('create-password-input').value;
    const confirm = document.getElementById('create-confirm-input').value;
    if (!name || !username || !password) {
        document.getElementById('account-error').textContent = 'Please fill in all fields.';
        return;
    }
    if (password !== confirm) {
        document.getElementById('account-error').textContent = 'Passwords do not match.';
        return;
    }
    const email = username + '@echoos.com';
    if (accounts.some(function(a) { return a.email === email; })) {
        document.getElementById('account-error').textContent = 'An account with this email already exists.';
        return;
    }
    const newAccount = {
        name: name,
        username: username,
        email: email,
        password: password,
        avatar: '👤',
        created: new Date().toISOString()
    };
    accounts.push(newAccount);
    localStorage.setItem('echo_accounts', JSON.stringify(accounts));
    currentAccountIndex = accounts.length - 1;
    localStorage.setItem('echo_current_account', currentAccountIndex);
    currentUser = newAccount;
    document.getElementById('account-modal').style.display = 'none';
    if (!setupComplete) {
        document.getElementById('setup-screen').style.display = 'flex';
    } else {
        showLockScreen();
    }
}

function signInAccount() {
    const email = document.getElementById('account-email-input').value.trim();
    const password = document.getElementById('account-password-input').value;
    const account = accounts.find(function(a) { return a.email === email && a.password === password; });
    if (!account) {
        document.getElementById('account-error').textContent = 'Invalid email or password.';
        return;
    }
    currentAccountIndex = accounts.indexOf(account);
    localStorage.setItem('echo_current_account', currentAccountIndex);
    currentUser = account;
    document.getElementById('account-modal').style.display = 'none';
    showAccountLoading();
}

function switchAccount() {
    document.getElementById('account-modal').style.display = 'flex';
    showSignIn();
}

function signOutAccount() {
    currentUser = null;
    currentAccountIndex = -1;
    localStorage.setItem('echo_current_account', '-1');
    location.reload();
}

function showAccountModalFromLock() {
    document.getElementById('lock-screen').style.display = 'none';
    document.getElementById('account-modal').style.display = 'flex';
    showSignIn();
}

function processSetupStep1() {
    const name = document.getElementById('setup-name-input').value.trim();
    if (!name) {
        alert('Please enter your name.');
        return;
    }
    localStorage.setItem('echo_user_name', name);
    document.getElementById('setup-step-1').classList.remove('active');
    document.getElementById('setup-step-2').classList.add('active');
}

function processSetupStep2(skip) {
    if (!skip) {
        const pass = document.getElementById('setup-pass-input').value;
        if (pass) {
            userPassword = pass;
            localStorage.setItem('echo_password', pass);
        }
    }
    document.getElementById('setup-step-2').classList.remove('active');
    document.getElementById('setup-step-3').classList.add('active');
}

function finalizeSetup() {
    setupComplete = true;
    localStorage.setItem('echo_setup_complete', 'true');
    document.getElementById('setup-screen').style.display = 'none';
    const hasWelcomed = localStorage.getItem('echo_welcomed');
    if (!hasWelcomed) {
        document.getElementById('welcome-modal').style.display = 'flex';
        localStorage.setItem('echo_welcomed', 'true');
    } else {
        enterDesktop();
    }
}

function closeWelcomeModal() {
    document.getElementById('welcome-modal').style.display = 'none';
    enterDesktop();
}

function showLockScreen() {
    const name = localStorage.getItem('echo_user_name') || 'User';
    document.getElementById('echo-lock-username').textContent = name;
    if (currentUser) {
        document.getElementById('echo-lock-email').textContent = currentUser.email;
        document.getElementById('echo-lock-email').style.display = 'block';
    } else {
        document.getElementById('echo-lock-email').style.display = 'none';
    }
    const accountsList = document.getElementById('lock-accounts-list');
    accountsList.innerHTML = '';
    accounts.forEach(function(acc, idx) {
        const item = document.createElement('div');
        item.className = 'lock-account-item' + (idx === currentAccountIndex ? ' active' : '');
        item.innerHTML = '<div class="lock-account-avatar">' + (acc.avatar || '👤') + '</div><div class="lock-account-info"><div class="lock-account-name">' + acc.name + '</div><div class="lock-account-email">' + acc.email + '</div></div><button class="lock-account-remove" onclick="removeAccount(' + idx + '); event.stopPropagation();">×</button>';
        item.onclick = function() {
            currentAccountIndex = idx;
            localStorage.setItem('echo_current_account', idx);
            currentUser = acc;
            showAccountLoading();
        };
        accountsList.appendChild(item);
    });
    document.getElementById('lock-screen').style.display = 'flex';
    document.getElementById('lock-password').value = '';
    document.getElementById('lock-error').style.display = 'none';
    document.getElementById('security-hint').style.display = 'none';
}

function removeAccount(index) {
    accounts.splice(index, 1);
    localStorage.setItem('echo_accounts', JSON.stringify(accounts));
    if (currentAccountIndex >= accounts.length) {
        currentAccountIndex = accounts.length - 1;
        localStorage.setItem('echo_current_account', currentAccountIndex);
    }
    showLockScreen();
}

function unlockOS() {
    const input = document.getElementById('lock-password').value;
    if (userPassword && input !== userPassword) {
        document.getElementById('lock-error').style.display = 'block';
        return;
    }
    document.getElementById('lock-screen').style.display = 'none';
    enterDesktop();
}

function showSecurityQuestion() {
    if (securityQuestion) {
        document.getElementById('lock-question-text').textContent = securityQuestion + ' (Answer: ' + securityAnswer + ')';
        document.getElementById('security-hint').style.display = 'block';
    } else {
        document.getElementById('lock-question-text').textContent = 'No security question set.';
        document.getElementById('security-hint').style.display = 'block';
    }
}

function lockSystem() {
    document.getElementById('quick-settings').style.display = 'none';
    document.getElementById('launcher-menu').style.display = 'none';
    document.getElementById('media-control-modal').classList.remove('show');
    showLockScreen();
}

function enterDesktop() {
    document.getElementById('desktop').style.display = 'block';
    const name = localStorage.getItem('echo_user_name') || 'User';
    document.getElementById('settings-account-name').textContent = name;
    if (currentUser) {
        document.getElementById('settings-account-email').textContent = currentUser.email;
        document.getElementById('settings-account-avatar').textContent = currentUser.avatar || '👤';
        document.getElementById('ps-username').textContent = currentUser.name;
        document.getElementById('ps-user-avatar').textContent = currentUser.avatar || '👤';
    }
    const abSetting = localStorage.getItem('echo_aboutblank') || 'ask';
    document.getElementById('aboutblank-setting').value = abSetting;
    if (localStorage.getItem('echo_aboutblank_blocked') === 'true') {
        document.getElementById('aboutblank-blocked-msg').style.display = 'block';
    }
    renderFileExplorer();
    renderPlayStoreSidebar();
    const updateSeen = localStorage.getItem('echo_update_seen_v18');
    if (!updateSeen) {
        document.getElementById('update-modal').style.display = 'flex';
        localStorage.setItem('echo_update_seen_v18', 'true');
    }
    const hasWelcomed = localStorage.getItem('echo_welcomed');
    if (!hasWelcomed) {
        document.getElementById('welcome-modal').style.display = 'flex';
        localStorage.setItem('echo_welcomed', 'true');
    }
    updateDeskIndicator();
}

function openApp(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    const deskIndex = desks[currentDesk].windows.indexOf(windowId);
    if (deskIndex === -1) {
        desks[currentDesk].windows.push(windowId);
        saveDesks();
    }
    win.style.display = 'flex';
    win.classList.remove('minimized');
    win.style.zIndex = ++zIndexCounter;
    const iframe = win.querySelector('iframe[data-src]');
    if (iframe && !iframe.src) {
        iframe.src = iframe.getAttribute('data-src');
    }
    updateTaskbar();
    if (!activeWindows.includes(windowId)) {
        activeWindows.push(windowId);
    }
    minimizedWindows = minimizedWindows.filter(function(w) { return w !== windowId; });
    addToRecent(windowId);
    document.getElementById('launcher-menu').style.display = 'none';
}

function closeApp(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.style.display = 'none';
    win.classList.remove('minimized');
    activeWindows = activeWindows.filter(function(w) { return w !== windowId; });
    minimizedWindows = minimizedWindows.filter(function(w) { return w !== windowId; });
    desks[currentDesk].windows = desks[currentDesk].windows.filter(function(w) { return w !== windowId; });
    saveDesks();
    updateTaskbar();
}

function minimizeApp(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    win.classList.add('minimized');
    if (!minimizedWindows.includes(windowId)) {
        minimizedWindows.push(windowId);
    }
    activeWindows = activeWindows.filter(function(w) { return w !== windowId; });
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
    } else if (activeWindows.includes(windowId)) {
        minimizeApp(windowId);
    } else {
        openApp(windowId);
    }
}

function updateTaskbar() {
    document.querySelectorAll('.app-icon').forEach(function(icon) {
        const id = icon.id.replace('taskbar-', '');
        if (activeWindows.includes(id)) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

let draggedWindow = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

document.addEventListener('mousedown', function(e) {
    const header = e.target.closest('.window-header');
    if (header && !e.target.closest('.win-btn')) {
        draggedWindow = header.closest('.window');
        const rect = draggedWindow.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        draggedWindow.classList.add('dragging');
        draggedWindow.style.zIndex = ++zIndexCounter;
        e.preventDefault();
    }
});

document.addEventListener('mousemove', function(e) {
    if (draggedWindow) {
        draggedWindow.style.left = (e.clientX - dragOffsetX) + 'px';
        draggedWindow.style.top = (e.clientY - dragOffsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    if (draggedWindow) {
        draggedWindow.classList.remove('dragging');
        draggedWindow = null;
    }
});

function addNewDesk() {
    const newDesk = {
        name: 'Desk ' + (desks.length + 1),
        windows: []
    };
    desks.push(newDesk);
    saveDesks();
    switchToDesk(desks.length - 1);
}

function switchToDesk(index) {
    if (index < 0 || index >= desks.length) return;
    desks[currentDesk].windows.forEach(function(winId) {
        const win = document.getElementById(winId);
        if (win) win.classList.add('desk-hidden');
    });
    currentDesk = index;
    desks[currentDesk].windows.forEach(function(winId) {
        const win = document.getElementById(winId);
        if (win) win.classList.remove('desk-hidden');
    });
    updateDeskIndicator();
}

function switchToPrevDesk() {
    if (currentDesk > 0) {
        switchToDesk(currentDesk - 1);
    }
}

function switchToNextDesk() {
    if (currentDesk < desks.length - 1) {
        switchToDesk(currentDesk + 1);
    }
}

function updateDeskIndicator() {
    document.getElementById('current-desk-name').textContent = desks[currentDesk].name;
}

function saveDesks() {
    localStorage.setItem('echo_desks', JSON.stringify(desks));
}

let calcExpression = '';

function calcPress(key) {
    if (calcExpression === '0' && key !== '.') {
        calcExpression = key;
    } else {
        calcExpression += key;
    }
    document.getElementById('calc-display').value = calcExpression;
}

function calcClear() {
    calcExpression = '';
    document.getElementById('calc-display').value = '0';
}

function calcEval() {
    try {
        const result = eval(calcExpression);
        calcExpression = String(result);
        document.getElementById('calc-display').value = calcExpression;
    } catch (e) {
        document.getElementById('calc-display').value = 'Error';
        calcExpression = '';
    }
}

function notepadSave() {
    const content = document.getElementById('wordpad-editor').innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('💾', 'Document Saved', 'Your document has been saved.');
}

function notepadSaveAs() {
    notepadSave();
}

function notepadOpen() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.txt';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('wordpad-editor').innerHTML = event.target.result;
        };
        reader.readAsText(file);
    };
    input.click();
}

function renderFileExplorer() {
    const grid = document.getElementById('file-explorer-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const defaultItems = [
        { name: 'Documents', icon: '📄', type: 'folder' },
        { name: 'Downloads', icon: '⬇️', type: 'folder' },
        { name: 'Pictures', icon: '🖼️', type: 'folder' },
        { name: 'Music', icon: '🎵', type: 'folder' },
        { name: 'Games', icon: '🎮', type: 'folder' }
    ];
    defaultItems.forEach(function(item) {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.innerHTML = '<div class="f-icon">' + item.icon + '</div><span>' + item.name + '</span>';
        grid.appendChild(div);
    });
    files.forEach(function(file) {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.innerHTML = '<div class="f-icon">📄</div><span>' + file.name + '</span>';
        grid.appendChild(div);
    });
}

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = hours + ':' + minutes;
}

function updateCalendarWidget() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    document.getElementById('calendar-day').textContent = now.getDate();
    document.getElementById('calendar-date').textContent = months[now.getMonth()];
}

function toggleCalendar() {
    const modal = document.getElementById('calendar-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        renderCalendar();
    }
}

function renderCalendar() {
    const year = calendarCurrentDate.getFullYear();
    const month = calendarCurrentDate.getMonth();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('calendar-month-year').textContent = monthNames[month] + ' ' + year;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const container = document.getElementById('calendar-days');
    container.innerHTML = '';
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        container.appendChild(day);
    }
    const today = new Date();
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
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + delta);
    renderCalendar();
}

function updateBatteryDisplay(battery) {
    const level = Math.round(battery.level * 100);
    const charging = battery.charging;
    let icon = '🔋';
    if (charging) icon = '⚡';
    else if (level < 20) icon = '🪫';
    document.getElementById('qs-battery-text').textContent = level + '%';
    document.getElementById('qs-battery-icon').textContent = icon;
    document.getElementById('taskbar-battery').textContent = icon;
}

function toggleTheme() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        theme = 'light';
        document.getElementById('theme-text').textContent = 'Light Theme';
    } else {
        body.setAttribute('data-theme', 'dark');
        theme = 'dark';
        document.getElementById('theme-text').textContent = 'Dark Theme';
    }
    localStorage.setItem('echo_theme', theme);
}

function toggleBatterySaver() {
    batterySaver = !batterySaver;
    localStorage.setItem('echo_battery_saver', batterySaver);
    const btn = document.getElementById('battery-saver-btn');
    if (batterySaver) {
        btn.classList.add('active');
        document.getElementById('desktop').style.filter = 'brightness(0.7)';
        showNotification('🔋', 'Battery Saver On', 'Brightness reduced to save power.');
    } else {
        btn.classList.remove('active');
        document.getElementById('desktop').style.filter = 'none';
        showNotification('🔋', 'Battery Saver Off', 'Normal brightness restored.');
    }
}

function setWallpaper(src) {
    document.getElementById('desktop').style.backgroundImage = "url('" + src + "')";
    localStorage.setItem('echo_wallpaper', src);
    showNotification('🖼️', 'Wallpaper Changed', 'Your new wallpaper has been applied.');
}

document.addEventListener('DOMContentLoaded', function() {
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
});

function changeTabCloak() {
    const selector = document.getElementById('cloak-selector');
    const value = selector.value;
    const cloaks = {
        'echo': { title: 'Echo OS', icon: '' },
        'fleckle': { title: 'Fleckle', icon: '' },
        'classroom': { title: 'Google Classroom', icon: 'https://ssl.gstatic.com/classroom/favicon.png' },
        'flocabulary': { title: 'Flocabulary', icon: '' },
        'docs': { title: 'Google Docs', icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico' },
        'slides': { title: 'Google Slides', icon: 'https://ssl.gstatic.com/docs/presentations/images/favicon5.ico' },
        'drive': { title: 'Google Drive', icon: 'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico' },
        'canvas': { title: 'Canvas', icon: '' },
        'clever': { title: 'Clever', icon: '' },
        'khan': { title: 'Khan Academy', icon: '' },
        'ixl': { title: 'IXL', icon: '' },
        'quizlet': { title: 'Quizlet', icon: '' },
        'desmos': { title: 'Desmos', icon: '' },
        'wikipedia': { title: 'Wikipedia', icon: '' },
        'britannica': { title: 'Britannica', icon: '' },
        'codewars': { title: 'Codewars', icon: '' },
        'github': { title: 'GitHub', icon: '' },
        'stackoverflow': { title: 'Stack Overflow', icon: '' },
        'chess': { title: 'Chess.com', icon: '' },
        'coolmath': { title: 'Cool Math Games', icon: '' },
        'poki': { title: 'Poki', icon: '' },
        'scratch': { title: 'Scratch', icon: '' },
        'codeorg': { title: 'Code.org', icon: '' },
        'typing': { title: 'Typing.com', icon: '' },
        'nitrotype': { title: 'Nitro Type', icon: '' },
        'prodigy': { title: 'Prodigy', icon: '' },
        'readworks': { title: 'ReadWorks', icon: '' },
        'newsela': { title: 'Newsela', icon: '' },
        'nearpod': { title: 'Nearpod', icon: '' },
        'edpuzzle': { title: 'Edpuzzle', icon: '' },
        'blooket': { title: 'Blooket', icon: '' },
        'gimkit': { title: 'Gimkit', icon: '' },
        'kahoot': { title: 'Kahoot!', icon: '' }
    };
    const cloak = cloaks[value] || cloaks['echo'];
    document.title = cloak.title;
    document.getElementById('page-title').textContent = cloak.title;
    if (cloak.icon) {
        document.getElementById('page-favicon').href = cloak.icon;
    }
    document.getElementById('cloak-status').textContent = 'Current: ' + cloak.title;
    localStorage.setItem('echo_cloak', value);
    showNotification('👻', 'Tab Cloaked', 'This tab now appears as ' + cloak.title);
}

function saveAboutBlankSetting() {
    const value = document.getElementById('aboutblank-setting').value;
    localStorage.setItem('echo_aboutblank', value);
    if (value !== 'never') {
        localStorage.setItem('echo_aboutblank_blocked', 'false');
        document.getElementById('aboutblank-blocked-msg').style.display = 'none';
    }
    showNotification('🔒', 'Setting Saved', 'About:blank preference updated.');
}

function saveSecuritySettings() {
    const pass = document.getElementById('set-password').value;
    const question = document.getElementById('set-question').value;
    const answer = document.getElementById('set-answer').value;
    if (pass) {
        userPassword = pass;
        localStorage.setItem('echo_password', pass);
    }
    if (question && answer) {
        securityQuestion = question;
        securityAnswer = answer;
        localStorage.setItem('echo_security_question', question);
        localStorage.setItem('echo_security_answer', answer);
    }
    document.getElementById('security-save-msg').style.display = 'block';
    setTimeout(function() {
        document.getElementById('security-save-msg').style.display = 'none';
    }, 3000);
}

function factoryReset() {
    if (confirm('Are you sure? This will erase ALL data and cannot be undone.')) {
        if (confirm('Really sure? All your files, accounts, and settings will be permanently deleted.')) {
            localStorage.clear();
            location.reload();
        }
    }
}

function showNotification(icon, title, message) {
    const container = document.getElementById('notification-toast-container');
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = '<div class="notif-icon">' + icon + '</div><div class="notif-content"><strong>' + title + '</strong><p>' + message + '</p></div>';
    container.appendChild(notif);
    addToQuickSettingsNotif(icon, title, message);
    setTimeout(function() {
        notif.style.opacity = '0';
        setTimeout(function() {
            notif.remove();
        }, 300);
    }, 4000);
}

function addToQuickSettingsNotif(icon, title, message) {
    const list = document.getElementById('qs-notif-list');
    const noNotifs = list.querySelector('.qs-no-notifs');
    if (noNotifs) noNotifs.remove();
    const item = document.createElement('div');
    item.className = 'qs-notif-item';
    item.innerHTML = '<div class="notif-icon">' + icon + '</div><div class="notif-content"><strong>' + title + '</strong><p>' + message + '</p></div><button class="qs-notif-close" onclick="this.parentElement.remove()">×</button>';
    list.appendChild(item);
}

function toggleQuickSettings() {
    const panel = document.getElementById('quick-settings');
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'block';
        document.getElementById('launcher-menu').style.display = 'none';
        document.getElementById('media-control-modal').classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const brightnessSlider = document.getElementById('brightness-slider');
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', function(e) {
            const value = e.target.value;
            document.getElementById('desktop').style.filter = 'brightness(' + value + '%)';
        });
        brightnessSlider.addEventListener('change', function(e) {
            localStorage.setItem('echo_brightness', e.target.value);
        });
    }
});

function toggleMenu() {
    const menu = document.getElementById('launcher-menu');
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
        document.getElementById('quick-settings').style.display = 'none';
        document.getElementById('media-control-modal').classList.remove('show');
        renderLauncherRecent();
    }
}

function renderLauncherRecent() {
    const recentSection = document.getElementById('launcher-recent');
    const recentList = document.getElementById('launcher-recent-list');
    if (recentApps.length === 0) {
        recentSection.style.display = 'none';
        return;
    }
    recentSection.style.display = 'block';
    recentList.innerHTML = '';
    recentApps.slice(0, 5).forEach(function(appId) {
        const item = document.querySelector('[data-app-id="' + appId + '"]');
        if (item) {
            const clone = item.cloneNode(true);
            clone.onclick = function() { openApp(appId); };
            recentList.appendChild(clone);
        }
    });
}

function addToRecent(windowId) {
    recentApps = recentApps.filter(function(id) { return id !== windowId; });
    recentApps.unshift(windowId);
    if (recentApps.length > 10) recentApps.pop();
    localStorage.setItem('echo_recent_apps', JSON.stringify(recentApps));
}

function filterLauncher() {
    const query = document.getElementById('launcher-search').value.toLowerCase();
    const items = document.querySelectorAll('.launcher-item');
    items.forEach(function(item) {
        const name = item.getAttribute('data-name').toLowerCase();
        if (name.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

document.addEventListener('contextmenu', function(e) {
    const launcherItem = e.target.closest('.launcher-item');
    if (launcherItem && document.getElementById('launcher-menu').style.display === 'flex') {
        e.preventDefault();
        launcherContextTarget = launcherItem;
        const menu = document.getElementById('launcher-context-menu');
        menu.style.display = 'block';
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
    } else {
        document.getElementById('launcher-context-menu').style.display = 'none';
    }
});

document.addEventListener('click', function() {
    document.getElementById('launcher-context-menu').style.display = 'none';
});

function launcherContextAction(action) {
    if (!launcherContextTarget) return;
    const appId = launcherContextTarget.getAttribute('data-app-id');
    if (action === 'open') {
        openApp(appId);
    } else if (action === 'addToShelf') {
        showNotification('📌', 'Added to Shelf', 'App pinned to taskbar.');
    } else if (action === 'uninstall') {
        installedApps = installedApps.filter(function(id) { return id !== appId; });
        localStorage.setItem('echo_installed_apps', JSON.stringify(installedApps));
        showNotification('🗑️', 'Uninstalled', 'App has been removed.');
    }
}

document.addEventListener('contextmenu', function(e) {
    const desktop = e.target.closest('#desktop');
    if (desktop && !e.target.closest('.window') && !e.target.closest('#taskbar')) {
        e.preventDefault();
        const menu = document.getElementById('context-menu');
        menu.style.display = 'block';
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
    }
});

document.addEventListener('click', function() {
    document.getElementById('context-menu').style.display = 'none';
});

function toggleMediaModal() {
    const modal = document.getElementById('media-control-modal');
    modal.classList.toggle('show');
}

function mediaTogglePlay() {
    isPlaying = !isPlaying;
    const btn = document.getElementById('media-play-btn');
    if (isPlaying) {
        btn.innerHTML = '⏸';
        document.getElementById('media-control-btn').classList.add('visible');
    } else {
        btn.innerHTML = '▶';
    }
}

function mediaPrev() {
    showNotification('⏮', 'Previous Track', 'Skipped to previous track.');
}

function mediaNext() {
    showNotification('⏭', 'Next Track', 'Skipped to next track.');
}

function seekMedia(e) {
    const bar = document.getElementById('media-progress-bar');
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    document.getElementById('media-progress-fill').style.width = (percent * 100) + '%';
}

function generateLink() {
    const url = document.getElementById('lc-url').value.trim();
    const title = document.getElementById('lc-title').value.trim() || 'Untitled';
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    const linkData = {
        url: url,
        title: title,
        created: new Date().toISOString()
    };
    linkHistory.unshift(linkData);
    localStorage.setItem('echo_link_history', JSON.stringify(linkHistory));
    const cloakedUrl = 'data:text/html,<title>' + encodeURIComponent(title) + '</title><iframe src="' + encodeURIComponent(url) + '" style="width:100vw;height:100vh;border:none;"></iframe>';
    document.getElementById('lc-output').value = cloakedUrl;
    document.getElementById('lc-result').style.display = 'block';
    renderLinkHistory();
}

function copyLink() {
    const output = document.getElementById('lc-output');
    output.select();
    document.execCommand('copy');
    showNotification('📋', 'Copied!', 'Link copied to clipboard.');
}

function renderLinkHistory() {
    const list = document.getElementById('lc-history-list');
    list.innerHTML = '';
    linkHistory.slice(0, 5).forEach(function(link) {
        const div = document.createElement('div');
        div.style.cssText = 'padding: 8px; background: rgba(128,128,128,0.05); border-radius: 6px; font-size: 12px; cursor: pointer;';
        div.innerHTML = '<strong>' + link.title + '</strong><br><span style="color: var(--sys-text-muted);">' + link.url + '</span>';
        div.onclick = function() {
            document.getElementById('lc-url').value = link.url;
            document.getElementById('lc-title').value = link.title;
        };
        list.appendChild(div);
    });
}

function initPlayStoreData() {
    playStoreGames = [
        { id: 'infinitecraft-window', name: 'Infinite Craft', icon: '⚗️', category: 'simulation', desc: 'Combine elements to create new items in this addictive crafting game.', rating: 4.8, installs: '1M+', size: '2.5 MB' },
        { id: 'paperio-window', name: 'Paper.io', icon: '📄', category: 'arcade', desc: 'Conquer territory and expand your domain in this addictive io game.', rating: 4.5, installs: '5M+', size: '3.1 MB' },
        { id: 'parkingfury-window', name: 'Parking Fury', icon: '🅿️', category: 'simulation', desc: 'Master the art of parking in challenging levels.', rating: 4.2, installs: '500K+', size: '4.2 MB' },
        { id: 'granny3-window', name: 'Granny 3', icon: '👵', category: 'horror', desc: 'Escape from Granny's house in this terrifying horror game.', rating: 4.6, installs: '2M+', size: '15 MB' },
        { id: 'fridaynightfunk-window', name: 'Friday Night Funkin', icon: '🎤', category: 'arcade', desc: 'Rhythm-based battle game with catchy tunes.', rating: 4.7, installs: '3M+', size: '8.5 MB' },
        { id: 'geometrydash-window', name: 'Geometry Dash', icon: '📐', category: 'arcade', desc: 'Jump and fly through danger in this rhythm-based platformer.', rating: 4.9, installs: '10M+', size: '12 MB' },
        { id: 'smashcarts-window', name: 'Smash Carts', icon: '🏎️', category: 'racing', desc: 'Multiplayer kart racing with weapons and power-ups.', rating: 4.4, installs: '1.5M+', size: '6.8 MB' },
        { id: 'eaglercraft-window', name: 'Eaglercraft', icon: '⛏️', category: 'simulation', desc: 'Browser-based Minecraft clone with multiplayer support.', rating: 4.8, installs: '5M+', size: '5.2 MB' },
        { id: 'fnae-window', name: 'Five Nights', icon: '🐻', category: 'horror', desc: 'Survive the night shift at a haunted pizzeria.', rating: 4.5, installs: '2M+', size: '10 MB' },
        { id: 'granny-window', name: 'Granny', icon: '👵', category: 'horror', desc: 'The original horror escape game. Don't get caught!', rating: 4.7, installs: '10M+', size: '14 MB' },
        { id: 'escaperoad-window', name: 'Escape Road', icon: '🚗', category: 'racing', desc: 'Outrun the police in high-speed chases.', rating: 4.3, installs: '1M+', size: '4.5 MB' },
        { id: 'escaperoad2-window', name: 'Escape Road 2', icon: '🏎️', category: 'racing', desc: 'Bigger maps, more cars, intense police chases.', rating: 4.5, installs: '800K+', size: '5.8 MB' },
        { id: 'solarsmash-window', name: 'Solar Smash', icon: '🪐', category: 'simulation', desc: 'Destroy planets with various weapons and disasters.', rating: 4.6, installs: '3M+', size: '7.2 MB' },
        { id: 'brainrot-window', name: 'Steal a Brainrot', icon: '🧠', category: 'arcade', desc: 'Meme-filled adventure game with brainrot humor.', rating: 4.1, installs: '300K+', size: '3.5 MB' },
        { id: 'ragdollhit-window', name: 'Ragdoll Hit', icon: '🥊', category: 'action', desc: 'Physics-based fighting with ragdoll mechanics.', rating: 4.3, installs: '700K+', size: '4.1 MB' },
        { id: 'ragdollarchers-window', name: 'Ragdoll Archers', icon: '🏹', category: 'action', desc: 'Archery combat with hilarious ragdoll physics.', rating: 4.4, installs: '600K+', size: '3.8 MB' },
        { id: '99nights-window', name: '99 Nights in the Forest', icon: '🌲', category: 'horror', desc: 'Survive 99 nights in a dark, mysterious forest.', rating: 4.5, installs: '400K+', size: '8.1 MB' },
        { id: 'rocketleague-window', name: 'Rocket League', icon: '⚽', category: 'sports', desc: 'Soccer with rocket-powered cars. High-octane action!', rating: 4.9, installs: '15M+', size: '20 MB' },
        { id: 'bballrandom-window', name: 'Basketball Random', icon: '🏀', category: 'sports', desc: 'Randomized basketball physics game. Hilarious and fun!', rating: 4.4, installs: '2M+', size: '3.2 MB' },
        { id: 'bballbros-window', name: 'Basketball Bros', icon: '🏀', category: 'sports', desc: 'Street basketball with multiplayer support.', rating: 4.5, installs: '1.2M+', size: '4.8 MB' },
        { id: 'bballlegend-window', name: 'Basketball Legend', icon: '🏀', category: 'sports', desc: 'Become a basketball legend in career mode.', rating: 4.6, installs: '900K+', size: '5.5 MB' },
        { id: 'roblox-window', name: 'Roblox', icon: '🟥', category: 'simulation', desc: 'Play millions of user-created games in one app.', rating: 4.7, installs: '100M+', size: '8 MB' },
        { id: 'gtavice-window', name: 'GTA III: Vice City', icon: '🚔', category: 'action', desc: 'Classic open-world crime adventure.', rating: 4.8, installs: '5M+', size: '25 MB' },
        { id: 'pixelfruits-window', name: 'Pixel Fruits', icon: '🍎', category: 'arcade', desc: 'Match colorful pixel fruits in this puzzle game.', rating: 4.2, installs: '300K+', size: '2.8 MB' },
        { id: 'aceattorney-window', name: 'Ace Attorney', icon: '⚖️', category: 'simulation', desc: 'Courtroom drama visual novel. Objection!', rating: 4.9, installs: '1M+', size: '18 MB' },
        { id: 'callofduty-window', name: 'Call of Duty', icon: '🔫', category: 'action', desc: 'First-person shooter with intense multiplayer battles.', rating: 4.7, installs: '20M+', size: '30 MB' },
        { id: 'stateio-window', name: 'State.io', icon: '🗺️', category: 'strategy', desc: 'Conquer states and expand your empire.', rating: 4.3, installs: '2M+', size: '4.5 MB' },
        { id: 'undertaleyellow-window', name: 'Undertale Yellow', icon: '💛', category: 'rpg', desc: 'Fan-made Undertale prequel with original story.', rating: 4.8, installs: '500K+', size: '12 MB' },
        { id: 'yanderesim-window', name: 'Yandere Simulator', icon: '🔪', category: 'simulation', desc: 'Stealth game about eliminating rivals for your senpai.', rating: 4.5, installs: '3M+', size: '10 MB' },
        { id: 'doodlejump-window', name: 'Doodle Jump', icon: '🐰', category: 'arcade', desc: 'Jump endlessly upward in this classic mobile game.', rating: 4.6, installs: '10M+', size: '3 MB' },
        { id: 'drivingsimulator-window', name: 'Driving Simulator', icon: '🚗', category: 'simulation', desc: 'Realistic driving physics and open world exploration.', rating: 4.4, installs: '1M+', size: '6.2 MB' },
        { id: 'effingzombies-window', name: 'Effing Zombies', icon: '🧟', category: 'action', desc: 'Survive waves of zombies with various weapons.', rating: 4.2, installs: '400K+', size: '3.9 MB' },
        { id: 'granny2-window', name: 'Granny 2', icon: '👵', category: 'horror', desc: 'Granny is back and more terrifying than ever.', rating: 4.7, installs: '3M+', size: '16 MB' },
        { id: 'pokemon-window', name: 'Pokemon', icon: '⚡', category: 'rpg', desc: 'Classic Pokemon adventure in your browser.', rating: 4.9, installs: '8M+', size: '5.5 MB' },
        { id: '1v1lol-window', name: '1v1.LOL', icon: '🔫', category: 'action', desc: 'Build and battle in this competitive shooter.', rating: 4.6, installs: '5M+', size: '4.2 MB' },
        { id: 'bitlife-window', name: 'Bitlife', icon: '📱', category: 'simulation', desc: 'Live a virtual life from birth to death. Make choices!', rating: 4.8, installs: '10M+', size: '3.5 MB' },
        { id: 'footballbros-window', name: 'Football Bros', icon: '🏈', category: 'sports', desc: 'Arcade football with crazy plays and power-ups.', rating: 4.5, installs: '1M+', size: '4.8 MB' }
    ];
    playStoreApps = [
        { id: 'chrome-window', name: 'Chrome', icon: '🌐', category: 'apps', desc: 'Fast, secure web browser.', rating: 4.9, installs: '1B+', size: '5 MB' },
        { id: 'discord-window', name: 'Discord', icon: '💬', category: 'apps', desc: 'Chat and voice communication for gamers.', rating: 4.7, installs: '100M+', size: '8 MB' },
        { id: 'echoflix-window', name: 'EchoFlix', icon: '🎬', category: 'apps', desc: 'Stream movies and TV shows.', rating: 4.6, installs: '5M+', size: '6 MB' },
        { id: 'echomusic-window', name: 'Echo Music', icon: '🎵', category: 'apps', desc: 'Stream and discover music.', rating: 4.8, installs: '3M+', size: '4.5 MB' },
        { id: 'robloxanimator-window', name: 'Roblox Animator V1.7', icon: '🎬', category: 'apps', desc: 'Create Roblox animations easily.', rating: 4.4, installs: '200K+', size: '7 MB' },
        { id: 'wordpad-window', name: 'Wordpad', icon: '📝', category: 'apps', desc: 'Simple text editing and document creation.', rating: 4.3, installs: '1M+', size: '1 MB' },
        { id: 'calc-window', name: 'Calculator', icon: '🧮', category: 'apps', desc: 'Basic and scientific calculator.', rating: 4.5, installs: '10M+', size: '0.5 MB' },
        { id: 'files-window', name: 'Files', icon: '📁', category: 'apps', desc: 'File manager and explorer.', rating: 4.2, installs: '5M+', size: '2 MB' },
        { id: 'linkcreator-window', name: 'Link Creator', icon: '🔗', category: 'apps', desc: 'Create custom shareable links.', rating: 4.1, installs: '100K+', size: '1 MB' }
    ];
}

function renderPlayStoreSidebar() {
    const gameList = document.getElementById('ps-game-list');
    const appList = document.getElementById('ps-app-list');
    if (gameList) {
        gameList.innerHTML = '';
        playStoreGames.forEach(function(game) {
            const item = document.createElement('div');
            item.className = 'ps-game-item';
            item.innerHTML = '<div class="ps-game-icon">' + game.icon + '</div><span>' + game.name + '</span>';
            item.onclick = function() {
                showPlayStoreDetail(game);
            };
            gameList.appendChild(item);
        });
    }
    if (appList) {
        appList.innerHTML = '';
        playStoreApps.forEach(function(app) {
            const item = document.createElement('div');
            item.className = 'ps-game-item';
            item.innerHTML = '<div class="ps-game-icon">' + app.icon + '</div><span>' + app.name + '</span>';
            item.onclick = function() {
                showPlayStoreDetail(app);
            };
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
        gamesBtn.style.background = 'var(--ps-primary)';
        gamesBtn.style.color = 'white';
        appsBtn.style.background = 'rgba(255,255,255,0.05)';
        appsBtn.style.color = '#9aa0a6';
        gameList.style.display = 'flex';
        appList.style.display = 'none';
    } else {
        appsBtn.style.background = 'var(--ps-primary)';
        appsBtn.style.color = 'white';
        gamesBtn.style.background = 'rgba(255,255,255,0.05)';
        gamesBtn.style.color = '#9aa0a6';
        appList.style.display = 'flex';
        gameList.style.display = 'none';
    }
}

function showPlayStoreTab(tab) {
    currentPlayStoreTab = tab;
    document.querySelectorAll('.ps-nav-btn').forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        }
    });
    document.querySelectorAll('.ps-tab').forEach(function(t) {
        t.classList.remove('active');
        t.style.display = 'none';
    });
    const selectedTab = document.getElementById('ps-tab-' + tab);
    if (selectedTab) {
        selectedTab.classList.add('active');
        selectedTab.style.display = 'block';
    }
    if (tab === 'home') {
        renderPlayStoreHome();
    } else if (tab === 'library') {
        renderPlayStoreLibrary();
    } else if (tab === 'store') {
        renderPlayStoreStore();
    } else if (tab === 'favorites') {
        renderPlayStoreFavorites();
    }
}

function renderPlayStoreHome() {
    const empty = document.getElementById('ps-home-empty');
    const content = document.getElementById('ps-home-content');
    const recentSection = document.getElementById('ps-recent-section');
    const recentGrid = document.getElementById('ps-recent-grid');
    const featured = document.getElementById('ps-featured-game');
    const featuredGame = playStoreGames[Math.floor(Math.random() * playStoreGames.length)];
    featured.innerHTML = '<div class="ps-featured-banner"><div class="ps-featured-overlay"><div class="ps-featured-tags"><span class="ps-tag">' + featuredGame.category + '</span><span class="ps-tag full">⭐ ' + featuredGame.rating + '</span></div><h2 class="ps-featured-title">' + featuredGame.name + '</h2><p style="color: #c5c5c5; margin: 0 0 15px 0; font-size: 14px;">' + featuredGame.desc + '</p><button class="ps-play-btn" onclick="installAndPlay('' + featuredGame.id + '')">▶ Play Now</button></div></div>';
    if (recentApps.length === 0) {
        empty.style.display = 'block';
        content.style.display = 'none';
    } else {
        empty.style.display = 'none';
        content.style.display = 'block';
        const recentGames = recentApps.filter(function(id) {
            return playStoreGames.some(function(g) { return g.id === id; }) || playStoreApps.some(function(a) { return a.id === id; });
        }).slice(0, 6);
        if (recentGames.length > 0) {
            recentSection.style.display = 'block';
            recentGrid.innerHTML = '';
            recentGames.forEach(function(id) {
                const game = playStoreGames.find(function(g) { return g.id === id; }) || playStoreApps.find(function(a) { return a.id === id; });
                if (game) {
                    const card = createStoreCard(game, true);
                    recentGrid.appendChild(card);
                }
            });
        } else {
            recentSection.style.display = 'none';
        }
    }
}

function renderPlayStoreLibrary() {
    const grid = document.getElementById('ps-library-grid');
    const empty = document.getElementById('ps-library-empty');
    const allInstalled = installedApps.slice();
    if (allInstalled.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    grid.innerHTML = '';
    allInstalled.forEach(function(id) {
        const item = playStoreGames.find(function(g) { return g.id === id; }) || playStoreApps.find(function(a) { return a.id === id; });
        if (item) {
            const card = document.createElement('div');
            card.className = 'ps-lib-card';
            card.innerHTML = '<div class="lib-icon">' + item.icon + '</div><div class="lib-title">' + item.name + '</div><div class="lib-playtime">' + (playTime[item.id] || '0m') + ' played</div>';
            card.onclick = function() {
                openApp(item.id);
            };
            grid.appendChild(card);
        }
    });
}

function renderPlayStoreStore() {
    const grid = document.getElementById('ps-store-grid');
    const appsGrid = document.getElementById('ps-apps-store-grid');
    grid.innerHTML = '';
    appsGrid.innerHTML = '';
    let filteredGames = playStoreGames;
    if (currentStoreCategory !== 'all') {
        filteredGames = playStoreGames.filter(function(g) { return g.category === currentStoreCategory; });
    }
    const searchQuery = (document.getElementById('ps-store-search') && document.getElementById('ps-store-search').value.toLowerCase()) || '';
    if (searchQuery) {
        filteredGames = filteredGames.filter(function(g) { return g.name.toLowerCase().includes(searchQuery); });
    }
    filteredGames.forEach(function(game) {
        const card = createStoreCard(game);
        grid.appendChild(card);
    });
    let filteredApps = playStoreApps;
    if (searchQuery) {
        filteredApps = filteredApps.filter(function(a) { return a.name.toLowerCase().includes(searchQuery); });
    }
    filteredApps.forEach(function(app) {
        const card = createStoreCard(app);
        appsGrid.appendChild(card);
    });
}

function renderPlayStoreFavorites() {
    const grid = document.getElementById('ps-favorites-grid');
    const empty = document.getElementById('ps-favorites-empty');
    if (favorites.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    grid.innerHTML = '';
    favorites.forEach(function(id) {
        const item = playStoreGames.find(function(g) { return g.id === id; }) || playStoreApps.find(function(a) { return a.id === id; });
        if (item) {
            const card = createStoreCard(item);
            grid.appendChild(card);
        }
    });
}

function createStoreCard(item, isSmall) {
    const isInstalled = installedApps.includes(item.id);
    const isFav = favorites.includes(item.id);
    const card = document.createElement('div');
    card.className = 'ps-store-card';
    card.innerHTML = '<div class="card-icon">' + item.icon + '</div><div class="card-title">' + item.name + '</div><div class="card-meta">⭐ ' + item.rating + ' • ' + item.size + '</div><div class="install-overlay"><button onclick="installAndPlay('' + item.id + ''); event.stopPropagation();">' + (isInstalled ? '▶ Play' : '⬇ Install') + '</button><button onclick="toggleFavorite('' + item.id + ''); event.stopPropagation();" style="background: transparent; border: 1px solid white; color: white;">' + (isFav ? '★' : '☆') + '</button></div>';
    card.onclick = function() {
        showPlayStoreDetail(item);
    };
    return card;
}

function showPlayStoreDetail(item) {
    const overlay = document.getElementById('ps-detail-overlay');
    const content = document.getElementById('ps-detail-content');
    const isInstalled = installedApps.includes(item.id);
    const isFav = favorites.includes(item.id);
    content.innerHTML = '<div class="ps-detail-banner"><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:80px;background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%);">' + item.icon + '</div></div><div style="display:flex;gap:15px;align-items:flex-start;"><div class="ps-detail-icon">' + item.icon + '</div><div style="flex:1;"><h2 class="ps-detail-title">' + item.name + '</h2><div class="ps-detail-meta"><span>' + item.category + '</span><span>⭐ ' + item.rating + '</span><span>' + item.size + '</span></div></div></div><div class="ps-detail-actions"><button class="ps-detail-btn play" onclick="installAndPlay('' + item.id + '')">' + (isInstalled ? '▶ Play Now' : '⬇ Install') + '</button><button class="ps-detail-btn install" onclick="toggleFavorite('' + item.id + '')">' + (isFav ? '★ Favorited' : '☆ Add to Favorites') + '</button></div><div class="ps-detail-stats"><div class="ps-detail-stat"><div class="stat-value">' + item.rating + '</div><div class="stat-label">Rating</div></div><div class="ps-detail-stat"><div class="stat-value">' + item.installs + '</div><div class="stat-label">Downloads</div></div><div class="ps-detail-stat"><div class="stat-value">' + (playTime[item.id] || '0m') + '</div><div class="stat-label">Your Playtime</div></div></div><div class="ps-detail-desc">' + item.desc + '</div><div class="ps-detail-controls"><h4>Controls</h4><p>Mouse and keyboard supported. Fullscreen recommended for best experience.</p></div>';
    overlay.style.transform = 'translateX(0)';
}

function closePlayStoreDetail() {
    document.getElementById('ps-detail-overlay').style.transform = 'translateX(100%)';
}

function installAndPlay(appId) {
    if (!installedApps.includes(appId)) {
        installedApps.push(appId);
        localStorage.setItem('echo_installed_apps', JSON.stringify(installedApps));
        showNotification('⬇', 'Installed', 'App has been installed successfully!');
    }
    playTime[appId] = playTime[appId] || '0m';
    openApp(appId);
    renderPlayStoreLibrary();
    renderPlayStoreStore();
    renderPlayStoreHome();
}

function toggleFavorite(appId) {
    const index = favorites.indexOf(appId);
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('☆', 'Removed', 'Removed from favorites.');
    } else {
        favorites.push(appId);
        showNotification('★', 'Added', 'Added to favorites!');
    }
    localStorage.setItem('echo_favorites', JSON.stringify(favorites));
    renderPlayStoreFavorites();
    const item = playStoreGames.find(function(g) { return g.id === appId; }) || playStoreApps.find(function(a) { return a.id === appId; });
    if (item && document.getElementById('ps-detail-overlay').style.transform === 'translateX(0px)') {
        showPlayStoreDetail(item);
    }
}

function filterPlayStoreGames() {
    renderPlayStoreStore();
}

function filterStoreCategory(cat) {
    currentStoreCategory = cat;
    document.querySelectorAll('.ps-category').forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('data-cat') === cat) {
            btn.classList.add('active');
        }
    });
    renderPlayStoreStore();
}

function clearPlayStoreData() {
    if (confirm('Clear all Play Store data? This will remove installed apps, favorites, and playtime.')) {
        installedApps = [];
        favorites = [];
        playTime = {};
        localStorage.setItem('echo_installed_apps', '[]');
        localStorage.setItem('echo_favorites', '[]');
        localStorage.setItem('echo_playtime', '{}');
        showNotification('🗑', 'Cleared', 'All Play Store data has been cleared.');
        renderPlayStoreLibrary();
        renderPlayStoreFavorites();
    }
}

let draggedIcon = null;
let iconOffsetX = 0;
let iconOffsetY = 0;

document.addEventListener('mousedown', function(e) {
    const icon = e.target.closest('.desktop-icon');
    if (icon) {
        draggedIcon = icon;
        const rect = icon.getBoundingClientRect();
        iconOffsetX = e.clientX - rect.left;
        iconOffsetY = e.clientY - rect.top;
        e.preventDefault();
    }
});

document.addEventListener('mousemove', function(e) {
    if (draggedIcon) {
        draggedIcon.style.left = (e.clientX - iconOffsetX) + 'px';
        draggedIcon.style.top = (e.clientY - iconOffsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    draggedIcon = null;
});

const snapPreview = document.getElementById('snap-preview');
document.addEventListener('mousemove', function(e) {
    if (draggedWindow && snapPreview) {
        const x = e.clientX;
        const y = e.clientY;
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (x < 50) {
            snapPreview.style.display = 'block';
            snapPreview.style.left = '0';
            snapPreview.style.top = '0';
            snapPreview.style.width = '50vw';
            snapPreview.style.height = '100vh';
        } else if (x > w - 50) {
            snapPreview.style.display = 'block';
            snapPreview.style.left = '50vw';
            snapPreview.style.top = '0';
            snapPreview.style.width = '50vw';
            snapPreview.style.height = '100vh';
        } else if (y < 50) {
            snapPreview.style.display = 'block';
            snapPreview.style.left = '0';
            snapPreview.style.top = '0';
            snapPreview.style.width = '100vw';
            snapPreview.style.height = '100vh';
        } else {
            snapPreview.style.display = 'none';
        }
    }
});

document.addEventListener('mouseup', function(e) {
    if (snapPreview && snapPreview.style.display === 'block') {
        snapPreview.style.display = 'none';
        if (draggedWindow) {
            const x = e.clientX;
            const y = e.clientY;
            const w = window.innerWidth;
            if (x < 50) {
                draggedWindow.style.left = '0';
                draggedWindow.style.top = '0';
                draggedWindow.style.width = '50vw';
                draggedWindow.style.height = '100vh';
            } else if (x > w - 50) {
                draggedWindow.style.left = '50vw';
                draggedWindow.style.top = '0';
                draggedWindow.style.width = '50vw';
                draggedWindow.style.height = '100vh';
            } else if (y < 50) {
                draggedWindow.classList.add('fullscreen');
            }
        }
    }
});

document.querySelectorAll('.app-icon').forEach(function(icon) {
    icon.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('app-id', icon.id);
        icon.classList.add('dragging-icon');
    });
    icon.addEventListener('dragend', function() {
        icon.classList.remove('dragging-icon');
    });
});

document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        if (activeWindows.length > 1) {
            const current = activeWindows[activeWindows.length - 1];
            const currentEl = document.getElementById(current);
            if (currentEl) {
                currentEl.style.zIndex = 10;
            }
            activeWindows.unshift(activeWindows.pop());
            const next = activeWindows[activeWindows.length - 1];
            const nextEl = document.getElementById(next);
            if (nextEl) {
                nextEl.style.zIndex = ++zIndexCounter;
            }
        }
    }
    if (e.key === 'Escape') {
        document.getElementById('quick-settings').style.display = 'none';
        document.getElementById('launcher-menu').style.display = 'none';
        document.getElementById('media-control-modal').classList.remove('show');
        document.getElementById('calendar-modal').style.display = 'none';
    }
});

window.addEventListener('load', function() {
    const savedCloak = localStorage.getItem('echo_cloak');
    if (savedCloak) {
        document.getElementById('cloak-selector').value = savedCloak;
        changeTabCloak();
    }
    const brightness = localStorage.getItem('echo_brightness');
    if (brightness) {
        document.getElementById('brightness-slider').value = brightness;
        document.getElementById('desktop').style.filter = 'brightness(' + brightness + '%)';
    }
    renderLinkHistory();
});
