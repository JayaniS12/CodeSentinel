
async function analyzeCode() {
    const code = document.getElementById("codeInput").value.trim();
    const results = document.getElementById("results");
    const status = document.getElementById("reviewStatus");
    const button = document.getElementById("analyzeBtn");

    if (!code) {
        results.innerHTML = "<p>Please enter some Python code first.</p>";
        return;
    }

    button.disabled = true;
    button.textContent = "Analyzing...";
    status.textContent = "ANALYZING";

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Analysis failed.");
        }

        displayResults(data);
        status.textContent = "REVIEW COMPLETE";

    } catch (error) {
        results.innerHTML = `<p>${escapeHTML(error.message)}</p>`;
        status.textContent = "ERROR";

    } finally {
        button.disabled = false;
        button.textContent = "Analyze Code →";
    }
}


async function aiReview() {
    const code = document.getElementById("codeInput").value.trim();
    const results = document.getElementById("results");
    const status = document.getElementById("reviewStatus");
    const button = document.getElementById("aiReviewBtn");

    if (!code) {
        results.innerHTML = "<p>Please enter some Python code first.</p>";
        return;
    }

    button.disabled = true;
    button.textContent = "✨ AI Reviewing...";
    status.textContent = "AI REVIEWING";

    results.innerHTML = `
        <div class="empty-state">
            <h3>Qwen is reviewing your code...</h3>
            <p>This may take a little while on your laptop.</p>
        </div>
    `;

    try {
        const response = await fetch("/ai-review", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "AI review failed.");
        }

        results.innerHTML = `
            <div class="summary">
                <h3>✨ AI Code Review</h3>
                <p>Powered by Qwen 2.5 1.5B</p>
            </div>

            <div class="ai-response">
                ${formatAIResponse(data.ai_review)}
            </div>
        `;

        status.textContent = "AI REVIEW COMPLETE";

    } catch (error) {
        results.innerHTML = `
            <div class="empty-state">
                <h3>AI Review Failed</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
        status.textContent = "ERROR";

    } finally {
        button.disabled = false;
        button.textContent = "✨ AI Review";
    }
}


function displayResults(data) {
    const results = document.getElementById("results");

    if (!data.success) {
        results.innerHTML = `
            <div class="issue">
                <h3>Syntax Error</h3>
                <p>${escapeHTML(data.issues?.[0]?.message || "Invalid Python syntax.")}</p>
            </div>
        `;
        return;
    }

    if (data.total_issues === 0) {
        results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✓</div>
                <h3>No issues found!</h3>
                <p>Your code passed the current static checks.</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="summary">
            <h3>${data.total_issues} issue(s) found</h3>
            <p>Review the findings below.</p>
        </div>
    `;

    data.issues.forEach(issue => {
        html += `
            <div class="issue">
                <div class="issue-top">
                    <span class="severity ${escapeHTML(issue.severity.toLowerCase())}">
                        ${escapeHTML(issue.severity)}
                    </span>
                    <span class="line">Line ${Number(issue.line) || "—"}</span>
                </div>
                <h3>${escapeHTML(issue.category)}</h3>
                <p>${escapeHTML(issue.message)}</p>
                <div class="suggestion">
                    <strong>Suggestion:</strong>
                    ${escapeHTML(issue.suggestion)}
                </div>
            </div>
        `;
    });

    results.innerHTML = html;
}


// Safely display AI-generated text with basic Markdown formatting.
function formatAIResponse(text) {
    const escaped = escapeHTML(text);

    return escaped
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^# (.*$)/gm, "<h2>$1</h2>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\n/g, "<br>");
}


function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

