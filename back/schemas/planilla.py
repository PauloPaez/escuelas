def planillaSh(item):
    return {
        "id": str(item.get("id", None)),
        "escuela": item.get("escuela"),
        "nombre": item.get("nombre"),
        "apellido": item.get("apellido"),
        "mes": item.get("mes"),
        "control": item.get("control"),
        "licencias": item.get("licencias")
    }

def planillasSh(items) -> list:
    return [planillaSh(item) for item in items]