# agregar.py
from datetime import datetime
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from config.motor_DB_escuelas import database

coleccion = database.docentes

def fecha_es(fecha_iso: str):
    f_es = datetime.strptime(fecha_iso, '%Y-%m-%d').date()
    fes = f_es.strftime('%d/%m/%Y')
    return fes

async def presente(id: str, mes: int, dia: int, anio: int):
    # Crear la fecha en formato dd/mm/yyyy
    nuevo_dia = f"{dia:02d}/{mes:02d}/{anio}"

    # Criterio de búsqueda para verificar si el día ya existe en el mes
    crt = {
        "_id": ObjectId(id),
        "asistencias": {
            "$elemMatch": {
                "mes": mes,
                "dias.dia": nuevo_dia
            }
        }
    }

    # Verificar si el día ya está registrado
    dia_existente = await coleccion.find_one(crt)
    print('Existe el dia ', dia_existente)

    # Eliminar el día existente
    if dia_existente:
        # Eliminar el día existente
        result = await coleccion.update_one(
            {
                "_id": ObjectId(id),
                "asistencias.mes": mes
            },
            {
                "$pull": {
                    "asistencias.$.dias": {"dia": nuevo_dia}
                }
            }
        )
        return ({"message": "El día ha sido eliminado del mes indicado."})

    return ({"message": "El día no ha sido eliminado del mes indicado."})


async def licencia(id: str, mes: int, desde: str, anio: int):
    print('\n\n desde quitar.licencia: ', id, ' mes: ',
          mes, ' desde: ', desde, ' anio: ', anio)
    crt = {
        "_id": ObjectId(id),
        "licencias": {
            "$elemMatch": {
                "mes": mes,
                "detalle.desde": fecha_es(desde)
            }
        }
    }
    licencia = await coleccion.find_one(crt)
    print('Existe licencia: '. licencia)
