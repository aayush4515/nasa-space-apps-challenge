import xgboost
import numpy as np
import pickle

test_point = [9.48803557,170.53875,2.9575,615.8,5.135849,28.47082,142.0,5455.0,4.467,0.14,0.927,0.919,291.93423,48.141651,15.347]
test2 = [2.56658897,179.55437,2.429,226.5,4.3886313,12.325094,355.0,6046.0,4.486,-0.08,0.972,1.053,296.28613,48.22467,15.714]
test3 = [670.645531,209.04355,53.412,18091.0,70.64302,96.96236,3.0,5520.0,4.466,0.48,0.983,1.03,296.69861,49.316479,15.207]
test_k0044_01 = [19.40393776,172.484253,12.2155,8918.7,49.468765,320.90817,71.0,5043.0,4.591,-0.54,0.68,0.657,289.25821,47.635319,15.487]

test_100 = [54.4183827,162.51384,4.507,874.8,7.027669,20.109507,25.0,5455.0,4.467,0.14,0.927,0.919,291.93423,48.141651,15.347]

with open("backend/models/koi_xgb.pkl", "rb") as f:
    model = pickle.load(f)

test_point = np.array(test_point).reshape(1, 15)
test3 = np.array(test3).reshape(1, 15)
test_k0044_01 = np.array(test_k0044_01).reshape(1, 15)
test_100 = np.array(test_100).reshape(1, 15)

prediction = model.predict_proba(test_100)[0]

positive_score = prediction[1]
negative_score = prediction[0]

print(prediction)