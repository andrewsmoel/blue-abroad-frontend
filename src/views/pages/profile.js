import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'

class ProfileView {
  init(){
    console.log('ProfileView.init')
    document.title = 'Profile'    
    this.render()    
    Utils.pageIntroAnim()
    this.postGetHandler()
  }



postGetHandler(){
  fetch('http://localhost:3000/post')
    .then(response => response.json())
    .then(posts => {
      console.log('posts:', posts); // Log the posts
      console.log('Auth.currentUser._id:', Auth.currentUser._id); // Log the current user's ID

      if (!posts.every(post => post.hasOwnProperty('author'))) {
        console.error('Some posts do not have an author property');
        return;
      }
      const postsTab = document.querySelector('.general-tab');

            if (postsTab) {
              // Filter the posts by the authorId of the current user
              const userPosts = posts.filter(post => {
                console.log('post.author:', post.author); // Log the author of each post
                return post.author === Auth.currentUser._id;
              });
              console.log('userPosts:', userPosts); // Log the user's posts


              userPosts.forEach((post, index) => {
                const postDiv = document.createElement('div');
                postDiv.style.display = 'flex';
                postDiv.style.alignItems = 'center';
                postDiv.style.backgroundColor = '#222633';
                postDiv.style.borderRadius = '15px';
                postDiv.style.width = '98%';
                postDiv.style.marginTop = '15px';
                postDiv.style.cursor = 'pointer';

                // Add a click event listener to the postDiv
                postDiv.addEventListener('click', () => {
                          
                  // Store the post data in the local storage
                  localStorage.setItem('postId', post._id);

                  // Redirect to the forumPost page
                  window.location.href = `http://localhost:1234/forumPost`;
              });
                

                

                // Create the avatar div
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'avatar';
                avatarDiv.style.marginLeft = '20px'

                // Create the sl-avatar element
                const slAvatar = document.createElement('sl-avatar');
                slAvatar.style = '--size: 50px; padding-top: 1.5em; margin-bottom: 1em;';

                // If the current user has an avatar, set the image property of the sl-avatar element
                if (post.author) {
                  const token = localStorage.getItem('token'); // Replace 'token' with the key you use to store the token
                  fetch(`${App.apiBase}/user/${post.author}`, {
                    headers: {
                      'Authorization': "Bearer " + localStorage.getItem('accessToken')
                    }
                  })
                    .then(response => response.json())
                    .then(author => {
                      if (author && author.avatar) {
                        const avatarUrl = `${App.apiBase}/images/${author.avatar}`;
                        console.log(avatarUrl); // Log the avatar URL
                        slAvatar.setAttribute('image', avatarUrl);
                      }
                    })
                    .catch(err => console.error(err)); // Handle any errors
                }

                // Append the sl-avatar element to the avatar div
                avatarDiv.appendChild(slAvatar);

                // Append the avatar div to the postDiv
                postDiv.appendChild(avatarDiv);

                // Create a new div for the text content
                const textDiv = document.createElement('div');
                textDiv.textContent = post.title;
                textDiv.style.display = 'flex';
                textDiv.style.justifyContent = 'left';
                textDiv.style.alignItems = 'center';
                textDiv.style.width = '85%';
                textDiv.style.color = 'var(--heading-color)';
                textDiv.style.marginLeft = '20px';

                postDiv.appendChild(textDiv);
                

                // Append the postDiv to the forumsContainer
                postsTab.appendChild(postDiv);

                // Create a new div for the SVG chevron
                const chevronDiv = document.createElement('div');
                chevronDiv.style.marginRight = '25px';

                // Create the SVG chevron element
                const svgChevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgChevron.setAttribute('fill', 'none');
                svgChevron.setAttribute('viewBox', '0 0 24 24');
                svgChevron.setAttribute('strokeWidth', '1.5');
                svgChevron.setAttribute('stroke', 'var(--heading-color)');
                svgChevron.setAttribute('width', '24'); // adjust size as needed
                svgChevron.setAttribute('height', '24'); // adjust size as needed
                svgChevron.classList.add('w-6', 'h-6');

                // Create the path element for the SVG chevron
                const pathChevron = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathChevron.setAttribute('strokeLinecap', 'round');
                pathChevron.setAttribute('strokeLinejoin', 'round');
                pathChevron.setAttribute('d', 'm8.25 4.5 7.5 7.5-7.5 7.5');

                // Append the path element to the SVG chevron element
                svgChevron.appendChild(pathChevron);

                // Append the SVG chevron to the chevronDiv
                chevronDiv.appendChild(svgChevron);

                // Append the chevronDiv to the postDiv
                postDiv.appendChild(chevronDiv);

              // Add a line after each post, except the last one
              if (index < posts.length - 1) {
                const lineDiv = document.createElement('div');
                lineDiv.style.height = '1px';
                lineDiv.style.backgroundColor = '#F0F0F0';
                lineDiv.style.width = '100%';
                postsTab.appendChild(lineDiv);
            }
            // If this is the last post, add a bottom margin
            if (index === posts.length - 1) {
                postDiv.style.marginBottom = '30px'; // Adjust as needed
            }
        });
    } else {
        console.error('inner-cont not found');
    }
})
.catch(err => console.log('error', err));
}

deleteAccount() {
  if (confirm("This will permanently delete your account")) {
      fetch(`/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete account');
        }
      })
      .catch(err => {
        console.log("error deleting user", err)
            // send back 500 status with error message
            res.status(500).json({
                message: "problem deleting user",
                error: err
      });
    });
  }
}


render(){
    const avatarSize = window.innerWidth <= 390 ? '100px' : '200px';
    const template = html`
    <style>
    
    p, h2 {
      color: #222633;
    }

    h1 {
      margin-left: 20%;
    }

    .user-container {
      background-color: #EDEBEB;
      margin-left: 20%;
      margin-right: 20%;
      border-radius: 15px;
      margin-bottom: 2em;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .user-info-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-left: 1em;
    }

    .profile-name {
      margin-left: 25px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .profile-name h2, p {
      margin-bottom: .25em;
      margin-top: .25em;
    }

    .edit-info {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      top: 25px;
      position: relative;
      height: 240px;
      padding-right: 2.5em;
    }

    edit-buttons {
      right: 25px;
      padding-top: 1.5em;
      display: flex;
      top: 1.5em;
    }

    .user-bio {
      margin-top: 20px;
      justify-content: flex-start;
      margin-left: 1.5em;
      margin-right: 3em;
      margin-bottom: 1em;
    }

    .button {
      width: 5em;
    }

    .delete-bubble {
      white-space: nowrap;
      z-index: 1;
      position: absolute;
      margin-bottom: 0;
    }
    
    .forum-posts {
      background-color: #EDEBEB;
      margin-left: 20%;
      margin-right: 20%;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .profile-tabs {
      margin-left: 1em;
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

        .user-container {
          margin-left: 2%;
          margin-right: 2%;
          width: 350px;
        }

        .forum-posts {
          margin-left: 2%;
          margin-right: 2%;
          width: 350px;
        }

        .user-info-row {
          flex-direction: column;
          justify-content: left;
          align-items: left;
        }

        .profile-name {
          margin-left: 0px;
          margin-top: 0;
        }

        .edit-info {
          justify-content: flex-start;
          margin-bottom: 1.5em;
        }

        .user-bio {
          margin-left: 1em;
        }
  }

    </style>


      <va-app-header user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content"> 
        <h1>PROFILE</h1>       
        <div class="user-container">   
              <div class="user-info-row">
                <div class="avatar">
                  ${Auth.currentUser && Auth.currentUser.avatar ? html`
                  <sl-avatar style="--size: ${avatarSize}; padding-top: 1.5em; margin-bottom: 1em;" image=${(Auth.currentUser && Auth.currentUser.avatar) ? `${App.apiBase}/images/${Auth.currentUser.avatar}` : ''}></sl-avatar>
                  `:html`
                  <sl-avatar style="--size: 200px; padding-top: 1.5em; margin-bottom: 1em;"></sl-avatar>
                  `} 
                </div>

                <div class="profile-name">
                  <h2>${Auth.currentUser.firstName} ${Auth.currentUser.lastName}</h2>
                  <p>${Auth.currentUser.email}</p>
                </div>

                <div class="edit-info">
                
                  <sl-button-group label="Alignment" class="edit-buttons">
                    <sl-tooltip content="Edit Profile">
                      <sl-button style="min-width: 60px;" size="small" pill @click=${()=> gotoRoute('/editProfile')}>Edit</sl-button>
                    </sl-tooltip>
                    <sl-tooltip class="delete-bubble" content="Delete Account">
                      <sl-button style="min-width: 60px;" size="small" pill @click=${this.deleteAccount}>Delete</sl-button>
                    </sl-tooltip>
                  </sl-button-group>

                  
                </div>
              </div>
              <div class="user-bio">
                <p style="font-size: 24pt;">Bio</p>
                <p>${Auth.currentUser.bio}</p>
              
              </div>
        </div>
        <div class="forum-posts">
          <sl-tab-group class="profile-tabs">
            <sl-tab slot="nav" panel="general">Posts</sl-tab>
            <sl-tab slot="nav" panel="disabled" disabled>Saved</sl-tab>
            <sl-tab slot="nav" panel="disabled" disabled>Liked</sl-tab>
          
            <sl-tab-panel name="general" class="general-tab"></sl-tab-panel>
            <sl-tab-panel name="Saved">This is the custom tab panel.</sl-tab-panel>
            <sl-tab-panel name="Liked">This is the advanced tab panel.</sl-tab-panel>
          </sl-tab-group>
        </div> 
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new ProfileView()