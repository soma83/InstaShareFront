import React from 'react';

function Welcome() {
  return (<>
    <p>
      <h2>Welcome!!!</h2>
    </p>
    <p>
      Well, well, well! Here we are, again! Good to see you once more. The previous assignment was about a FizzBuzz quiz.
      Back then I sent an React only project. This time I have no i18n (I had no time, I recognize that, several things on the oven) but
      I bring up with a backend API this time.
    </p>
    <p>
      <strong>This is how this app works.</strong> First of all, if you are seeing this is because you properly installed the backend API.
      So, lets move on.
    </p>
    <p>
      <strong>Consider this:</strong> The app will ask you to save a "Secret question" and its respective "Secret response",
      just in case you forget your password. Also the app will ask you for a valid email address, can't remember why I added this, but
      I was a little lazy to remove it.
    </p>
    <p>
      The first user will be admin, always. From there, the next users will be just users. In the right top corner you will find the menu
      that brings you four main options, if you are not admin, and five if you are the admin.
      <ul>
        <li>Home: will take you back here.</li>
        <li>My profile: allows you to modify the data in your profile.</li>
        <li>File handler: allows you to upload, update and download files. See more below.</li>
        <li>Users handler: if you are admin, will allow you to handle the users, create, update and delete. See more below.</li>
        <li>Logout: will take you out of here.</li>
      </ul>
    </p>
    <p>
      <strong>File handler:</strong> Allows you to upload your files, any kind of files is welcome, but up to 5 MB. I added this restriction
      for nothing, just for adding some functionality. You will notice the "Upload file" button and the "Files from the user" selector.
      The upload button I think is pretty straightforward, the users selector will allow you to see the "public" files from other user,
      unless you are admin, if so then you can have access to all files uploaded by any user.
    </p>
    <p>
      Next, you can secondary click on any file and you will have these options: "Make the file public/private", "Rename", "Download" and
      "Delete". Pretty understandable as well.
    </p>
    <p>
      <strong>Users handler:</strong> As said, only for administrators. It also have a context menu over each user with these options: "Turn
      user into admin/Remove admin capabilities" and "Delete user". You will never be able to remove the last administrator available and
      to remove your own user.
    </p>
    <p>
      <strong>Some technical specs:</strong> The frontend app is built using pure ReactJS v17.0.2, the latest available at the moment of
      creating the app. Also it uses Material UI as components palette.
    </p>
    <p>
      The backend app was built using Ruby on Rails v6.1.4.1, not the latest, but the previous to the latest.
    </p>
    <p>
      <strong>One more thing:</strong> The zip handling of the file, I had no time for doing it, but with one, or two days more maybe I was
      able to add it as well, since I found a very nice gem "rubyzip" that makes it easy to turn a file into a zip compressed file. You might
      want to check out this gem.
    </p>
    <p>
      I hope you'll dig into the React's code, any comment, criticisms or whatever, will be welcome. So, go ahead, look under the hood.
      And that's it. Happy coding!
    </p>
  </>);
}

export default Welcome;
