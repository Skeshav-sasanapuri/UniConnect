import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import axios from "axios";  // Import axios
import { useEmail } from '../context/EmailContext'; // Import the email context

const Feed = () => {
  const { email } = useEmail(); // Access the email from context
  const [posts, setPosts] = useState([]);

  // Fetch posts from the backend using axios
  useEffect(() => {
    if (email) {  // Ensure email is available before making the request
      axios.get(`http://localhost:8080/getfeed?email=${email}`) // Send email as query param
        .then((response) => {
          console.log(response.data)
          setPosts(response.data); // Set posts to state
        })
        .catch((error) => {
          console.error("Error fetching posts:", error); // Handle error
        });
    }
  }, [email]); // Re-fetch when email changes

  const handleLike = async (postId) => {
    try {
      // Send request to start a chat with the post owner
      console.log(email)
      await axios.post("http://localhost:8080/startchat", { "postId":postId, "email":email });

      // Remove the liked post from the feed
      setPosts(posts.filter(post => post._id !== postId));
      console.log(`Started chat and removed liked post: ${postId}`);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleDislike = (postId) => {
    // Remove the disliked post from the feed
    setPosts(posts.filter(post => post._id !== postId));
    console.log(`Removed disliked post: ${postId}`);
  };

  return (
    <div className="container mt-4">
      <h2>Feed</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            name={post.name} // Pass name to PostCard
            description={post.description} // Pass description to PostCard
            skills={post.related_skills} // Pass skills to PostCard
            onLike={() => handleLike(post._id)}
            onDislike={() => handleDislike(post._id)}
          />
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Feed;
