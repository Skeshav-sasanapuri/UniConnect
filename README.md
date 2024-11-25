
# UniConnect - Social media app for colleges centered around building communities  

UniConnect is a web-based platform designed to connect college students based on shared skills and interests. The platform enables users to create profiles, share opportunities, and interact with like-minded peers, fostering collaboration and community building.

## Features

- **Skill-Based Matching**: Students can connect with others who share similar skills and interests.
- **Opportunities & Posts**: Create and share opportunities such as finding hackathon partners, organizing events, or starting interest groups.
- **Smart Feed**: Displays posts and opportunities tailored to each user's skills and preferences.
- **Secure Authentication**: Integrated Google OAuth 2.0 for logging in with .edu emails, ensuring a trusted academic user base.
- **Chat Functionality**: Allows students to communicate with others who interact with their posts.
- **Responsive Design**: Built with a React.js front end and Bootstrap for a user-friendly interface.

## Tech Stack

- **Frontend**: React.js, Bootstrap
- **Backend**: Flask
- **Database**: MongoDB (Atlas)
- **Authentication**: Google OAuth 2.0
- **API Communication**: REST APIs

## Installation

Follow the steps below to set up UniConnect on your local machine:

1. Clone the repository:

   ```bash
   git clone https://github.com/Skeshav-sasanapuri/UniConnect.git
   cd UniConnect
   ```

2. Set up the backend:

   - Navigate to the `backend` directory.
   - Install dependencies:

     ```bash
     pip install -r requirements.txt
     ```

   - Configure your MongoDB Atlas connection and Google OAuth credentials in `.env`:

     ```env
     MONGO_URI=your_mongodb_atlas_connection_string
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

   - Start the backend server:

     ```bash
     python app.py
     ```

3. Set up the frontend:

   - Navigate to the `frontend` directory.
   - Install dependencies:

     ```bash
     npm install
     ```

   - Start the frontend:

     ```bash
     npm start
     ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Login**: Use your institutional email to log in via Google OAuth.
2. **Build Your Profile**: Add your skills, interests, and bio to let others know about you.
3. **Create Posts**: Share opportunities or events like finding hackathon partners or organizing a game.
4. **Interact**: View personalized posts and connect with users by liking their posts or chatting.

## Contribution

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your message here"
   ```

4. Push the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- React.js for front-end development.
- Flask for back-end APIs.
- MongoDB Atlas for database management.
- Google OAuth for secure authentication.

---

Feel free to explore, contribute, and make UniConnect the ultimate platform for connecting students!
