const commentForm = document.querySelector('.js-book__comment-form');
if (commentForm) {
    const comments = document.querySelector('.js-book__comment');
    const roomName = location.pathname.split('/').pop();
    const socket = io.connect('/', { query: `roomName=${roomName}` });
    const handleSubmit = e => {
        e.preventDefault();
        if (!e.target.comment.value.trim()) return false;
        socket.emit('product-comment', {
            text: e.target.comment.value
        });
        e.target.comment.value = '';
    };
    commentForm.addEventListener('submit', handleSubmit);
    socket.on('product-comment', (msg) => {
        const template = msg.comments.map(el => {
            return `
                <li class="collection-item">
                    <i class="material-icons">comment_bank</i>
                    <p>${el.text}</p>
                </li>
            `;
        });
        comments.innerHTML = '';
        comments.insertAdjacentHTML('afterbegin', template.join());
    });
}
