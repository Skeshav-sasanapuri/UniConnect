from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from pymongo.mongo_client import MongoClient
from flask_cors import CORS
from urllib.parse import quote_plus
from google.oauth2 import id_token
from google.auth.transport.requests import Request
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)


# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'changeme'  # Email address
app.config['MAIL_PASSWORD'] = 'changeme'  # Replace with your password


mail = Mail(app)

# Original username and password
username = "changeme"
password = "changeme"

# URL encode the username and password
encoded_username = quote_plus(username)
encoded_password = quote_plus(password)

# MongoDB connection URI with encoded username and password
uri = f"mongodb+srv://{encoded_username}:{encoded_password}@uniconnect.kbuqf.mongodb.net/?retryWrites=true&w=majority&appName=UniConnect"

client = MongoClient(uri)

db = client["UniConnect_Database"]
users_collection = db["users"]
chat_collection = db["chats"]
posts_collection = db["posts"]


# Example endpoint
@app.route('/')
def home():
    return jsonify({'message': 'Backend is running'})


# Email verification endpoint
@app.route("/send_verification", methods=["POST"])
def send_verification():
    email = request.form['email']

    # Check if email ends with '.edu'
    if email.endswith(".edu"):
        msg = Message("Verify Your Email", sender="your_email@gmail.com", recipients=[email])  # Replace with your email
        msg.body = "Click the link to verify your email."
        try:
            mail.send(msg)
            return jsonify({'message': 'Verification email sent.'})
        except Exception as e:
            return jsonify({'message': f'Error sending email: {str(e)}'})
    else:
        return jsonify({'message': 'Invalid email domain.'})


@app.route("/google_login", methods=["POST"])
def google_login():
    data = request.json
    token = data.get("token")

    if not token:
        return jsonify({"error": "Token is required"}), 400

    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(token, Request())

        # Extract user email from the decoded token
        user_email = idinfo['email']

        # Check if the user exists in the database
        user = users_collection.find_one({"email": user_email})

        if user:
            return jsonify({"success": True, "new_user": False, "email": user_email})
        else:
            # Create a placeholder for the new user
            users_collection.insert_one({"email": user_email})
            return jsonify({"success": True, "new_user": True, "email": user_email})

    except ValueError:
        # Token is invalid
        return jsonify({"error": "Invalid token"}), 400


@app.route("/createpost", methods=["POST"])
def create_post():
    data = request.get_json()
    email = data.get("email")
    description = data.get("description")
    related_skills = data.get("relatedSkills")

    if not description or not related_skills:
        return jsonify({"error": "Description and skills are required"}), 400

    # Query users_collection to get the user's name by email
    user = users_collection.find_one({"email": email})

    related_skills = [tag.strip() for tag in related_skills.split(",") if tag.strip()]

    if not user:
        return jsonify({"error": "User not found"}), 404

        # Get the user's name
    name = user.get("name", "Anonymous")  # Default to "Anonymous" if name is not found
    university = user.get("university", "Anonymous")

    # Get the current timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Format: YYYY-MM-DD HH:MM:SS

    # Save the post to the database
    post_data = {
        "email": email,
        "name": name,
        "university": university,
        "description": description,
        "related_skills": related_skills,
        "timestamp": timestamp  # Add timestamp to the post
    }

    # Insert the post into the Posts collection
    posts_collection.insert_one(post_data)

    return jsonify({"message": "Post created successfully!"}), 201

@app.route("/profile", methods=["POST"])
def create_profile():
    # Get other profile data
    data = request.json
    email = data.get("email")
    # Extract the university from the email
    def extract_university_from_email(email):
        domain = email.split('@')[-1]
        parts = domain.split('.')
        return parts[-2]

    university = extract_university_from_email(email)

    update_data = {}

    # fields = ["name", "birthDate", "major", "year", "bio", "interests", "links"]
    for field in data:
        print(field)
        if data[field] != '':
            if field == "interests":
                interests = data[field]
                update_data["interests"] = [tag.strip() for tag in interests.split(",") if tag.strip()]
            else:
                update_data[field] = data[field]

    update_data["university"] = university

    # Update the user's profile
    users_collection.update_one(
        {"email": email},
        {"$set": update_data},
        upsert=True
    )
    return jsonify({"message": "Profile created/updated successfully."})


@app.route("/getprofile", methods=["GET"])
def get_profile():
    # Get the email from the query parameters (or cookies/session)
    email = request.args.get("email")  # You can also fetch from session or cookie

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Fetch the user's profile from the database using the email
    user = users_collection.find_one({"email": email}, {"_id": 0})  # Exclude the _id field

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Return the user profile data
    return jsonify(user)


@app.route("/getposts", methods=["GET"])
def get_posts():
    user_email = request.args.get('email')  # Get email from query parameter
    posts = list(posts_collection.find({"email": user_email}, {"_id": 0}))
    return jsonify(posts)


@app.route("/getfeed", methods=["GET"])
def feed_posts():
    user_email = request.args.get("email")
    user = users_collection.find_one({"email": user_email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_skills = user.get("interests", [])
    user_university = user.get("university", "")
    print(user_skills)
    print(user_university)

    # Find posts that have matching skills and university
    matching_posts = list(posts_collection.find({
        "related_skills": {"$in": user_skills},
        "university": user_university,
        "email": {"$ne": user_email}  # Exclude posts by the user
    }))
    # Convert ObjectIDs to strings before serializing
    for post in matching_posts:
        post['_id'] = str(post['_id'])

    return jsonify(matching_posts)


@app.route("/startchat", methods=["POST"])
def start_chat():
    data = request.json
    post_id = data.get("postId")
    print(post_id)

    if not post_id:
        return jsonify({"error": "Post ID is required"}), 400

    post_id = ObjectId(post_id)
    # Find the post by ID
    post = posts_collection.find_one({"_id": post_id})
    print(post)


    if not post:
        return jsonify({"error": "Post not found"}), 404

    # Get the post owner's email and the current user's email
    post_owner_email = post.get("email")
    user_email = data.get("email")   # Pass user's email as a query parameter
    print(user_email)

    if not user_email or not post_owner_email:
        return jsonify({"error": "Email is required"}), 400

    # Create a new chat between the two users
    chat_data = {
        "users": [user_email, post_owner_email],
        "messages": [post.get('description')],  # Initialize an empty message array
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    chat_collection.insert_one(chat_data)
    return jsonify({"message": "Chat started successfully!"}), 201


@app.route("/chat/conversations", methods=["GET"])
def get_conversations():
    user_email = request.args.get("email")
    print(user_email)

    if not user_email:
        return jsonify({"error": "Email is required"}), 400

    # Find conversations where the user is a participant
    conversations = list(chat_collection.find(
        {"users": user_email},
        {"_id": 1, "users": 1}  # Only include _id and users in the results
    ))

    # Add the user's name to each conversation by querying the user_collection
    for conversation in conversations:
        # Fetch user details from user_collection using user_email
        user_details = users_collection.find_one({"email": user_email})
        if user_details:
            conversation["user_name"] = user_details.get("name", "Unknown")  # Add the user's name
        conversation['_id'] = str(conversation['_id'])  # Convert ObjectId to string

    return jsonify(conversations)


@app.route("/chat", methods=["POST"])
def send_message():
    data = request.json
    chat_collection.insert_one(data)
    return jsonify({"message": "Message sent."})


@app.route("/chat/<conversation_id>", methods=["GET"])
def get_messages(conversation_id):
    messages = list(chat_collection.find({"conversation_id": conversation_id}, {"_id": 0}))
    return jsonify(messages)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
