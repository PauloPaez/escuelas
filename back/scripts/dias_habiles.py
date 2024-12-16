import calendar
from datetime import datetime

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
            dias_habiles.append(fecha.strftime('%Y-%m-%d'))  # Formateamos la fecha como string
    
    diasHab = []
    for dia in dias_habiles:
        diasHab.append(dia[8:])

    result_set = {int(x) for x in diasHab}

    return result_set

# Ejemplo de uso: Obtener los días hábiles de septiembre de 2024

if __name__ == "__main__":
    mes = 8
    anio = 2024
    dh = calcular(mes, anio)
    print(dh)
#print(f"Días hábiles en {calendar.month_name[mes]} {anio}:")

