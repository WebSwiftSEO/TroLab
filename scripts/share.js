function sharePage() {
    const shareData = {
        title: document.querySelector('meta[property="og:title"]').getAttribute('content'),
        text: document.querySelector('meta[property="og:description"]').getAttribute('content'),
        url: window.location.href
    };
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch(err => {
                console.log('Error sharing:', err);
                navigator.clipboard.writeText(shareData.url).then(() => alert('Link copied to clipboard!'));
            });
    } else {
        navigator.clipboard.writeText(shareData.url).then(() => alert('Link copied to clipboard!'));
    }
}