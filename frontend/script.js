
async function analyzeCode() {
    const code = document.getElementById("codeInput").value.trim();
    const results = document.getElementById("results");
    const status = document.getElementById("reviewStatus");
    const button = document.getElementById("analyzeBtn");

    if (!code) {
        results.textContent = "Please enter some Python code first.";
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
        results.textContent = error.message;
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
        results.textContent = "Please enter some Python code first.";
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
                <h3>🔍 Static Analysis Results</h3>
                <p>Verified findings from CodeSentinel's rule-based analyzer.</p>
            </div>

            ${displayStaticFindings(data.static_analysis)}

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
        results.textContent = error.message;
        status.textContent = "ERROR";

    } finally {
        button.disabled = false;
        button.textContent = "✨ AI Review";
    }
}


function displayResults(data) {
    const results = document.getElementById("results");

    // Display syntax errors with a detailed diagnostic report.
    if (!data.success) {
        const issue = data.issues?.[0];

        results.innerHTML = `
            <div class="summary">
                <h3>Analysis Interrupted</h3>
                <p>
                    CodeSentinel found a syntax error before
                    completing the analysis.
                </p>
            </div>

            <div class="issue syntax-error">
                <div class="issue-top">
                    <span class="severity high">SYNTAX ERROR</span>
                    <span class="line">
                        Line ${Number(issue?.line) || "—"}
                    </span>
                </div>

                <div class="syntax-icon">!</div>

                <h3>Syntax Error Detected</h3>

                <p class="error-message">
                    ${escapeHTML(issue?.message || "Invalid Python syntax.")}
                </p>

                <div class="suggestion">
                    <strong>How to fix it</strong>
                    <p>
                        Check the indicated line for missing colons,
                        brackets, quotation marks, or incorrect indentation.
                        Correct the syntax and run the analysis again.
                    </p>
                </div>

                <div class="error-footer">
                    <span>CODE SENTINEL</span>
                    <span>ANALYSIS INCOMPLETE</span>
                </div>
            </div>
        `;

        return;
    }

    // Display a clean result when no issues are detected.
    if (data.total_issues === 0) {
        results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✓</div>
                <h3>No issues found!</h3>
                <p>
                    Your code passed the current static checks.
                    This does not guarantee that all possible
                    bugs or security vulnerabilities are absent.
                </p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="summary">
            <h3>${Number(data.total_issues)} issue(s) found</h3>
            <p>Review the findings below.</p>
        </div>
    `;

    data.issues.forEach(issue => {
        html += `
            <div class="issue">
                <div class="issue-top">
                    <span class="severity ${escapeHTML(String(issue.severity).toLowerCase())}">
                        ${escapeHTML(issue.severity)}
                    </span>

                    <span class="line">
                        Line ${Number(issue.line) || "—"}
                    </span>
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


// Display findings directly from the static analyzer.
function displayStaticFindings(analysis) {
    if (!analysis || !analysis.success) {
        return `
            <div class="empty-state">
                <p>Static analysis could not be completed.</p>
            </div>
        `;
    }

    if (analysis.total_issues === 0) {
        return `
            <div class="empty-state">
                <h3>✓ No issues detected</h3>
                <p>
                    The code passed the current static checks.
                    This does not guarantee that the code is free
                    from all bugs or security vulnerabilities.
                </p>
            </div>
        `;
    }

    let html = `<div class="static-findings">`;

    analysis.issues.forEach(issue => {
        html += `
            <div class="issue">
                <div class="issue-top">
                    <span class="severity ${escapeHTML(String(issue.severity).toLowerCase())}">
                        ${escapeHTML(issue.severity)}
                    </span>

                    <span class="line">
                        Line ${Number(issue.line) || "—"}
                    </span>
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

    html += `</div>`;

    return html;
}


// Safely format AI-generated Markdown.
function formatAIResponse(text) {
    let escaped = escapeHTML(text);

    // Remove standalone backslashes and escaped line separators.
    escaped = escaped.replace(/^\s*\\+\s*$/gm, "");
    escaped = escaped.replace(/\\[ \t]*\r?\n/g, "\n");
    escaped = escaped.replace(/\\n/g, "\n");

    // Normalize excessive blank lines.
    escaped = escaped.replace(/\n{3,}/g, "\n\n");

    // Format fenced code blocks first.
    escaped = escaped.replace(
        /```(?:python)?[ \t]*\r?\n?([\s\S]*?)```/gi,
        (_, code) => `<pre><code>${code.trim()}</code></pre>`
    );

    // Format headings.
    escaped = escaped.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    escaped = escaped.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    escaped = escaped.replace(/^# (.*)$/gm, "<h2>$1</h2>");

    // Format bold text and inline code.
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Format bullet points.
    escaped = escaped.replace(/^- (.*)$/gm, "<li>$1</li>");

    // Convert newlines into HTML line breaks,
    // without inserting breaks inside code blocks.
    const parts = escaped.split(/(<pre><code>[\s\S]*?<\/code><\/pre>)/g);

    return parts.map(part => {
        if (part.startsWith("<pre><code>")) {
            return part;
        }

        return part.replace(/\n/g, "<br>");
    }).join("");
}


// Escape HTML to prevent injected markup from being rendered.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


