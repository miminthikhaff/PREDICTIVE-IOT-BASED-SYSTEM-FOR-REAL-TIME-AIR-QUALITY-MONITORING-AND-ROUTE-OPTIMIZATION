import pandas as pd
from prophet import Prophet
import joblib



loaded_model = joblib.load('models/prophet_model.joblib')






# start_date = '2023-08-20'
# end_date = '2023-08-27'


def predict_co2_level(start_date:str , end_date:str):
    future_specific = pd.DataFrame({'ds': pd.date_range(start=start_date, end=end_date, freq='h')})
    forecast_specific = loaded_model.predict(future_specific)
    return forecast_specific[['ds' , 'yhat']]

# print(predict_co2_level(start_date=start_date , end_date=end_date))