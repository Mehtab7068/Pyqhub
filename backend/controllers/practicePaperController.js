import { chromium } from 'playwright';

const cleanText = (value) => String(value || '').replace(/\\s+/g, ' ').trim();

const extractSourceExplanation = (value) => {
    const explanation = cleanText(value)
        .replace(/^Question\s+\d+\s+Explanation:\s*/i, '')
        .trim();

    if (!explanation || /^(click here|view|see)\s+(for|the)\s+(detail|detailed)?\s*solution/i.test(explanation)) {
        return '';
    }

    return explanation;
};

const extractNatAnswer = (text) => {
    const match = String(text || '').match(/(?:correct\s+answer|answer|ans)\s*[:=\-]?\s*(-?\d+(?:\.\d+)?)/i);
    return match ? Number(match[1]) : null;
};

const determineDifficulty = (questionText, options, explanation) => {
    const text = `${questionText} ${explanation}`.toLowerCase();
    let score = 0;

    if (text.length > 450) score += 1;
    if (text.length > 900) score += 1;
    if ((text.match(/\b(and|then|after|before|following|which of the following)\b/g) || []).length >= 3) score += 1;
    if (/(algorithm|recursion|dynamic programming|time complexity|proof|minimum spanning|deadlock|normalization|automata)/i.test(text)) score += 1;
    if (/(calculate|compute|evaluate|minimum|maximum|number of ways|how many)/i.test(text)) score += 1;
    if ((options || []).length >= 4 && /which.*correct|which.*true|possible/i.test(text)) score += 1;
    if ((text.match(/[=+*/^]|\bif\b|\bfor\b|\bwhile\b/g) || []).length >= 4) score += 1;

    if (score >= 5) return 'hard';
    if (score >= 2) return 'medium';
    return 'easy';
};

const evaluateArithmeticExpression = (expression) => {
    const tokens = expression.replace(/−/g, '-').match(/\d+(?:\.\d+)?|[+\-*/]/g);
    if (!tokens || tokens.length < 3) return null;

    const precedence = { '+': 4, '-': 3, '*': 2, '/': 1 };
    const values = [];
    const operators = [];
    const apply = () => {
        const operator = operators.pop();
        const right = values.pop();
        const left = values.pop();
        if (operator === '+') values.push(left + right);
        if (operator === '-') values.push(left - right);
        if (operator === '*') values.push(left * right);
        if (operator === '/') values.push(left / right);
    };

    tokens.forEach((token) => {
        if (/^\d/.test(token)) {
            values.push(Number(token));
            return;
        }
        // All operators in the source table are right-associative except +.
        while (operators.length && (precedence[operators.at(-1)] > precedence[token]
            || (precedence[operators.at(-1)] === precedence[token] && token === '+'))) {
            apply();
        }
        operators.push(token);
    });
    while (operators.length) apply();
    const value = values[0];
    return Number.isFinite(value) ? Number(value.toFixed(6)) : null;
};

const inferArithmeticNat = (questionText) => {
    const normalizedText = String(questionText).replace(/[∗×]/g, '*').replace(/[−–]/g, '-');
    const match = normalizedText.match(/value of the expression\s+([\d\s+*/-]{5,})\s+as per/i);
    if (!match) return null;
    const expression = match[1].replace(/\s+/g, ' ').trim();
    return evaluateArithmeticExpression(expression);
};

const inferStackQueueNat = (questionText) => {
    const text = String(questionText);
    const queueIndex = text.toLowerCase().indexOf('queue');
    if (queueIndex < 0 || !/s\s*=\s*pop\s*\(/i.test(text) || !/q\s*=\s*dequeue\s*\(/i.test(text)) return null;

    const simulateStack = (part) => {
        const stack = [];
        let lastPopped = null;
        for (const operation of part.match(/push\s*\(\s*-?\d+(?:\.\d+)?\s*\)|pop\s*\(\s*\)/gi) || []) {
            const value = operation.match(/push\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)/i);
            if (value) stack.push(Number(value[1]));
            else lastPopped = stack.pop() ?? null;
        }
        return lastPopped;
    };

    const simulateQueue = (part) => {
        const queue = [];
        let lastDequeued = null;
        for (const operation of part.match(/enqueue\s*\(\s*-?\d+(?:\.\d+)?\s*\)|dequeue\s*\(\s*\)/gi) || []) {
            const value = operation.match(/enqueue\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)/i);
            if (value) queue.push(Number(value[1]));
            else lastDequeued = queue.shift() ?? null;
        }
        return lastDequeued;
    };

    const stackAnswer = simulateStack(text.slice(0, queueIndex));
    const queueAnswer = simulateQueue(text.slice(queueIndex));
    return stackAnswer === null || queueAnswer === null ? null : stackAnswer + queueAnswer;
};

const inferNatAnswer = (questionText) => inferArithmeticNat(questionText) ?? inferStackQueueNat(questionText);

const getImportMetadata = (url, sourceChapter) => {
    const path = new URL(url).pathname.toLowerCase();
    if (path.includes('linked-list')) {
        return {
            chapter: 'Linked List',
            tags: ['Data Structure', 'Programming'],
        };
    }

    return {
        chapter: sourceChapter || 'General Aptitude',
        tags: sourceChapter ? [sourceChapter] : ['General Aptitude'],
    };
};

const classifyQuestion = (subject, questionText, sourceChapter, sourceUrl, selectedChapter) => {
    if (selectedChapter?.trim()) {
        return {
            chapter: selectedChapter.trim(),
            tags: [subject || 'Imported Questions'],
        };
    }

    const text = `${questionText} ${sourceChapter}`.toLowerCase().replace(/[-_/]/g, ' ');
    const subjectName = String(subject || '').toLowerCase();
    const isProgrammingDataStructures = subjectName.includes('programming') || subjectName.includes('data structure');

    if (isProgrammingDataStructures) {
        const rules = [
            { chapter: 'Link List', tags: ['Data Structure', 'Programming'], terms: ['linked list', 'singly linked', 'doubly linked', 'circular linked'] },
            { chapter: 'Binary Search Tree', tags: ['Data Structure', 'Programming'], terms: ['binary search tree', 'bst'] },
            { chapter: 'AVL Tree', tags: ['Data Structure', 'Programming'], terms: ['avl tree', 'avl rotation'] },
            { chapter: 'B+ Tree', tags: ['Data Structure', 'Programming'], terms: ['b+ tree', 'b plus tree'] },
            { chapter: 'B Tree', tags: ['Data Structure', 'Programming'], terms: ['b-tree', 'b tree'] },
            { chapter: 'Heap Tree', tags: ['Data Structure', 'Programming'], terms: ['heap tree', 'min heap', 'max heap', 'heapify'] },
            { chapter: 'Binary Tree', tags: ['Data Structure', 'Programming'], terms: ['binary tree', 'tree traversal'] },
            { chapter: 'Stack', tags: ['Data Structure', 'Programming'], terms: ['stack', 'push operation', 'pop operation'] },
            { chapter: 'Queue', tags: ['Data Structure', 'Programming'], terms: ['queue', 'enqueue', 'dequeue'] },
            { chapter: 'Hashing', tags: ['Data Structure', 'Programming'], terms: ['hash table', 'hashing', 'collision resolution'] },
            { chapter: 'Array', tags: ['Data Structure', 'Programming'], terms: ['array', 'subarray', 'array index'] },
        ];
        const match = rules.find((rule) => rule.terms.some((term) => text.includes(term)));
        if (match) return match;
        return { chapter: getImportMetadata(sourceUrl, sourceChapter).chapter, tags: ['Data Structure', 'Programming'] };
    }

    if (subjectName.includes('algorithm')) {
        const rules = [
            { chapter: 'Minimum Spanning Tree', terms: ['minimum spanning', 'kruskal', 'prim'] },
            { chapter: 'Shortest Path', terms: ['shortest path', 'dijkstra', 'bellman ford', 'floyd warshall'] },
            { chapter: 'Graph Traversal', terms: ['graph traversal', 'breadth first', 'depth first', 'bfs', 'dfs'] },
            { chapter: 'Dynamic Programming', terms: ['dynamic programming', 'memoization', 'optimal substructure'] },
            { chapter: 'Divide and Conquer', terms: ['divide and conquer', 'merge sort', 'quick sort', 'binary search'] },
            { chapter: 'Greedy Technique', terms: ['greedy', 'activity selection', 'huffman'] },
            { chapter: 'Sorting', terms: ['sorting', 'insertion sort', 'selection sort', 'bubble sort', 'heap sort'] },
            { chapter: 'Recurrence Relation', terms: ['recurrence', 'master theorem'] },
            { chapter: 'Asymptotic Notation', terms: ['big o', 'big theta', 'big omega', 'asymptotic'] },
        ];
        const match = rules.find((rule) => rule.terms.some((term) => text.includes(term)));
        if (match) return { ...match, tags: ['Algorithms', 'Programming'] };
    }

    return getImportMetadata(sourceUrl, sourceChapter);
};

const extractQuestions = async (page, sourceUrl, subject, selectedChapter) => {
    const candidates = page.locator('.question');
    const questions = [];
    const skipped = [];
    for (let index = 0; index < Math.min(await candidates.count(), 100); index += 1) {
        const container = candidates.nth(index);
        const questionText = cleanText(await container.locator('.question_text').innerText().catch(() => ''));
        const heading = cleanText(await container.locator('.question_heading_table').innerText().catch(() => ''));
        const isNat = /\bNAT\b/i.test(heading);
        const rows = container.locator('.answer_table tr');
        const optionValues = [];
        let correctAnswer = null;

        for (let optionIndex = 0; optionIndex < await rows.count(); optionIndex += 1) {
            const row = rows.nth(optionIndex);
            const id = cleanText(await row.locator('.option_index_number').innerText().catch(() => '')) || String.fromCharCode(65 + optionIndex);
            const text = cleanText(await row.locator('.option_data').innerText().catch(() => ''));
            if (!text) continue;
            optionValues.push({ id, text });
            if (await row.getAttribute('data-value') === '1' || await row.locator('.mtq_correct_marker').count()) {
                correctAnswer = id;
            }
        }

        if (!questionText) {
            skipped.push({ index: index + 1, reason: 'Question text was not found' });
            continue;
        }

        const marksMatch = heading.match(/\|\s*(\d+)\s*Marks?/i);
        const numberMatch = heading.match(/Question\s+(\d+)/i);
        const metadata = cleanText(await container.locator('.year_sub_chap_link').innerText().catch(() => ''));
        const yearMatch = metadata.match(/\b(20\d{2})\b/);
        const chapterMatch = metadata.match(/(?:SET[-\s]?\d+\s+)(.+)$/i) || metadata.match(/(?:20\d{2}\s+)(.+)$/i);
        const importMetadata = classifyQuestion(subject, questionText, chapterMatch?.[1]?.trim(), sourceUrl, selectedChapter);
        const explanation = extractSourceExplanation(
            await container.locator('.mtq_explanation-text').innerText().catch(() => '')
        );
        if (isNat && correctAnswer === null) {
            const natText = cleanText(await container.innerText().catch(() => ''));
            correctAnswer = extractNatAnswer(`${natText} ${explanation}`);
            if (correctAnswer === null) correctAnswer = inferNatAnswer(questionText);
        }
        const imageUrls = await container.locator('.question_text img').evaluateAll((images) => images
            .map((image) => image.dataset.src || image.src)
            .filter((src) => src && !src.startsWith('data:'))
            .map((src) => new URL(src, window.location.href).href));

        questions.push({
            questionType: isNat ? 'NAT' : 'MCQ',
            marks: Number(marksMatch?.[1] || 1),
            questionNumber: numberMatch ? Number(numberMatch[1]) : undefined,
            questionText,
            chapter: importMetadata.chapter,
            yearTag: yearMatch?.[1] || '',
            options: isNat ? [] : optionValues,
            correctAnswer,
            explanation,
            imageUrls,
            mockTestWeight: 1,
            isCoreConcept: false,
            difficulty: determineDifficulty(questionText, optionValues, explanation),
            tags: importMetadata.tags,
            needsReview: !correctAnswer || (!isNat && optionValues.length < 2),
        });
    }

    return { questions, skipped };
};

export const importPracticePaper = async (req, res) => {
    const { url, subject, chapter } = req.body;
    if (!url || !/^https:\/\/practicepaper\.in\//i.test(url)) {
        return res.status(400).json({ success: false, message: 'Only https://practicepaper.in/ URLs are supported.' });
    }

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(1500);

        const { questions, skipped } = await extractQuestions(page, page.url(), subject, chapter);
        return res.json({
            success: true,
            source: page.url(),
            count: questions.length,
            questions,
            skipped,
            warning: skipped.length || questions.some((question) => question.needsReview)
                ? `${skipped.length ? `${skipped.length} question block(s) could not be read. ` : ''}Review incomplete questions before uploading.`
                : null,
        });
    } catch (error) {
        console.error('PracticePaper import error:', error);
        return res.status(502).json({
            success: false,
            message: 'The page could not be imported. It may require a visible browser, have anti-bot protection, or have changed its layout.',
        });
    } finally {
        await browser?.close();
    }
};
