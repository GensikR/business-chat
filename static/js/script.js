import { setupFirestoreListener } from './firebase.js';

document.addEventListener('DOMContentLoaded', function() {
    const send_button = document.getElementById('send_button');
    const message_input = document.getElementById('message_input');
    const chat_window = document.getElementById('chat_window');
    const session_id = document.getElementById('session_id').value;  // Capture the session ID

    // Function to add a message to the chat window
    function add_message(message, sender) {
        const msg_element = document.createElement('div');
        msg_element.classList.add('message');
        msg_element.classList.add(sender + "-message");
        msg_element.innerHTML = `<p>${message}</p>`;
        chat_window.appendChild(msg_element);
        chat_window.scrollTop = chat_window.scrollHeight;
    }

    // Function to send the message
    async function send_message() {
        const message = message_input.value.trim();

        if (message) {
            // Add user message immediately
            add_message(message, 'user');
            message_input.value = '';

            try {
                // Send the message along with the session ID to the Flask backend
                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message, session_id })
                });

                // Handle response
                if (!response.ok) {
                    add_message("Sorry, I couldn't understand that.", 'bot');
                } else {
                    const data = await response.json();
                    if (data.message) {
                        // Only add bot's message once the response is received
                        add_message(data.message, 'bot');
                    } else {
                        add_message("Sorry, there was an error processing your message.", 'bot');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                add_message("Sorry, there was an error processing your message.", 'bot');
            }
        }
    }

    // Event listeners for sending messages
    send_button.addEventListener('click', send_message);
    message_input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            send_message();
        }
    });

    // Initialize Firestore real-time listener to dynamically update messages
    setupFirestoreListener(add_message, session_id);  // Pass session ID to listener
});
