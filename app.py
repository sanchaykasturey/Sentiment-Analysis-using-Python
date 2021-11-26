from flask import Flask, render_template,request
from flask_socketio import SocketIO
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
from keras.preprocessing.text import Tokenizer
import pickle

def predict_class(text):
    model = load_model('models/sentimentModel.h5')
    sentiment_classes = ['Negative', 'Neutral', 'Positive']
    max_len=50
    with open('tokenizer/tokenizer.pickle', 'rb') as handle:
        tokenizer = pickle.load(handle)
    to_predict = tokenizer.texts_to_sequences([text])
    to_predict = pad_sequences(to_predict, padding='post', maxlen=max_len)
    pridicted = model.predict(to_predict).argmax(axis=1)
    print(pridicted)
    print('Sentiment is: ', sentiment_classes[pridicted[0]])
    return(sentiment_classes[pridicted[0]])


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@socketio.on("userJoined")
def userJoined():
    print("user Joined")
    socketio.emit("joined", "user Joined");


# routes 
# index route 
@app.route("/", methods=["GET"])
def indexRoute():
    return render_template("index.html")

# prediction route 
@app.route("/predict", methods=["POST"])
def predictRoute():
    COMMENT = request.form.get("comment")
    
    prediction = predict_class(COMMENT)
    return ({"success":True,"prediction":prediction })

if __name__ == '__main__':
    socketio.run(app, debug=True)