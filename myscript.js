document.addEventListener('DOMContentLoaded', function () {
  // --- EXISTING SCRIPT FOR SHARE BUTTONS AND NOTIFICATIONS ---

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

  document.getElementById('copy-link').addEventListener('click', copyToClipboard);
  document.getElementById('share-whatsapp').addEventListener('click', shareOnWhatsApp);
  document.getElementById('share-telegram').addEventListener('click', shareOnTelegram);


  // --- NEW SCRIPT FOR SEARCH FUNCTIONALITY ---

  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const pyqContainer = document.getElementById('btech-pyqs');
  let pyqData = [];

  // 1. Function to scan the document and build the PYQ data array
  function buildPyqData() {
    const semesterDetails = pyqContainer.querySelectorAll('details > details');
    semesterDetails.forEach(semesterDetail => {
      const semester = semesterDetail.querySelector('summary').textContent.trim();
      const subjectDivs = semesterDetail.querySelectorAll('.subject');
      subjectDivs.forEach(subjectDiv => {
        const subjects = subjectDiv.querySelectorAll('h2');
        subjects.forEach(subjectHeading => {
          const subject = subjectHeading.textContent.trim();
          let nextElement = subjectHeading.nextElementSibling;
          while (nextElement && nextElement.tagName === 'UL') {
            const links = nextElement.querySelectorAll('a');
            links.forEach(link => {
              pyqData.push({
                semester: semester,
                subject: subject,
                text: link.textContent.trim(),
                url: link.href
              });
            });
            nextElement = nextElement.nextElementSibling;
          }
        });
      });
    });
  }

  // 2. Function to display search results
  function displayResults(results) {
    if (!results.length) {
      searchResults.style.display = 'none';
      return;
    }

    const html = results.map(pyq => {
      return `<a href="${pyq.url}" target="_blank">
                        <div>${pyq.text}</div>
                        <div class="subject-name">${pyq.subject} - ${pyq.semester}</div>
                    </a>`;
    }).join('');

    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
  }

  // 3. Event Listener for the search input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
      searchResults.style.display = 'none';
      return;
    }

    const filteredResults = pyqData.filter(pyq =>
      pyq.subject.toLowerCase().includes(query) ||
      pyq.semester.toLowerCase().includes(query) ||
      pyq.text.toLowerCase().includes(query)
    );

    displayResults(filteredResults);
  });

 // Hide results if user clicks outside of the search input OR the results box
document.addEventListener('click', function (event) {
  if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
    searchResults.style.display = 'none';
  }
});
  // Build the data once the page loads
  buildPyqData();
});