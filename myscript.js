document.addEventListener('DOMContentLoaded', function() {
    // --- SHARE BUTTONS AND NOTIFICATIONS SCRIPT ---
    function copyToClipboard() {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => showNotification("Link copied to clipboard!"))
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
        if (!notification) return;
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    document.getElementById('copy-link')?.addEventListener('click', copyToClipboard);
    document.getElementById('share-whatsapp')?.addEventListener('click', shareOnWhatsApp);
    document.getElementById('share-telegram')?.addEventListener('click', shareOnTelegram);


    // --- UNIFIED MODAL PLAYER SCRIPT ---
    const mainContainer = document.querySelector('.container');
    // Video Modal
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    // GDrive Modal
    const gdriveModal = document.getElementById('gdriveModal');
    const gdrivePlayer = document.getElementById('gdrivePlayer');

    function openVideoModal(videoId) {
        if (!videoModal || !videoPlayer) return;
        videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        videoModal.classList.add('active');
    }

    function openGdriveModal(fileId) {
        if (!gdriveModal || !gdrivePlayer) return;
        gdrivePlayer.src = `https://drive.google.com/file/d/${fileId}/preview`;
        gdriveModal.classList.add('active');
    }
    
    function closeModal() {
        if(videoModal?.classList.contains('active')) {
            videoModal.classList.remove('active');
            videoPlayer.src = '';
        }
        if(gdriveModal?.classList.contains('active')) {
            gdriveModal.classList.remove('active');
            gdrivePlayer.src = '';
        }
    }

    if (mainContainer) {
        mainContainer.addEventListener('click', function(event) {
            const link = event.target.closest('a');
            if (link) {
                if (link.classList.contains('video-link')) {
                    event.preventDefault();
                    openVideoModal(link.dataset.videoId);
                } else if (link.classList.contains('gdrive-link')) {
                    event.preventDefault();
                    openGdriveModal(link.dataset.gdriveId);
                }
            }
        });
    }

    document.querySelectorAll('.close-button').forEach(button => button.addEventListener('click', closeModal));
    document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    }));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeModal();
    });


    // --- SEARCH FUNCTIONALITY SCRIPT ---
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let pyqData = [];

    function buildPyqData() {
        pyqData = []; // Clear previous data
        
        // B.Tech Section
        const btechSemesters = document.querySelectorAll('#btech-pyqs > details');
        btechSemesters.forEach(semesterDetail => {
            if (!semesterDetail.querySelector('summary') || !semesterDetail.querySelector('.subject')) return;
            const semester = semesterDetail.querySelector('summary').textContent.trim();
            const subjects = semesterDetail.querySelectorAll('.subject h2');

            subjects.forEach(subjectHeading => {
                const subject = subjectHeading.textContent.trim();
                let listElement = subjectHeading.nextElementSibling;
                if (listElement && listElement.tagName === 'UL') {
                    listElement.querySelectorAll('a').forEach(link => {
                        pyqData.push({
                            text: link.textContent.trim(),
                            isvideo: link.classList.contains('video-link'),
                            isgdrive: link.classList.contains('gdrive-link'),
                            id: link.dataset.videoId || link.dataset.gdriveId,
                            subject: subject,
                            semester: semester,
                            course: 'Btech'
                        });
                    });
                }
            });
        });

        // BCOM and BBA Sections
        function scanSimpleSection(containerId, courseName) {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.querySelectorAll('a').forEach(link => {
                pyqData.push({
                    text: link.textContent.trim(),
                    isvideo: false,
                    isgdrive: link.classList.contains('gdrive-link'),
                    id: link.dataset.gdriveId,
                    subject: "General PYQs",
                    semester: courseName,
                    course: courseName
                });
            });
        }
        scanSimpleSection('bcom-pyqs', 'BCOM');
        scanSimpleSection('bba-pyqs', 'BBA');
    }

    function displayResults(results) {
        if (!results || !searchResults) return;
        if (!results.length) {
            searchResults.style.display = 'none';
            return;
        }
        const html = results.map(pyq => {
            let linkClass = '';
            let dataAttr = '';
            if (pyq.isvideo) {
                linkClass = 'class="video-link"';
                dataAttr = `data-video-id="${pyq.id}"`;
            } else if (pyq.isgdrive) {
                linkClass = 'class="gdrive-link"';
                dataAttr = `data-gdrive-id="${pyq.id}"`;
            }
            return `<a href="#" ${linkClass} ${dataAttr}>
                        <div>${pyq.text}</div>
                        <div class="subject-name">${pyq.course} - ${pyq.subject} - ${pyq.semester}</div>
                    </a>`;
        }).join('');
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            if (!query) {
                if (searchResults) searchResults.style.display = 'none';
                return;
            }
            const filteredResults = pyqData.filter(pyq =>
                pyq.text.toLowerCase().includes(query) ||
                pyq.subject.toLowerCase().includes(query) ||
                pyq.semester.toLowerCase().includes(query) ||
                pyq.course.toLowerCase().includes(query)
            );
            displayResults(filteredResults);
        });
    }

    if (searchResults) {
        searchResults.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link) {
                event.preventDefault();
                if (link.classList.contains('video-link')) {
                    openVideoModal(link.dataset.videoId);
                } else if (link.classList.contains('gdrive-link')) {
                    openGdriveModal(link.dataset.gdriveId);
                }
            }
            searchResults.style.display = 'none';
            if(searchInput) searchInput.value = '';
        });
    }

    document.addEventListener('click', event => {
        if (searchInput && searchResults && !searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });

    buildPyqData();
});