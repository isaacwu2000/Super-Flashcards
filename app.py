import os
from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)
app.secret_key = 'psw'

@app.route('/')
def home():
    return render_template('index.html')

# Recieving user data
@app.route('/receive-user-data', methods=['POST'])
def receive_user_data():
    user = request.get_json() 
     
    # Getting the user's flashcards and sorting them by level
    from python.flashcard_interpretation import interpret_firebase_flashcards, update_firebase_flashcard_level
    from python.flashcard_alg import make_batch, batch_retrieval_alg

    flashcards, user_flashcards_collection = interpret_firebase_flashcards(user)
    flashcards.sort(key = lambda card: card['level'])

    # Running the program such that:
    # 1) The user gets to level 2 in all batches
    FIRST_LEVEL = 1
    # 2) The user gets to level 4 in all batches
    SECOND_LEVEL = 4

    while flashcards[0]['level'] < SECOND_LEVEL:
        flashcards = interpret_firebase_flashcards(user)[0]
        flashcards.sort(key = lambda card: card['level'])
        while flashcards[0]['level'] < FIRST_LEVEL:
            from python.flashcard_alg import make_batch, batch_retrieval_alg
            batch = make_batch(flashcards, batch_size = 3)
            batch_retrieval_alg(user, batch, batch_level_goal = FIRST_LEVEL)

        while flashcards[0]['level'] < SECOND_LEVEL:
            from python.flashcard_alg import make_batch, batch_retrieval_alg
            batch = make_batch(flashcards, batch_size = 10)
            batch_retrieval_alg(user, batch, batch_level_goal = SECOND_LEVEL)

    return "Data recieved"

if __name__ == '__main__':
    app.run(port=5500, debug=True)