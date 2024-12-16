from scripts import generarAsistencias
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from models.planilla import Planilla
from schemas.planilla import planillasSh
from querys import agregar, buscarDocente, quitar
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")
planillas = APIRouter()

@planillas.get('/planillas/{mes}/{anio}/{escuela}/{direccion}', response_model=list[Planilla])
async def obtener_planillasMensuales(mes: int, anio: int, escuela: str, direccion: str):
    # Llama directamente a scripts
    items = await generarAsistencias.docentes(mes, anio, escuela, direccion)
    datos = planillasSh(items)
    return datos

@planillas.post("/planillas")
async def create_planilla(planilla: Planilla):
    mes = planilla.mes
    id = planilla.id
    anio = 2024
    print('POST DE PLANILLA: ', planilla)
    try:
        planilla_dict = planilla.model_dump_json()
        planilla_dict = json.loads(planilla_dict)
        print('Planilla: ', planilla_dict)
        licencias = planilla_dict.get('licencias', [])
        
        # Manejo de licencias
        if licencias:
            tipo = licencias[0].get('tipo', '')
            desde = licencias[0].get('desde', '')
            hasta = licencias[0].get('hasta', '')
            print(f"Licencia - Tipo: {tipo}, Desde: {desde}, Hasta: {hasta}")
            
            if tipo != 'eliminar' and desde and hasta:
                respAgrLic = await agregar.licencia(id, mes, tipo, desde, hasta, anio)  
                print('Respuesta de agregar.licencia:', respAgrLic)
                if respAgrLic and 'message' in respAgrLic:
                    return respAgrLic
                elif respAgrLic and 'mensaje' in respAgrLic:
                    return {"message": respAgrLic['mensaje']}
            elif tipo == 'eliminar':
                print('se debe eliminar desde: ',desde)
                respAgrLic = await quitar.licencia(id, mes, desde, anio)

        # Manejo de control
        response_messages = []
        for c in planilla_dict.get('control', []):
            dia = c.get('dia')
            estado = c.get('estado')
            print('Procesando día:', dia, 'Estado:', estado)
            if estado == 'At':
                respAgrAs = await quitar.presente(id, mes, dia, anio)
            elif estado == 'Pt':
                respAgrAs = await agregar.presente(id, mes, dia, anio)
            else:
                respAgrAs = None  # Manejar otros estados si es necesario

            print('Respuesta de agregar/quitar:', respAgrAs)
            if respAgrAs and 'message' in respAgrAs:
                response_messages.append(respAgrAs['message'])
            elif respAgrAs and 'mensaje' in respAgrAs:
                response_messages.append(respAgrAs['mensaje'])
        
        if response_messages:
            return {"messages": response_messages}
        else:
            return {"message": "Planilla procesada sin cambios."}
    except Exception as e:
        print('Error en create_planilla:', str(e))
        raise HTTPException(status_code=500, detail=str(e))


