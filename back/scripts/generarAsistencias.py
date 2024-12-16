from config.motor_DB_escuelas import database
import pandas as pd
import numpy as np
import os
import sys
import asyncio
import calendar
from datetime import datetime

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")


# Conectar a la base de datos y colección
collection = database.docentes


def calcular(mes, anio):
    # Lista para almacenar los días hábiles
    dias_habiles = []

    # Determinamos el primer y último día del mes
    primer_dia, numero_dias = calendar.monthrange(anio, mes)

    # Iteramos sobre cada día del mes
    for dia in range(1, numero_dias + 1):
        fecha = datetime(anio, mes, dia)
        # Comprobamos si el día de la semana está entre lunes (0) y viernes (4)
        if fecha.weekday() < 5:  # Lunes = 0, ..., Viernes = 4
            # Formateamos la fecha como string
            dias_habiles.append(fecha.strftime('%Y-%m-%d'))

    diasHab = []
    for dia in dias_habiles:
        diasHab.append(dia[8:])

    result_set = {int(x) for x in diasHab}

    return result_set


async def docentes(mes, anio, escuela, direccion) -> list:
    # Criterio de búsqueda
    crt = {
        'escuela.nombre': escuela,
        'escuela.direccion': direccion,
        "$or": [
            {"asistencias": {"$elemMatch": {"mes": mes}}},
            {"licencias": {"$elemMatch": {"mes": mes}}}
        ]
    }

    # Obtener los documentos que coinciden con el criterio
    # cursor = collection.aggregate([{"$match": crt}])
    cursor = collection.aggregate([
        {"$match": crt},
        {"$project": {
            "_id": 1,  # Asegúrate de incluir el _id en los resultados
            "escuela": 1,
            "nombre": 1,
            "apellido": 1,
            "control": 1,
            "asistencias": 1,  # Incluye asistencias explícitamente
            "licencias": 1   # Incluye licencias explícitamente
        }}
    ])

   # Procesar los datos
    registro_de_todos_los_docentes = []
    async for data in cursor:
        dias = []
        escuelaR = data['escuela']['nombre']
        nombre = data['nombre']
        apellido = data['apellido']
        id = data['_id']
        # Procesar los días de asistencia
        asistencias = data.get('asistencias', [])
        asistencias_df = pd.DataFrame(
            [(int(dp['dia'][:2]), 'P')  # Convertimos a entero para comparación
             for asis in asistencias if asis['mes'] == mes for dp in asis.get('dias', [])],
            columns=['dia', 'estado']
        )

        # Procesar los días de licencia
        licencias = data.get('licencias', [])

        licencias_df = pd.DataFrame()
        if licencias:
            licencias_df = pd.concat([
                pd.DataFrame({
                    'dia': np.arange(int(dl['desde'][:2]), int(dl['hasta'][:2]) + 1)
                    if int(dl['hasta'][:2]) > int(dl['desde'][:2]) else [int(dl['desde'][:2])],
                    'estado': dl['codigo']
                }) for lic in licencias if lic['mes'] == mes for dl in lic.get('detalle', [])
            ], ignore_index=True)

        # Concatenar y ordenar los resultados
        dias_df = pd.concat([asistencias_df, licencias_df], ignore_index=True)
        dias_df = dias_df.sort_values(by='dia').reset_index(drop=True)

        # Crear un conjunto con todos los días del mes de agosto (1 a 31)
        todos_los_dias = calcular(mes, anio)
        # Crear un conjunto de los días presentes en asistencias y licencias
        dias_presentes = set(dias_df['dia'])

        # Identificar los días faltantes
        dias_faltantes = todos_los_dias - dias_presentes

        # Agregar los días faltantes con estado 'A'
        dias_faltantes_df = pd.DataFrame(
            [{'dia': dia, 'estado': 'A'} for dia in dias_faltantes]
        )

        # Concatenar los días faltantes al DataFrame principal
        dias_df = pd.concat([dias_df, dias_faltantes_df], ignore_index=True)
        dias_df = dias_df.sort_values(by='dia').reset_index(drop=True)

        # Convertir el DataFrame final a una lista de diccionarios y agregar a 'dias'

        dias.extend(dias_df.to_dict('records'))
        asistencias = {'id': id, 'escuela': escuelaR, 'nombre': nombre, 
                       'apellido': apellido, 'mes': mes, 'control': dias}
        registro_de_todos_los_docentes.append(asistencias)
    return registro_de_todos_los_docentes


# Función principal para ejecutar la consulta
# async def main():
#     mes = 9
#     anio = 2024
#     escuela = 'Rivadavia'
#     direccion = 'calle laprida y guemes'
#     registro_diario =  docentes(mes, anio, escuela, direccion)

#     print(registro_diario)

# # Ejecución
# if __name__ == '__main__':
#     # Ejecutar la función asincrónica main
#     asyncio.run(main())
