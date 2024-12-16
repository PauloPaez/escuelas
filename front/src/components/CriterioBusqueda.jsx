import React from 'react'
import { useForm } from "react-hook-form"
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado
import { useDispatch, useSelector } from "react-redux";
import { setCriterio } from '../store/appSlice';

const CriterioBusqueda = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm()
    const enviar = (data) => {
        dispatch(setCriterio(data));
    }

    return (

        <form onSubmit={handleSubmit(enviar)} className="form-inline d-flex">
            <select {...register("escuela")} className="form-control ms-3">
                <option>Escuela</option>
                <option value="Rivadavia">Rivadavia</option>
                <option value="San Martin">San Martin</option>
                <option value="Belgrano">Belgrano</option>
            </select>
            <input
                placeholder="Direccion"
                {...register("direccion")}
                className="form-control mr-3 ms-3" // Margen derecho para separación
            />
            <input
                placeholder="Mes"
                type='number'
                {...register("mes")}
                className="form-control w-auto ms-3" // Ajuste de ancho automático y margen derecho
                maxLength={1} // Solo dos dígitos
            />
                        <input
                placeholder="Año"
                type='number'
                {...register("anio")}
                className="form-control w-auto ms-3" // Ajuste de ancho automático y margen derecho
                maxLength={4} // Solo dos dígitos
            />
            <button type="submit" className="btn btn-secondary ms-3 me-3">Buscar</button>
        </form>

    )
}

export default CriterioBusqueda

