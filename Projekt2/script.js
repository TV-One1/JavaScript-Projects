const newPostBtn = document.getElementById('newPostBtn');
const postContainer = document.getElementById('postContainer');
const postForm = document.getElementById('postForm');
const savePostBtn = document.getElementById('savePostBtn');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const postTitle = document.getElementById('postTitle');
const postContent = document.getElementById('postContent');

// Funktion zum Laden der Beiträge aus localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => {
        displayPost(post.title, post.content);
    });
}

// Funktion zum Anzeigen eines Beitrags
function displayPost(title, content) {
    const post = document.createElement('div');
    post.classList.add('post');
    post.innerHTML = `<h3>${title}</h3><p>${content}</p>
                      <button class="editBtn">Bearbeiten</button>
                      <button class="deleteBtn">Löschen</button>
                      <div class="commentSection">
                          <input type="text" class="commentInput" placeholder="Kommentar hinzufügen">
                          <button class="addCommentBtn">Kommentar hinzufügen</button>
                      </div>
                      <div class="comments"></div>`;
    postContainer.prepend(post);

    // Event Listener für Bearbeiten
    post.querySelector('.editBtn').addEventListener('click', () => {
        postTitle.value = title;
        postContent.value = content;
        postForm.classList.remove('hidden');
        postForm.dataset.editing = title; // Speichere den aktuellen Titel für die Bearbeitung
    });

    // Event Listener für Löschen
    post.querySelector('.deleteBtn').addEventListener('click', () => {
        postContainer.removeChild(post);
        removePostFromStorage(title); // Entferne den Beitrag aus localStorage
    });

    // Event Listener für Kommentare
    const addCommentBtn = post.querySelector('.addCommentBtn');
    addCommentBtn.addEventListener('click', () => {
        const commentInput = post.querySelector('.commentInput');
        const commentText = commentInput.value;
        if (commentText) {
            const comment = document.createElement('div');
            comment.classList.add('comment');
            comment.textContent = commentText;
            post.querySelector('.comments').appendChild(comment);
            commentInput.value = ''; // Leere das Eingabefeld
        }
    });
}

// Funktion zum Speichern eines Beitrags
function savePost() {
    const title = postTitle.value;
    const content = postContent.value;

    if (title && content) {
        if (postForm.dataset.editing) {
            // Wenn wir einen bestehenden Beitrag bearbeiten
            const oldTitle = postForm.dataset.editing;
            removePostFromStorage(oldTitle); // Entferne den alten Beitrag
        }
        displayPost(title, content);
        savePostToStorage(title, content);
        postForm.classList.add('hidden');
        postTitle.value = '';
        postContent.value = '';
        delete postForm.dataset.editing; // Lösche die Bearbeitungsdaten
    } else {
        alert('Bitte Titel und Inhalt ausfüllen.');
    }
}

// Funktion zum Speichern in localStorage
function savePostToStorage(title, content) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push({ title, content });
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Funktion zum Entfernen eines Beitrags aus localStorage
function removePostFromStorage(title) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = posts.filter(post => post.title !== title);
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Event Listener
newPostBtn.addEventListener('click', () => {
    postForm.classList.remove('hidden');
    delete postForm.dataset.editing; // Lösche die Bearbeitungsdaten
});

cancelPostBtn.addEventListener('click', () => {
    postForm.classList.add('hidden');
    postTitle.value = '';
    postContent.value = '';
});

// Event Listener für das Speichern des Beitrags
savePostBtn.addEventListener('click', savePost);

// Lade die Beiträge beim Start
loadPosts();
