import React from "react";

const PostCard = ({ name, description, skills, onLike, onDislike }) => {
  return (
    <div className="card my-3">
      <div className="card-body">
        <h5 className="card-title">{name}</h5> {/* Display the name of the poster */}
        <p className="card-text">{description}</p> {/* Display the post description */}
        <p className="card-text">
          <strong>Skills:</strong> {skills.join(",  ")} {/* Display skills as a comma-separated list */}
        </p>
        <div className="d-flex justify-content-between">
          <button className="btn btn-success" onClick={onLike}>
            Like
          </button>
          <button className="btn btn-danger" onClick={onDislike}>
            Dislike
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;