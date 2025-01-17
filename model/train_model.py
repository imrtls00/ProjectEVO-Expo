import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Embedding, LSTM, Dense, Input, Bidirectional
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import pickle

# 📌 Step 1: Load the dataset
df = pd.read_csv("evo_dataset.csv")

# 📌 Step 2: Preprocess Data
df.columns = df.columns.str.strip()  # Remove any extra spaces in column names

# Define input and output columns
input_col = "input"
output_cols = ["action", "messageToShow", "body", "subject"]

# Fill NaN values with empty strings
df[output_cols] = df[output_cols].fillna("")

# 📌 Step 3: Tokenize Input (Convert Text to Sequences)
tokenizer = Tokenizer()
tokenizer.fit_on_texts(df[input_col])
input_sequences = tokenizer.texts_to_sequences(df[input_col])

# Padding sequences to ensure equal length
max_length = max(len(seq) for seq in input_sequences)
input_sequences = pad_sequences(input_sequences, maxlen=max_length, padding="post")

# 📌 Step 4: Encode Output Labels
label_encoders = {}
encoded_outputs = {}

for col in output_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])  # Convert text labels to numeric values
    label_encoders[col] = le
    encoded_outputs[col] = df[col].values

# Convert encoded outputs into a dictionary of NumPy arrays
encoded_outputs = {col: np.array(encoded_outputs[col]) for col in output_cols}

# 📌 Step 5: Train-Test Split
X_train, X_test, y_train_dict, y_test_dict = train_test_split(
    input_sequences, 
    list(encoded_outputs.values()),  # Convert dictionary values to list
    test_size=0.2, 
    random_state=42
)

# Convert back into a dictionary after splitting
y_train = {col: y_train_dict[i] for i, col in enumerate(encoded_outputs.keys())}
y_test = {col: y_test_dict[i] for i, col in enumerate(encoded_outputs.keys())}

# 📌 Step 6: Build the Multi-Output Model
vocab_size = len(tokenizer.word_index) + 1  # Number of unique words
embedding_dim = 128

# Input Layer
input_layer = Input(shape=(max_length,))

# Embedding + LSTM
embedding = Embedding(vocab_size, embedding_dim)(input_layer)
lstm = Bidirectional(LSTM(64))(embedding)

# Separate outputs for each category
outputs = {}
for col in output_cols:
    num_classes = len(label_encoders[col].classes_)
    outputs[col] = Dense(num_classes, activation="softmax", name=col)(lstm)

# Define Model with Multiple Outputs
model = Model(inputs=input_layer, outputs=list(outputs.values()))

# Compile the Model
model.compile(
    loss="sparse_categorical_crossentropy",  # Works with integer labels
    optimizer="adam",
    metrics=["accuracy"]
)

# 📌 Step 7: Train the Model
model.fit(
    X_train, 
    {col: y_train[col] for col in output_cols},  # Multi-output training
    epochs=10, 
    batch_size=16, 
    validation_data=(X_test, {col: y_test[col] for col in output_cols})
)

# 📌 Step 8: Save Model & Tokenizer
model.save("text_generation_model.h5")

# Save Tokenizer
with open("tokenizer.pkl", "wb") as f:
    pickle.dump(tokenizer, f)

# Save Label Encoders
with open("label_encoders.pkl", "wb") as f:
    pickle.dump(label_encoders, f)

print("✅ Model training complete! Saved model, tokenizer, and encoders.")
