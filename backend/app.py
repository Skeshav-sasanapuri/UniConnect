from flask import Flask, jsonify, request
from flask_mail import Mail, Message
from pymongo import MongoClient

app = Flask(__name__)

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'uniconnect.app.noreply@gmail.com'  # Email address
app.config['MAIL_PASSWORD'] = 'Pass12?ab#uniconnect'  # Replace with your password

mail = Mail(app)

# Use the connection string provided by Atlas
client = MongoClient("mongodb+srv://keshavsasanapuri:Pass12?ab#Uniconnect@uniconnect.kbuqf.mongodb.net/?retryWrites=true&w=majority&appName=UniConnect")

db = client["UniConnect Database"]
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


@app.route("/profile", methods=["POST"])
def create_profile():
    data = request.json
    users_collection.update_one(
        {"email": data["email"]},
        {"$set": data},
        upsert=True
    )
    return jsonify({"message": "Profile created/updated successfully."})


@app.route("/posts", methods=["GET"])
def get_posts():
    posts = list(posts_collection.find({}, {"_id": 0}))
    return jsonify(posts)


@app.route("/match", methods=["GET"])
def match_posts():
    user_email = request.args.get("email")
    user = users_collection.find_one({"email": user_email})
    user_skills = user.get("skills", [])
    matching_posts = list(posts_collection.find({"skills": {"$in": user_skills}}, {"_id": 0}))
    return jsonify(matching_posts)


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
    app.run(host='0.0.0.0', port=8080)
