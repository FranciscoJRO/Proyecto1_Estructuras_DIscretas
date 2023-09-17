document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const content = document.getElementById("content");
    const searchButton = document.getElementById("search-button");

    searchButton.addEventListener("click", function () {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === "") {
            clearHighlights();
            return;
        }

        const result = highlightMatches(content, searchTerm);
        
        if (result) {
            result.scrollIntoView({ behavior: "smooth" });
        }
    });

    function clearHighlights() {
        const highlightedElements = content.querySelectorAll(".highlight");
        highlightedElements.forEach(element => {
            element.classList.remove("highlight");
        });
    }

    function highlightMatches(element, searchTerm) {
        const regex = new RegExp(searchTerm, "gi");
        const textNodes = getTextNodes(element);

        let firstMatchElement = null;

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            let match;
            while ((match = regex.exec(text)) !== null) {
                const span = document.createElement("span");
                span.className = "highlight";
                const matchedText = text.slice(match.index, match.index + searchTerm.length);
                span.textContent = matchedText;
                textNode.splitText(match.index);
                textNode.nextSibling.splitText(searchTerm.length);
                textNode.parentElement.replaceChild(span, textNode.nextSibling);
                regex.lastIndex -= searchTerm.length - 1;

                if (!firstMatchElement) {
                    firstMatchElement = span;
                }
            }
        });

        return firstMatchElement;
    }

    function getTextNodes(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }
        return textNodes;
    }
});




