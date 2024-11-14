import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, render_template, request, jsonify
import uuid

# Initialize Firebase Admin with the credentials file
cred = credentials.Certificate(r"C:\Users\gensikr\Desktop\school\fall2024\cse4333\project1\firebase_key\business-chat-88712-firebase-adminsdk-erxea-470dbeeb0b.json")
firebase_admin.initialize_app(cred)
print("Firebase Admin initialized successfully!")

# Get Firestore client
db = firestore.client()

app = Flask(__name__)

# Generate bot response based on user message
def my_function_generate_bot_response(usr_msg):
    if "hello" in usr_msg.lower():
        return "Hello! How can I help you?"
    elif "bye" in usr_msg.lower():
        return "Goodbye! Have a great day!"
    else:
        return "I am a simple bot. I can only say hello and goodbye."

# Save user message and bot reply to Firestore
def my_function_save_message(user_message, bot_reply, session_id):
    try:
        chat_ref = db.collection('chats').document()
        chat_ref.set({
            'user_message': user_message,
            'bot_reply': bot_reply,
            'timestamp': firestore.SERVER_TIMESTAMP,
            'session_id': session_id  # Store session ID
        })
        print("Message saved successfully!")
    except Exception as e:
        print(f"Error saving message to Firestore: {e}")

# Serve the main chat page
@app.route('/')
def index():
    session_id = str(uuid.uuid4())  # Generate a new unique session ID for each user
    return render_template('index.html', session_id=session_id)

# Handle sending the message
@app.route('/send-message', methods=['POST'])
def my_function_send_message():
    try:
        data = request.get_json()
        user_message = data.get('message', "")
        session_id = data.get('session_id', "")  # Get the session ID from the request

        print(f"User message: {user_message}")
        print(f"Session ID: {session_id}")

        bot_reply = my_function_generate_bot_response(user_message)

        print(f"Bot reply: {bot_reply}")

        my_function_save_message(user_message, bot_reply, session_id)

        return jsonify({"message": bot_reply})

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
