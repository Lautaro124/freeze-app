import { useEffect, useState } from 'react';
import './AppStyles.css';
import './App.css';
import service from './service/service';

function App() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [statusConnection, setStatus] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(temperature === null);
        const temperatureResponse = await service<{
          data: number
        }>('/freeze');
        const lastConection = await service<{
          lastConnection: Date,
          status: boolean
        }>('/espStatus');

        setStatus(lastConection.status);
        setTemperature(temperatureResponse.data);
        if (temperatureResponse.data >= 5) {
          setErrors('La temperatura se encuentra alta.');
        }
        if (temperatureResponse.data >= 10) {
          setErrors('La temperatura se encuentra muy alta.');
        }
        setErrors('');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const intervalId = setInterval(fetchData, 1500);
    return () => clearInterval(intervalId);
  }, [temperature]);

  const getTemperatureColor = () => {
    return temperature !== null && temperature >= 5 ?
      '#fc6446' : '#2196F3'
  }

  return (
    <main className="app-container">
      <h2>Temperatura de la heladera</h2>
      {loading ? (
        <p className="loading">Cargando...</p>
      ) : (
        <article className="gauge-container">
          <div className="gauge">
            <div className="gauge-content">
              <h1 style={{
                color: getTemperatureColor()
              }}>
                {temperature !== null ? `${temperature}°C` : 'N/A'}
              </h1>
              <div className={`statusTag ${statusConnection ? 'connected' : 'disconnected'}`}>
                <div className={`dot  ${statusConnection ? 'dotConnected' : 'dotdisconnected'}`}></div>
                <span className={`${statusConnection ? 'connected' : 'disconnected'}`}>
                  {statusConnection ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="290px" height="290px">
            <defs>
              <linearGradient id="GradientColor">
                <stop offset="0%" stopColor={getTemperatureColor()} />
                <stop offset="100%" stopColor={getTemperatureColor()} />
              </linearGradient>
            </defs>
            <circle cx="145" cy="145" r="120" strokeLinecap="round" />
          </svg>
        </article>
      )}
      <article>
        <span className={`error-message ${errors ? 'visible' : ''}`}>{errors}</span>
      </article>
    </main>
  );
}


export default App;
