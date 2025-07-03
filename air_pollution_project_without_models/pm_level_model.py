import joblib 
import pandas as pd 
from typing import List 

loaded_rf_model = joblib.load('models/gas_model_pm25.joblib')
loaded_rf_model_pm10 = joblib.load('models/gas_model_pm10.joblib')


def predict_pm(no2:List[float] , so2:List[float] , o3:List[float] , co:List[float]):
    new_data = pd.DataFrame({
        "NO2" : no2 ,
        "CO2" : co2 , 
        "CH4" : ch4
        
    })
    predictions = loaded_rf_model.predict(new_data)
    predictions_pm10 = loaded_rf_model_pm10.predict(new_data)

    return {'pm_2.5':list(predictions) , "pm_10":list(predictions_pm10)}


# print(predict_pm(no2=[2, 2.5, 3.0] , co2= [5, 7, 9], ch4= [40, 45, 50], ))