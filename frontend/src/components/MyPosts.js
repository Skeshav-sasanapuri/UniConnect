import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEmail } from '../context/EmailContext'; // Import the email context

function MyPosts() {
  const { email } = useEmail(); // Access the email from context
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({
    description: '',
    relatedSkills: '',
  });

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const response = await axios.get('http://localhost:8080/getposts');
        const response = await axios.get('http://localhost:8080/getposts', {
                  params: { email },  // Pass the email as query parameters
              });
        console.log(email)
        setPosts(response.data);  // Set the posts data to state
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (email) {
          fetchPosts();
      }
  }, [email]);  // Only fetch when email is available

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const postWithEmail = { ...post, email }; // Add email to post object
      await axios.post('http://localhost:8080/createpost', postWithEmail);
      alert('Post created successfully!');
      setPost({ description: '', relatedSkills: '' }); // Reset post form
      // Optionally, fetch posts again to update the list
      const response = await axios.get('http://localhost:8080/getposts');
      setPosts(response.data);
    } catch (error) {
      alert('Error creating post.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Post</h2>
      <form onSubmit={handlePostSubmit}>
        <div className="mb-3">
          <label className="form-label">Post Description:</label>
          <textarea
            className="form-control"
            name="description"
            value={post.description}
            onChange={handlePostChange}
            placeholder="Describe the activity or opportunity"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Related Skills/Interests:</label>
          <input
            type="text"
            className="form-control"
            name="relatedSkills"
            value={post.relatedSkills}
            onChange={handlePostChange}
            placeholder="Separate skills with commas"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Post</button>
      </form>

      <h2 className="mt-5">Existing Posts</h2>
      <div className="mt-3">
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to create a post!</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Description:</h5>
                <p className="card-text">{post.description}</p>
                <h6 className="card-subtitle mb-2 text-muted">Skills/Interests:</h6>
                <p className="card-text">{post.related_skills}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyPosts;