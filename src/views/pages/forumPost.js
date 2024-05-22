import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'


class Comment {
    async addComment(postId, comment) {
        // Create the comment data
        const commentData = {
            postId: postId,
            comment: comment,
            // Add any other data you want to include with the comment
        };

        // Fetch the post data from the server
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
}

class ForumPostView {
    async init() {
        document.title = 'Forum Post';
        // Get the post ID from the local storage
        const postId = localStorage.getItem('postId');
        try {
            // Fetch the post data from the server
            this.postData = await this.getPostData(postId);
            this.render();
            Utils.pageIntroAnim();
            console.log(this.postData);
            this.renderPosts([this.postData]);
        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    }

    async getPostData(postId) {
        try {
            // Fetch the post data from the server
            const response = await fetch(`https://asmoel-blueabroad-backend.onrender.com/post/${postId}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('accessToken')
                }
            });

            if (!response.ok) throw new Error('Failed to fetch post data');

            const postData = await response.json();
            console.log(postData.author);

            // Fetch the author's data from the server
            const authorData = await this.getAuthorData(postData.author);

            // Concatenate the author's first name and last name to form the full name
            postData.authorName = `${authorData.firstName} ${authorData.lastName}`;

            // Add the author's avatar to the post data
            postData.authorAvatar = `${App.apiBase}/images/${authorData.avatar}`;

            return postData;
        } catch (error) {
            console.error('Error fetching post data:', error);
            throw error;
        }
    }

    async getAuthorData(authorId) {
        try {
            const response = await fetch(`https://asmoel-blueabroad-backend.onrender.com/user/${authorId}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('accessToken')
                }
            });

            if (!response.ok) throw new Error('Failed to fetch author data');

            return await response.json();
        } catch (error) {
            console.error('Error fetching author data:', error);
            throw error;
        }
    }

    renderPosts(posts) {
        const innerContainer = document.querySelector('.inner-cont');
        if (!innerContainer) return;

        posts.forEach(post => {
            const postDiv = this.createPostElement(post);
            innerContainer.appendChild(postDiv);
        });
    }

    createPostElement(post) {
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

        const avatarDiv = this.createAvatarElement(post.authorAvatar);
        const authorDiv = this.createAuthorElement(post.authorName);
        const postBody = this.createPostBodyElement(post.bodyContent);
        const replyLink = this.createReplyLink(post);
        const deleteLink = this.createDeleteLink(post);

        postDiv.appendChild(avatarDiv);
        postDiv.appendChild(authorDiv);
        postDiv.appendChild(postBody);
        postDiv.appendChild(replyLink);

        // Conditionally append the delete link if the current user is the author or has access level 2
        if (post.author === Auth.currentUser._id || Auth.currentUser.accessLevel === 2) {
            postDiv.appendChild(deleteLink);
        }

        return postDiv;
    }

    createAvatarElement(avatarUrl) {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';

        const slAvatar = document.createElement('sl-avatar');
        slAvatar.style = '--size: 50px; padding-top: 1.5em; margin-bottom: 1em;';
        slAvatar.setAttribute('image', avatarUrl);

        avatarDiv.appendChild(slAvatar);
        return avatarDiv;
    }

    createAuthorElement(authorName) {
        const authorDiv = document.createElement('div');
        authorDiv.textContent = authorName;
        authorDiv.style.display = 'flex';
        authorDiv.style.justifyContent = 'left';
        return authorDiv;
    }

    createPostBodyElement(bodyContent) {
        const postBody = document.createElement('div');
        postBody.textContent = bodyContent;
        return postBody;
    }

    createReplyLink(post) {
        const replyLink = document.createElement('a');
        replyLink.href = '#';
        replyLink.textContent = 'Reply';
        replyLink.style.marginRight = '20px';
        replyLink.addEventListener('click', (event) => this.handleReplyClick(event, post));

        return replyLink;
    }

    createDeleteLink(post) {
        const deleteLink = document.createElement('a');
        deleteLink.href = '#';
        deleteLink.textContent = 'Delete';
        deleteLink.style.marginRight = '20px';

        deleteLink.addEventListener('click', (event) => this.handleDeleteClick(event, post._id));

        return deleteLink;
    }

    handleReplyClick(event, post) {
        event.preventDefault();

        const postDiv = event.currentTarget.closest('div');
        if (!postDiv.querySelector('sl-dialog')) {
            const slDialog = this.createReplyDialog(post._id);
            postDiv.appendChild(slDialog);
            slDialog.show();
        }
    }

    handleDeleteClick(event, postId) {
        event.preventDefault();

        // Confirm the deletion
        if (confirm('Are you sure you want to delete this post?')) {
            this.deletePost(postId);
        }
    }

    async deletePost(postId) {
        try {
            const response = await fetch(`https://asmoel-blueabroad-backend.onrender.com/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('accessToken')
                }
            });

            if (!response.ok) throw new Error('Failed to delete post');

            // Remove the post from the DOM
            document.querySelector(`[data-post-id="${postId}"]`).remove();
            console.log('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }

    createReplyDialog(postId) {
        const slDialog = document.createElement('sl-dialog');
        slDialog.setAttribute('label', 'Reply');
        slDialog.classList.add('dialog-focus');
        slDialog.style.color = '#222633';

        const slInput = document.createElement('sl-input');
        slInput.setAttribute('autofocus', '');
        slInput.setAttribute('placeholder', 'Insert reply here');
        slDialog.appendChild(slInput);

        const cancelButton = this.createCancelButton(slDialog);
        const commentButton = this.createCommentButton(slDialog, slInput, postId);

        slDialog.appendChild(cancelButton);
        slDialog.appendChild(commentButton);

        return slDialog;
    }

    createCancelButton(slDialog) {
        const cancelButton = document.createElement('sl-button');
        cancelButton.setAttribute('slot', 'footer');
        cancelButton.setAttribute('variant', 'primary');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            slDialog.hide();
            slDialog.remove();
        });
        return cancelButton;
    }

    createCommentButton(slDialog, slInput, postId) {
        const commentButton = document.createElement('sl-button');
        commentButton.setAttribute('slot', 'footer');
        commentButton.setAttribute('variant', 'primary');
        commentButton.textContent = 'Comment';
        commentButton.style.fill = '#222633';

        const commentInstance = new Comment();
        commentButton.addEventListener('click', async () => {
            const commentData = {
                author: localStorage.getItem('authorId'),
                comment: slInput.value,
                postId: postId,
            };

            try {
                const data = await commentInstance.addComment(postId, commentData);
                console.log(data);
                slDialog.hide();
            } catch (error) {
                console.error(error);
            }
        });
        return commentButton;
    }
}






            
            
            
        

    render(){
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
                <div class="inner-cont">
                    
                
                </div>
            </div>
            </div>
        `
        render(template, App.rootEl)
    }
}
export default new forumPostView()