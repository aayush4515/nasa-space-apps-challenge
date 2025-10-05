import pickle
import numpy as np

# Load model from .pkl file
with open("backend/models/koi_xgb.pkl", "rb") as f:
    model = pickle.load(f)

data_point = [9.48803557,170.53875,2.9575,615.8,5.135849,28.47082,142.0,5455.0,4.467,0.14,0.927,0.919,291.93423,48.141651,15.347]

# Reshape to (1, n_features)
data_point = np.array(data_point).reshape(1, 15)

prediction = model.predict(data_point)
print(f"The prediction is: {prediction}")

