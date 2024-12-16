import sys
import os
import asyncio
from bson.objectid import ObjectId
# ----------------------------------------------------
from models.docente import Docente
# -----------------------------------------------------
from config.motor_DB_escuelas import database

coleccion = database.docentes


sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")


async def Uno(id, mes) -> dict:
    # Criterio de búsqueda
    crt = {
        '_id': ObjectId(id),
        "$or": [
            {"asitencias": {"$elemMatch": {"mes": mes}}},
            {"licencias": {"$elemMatch": {"mes": mes}}}
        ]
    }
    cursor = coleccion.aggregate([
        {"$match": crt},
        {"$project": {
            "_id": 1,  
            "asitencias": 1,  # Incluye asistencias explícitamente
            "licencias": 1   # Incluye licencias explícitamente
        }}
    ])

    # Obtener el primer documento como una lista
    resultados = await cursor.to_list(length=1)
    # Si la lista tiene al menos un documento, imprímelo
    if resultados:
        docente = resultados[0]
        return docente
    else:
        return {'error' : 'No se encontró ningún docente que coincida con el criterio.'}

