import React, { useState, useEffect } from 'react';
import cargando from '../images/cargando.gif';
import { useDispatch, useSelector } from "react-redux";
import {
  useGetPlanillasMensualesQuery,
} from '../store/apiSlice';
const cli = (dato) => { console.log(dato) }
const Asistencias = () => {
  const { data, isError, error, isLoading, refetch } = useGetPlanillasMensualesQuery({
    mes: "8",
    anio: "2024",
    escuela: "Rivadavia",
    direccion: "calle laprida y guemes"
  });
  if (isLoading) return <div><img src={cargando} /></div>;
  else if (!data) return <div>Sin datos</div>
  else if (isError) return <div>Error: {error.message}</div>;
  return (
    <div>Asistencias
      {<ul>
        {
          data.map((dato, idx) => (
            <li key={idx} onClick={cli(dato)}>
              <strong>{dato.escuela}</strong>  - {dato.nombre} {dato.apellido}
              <span>:</span>
              {/* Aquí se agregan los estados para cada día en una misma fila */}
              {
                dato.control.map((ctrl, ind) => (
                  <span key={ind} style={{ margin: '0 5px' }}>
                    {ctrl.dia}: {ctrl.estado}
                  </span>
                ))
              }
            </li>
          ))
        }
      </ul>}
    </div>

  )
}

export default Asistencias