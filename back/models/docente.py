from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date, time


class dias(BaseModel):
	dia: Optional[date] = None
	he: Optional[time] = None
	hs: Optional[time] = None

class asistencias(BaseModel):
	mes: Optional[str] = Field(default=None)
	dias: list[dias]


class detalleLicencia(BaseModel):
	codigo: Optional[str] = Field(default=None)
	desde: Optional[datetime] = None
	hasta: Optional[datetime] = None
	
class licencias(BaseModel):
	mes: Optional[str] = Field(default=None)
	detalles: list[detalleLicencia]

class detalleEscuela(BaseModel):
	nombre: Optional[str] = Field(default=None)
	direccion: Optional[str] = Field(default=None)

class Docente(BaseModel):
    id: Optional[str] = Field(default=None)
    padron: Optional[str] = Field(default=None)
    dni: Optional[int] = Field(default=None)
    nombre: Optional[str] = Field(default=None)
    apellido: Optional[str] = Field(default=None)
    estado_actual: Optional[bool] = Field(default=False)
    escuela: list[detalleEscuela]
    asistencias: list[asistencias]
    licencias: list[licencias]