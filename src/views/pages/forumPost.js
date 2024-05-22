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

class forumPostView {
    async init() {
        document.title = 'Forum Post'
        // Get the post ID from the local storage
        const postId = localStorage.getItem('postId');
        // Fetch the post data from the server
        this.postData = await this.getPostData(postId);
        this.render()    
        Utils.pageIntroAnim()
        console.log(this.postData)
        this.renderPosts([this.postData]);
    }

    async getPostData(postId) {
        // Fetch the post data from the server
        const response = await fetch(`https://asmoel-blueabroad-backend.onrender.com/post/${postId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('accessToken')
            }
        });
        const postData = await response.json();
        console.log(postData.author);
        // Fetch the author's data from the server
        const authorResponse = await fetch(`https://asmoel-blueabroad-backend.onrender.com/user/${postData.author}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('accessToken')
            }
        });
        const authorData = await authorResponse.json();
        
    
        // Concatenate the author's first name and last name to form the full name
        postData.authorName = `${authorData.firstName} ${authorData.lastName}`;
    
        // Add the author's avatar to the post data
        postData.authorAvatar = `${App.apiBase}/images/${authorData.avatar}`;
    
        return postData;
    };




    renderPosts(posts) {
        const innerContainer = document.querySelector('.inner-cont');
        if (innerContainer) {
            posts.forEach((post) => {
                const postDiv = document.createElement('div');
                postDiv.style.display = 'flex';
                postDiv.style.justifyContent = 'space-between';
                postDiv.style.alignItems = 'center';
                postDiv.style.marginTop = '20px';
                
                // Adjust the margin-left based on screen width
                if (window.innerWidth <= 390) {
                    postDiv.style.paddingLeft = '0'; // adjust size as needed
                    postDiv.style.fontSize = '12px';
                } else {
                    postDiv.style.paddingLeft = '20px'; // reset to default
                    postDiv.style.fontSize = '16px';
                }
            
                // Create the avatar div
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'avatar';

                // Create the sl-avatar element
                const slAvatar = document.createElement('sl-avatar');
                slAvatar.style = '--size: 50px; padding-top: 1.5em; margin-bottom: 1em;';

               
                // If the current user has an avatar, set the image property of the sl-avatar element
                if (post.author) {
                    const token = localStorage.getItem('accessToken'); // Replace 'token' with the key you use to store the token
                    
                    fetch(`${App.apiBase}/user/${post.author}`, {
                        headers: {
                            'Authorization': "Bearer " + token
                        }
                    })
                    .then(response => response.json())
                    .then(author => {
                        if (author && author.avatar) {
                            const avatarUrl = `${App.apiBase}/images/${author.avatar}`;
                             // Log the avatar URL
                            slAvatar.setAttribute('image', avatarUrl);
                        }
                
                        // Set the text content of the authorDiv to the author's name
                        if (author && author.firstName && author.lastName) {
                            authorDiv.textContent = `${author.firstName} ${author.lastName}`;
                        }
                    })
                    .catch(err => console.error(err)); // Handle any errors
                }

                // Append the sl-avatar element to the avatar div
                avatarDiv.appendChild(slAvatar);

                // Append the avatar div to the postDiv
                postDiv.appendChild(avatarDiv);

                
                // Create a new div for the author name
                const authorDiv = document.createElement('div');
                // Set the text content of the authorDiv to the author's name
                authorDiv.textContent = post.authorName;
                authorDiv.style.display = 'flex';
                authorDiv.style.justifyContent = 'left';
                
                

                const postBody = document.createElement('div');
                postBody.textContent = post.bodyContent;
                authorDiv.style.display = 'flex';
                authorDiv.style.justifyContent = 'left';
                
                
                postDiv.appendChild(authorDiv);
                postDiv.appendChild(postBody);

                // Create the reply anchor tag
                const replyLink = document.createElement('a');
                replyLink.href = '#';
                replyLink.textContent = 'Reply';
                replyLink.style.marginRight = '20px'; 
                replyLink.addEventListener('click', (event) => {
                    event.preventDefault();

                    // Check if the sl-dialog element already exists
                    if (!postDiv.querySelector('sl-dialog')) {
                        // Create the sl-dialog element
                        const slDialog = document.createElement('sl-dialog');
                        slDialog.setAttribute('label', 'Reply');
                        slDialog.classList.add('dialog-focus');
                        slDialog.style.color = '#222633';

                        // Create the sl-input element
                        const slInput = document.createElement('sl-input');
                        slInput.setAttribute('autofocus', '');
                        slInput.setAttribute('placeholder', 'Insert reply here');
                        slDialog.appendChild(slInput);

                        // Create the cancel button in the dialog box
                        const cancelButton = document.createElement('sl-button');
                        cancelButton.setAttribute('slot', 'footer');
                        cancelButton.setAttribute('variant', 'primary');
                        cancelButton.textContent = 'Cancel';
                        slDialog.appendChild(cancelButton);

                        // Add event listeners to the sl-button elements
                        cancelButton.addEventListener('click', () => {
                            slDialog.hide();
                            slDialog.remove(); // Add this line
                        });

                        const commentButton = document.createElement('sl-button');
                        commentButton.setAttribute('slot', 'footer');
                        commentButton.setAttribute('variant', 'primary');
                        commentButton.textContent = 'Comment';
                        slDialog.appendChild(commentButton);
                        commentButton.style.fill = '#222633';
                        
                        // Create an instance of the Comment class
                        const commentInstance = new Comment();

                        // Event handler for the comment button
                        commentButton.addEventListener('click', async () => {
                            const postId = postDiv.getAttribute('postId', post._id); // Replace with the actual method to get the post ID
                            const commentData = {
                                author: localStorage.getItem('authorId'), // Replace with the actual method to get the author ID
                                comment: slInput.value, // Get the comment from the sl-input element
                                postId: postId,
                            };
                        
                            try {
                                const data = await commentInstance.addComment(postId, commentData);
                                console.log(data);
                        
                                // Close the dialog box
                                slDialog.hide();
                            } catch (error) {
                                console.error(error);
                            }
                        });

                        // Append the sl-dialog element to the post div
                        postDiv.appendChild(slDialog);

                        // Add event listeners to the sl-button elements
                        cancelButton.addEventListener('click', () => slDialog.hide());

                        // Show the dialog
                        slDialog.show();
                    }
                });

                // Append the reply anchor tag to the post div
                postDiv.appendChild(replyLink);

                // Append the postDiv to the innerContainer
                innerContainer.appendChild(postDiv);
            });
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