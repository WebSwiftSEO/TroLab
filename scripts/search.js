function searchContent() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!query) return;
    const content = document.body.innerText.toLowerCase();
    if (content.includes(query)) {
        const regex = new RegExp(query, 'gi');
        const main = document.querySelector('main');
        main.innerHTML = main.innerHTML.replace(regex, match => `<mark>${match}</mark>`);
        const firstMatch = document.querySelector('mark');
        if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert('No matches found for: ' + query);
    }
}