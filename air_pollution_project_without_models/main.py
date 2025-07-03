from fastapi import FastAPI
from pydantic import BaseModel , field_validator , Field
from co2_model import predict_co2_level
from typing import List , Tuple , Dict , Union 
from shortest_path import find_shortest_path
from pm_level_model import predict_pm
app = FastAPI()




"""
working examples 
{
  "graph": {
    "New York": [["Boston", 215], ["Philadelphia", 97], ["Washington DC", 225]],
    "Boston": [["New York", 215], ["Portland", 107]],
    "Philadelphia": [["New York", 97], ["Washington DC", 139], ["Pittsburgh", 305]],
    "Washington DC": [["New York", 225], ["Philadelphia", 139], ["Richmond", 109]],
    "Portland": [["Boston", 107]],
    "Pittsburgh": [["Philadelphia", 305], ["Cleveland", 135]],
    "Richmond": [["Washington DC", 109]],
    "Cleveland": [["Pittsburgh", 135]]
  },
  "start": "New York",
  "end": "Cleveland"
}


{
  "graph": {
    "A": [["B", 5], ["C", 1]],
    "B": [["A", 5], ["C", 2], ["D", 1]],
    "C": [["A", 3], ["B", 2], ["D", 4], ["E", 8]],
    "D": [["B", 1], ["C", 4], ["E", 3], ["F", 1]],
    "E": [["C", 8], ["D", 3]],
    "F" : [["D" , 1]]

  },
  "start": "A",
  "end": "D"
}
"""



class Co2Prediction(BaseModel):
    start_date : str
    end_date : str 
class GraphInput(BaseModel):
    graph: Dict[str, List[Union[List[Union[str, float]], Tuple[str, float]]]]
    start: str
    end: str
    
    @field_validator('graph')
    def validate_graph(cls, v):
        for node, edges in v.items():
            for edge in edges:
                if not (isinstance(edge, (list, tuple)) and len(edge) == 2 and
                        isinstance(edge[0], str) and isinstance(edge[1], (int, float))):
                    raise ValueError(f"Invalid edge format for node {node}: {edge}")
        return v

class AirQualityInput(BaseModel):
    no2: List[float] = Field(..., description="List of NO2 (Nitrogen Dioxide) measurements")
    co2: List[float] = Field(..., description="List of CO2 (Carbon Dioxide) measurements")
    ch4: List[float] = Field(..., description="List of CH4 (Methane) measurements")
    



@app.post("/get-co2-level-prediction")
async def get_co2_level(request:Co2Prediction):
    co2_prediction  = predict_co2_level(start_date=request.start_date , end_date=request.end_date)
    return {
        "co2_prediction" : co2_prediction
    }

@app.post('/get-shortest-path')
async def shortest_path(request:GraphInput):
    path = find_shortest_path(graph=request.graph ,start=request.start , end=request.end)
    return {"path" : path }

@app.post('/get-pm-levels')
async def pm_levels(request:AirQualityInput):
    pm_values = predict_pm(no2=request.no2 , co2=request.so2 , ch4=request.o3)
    return pm_values



