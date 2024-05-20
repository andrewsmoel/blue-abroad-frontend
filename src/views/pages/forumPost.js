import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'


class Comment {
    async addComment(postId, comment) {
        const commentData = {
            postId: postId,
            comment: comment,
        };

        const response = await fetch(`https://asmoel-blueabroad-backend.onrender.com/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            },
            body: JSON.stringify(commentData),
        });
        const data = await response.json();
        return data;
    }

    async getComments(postId) {
        const response = await fetch(`https://asmoel-blueabroad-backend.onrender.com/comments/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            },
        });
        const comments = await response.json();
        return comments;
    }
}


class forumPostView {
    async init() {
        document.title = 'Forum Post';
        const postId = localStorage.getItem('postId');
        this.postData = await this.getPostData(postId);
        this.render();    
        Utils.pageIntroAnim();
        this.renderPosts([this.postData]);
        await this.renderComments(postId); // Fetch and render comments
    }

    async getPostData(postId) {
        const response = await fetch(`https://asmoel-blueabroad-backend.onrender.com/post/${postId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('accessToken')
            }
        });
        const postData = await response.json();
        const authorResponse = await fetch(`https://asmoel-blueabroad-backend.onrender.com/user/${postData.author}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('accessToken')
            }
        });
        const authorData = await authorResponse.json();

        postData.authorName = `${authorData.firstName} ${authorData.lastName}`;
        postData.authorAvatar = `${App.apiBase}/images/${authorData.avatar}`;

        return postData;
    }

    async renderComments(postId) {
        const commentInstance = new Comment();
        const comments = await commentInstance.getComments(postId);
        const innerContainer = document.querySelector('.inner-cont');

        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.style.marginTop = '10px';
            commentDiv.style.paddingLeft = '20px';
            commentDiv.style.fontSize = '14px';
            commentDiv.style.color = '#F0F0F0';

            commentDiv.textContent = comment.comment;
            innerContainer.appendChild(commentDiv);
        });
    }

    renderPosts(posts) {
        const innerContainer = document.querySelector('.inner-cont');
        if (innerContainer) {
            posts.forEach((post) => {
                const postDiv = document.createElement('div');
                postDiv.style.display = 'flex';
                postDiv.style.justifyContent = 'space-between';
                postDiv.style.alignItems = 'center';
                postDiv.style.marginTop = '20px';

                if (window.innerWidth <= 390) {
                    postDiv.style.paddingLeft = '0';
                    postDiv.style.fontSize = '12px';
                } else {
                    postDiv.style.paddingLeft = '20px';
                    postDiv.style.fontSize = '16px';
                }

                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'avatar';

                const slAvatar = document.createElement('sl-avatar');
                slAvatar.style = '--size: 50px; padding-top: 1.5em; margin-bottom: 1em;';

                if (post.author) {
                    const token = localStorage.getItem('accessToken');
                    
                    fetch(`${App.apiBase}/user/${post.author}`, {
                        headers: {
                            'Authorization': "Bearer " + token
                        }
                    })
                    .then(response => response.json())
                    .then(author => {
                        if (author && author.avatar) {
                            const avatarUrl = `${App.apiBase}/images/${author.avatar}`;
                            slAvatar.setAttribute('image', avatarUrl);
                        }

                        if (author && author.firstName && author.lastName) {
                            authorDiv.textContent = `${author.firstName} ${author.lastName}`;
                        }
                    })
                    .catch(err => console.error(err));
                }

                avatarDiv.appendChild(slAvatar);
                postDiv.appendChild(avatarDiv);

                const authorDiv = document.createElement('div');
                authorDiv.textContent = post.authorName;
                authorDiv.style.display = 'flex';
                authorDiv.style.justifyContent = 'left';

                const postBody = document.createElement('div');
                postBody.textContent = post.bodyContent;
                authorDiv.style.display = 'flex';
                authorDiv.style.justifyContent = 'left';

                postDiv.appendChild(authorDiv);
                postDiv.appendChild(postBody);

                const replyLink = document.createElement('a');
                replyLink.href = '#';
                replyLink.textContent = 'Reply';
                replyLink.style.marginRight = '20px'; 
                replyLink.addEventListener('click', (event) => {
                    event.preventDefault();

                    if (!postDiv.querySelector('sl-dialog')) {
                        const slDialog = document.createElement('sl-dialog');
                        slDialog.setAttribute('label', 'Reply');
                        slDialog.classList.add('dialog-focus');
                        slDialog.style.color = '#222633';

                        const slInput = document.createElement('sl-input');
                        slInput.setAttribute('autofocus', '');
                        slInput.setAttribute('placeholder', 'Insert reply here');
                        slDialog.appendChild(slInput);

                        const cancelButton = document.createElement('sl-button');
                        cancelButton.setAttribute('slot', 'footer');
                        cancelButton.setAttribute('variant', 'primary');
                        cancelButton.textContent = 'Cancel';
                        slDialog.appendChild(cancelButton);

                        cancelButton.addEventListener('click', () => {
                            slDialog.hide();
                            slDialog.remove();
                        });

                        const commentButton = document.createElement('sl-button');
                        commentButton.setAttribute('slot', 'footer');
                        commentButton.setAttribute('variant', 'primary');
                        commentButton.textContent = 'Comment';
                        slDialog.appendChild(commentButton);
                        commentButton.style.fill = '#222633';

                        const commentInstance = new Comment();

                        commentButton.addEventListener('click', async () => {
                            const commentData = slInput.value;
                            try {
                                await commentInstance.addComment(post._id, commentData);
                                await this.renderComments(post._id); // Re-fetch and render comments
                                slDialog.hide();
                            } catch (error) {
                                console.error(error);
                            }
                        });

                        postDiv.appendChild(slDialog);

                        cancelButton.addEventListener('click', () => slDialog.hide());

                        slDialog.show();
                    }
                });

                postDiv.appendChild(replyLink);
                innerContainer.appendChild(postDiv);
            });
        }
    }

    render() {
        const template = html`
        <style>
        h1 {
            margin-left: 20%;
        }

        .forums-container {
            background-color: #EDEBEB;
            margin-left: 20%;
            margin-right: 20%;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            min-height: 80vh;
        }

        .inner-cont {
            background-color: #222633;
            margin-top: 1em;
            display: flex;
            flex-direction: column;
            gap: 30px;
            height: 90%;
            border-radius: 15px;
            margin-left: 20px;
            margin-right: 20px;
            margin-bottom: 20px;
            flex-grow: 1;
        }

        .inner-cont div {
            color: #F0F0F0;
            padding-left: 20px;
        }

        @media screen and (max-width: 390px) {
            body {
                overflow-x: hidden;
            } 

            h1 {
                margin-left: 2%;
            }

            .page-content {
                justify-content: center;
                align-items: center;
                width: 100%;
                overflow-x: hidden;
            }

            .forums-container {
                margin-left: 2%;
                margin-right: 2%;
                width: 350px;
            }
        }
        </style>

        <va-app-header user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
            <div class="page-content">                
            <h1>${this.postData.title}</h1>
            <div class="forums-container">
                <div class="inner-cont"></div>
            </div>
            </div>
        `;
        render(template, App.rootEl);
    }
}

export default new forumPostView();
