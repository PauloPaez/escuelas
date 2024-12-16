from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class control(BaseModel):
	dia: Optional[int] = Field(default=None)
	estado: Optional[str] = Field(default=None)
      
class licencias(BaseModel):
    tipo: Optional[str] = Field(default=None)
    desde: Optional[str] = Field(default=None)
    hasta: Optional[str] = Field(default=None)

class Planilla(BaseModel):
    id: Optional[str] = Field(default=None)
    escuela: Optional[str] = Field(default=None)
    nombre: Optional[str] = Field(default=None)
    apellido: Optional[str] = Field(default=None)
    mes: Optional[int] = Field(default=None)  # Añadido el campo 'mes'
    control: Optional[list[control]]
    licencias: Optional[list[licencias]] 