document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVIGATION =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const burger = document.getElementById('burger');
    const navLinksContainer = document.querySelector('.nav-links');

    function showSection(sectionId) {
        sections.forEach(s => s.classList.remove('active'));
        navLinks.forEach(l => l.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        navLinksContainer.classList.remove('show');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(link.dataset.section);
        });
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => showSection(card.dataset.section));
    });

    burger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('show');
    });

    // ===== TEXTBOOK =====
    let currentClass = 5;
    const classBtns = document.querySelectorAll('.class-btn');
    const topicsList = document.getElementById('topicsList');
    const lessonContent = document.getElementById('lessonContent');
    const lessonBody = document.getElementById('lessonBody');
    const backToTopics = document.getElementById('backToTopics');

    function loadTopics(classNum) {
        topicsList.style.display = 'grid';
        lessonContent.style.display = 'none';
        topicsList.innerHTML = '';
        const topics = textbookData[classNum] || [];
        topics.forEach((topic, i) => {
            const div = document.createElement('div');
            div.className = 'topic-item';
            div.innerHTML = `
                <div class="topic-number">${i + 1}</div>
                <div>
                    <div class="topic-title">${topic.title}</div>
                    <div class="topic-desc">${topic.desc}</div>
                </div>
            `;
            div.addEventListener('click', () => {
                topicsList.style.display = 'none';
                lessonContent.style.display = 'block';
                lessonBody.innerHTML = topic.content;
            });
            topicsList.appendChild(div);
        });
    }

    classBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            classBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentClass = parseInt(btn.dataset.class);
            loadTopics(currentClass);
        });
    });

    backToTopics.addEventListener('click', () => loadTopics(currentClass));
    loadTopics(5);

    // ===== TESTS =====
    let currentCategory = 'grammar';
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let answered = false;

    const testCatBtns = document.querySelectorAll('.test-cat-btn');
    const testInfo = document.getElementById('testInfo');
    const testQuestion = document.getElementById('testQuestion');
    const testResult = document.getElementById('testResult');
    const startTestBtn = document.getElementById('startTest');
    const retryTestBtn = document.getElementById('retryTest');
    const questionCounter = document.getElementById('questionCounter');
    const questionText = document.getElementById('questionText');
    const answersContainer = document.getElementById('answers');
    const testProgress = document.getElementById('testProgress');
    const resultScore = document.getElementById('resultScore');
    const resultText = document.getElementById('resultText');

    testCatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            testCatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            resetTest();
        });
    });

    function shuffleArray(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function startTest() {
        currentQuestions = shuffleArray(testsData[currentCategory]).slice(0, 10);
        currentQuestionIndex = 0;
        score = 0;
        testInfo.style.display = 'none';
        testResult.style.display = 'none';
        testQuestion.style.display = 'block';
        showQuestion();
    }

    function showQuestion() {
        answered = false;
        const q = currentQuestions[currentQuestionIndex];
        questionCounter.textContent = `Вопрос ${currentQuestionIndex + 1}/${currentQuestions.length}`;
        questionText.textContent = q.question;
        testProgress.style.width = `${((currentQuestionIndex) / currentQuestions.length) * 100}%`;
        answersContainer.innerHTML = '';
        q.answers.forEach((ans, i) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = ans;
            btn.addEventListener('click', () => checkAnswer(i, btn));
            answersContainer.appendChild(btn);
        });
    }

    function checkAnswer(index, btn) {
        if (answered) return;
        answered = true;
        const q = currentQuestions[currentQuestionIndex];
        const allBtns = answersContainer.querySelectorAll('.answer-btn');
        allBtns.forEach((b, i) => {
            if (i === q.correct) b.classList.add('correct');
            if (i === index && i !== q.correct) b.classList.add('wrong');
            b.style.pointerEvents = 'none';
        });
        if (index === q.correct) score++;

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < currentQuestions.length) {
                showQuestion();
            } else {
                showResult();
            }
        }, 1000);
    }

    function showResult() {
        testQuestion.style.display = 'none';
        testResult.style.display = 'block';
        testProgress.style.width = '100%';
        const percent = Math.round((score / currentQuestions.length) * 100);
        resultScore.textContent = `${percent}%`;

        let msg = '';
        if (percent >= 90) msg = 'Тамаша! Керемет! (Отлично!)';
        else if (percent >= 70) msg = 'Жақсы! (Хорошо!)';
        else if (percent >= 50) msg = 'Орташа (Нормально)';
        else msg = 'Қайталау керек (Нужно повторить)';
        resultText.textContent = `${score}/${currentQuestions.length} - ${msg}`;

        // Update stats
        const testsCompleted = parseInt(localStorage.getItem('testsCompleted') || '0') + 1;
        localStorage.setItem('testsCompleted', testsCompleted);
        document.getElementById('testsCompleted').textContent = testsCompleted;
    }

    function resetTest() {
        testInfo.style.display = 'block';
        testQuestion.style.display = 'none';
        testResult.style.display = 'none';
        testProgress.style.width = '0%';
    }

    startTestBtn.addEventListener('click', startTest);
    retryTestBtn.addEventListener('click', startTest);

    // ===== DICTIONARY =====
    let currentDictCategory = 'all';
    const wordCatBtns = document.querySelectorAll('.word-cat');
    const dictSearch = document.getElementById('dictSearch');
    const dictSearchBtn = document.getElementById('dictSearchBtn');
    const dictionaryList = document.getElementById('dictionaryList');

    function loadDictionary(filter = '', category = 'all') {
        dictionaryList.innerHTML = '';
        let words = dictionaryData;
        if (category !== 'all') {
            words = words.filter(w => w.category === category);
        }
        if (filter) {
            const f = filter.toLowerCase();
            words = words.filter(w =>
                w.kz.toLowerCase().includes(f) ||
                w.ru.toLowerCase().includes(f)
            );
        }
        words.forEach(word => {
            const div = document.createElement('div');
            div.className = 'word-card';
            div.innerHTML = `
                <div class="word-kz">${word.kz}</div>
                <div class="word-ru">${word.ru}</div>
                <div class="word-category">${categoryNames[word.category]}</div>
            `;
            dictionaryList.appendChild(div);
        });
    }

    wordCatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            wordCatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDictCategory = btn.dataset.category;
            loadDictionary(dictSearch.value, currentDictCategory);
        });
    });

    dictSearch.addEventListener('input', () => {
        loadDictionary(dictSearch.value, currentDictCategory);
    });

    dictSearchBtn.addEventListener('click', () => {
        loadDictionary(dictSearch.value, currentDictCategory);
    });

    loadDictionary();

    // ===== GAMES =====
    const gamesGrid = document.querySelector('.games-grid');
    const gameArea = document.getElementById('gameArea');
    const gameContent = document.getElementById('gameContent');
    const backToGames = document.getElementById('backToGames');
    const gameMatch = document.getElementById('gameMatch');
    const gameFlash = document.getElementById('gameFlash');
    const gameSpell = document.getElementById('gameSpell');

    function showGameArea() {
        gamesGrid.style.display = 'none';
        gameArea.style.display = 'block';
    }

    backToGames.addEventListener('click', () => {
        gamesGrid.style.display = 'grid';
        gameArea.style.display = 'none';
    });

    // --- Match Game ---
    gameMatch.querySelector('.play-btn').addEventListener('click', () => {
        showGameArea();
        const words = shuffleArray(dictionaryData).slice(0, 5);
        let selectedLeft = null;
        let selectedRight = null;
        let matched = 0;

        const leftWords = shuffleArray(words.map(w => ({ id: w.kz, text: w.kz })));
        const rightWords = shuffleArray(words.map(w => ({ id: w.kz, text: w.ru })));

        gameContent.innerHTML = `
            <h3 style="text-align:center;margin-bottom:1rem;">Найди перевод</h3>
            <div class="match-game">
                <div class="match-column" id="leftCol">
                    ${leftWords.map(w => `<div class="match-item" data-id="${w.id}">${w.text}</div>`).join('')}
                </div>
                <div class="match-column" id="rightCol">
                    ${rightWords.map(w => `<div class="match-item" data-id="${w.id}">${w.text}</div>`).join('')}
                </div>
            </div>
            <p style="text-align:center;margin-top:1rem;color:var(--text-light);" id="matchStatus">0/${words.length} совпадений</p>
        `;

        function checkMatch() {
            if (!selectedLeft || !selectedRight) return;
            const leftEl = document.querySelector(`#leftCol [data-id="${selectedLeft}"]`);
            const rightEl = document.querySelector(`#rightCol [data-id="${selectedRight}"]`);
            if (selectedLeft === selectedRight) {
                leftEl.classList.add('matched');
                rightEl.classList.add('matched');
                matched++;
                document.getElementById('matchStatus').textContent = `${matched}/${words.length} совпадений`;
                if (matched === words.length) {
                    const wordsLearned = parseInt(localStorage.getItem('wordsLearned') || '0') + words.length;
                    localStorage.setItem('wordsLearned', wordsLearned);
                    document.getElementById('wordsLearned').textContent = wordsLearned;
                    setTimeout(() => alert('Тамаша! Все слова найдены!'), 300);
                }
            } else {
                leftEl.classList.remove('selected');
                rightEl.classList.remove('selected');
            }
            selectedLeft = null;
            selectedRight = null;
        }

        document.querySelectorAll('#leftCol .match-item').forEach(el => {
            el.addEventListener('click', () => {
                if (el.classList.contains('matched')) return;
                document.querySelectorAll('#leftCol .match-item').forEach(e => e.classList.remove('selected'));
                el.classList.add('selected');
                selectedLeft = el.dataset.id;
                checkMatch();
            });
        });

        document.querySelectorAll('#rightCol .match-item').forEach(el => {
            el.addEventListener('click', () => {
                if (el.classList.contains('matched')) return;
                document.querySelectorAll('#rightCol .match-item').forEach(e => e.classList.remove('selected'));
                el.classList.add('selected');
                selectedRight = el.dataset.id;
                checkMatch();
            });
        });
    });

    // --- Flashcard Game ---
    gameFlash.querySelector('.play-btn').addEventListener('click', () => {
        showGameArea();
        const words = shuffleArray(dictionaryData).slice(0, 10);
        let currentIndex = 0;

        function renderFlashcard() {
            const w = words[currentIndex];
            gameContent.innerHTML = `
                <div class="flashcard-container">
                    <div class="flashcard" id="flashcard">
                        <div class="flashcard-front">
                            <div>${w.kz}</div>
                            <div class="flashcard-hint">Нажми чтобы перевернуть</div>
                        </div>
                        <div class="flashcard-back">
                            <div>${w.ru}</div>
                            <div class="flashcard-hint">${categoryNames[w.category]}</div>
                        </div>
                    </div>
                </div>
                <div class="flashcard-nav">
                    <button class="prev-btn" id="fcPrev">← Назад</button>
                    <span style="font-weight:600;">${currentIndex + 1}/${words.length}</span>
                    <button class="next-btn" id="fcNext">Далее →</button>
                </div>
            `;
            document.getElementById('flashcard').addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
            document.getElementById('fcPrev').addEventListener('click', () => {
                if (currentIndex > 0) { currentIndex--; renderFlashcard(); }
            });
            document.getElementById('fcNext').addEventListener('click', () => {
                if (currentIndex < words.length - 1) { currentIndex++; renderFlashcard(); }
                else {
                    const wordsLearned = parseInt(localStorage.getItem('wordsLearned') || '0') + words.length;
                    localStorage.setItem('wordsLearned', wordsLearned);
                    document.getElementById('wordsLearned').textContent = wordsLearned;
                    alert('Керемет! Все карточки пройдены!');
                }
            });
        }
        renderFlashcard();
    });

    // --- Spell Game ---
    gameSpell.querySelector('.play-btn').addEventListener('click', () => {
        showGameArea();
        const words = shuffleArray(dictionaryData).slice(0, 5);
        let currentIndex = 0;

        function renderSpell() {
            const w = words[currentIndex];
            gameContent.innerHTML = `
                <div class="spell-game">
                    <h3>Напиши слово правильно</h3>
                    <p class="spell-hint">Перевод: <strong>${w.ru}</strong></p>
                    <div class="spell-word">${w.kz.charAt(0).toUpperCase() + '_'.repeat(w.kz.length - 1)}</div>
                    <input type="text" class="spell-input" id="spellInput" placeholder="Введи слово на казахском..." autocomplete="off">
                    <button class="spell-check-btn" id="spellCheck">Проверить</button>
                    <div class="spell-feedback" id="spellFeedback"></div>
                </div>
            `;
            const input = document.getElementById('spellInput');
            const feedback = document.getElementById('spellFeedback');
            document.getElementById('spellCheck').addEventListener('click', () => {
                const val = input.value.trim().toLowerCase();
                if (val === w.kz.toLowerCase()) {
                    feedback.style.color = 'var(--success)';
                    feedback.textContent = 'Дұрыс! (Правильно!)';
                    setTimeout(() => {
                        currentIndex++;
                        if (currentIndex < words.length) renderSpell();
                        else {
                            const wordsLearned = parseInt(localStorage.getItem('wordsLearned') || '0') + words.length;
                            localStorage.setItem('wordsLearned', wordsLearned);
                            document.getElementById('wordsLearned').textContent = wordsLearned;
                            alert('Тамаша! Все слова написаны правильно!');
                        }
                    }, 1000);
                } else {
                    feedback.style.color = 'var(--error)';
                    feedback.textContent = `Қате! Правильно: ${w.kz}`;
                }
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') document.getElementById('spellCheck').click();
            });
        }
        renderSpell();
    });

    // ===== LOAD STATS =====
    document.getElementById('wordsLearned').textContent = localStorage.getItem('wordsLearned') || '0';
    document.getElementById('testsCompleted').textContent = localStorage.getItem('testsCompleted') || '0';
    document.getElementById('streak').textContent = localStorage.getItem('streak') || '0';
});
