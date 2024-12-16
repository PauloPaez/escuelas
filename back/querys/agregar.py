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

    if dia_existente:
        # Retornar con "message" en lugar de "mensaje"
        return {"message": "El día ya existe en el mes indicado."}
    else:
        # Intentar agregar el día al mes existente
        result = await coleccion.update_one(
            {
                "_id": ObjectId(id),
                "asistencias.mes": mes
            },
            {
                "$push": {
                    "asistencias.$.dias": {"dia": nuevo_dia, "he": 8.30, "hs": 12.30}
                }
            }
        )

        if result.modified_count == 1:
            print({"message": "Asistencia agregada correctamente"})
            return {"message": "Asistencia agregada correctamente"}
        else:
            # Si no se modificó nada, significa que el mes no existe
            raise HTTPException(status_code=500, detail="No se pudo agregar el día de asistencia.")

async def licencia(id: str, mes: int, tipo: str, desde: str, hasta: str, anio: int):
    print('en agregar.licencia: ', id, ' ', mes, ' ', tipo, ' ', desde, ' ', hasta, ' ', anio)

    # Criterio de búsqueda para verificar si ese dia figura como PRESENTE
    crt = {
        "_id": ObjectId(id),
        "asistencias": {
            "$elemMatch": {
                "mes": mes,
                "dias.dia": fecha_es(desde)
            }
        }
    }
    dia_presente = await coleccion.find_one(crt)
    if dia_presente:
        print({"message": "Error ya está registrado como presente"})
        return {"message": "Error está registrado como presente"}
    else:
        # Intentar agregar licencia
        result = await coleccion.update_one(
            {
                "_id": ObjectId(id),
                "licencias.mes": mes
            },
            {
                "$push": {
                    "licencias.$.detalle": {"codigo": tipo, "desde": fecha_es(desde),
                                            "hasta": fecha_es(hasta)}
                }
            }
        )
        if result.modified_count == 0:
            # No existe el mes
            result_new = await coleccion.update_one(
                {"_id": ObjectId(id)},
                {
                    "$push": {
                        "licencias": {
                            "mes": mes,
                            "detalle": [{"codigo": tipo, "desde": fecha_es(desde),
                                        "hasta": fecha_es(hasta)}]
                        }
                    }
                }
            )
            if result_new.modified_count == 0:
                raise HTTPException(
                    status_code=500, detail="No se pudo agregar licencia.")
            else:
                return {"message": "Licencia agregada correctamente"}
        else:
            return {"message": "Licencia agregada correctamente"}
