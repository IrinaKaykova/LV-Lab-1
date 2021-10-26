import React, { useEffect, useState } from 'react';
import { settings, coefficients, paramNames } from './data';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './App.css';
import Plotly from "plotly.js"
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

function App() {
  const [data,setData] = useState([])
  const [values, setValues] = useState(settings)

  const LVCalculation = (x,y,values) => {
    const dx_dt = (values.alpha - values.beta * y) * x;
    const dy_dt = (-values.gamma + values.delta * x) * y;
    return [dx_dt,dy_dt]
  }
  useEffect(() => {
    setData(() => {
      const dataTemp = {
        x: [],
        y: [],
        t: [],
      }
      let x = values.x;
      let y = values.y;
      for (let i = 0; i < values.time; i++) {
        dataTemp.x.push(x);
        dataTemp.y.push(y);
        dataTemp.t.push(i);
        const [dx,dy] = LVCalculation(x,y,values);
        x+=dx;
        y+=dy;
      }
      return dataTemp
    })
  },[values])

  return (
    <div className="App">
      <div className="title">
        <p>Модель "Лотки-Вольтерры"</p>
        <p>  Кайкова Ирина. ИДМ-21-06.</p>
      </div>
      <div className='main'>
        <div className="graph">
        <Plot
          data={[
            {
              x: data.t,
              y: data.y,
              type: 'scatter',
              mode: 'lines',
              marker: {color: '#ea9999'},
              name: "Хищники"
            },
            {
              x: data.t,
              y: data.x,
              type: 'scatter',
              mode: 'lines',
              marker: {color: '#93c47d'},
              name: "Жертвы"
            },
          ]}
          showlegend={false}
          layout={ {width: 600, height: 400, title: 'График зависимости популяций друг от друга.', showlegend: false} }
          />
          <div className='image'>
            <img src='https://p0.pikist.com/photos/466/6/lynx-predator-big-cat-animal-animal-portrait-face-fur-head-drawing-animal-world.jpg'/>
            <span style={{color: "#ea9999"}}>Хищники</span>
          </div>
          <div className='image'>
            <img src='https://img-fotki.yandex.ru/get/9164/137106206.457/0_eba67_cf914ed3_orig.jpg'/>
            <span style={{color: "#93c47d"}}>Жертвы</span>
          </div>
        </div>
        <div className="graph">
        <Plot
          data={[
            {
              x: data.x,
              y: data.y,
              type: 'scatter',
              mode: 'lines',
              marker: {color: '#5b5b5b'},
            },
          ]}
          layout={ {width: 600, height: 400, title: 'Фазовый портрет.'} }
          />
        </div>
      </div>
      <div className="btns">
            {Object.keys(values).map((name) => (
              <div className="btns_item">
                <div style={{minWidth: '60px'}}>{paramNames[name]}:</div>
                <Slider 
                  value={values[name]*coefficients[name]} 
                  onChange={(data)=>{setValues(prev => ({...prev, [name]: data/coefficients[name]}))}}
                  min={name === 'time' ? 10 : 0}
                  max={name === 'time' ? 400 : 100}
                />
                <div style={{minWidth: '60px'}}>{values[name]}</div>
              </div>
            ))}
          </div>
    </div>
  );
}

export default App;
