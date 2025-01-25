class TypingTest {
    constructor() {
        // تهيئة عناصر DOM
        this.initializeElements();
        
        // تهيئة المتغيرات الأساسية
        this.initializeVariables();
        
        // بدء التطبيق
        this.init();
        
        // تحديث الوقت
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    initializeElements() {
        this.textDisplay = document.getElementById('textDisplay');
        this.textInput = document.getElementById('textInput');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.results = document.getElementById('results');
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.arabicBtn = document.getElementById('arabicBtn');
        this.englishBtn = document.getElementById('englishBtn');
        this.keyboard = document.getElementById('keyboard');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.username = document.getElementById('username');
        this.currentTimeDisplay = document.getElementById('currentTime');
    }

    initializeVariables() {
        this.timeLeft = 60;
        this.isRunning = false;
        this.timer = null;
        this.currentText = '';
        this.errors = 0;
        this.totalTyped = 0;
        this.currentLanguage = 'arabic';
        this.currentDifficulty = 'all';
        this.startTime = null;
    }

    init() {
        // إعداد event listeners
        this.setupEventListeners();
        
        // تهيئة لوحة المفاتيح
        this.initializeKeyboard();
        
        // تعيين اسم المستخدم
        this.username.textContent = 'Mahmoud Nazmy';
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTest());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.textInput.addEventListener('input', () => this.checkInput());
        this.arabicBtn.addEventListener('click', () => this.switchLanguage('arabic'));
        this.englishBtn.addEventListener('click', () => this.switchLanguage('english'));
        this.difficultySelect.addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.resetTest();
        });
    }

    updateDateTime() {
        const now = new Date();
        this.currentTimeDisplay.textContent = now.toISOString().slice(0, 19).replace('T', ' ');
    }

    initializeKeyboard() {
        const layout = {
            arabic: [
                ['ذ', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '٠'],
                ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج'],
                ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
                ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ']
            ],
            english: [
                ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
                ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
                ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
                ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/']
            ]
        };

        this.layouts = layout;
        this.renderKeyboard();
    }

    renderKeyboard() {
        const layout = this.layouts[this.currentLanguage];
        this.keyboard.innerHTML = '';

        layout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';

            row.forEach(key => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'key';
                keyDiv.textContent = key;
                keyDiv.dataset.key = key.toLowerCase();
                rowDiv.appendChild(keyDiv);
            });

            this.keyboard.appendChild(rowDiv);
        });

        // إضافة مفتاح المسافة
        const spaceRow = document.createElement('div');
        spaceRow.className = 'keyboard-row';
        const spaceKey = document.createElement('div');
        spaceKey.className = 'key space';
        spaceKey.dataset.key = ' ';
        spaceKey.textContent = '';
        spaceRow.appendChild(spaceKey);
        this.keyboard.appendChild(spaceRow);
    }

    switchLanguage(language) {
        this.currentLanguage = language;
        this.arabicBtn.classList.toggle('active', language === 'arabic');
        this.englishBtn.classList.toggle('active', language === 'english');
        this.renderKeyboard();
        this.resetTest();
    }

    getRandomText() {
        const availableTexts = texts[this.currentLanguage].filter(text => 
            this.currentDifficulty === 'all' || text.difficulty === this.currentDifficulty
        );
        return availableTexts[Math.floor(Math.random() * availableTexts.length)].text;
    }

    startTest() {
        this.isRunning = true;
        this.textInput.disabled = false;
        this.startBtn.disabled = true;
        this.resetBtn.disabled = true;
        this.results.style.display = 'none';
        
        this.currentText = this.getRandomText();
        this.textDisplay.innerHTML = this.currentText;
        this.textDisplay.classList.add('active');
        
        this.textInput.value = '';
        this.textInput.focus();
        
        this.startTime = new Date();
        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            
            this.minutesDisplay.textContent = minutes;
            this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
            
            if (this.timeLeft === 0) {
                this.endTest();
            }
        }, 1000);
    }

    checkInput() {
        if (!this.isRunning) return;

        const inputText = this.textInput.value;
        this.totalTyped = inputText.length;
        
        let displayText = '';
        let errorCount = 0;
        
        for (let i = 0; i < this.currentText.length; i++) {
            if (i < inputText.length) {
                if (inputText[i] === this.currentText[i]) {
                    displayText += `<span class="correct">${this.currentText[i]}</span>`;
                } else {
                    displayText += `<span class="incorrect">${this.currentText[i]}</span>`;
                    errorCount++;
                }
            } else {
                displayText += this.currentText[i];
            }
        }
        
        this.errors = errorCount;
        this.textDisplay.innerHTML = displayText;
        this.updateKeyboardState(inputText[inputText.length - 1]);

        // التحقق من اكتمال النص
        if (inputText.length >= this.currentText.length) {
            this.endTest();
        }
    }

    updateKeyboardState(currentChar) {
        if (!currentChar) return;

        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('active', 'correct', 'incorrect');
            if (key.dataset.key === currentChar.toLowerCase()) {
                const isCorrect = this.currentText[this.totalTyped - 1].toLowerCase() === currentChar.toLowerCase();
                key.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
        });
    }

    endTest() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.textInput.disabled = true;
        this.resetBtn.disabled = false;
        
        // حساب الوقت المستغرق بالثواني
        const timeSpent = Math.min(60 - this.timeLeft, 60);
        
        // حساب النتائج
        const wordsTyped = this.textInput.value.trim().split(/\s+/).length;
        const wpm = Math.round((wordsTyped * 60) / timeSpent);
        const accuracy = Math.max(0, Math.round(((this.totalTyped - this.errors) / this.totalTyped) * 100)) || 0;
        
        // عرض النتائج
        document.getElementById('wpm').textContent = wpm;
        document.getElementById('accuracy').textContent = accuracy;
        document.getElementById('errors').textContent = this.errors;
        
        this.results.style.display = 'block';
        this.results.classList.add('animate');
    }

    resetTest() {
        clearInterval(this.timer);
        this.timeLeft = 60;
        this.errors = 0;
        this.totalTyped = 0;
        this.isRunning = false;
        this.startTime = null;
        
        this.textInput.value = '';
        this.textInput.disabled = true;
        this.textDisplay.innerHTML = 'اضغط على "ابدأ الاختبار" للبدء';
        this.textDisplay.classList.remove('active');
        
        this.minutesDisplay.textContent = '1';
        this.secondsDisplay.textContent = '00';
        
        this.startBtn.disabled = false;
        this.resetBtn.disabled = true;
        this.results.style.display = 'none';
        
        // إعادة تعيين لوحة المفاتيح
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('active', 'correct', 'incorrect');
        });
    }
}

// تهيئة الاختبار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const typingTest = new TypingTest();
});
