def docenteSh(item):
    return {
        "id": item.get("_id"),
        "padron": item.get("padron"),
        "dni": item.get("dni"),
        "nombre": item.get("nombre"),
        "apellido": item.get("apellido"),
        "estado_actual": item.get("estado_actual"),
        "escuela": item.get("escuela"),
        "asistencias": item.get("asistencias"),
        "licencias": item.get("licencias"),
    }

def docentesSh(items) -> list:
    return [docenteSh(item) for item in items]