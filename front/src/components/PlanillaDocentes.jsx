import React, { useState, useEffect } from 'react';
import { useGetPlanillasMensualesQuery } from '../store/apiSlice';
import { useSavePlanillaMutation } from '../store/apiSlice';
import { useSelector } from 'react-redux';
import spiral from '../images/spiral.gif';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CriterioBusqueda from './CriterioBusqueda';

const PlanillaDocentes = () => {
  const filtro = useSelector((state) => state.criterio.filtro);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  // Datos que vienen de la API
  const { data, isError, error, isLoading } = useGetPlanillasMensualesQuery({
    mes: filtro.mes || "8",           // Valor por defecto si no hay filtro
    anio: filtro.anio || "2024",       // Si quieres agregar "anio" al filtro
    escuela: filtro.escuela || "Rivadavia",
    direccion: filtro.direccion || "calle laprida y guemes"
  });

  const [apiSavePlanilla, { isLoading: isSaving, isSuccess, isError: isSaveError, error: saveError, reset }] = useSavePlanillaMutation();

  const [diasRegistrados, setDiasRegistrados] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState(null); // Estado para el docente seleccionado
  const [editableControl, setEditableControl] = useState(null); // Estado para el control editable

  // Estado para las licencias como arreglo de objetos
  const [licencias, setLicencias] = useState([{
    tipo: '',
    desde: '',
    hasta: ''
  }]);

  // useEffect para cargar los datos en el estado cuando la data cambia
  useEffect(() => {
    if (data) {
      // Obtener los días únicos en los que hubo registro
      const dias = new Set();
      data.forEach((docente) => {
        docente.control.forEach((ctrl) => {
          dias.add(ctrl.dia); // Agregar cada día al set para asegurarnos de que sean únicos
        });
      });
      setDiasRegistrados([...dias].sort((a, b) => a - b)); // Convertir el set en array y ordenarlo
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      // toast.success('Planilla guardada con éxito');
      reset();
      setEditableControl(null);
      setLicencias([{ tipo: '', desde: '', hasta: '' }]); // Resetear licencia como arreglo
    }
    if (isSaveError) {
      if (saveError?.data?.message) {
        toast.error(saveError.data.message);
      } else {
        toast.error('Error al guardar la planilla');
      }
      reset();
    }
  }, [isSuccess, isSaveError, saveError, reset]);

  // Función para manejar cambios en las licencias
  const handleLicenciaChange = (e) => {
    const { name, value } = e.target;
    setLicencias([
      {
        ...licencias[0],
        [name]: value
      }
    ]);
  };


  const handleSave = async () => {
    if (selectedDocente) {
      // Validaciones opcional
      if (isCheckboxChecked && !licencias[0].desde) {
        toast.error('Por favor, completa la fecha de inicio de la licencia.');
        return;
      }
      if (!isCheckboxChecked && licencias.length > 0) {
        const licencia = licencias[0];
        if (licencia.tipo && (!licencia.desde || !licencia.hasta)) {
          toast.error('Por favor, completa todas las fechas de la licencia.');
          return;
        }
      }


      const planillaActualizada = {
        ...selectedDocente,
        licencias: licencias // Enviar como lista
      };

      console.log('planillaActualizada: ', planillaActualizada)
      try {
        console.log('Antes de enviar selectedDocente: ', planillaActualizada)
        const respuesta = await apiSavePlanilla(planillaActualizada).unwrap();

        // Manejar múltiples mensajes si es necesario
        if (respuesta.messages && Array.isArray(respuesta.messages)) {
          respuesta.messages.forEach((msg) => {
            const error = msg.toLowerCase().includes("error");
            error ? toast.error(msg) : toast.success(msg);
          });
        } else if (respuesta.message) {
          const mensaje = respuesta.message;
          const error = mensaje.toLowerCase().includes("error");
          error ? toast.error(mensaje) : toast.success(mensaje);
        } else {
          toast.success('Planilla guardada con éxito');
        }

        console.log(respuesta.message)
        setSelectedDocente(null);
        setLicencias([{ tipo: '', desde: '', hasta: '' }]); // Resetear licencia como arreglo
      } catch (error) {
        console.error('Error al guardar la planilla:', error);
        if (error?.data?.message) {
          toast.error(error.data.message);
        } else {
          toast.error('Error al guardar la planilla');
        }
      }
    }
  };

  // Función para manejar el clic en la fila
  const handleRowClick = (docente) => {
    setSelectedDocente(docente); // Guardar el docente seleccionado para mostrar en el modal
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setSelectedDocente(null); // Debería refrescar la tabla
    setEditableControl(null); // Resetear control editable
    setLicencias([{ tipo: '', desde: '', hasta: '' }]); // Resetear licencia como arreglo
  };

  // Función para habilitar la edición de un día en la matriz
  const handleEditClick = (ctrl) => {
    setEditableControl(ctrl); // Establecer el control editable
  };

  // Función para manejar el cambio en el select de edición
  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    setEditableControl({ ...editableControl, estado: nuevoEstado });
    console.log('editableControl: ', editableControl)
    console.log('Nuevo Estado: ', nuevoEstado)
    // Actualizar el estado del control en los datos del docente
    const updatedControl = selectedDocente.control.map((ctrl) =>
      ctrl.dia === editableControl.dia ? { ...ctrl, estado: nuevoEstado } : ctrl
    );

    setSelectedDocente({ ...selectedDocente, control: updatedControl });
    // Enviar a apiSlice(selectedDocente)
    setEditableControl(null);
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsCheckboxChecked(checked);
    // Si el checkbox está marcado, actualizar 'tipo' a 'eliminar'
    if (checked) {
      const name = 'tipo'
      const value  =  'eliminar'
      setLicencias([
        {
          ...licencias[0],
          [name]: value
        }
      ]);
      console.log('Cambio a name ', name, 'value: ', value)
    } else {
      setLicencias([{ ...licencias[0], tipo: '' }]);
    }
  };

  // Lógica de renderizado
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <img src={spiral} alt="Cargando..." />
      </div>
    );
  } else if (!data) return <div>Sin datos</div>;
  else if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <h3>Planilla de Asistencia</h3>
      <CriterioBusqueda />
      <table className='table table-striped mt-1'>
        <thead>
          <tr style={{ backgroundColor: '#FFA500' }}>
            <th>Nombre</th>
            <th>Apellido</th>
            {diasRegistrados.map((dia) => (
              <th key={dia}>{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((docente, idx) => (
            <tr key={idx} onClick={() => handleRowClick(docente)} style={{ cursor: 'pointer' }}>
              <td>{docente.nombre}</td>
              <td>{docente.apellido}</td>
              {diasRegistrados.map((dia) => {
                const controlDia = docente.control.find((ctrl) => ctrl.dia === dia);
                return <td key={dia}>{controlDia ? controlDia.estado : '-'}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Bootstrap */}
      {selectedDocente && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Docente: {selectedDocente.nombre} {selectedDocente.apellido}
                </h5>
              </div>
              <div className="modal-body">
                <p><strong>Escuela:</strong> {selectedDocente.escuela}</p>
                <p><strong>Asistencia:</strong></p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
                  {selectedDocente.control.map((ctrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #ccc',
                        padding: '5px',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleEditClick(ctrl)}
                    >
                      {editableControl && editableControl.dia === ctrl.dia ? (
                        <select value={editableControl.estado} onChange={handleEstadoChange}>
                          <option>↓↓↓</option>
                          <option value="At">A</option>
                          <option value="Pt">P</option>
                          {/* Agregar otras opciones si es necesario */}
                        </select>
                      ) : (
                        `${ctrl.dia} ${ctrl.estado}`
                      )}
                    </div>
                  ))}
                </div>

                {/* Campos de Licencia */}
                <div className="input-group mt-2">
                  <label className="input-group-text" htmlFor="tipoLicencia">Licencia</label>
                  <select
                    className="form-select"
                    id="tipoLicencia"
                    name="tipo"
                    value={licencias[0].tipo}
                    onChange={handleLicenciaChange}
                    disabled={isCheckboxChecked} // Deshabilitar el input si el checkbox está marcado
                  >
                    {/* Opción oculta por defecto */}
                    <option value="">Elija...</option>
                    <option value="ED">Enfermedad</option>
                    <option value="FR">Familiar</option>
                    <option value="IA">Injustificada</option>
                  </select>
                </div>
                <div className="input-group mt-1">
                  <span className="input-group-text">Desde</span>
                  <input
                    type="date"
                    className="form-control"
                    name="desde"
                    value={licencias[0].desde}
                    onChange={handleLicenciaChange}
                  />
                </div>
                <div className="input-group mt-1 mb-1">
                  <span className="input-group-text">Hasta</span>
                  <input
                    type="date"
                    className="form-control"
                    name="hasta"
                    value={licencias[0].hasta}
                    onChange={handleLicenciaChange}
                    disabled={isCheckboxChecked} // Deshabilitar el input si el checkbox está marcado
                  />
                </div>

                <div className="form-check input-group mt-1 mb-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange} // Manejar el cambio del checkbox
                  />
                  <label className="form-check-label  ms-1" htmlfor="flexCheckDefault">
                    Eliminar Licencia
                  </label>
                </div>

              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary me-auto"
                  disabled={isSaving} // Deshabilitar el botón si está cargando
                >
                  {isSaving ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      /> Guardando...
                    </>
                  ) : (
                    'Actualizar'
                  )}
                </button>
                <button type="button" className="btn btn-secondary"
                  onClick={handleCloseModal}>
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlanillaDocentes;






