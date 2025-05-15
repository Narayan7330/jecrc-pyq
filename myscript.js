function copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            showNotification("Link copied to clipboard!");
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showNotification("Failed to copy link.");
        });
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out these JECRC University PYQs! ");
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
}

function shareOnTelegram() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out these JECRC University PYQs! ");
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('copy-link').addEventListener('click', copyToClipboard);
    document.getElementById('share-whatsapp').addEventListener('click', shareOnWhatsApp);
    document.getElementById('share-telegram').addEventListener('click', shareOnTelegram);
});
