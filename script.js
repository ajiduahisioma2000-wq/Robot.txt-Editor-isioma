const editor = document.querySelector("#editor");
const highlightContent = document.querySelector("#highlight-content");

const testUrl = document.querySelector("#test-url");
const botSelect = document.querySelector("#bot-select");
const testButton = document.querySelector("#test-btn");
const resultBox = document.querySelector("#result-box");

function escapeHTML(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function resetResult() {

    resultBox.textContent = "RESULT";

    resultBox.style.backgroundColor = "";
    resultBox.style.color = "";
}


function highlightText() {

    const text = editor.value;

    const lines = text.split("\n");

    let html = "";

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i];

        if (line.startsWith("#")) {

            html += `<span class="comment">${escapeHTML(line)}</span>`;

        }

        else if (line.toLowerCase().startsWith("user-agent:")) {

            const parts = line.split(":");

            const directive = parts[0];
            const value = parts.slice(1).join(":");

            html +=
                `<span class="directive">${escapeHTML(directive)}:</span>` +
                `<span class="value">${escapeHTML(value)}</span>`;

        }

        else if (line.toLowerCase().startsWith("disallow:")) {

            const parts = line.split(":");

            const directive = parts[0];
            const value = parts.slice(1).join(":");

            html +=
                `<span class="disallow">${escapeHTML(directive)}:</span>` +
                `<span class="value">${escapeHTML(value)}</span>`;

        }

        else if (line.toLowerCase().startsWith("allow:")) {

            const parts = line.split(":");

            const directive = parts[0];
            const value = parts.slice(1).join(":");

            html +=
                `<span class="allow">${escapeHTML(directive)}:</span>` +
                `<span class="value">${escapeHTML(value)}</span>`;

        }

        else {

            html += escapeHTML(line);
        }

        html += "<br>";
    }

    highlightContent.innerHTML = html;

    resetResult();
}


editor.addEventListener("input", highlightText);


editor.addEventListener("scroll", function () {

    highlightContent.scrollTop = editor.scrollTop;
    highlightContent.scrollLeft = editor.scrollLeft;

});


highlightText();

botSelect.addEventListener("change", resetResult);
testUrl.addEventListener("input", resetResult);

testUrl.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        testButton.click();
    }
});


testButton.addEventListener("click", function () {

    const robotsText = editor.value;

    const testPath = testUrl.value.trim();

    const selectedBot = botSelect.value;

    const lines = robotsText.split("\n");

    let insideSection = false;

    let blocked = false;


    for (let i = 0; i < lines.length; i++) {

        const line = lines[i].trim();


        if (line.toLowerCase().startsWith("user-agent:")) {

            const agent = line.split(":").slice(1).join(":").trim();

            if (agent.toLowerCase() === selectedBot.toLowerCase()) {

                insideSection = true;

                continue;
            }

            insideSection = false;

            continue;
        }


        if (insideSection) {


            if (line === "") {
                break;
            }


            if (line.toLowerCase().startsWith("disallow:")) {

                const parts = line.split(":");

                const rulePath = parts.slice(1).join(":").trim();


                if (rulePath !== "") {

                    if (testPath.startsWith(rulePath)) {

                        blocked = true;

                        break;
                    }
                }
            }
        }
    }


    if (blocked) {

        resultBox.textContent = "BLOCKED";

        resultBox.style.backgroundColor = "red";
        resultBox.style.color = "white";

    }

    else {

        resultBox.textContent = "ALLOWED";

        resultBox.style.backgroundColor = "green";
        resultBox.style.color = "white";
    }

});