"use client"

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetPlanillasMensualesQuery, useSavePlanillaMutation } from '../store/apiSlice'

import { DocenteTable } from './docente-table'
import { DocenteModal } from './docente-modal'
import { Spinner } from './ui/spinner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CriterioBusqueda } from './CriterioBusqueda'

interface Docente {
  nombre: string
  apellido: string
  escuela: string
  control: { dia: number; estado: string }[]
}

export function PlanillaDocentes() {
  const filtro = useSelector((state: any) => state.criterio.filtro)
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null)
  const [diasRegistrados, setDiasRegistrados] = useState<number[]>([])

  const { data, isError, isLoading } = useGetPlanillasMensualesQuery({
    mes: filtro.mes || "8",
    anio: filtro.anio || "2024",
    escuela: filtro.escuela || "Rivadavia",
    direccion: filtro.direccion || "calle laprida y guemes"
  })

  const [savePlanilla] = useSavePlanillaMutation()

  useEffect(() => {
    if (data) {
      const dias = new Set<number>()
      data.forEach((docente: Docente) => {
        docente.control.forEach((ctrl) => {
          dias.add(ctrl.dia)
        })
      })
      setDiasRegistrados([...dias].sort((a, b) => a - b))
    }
  }, [data])

  const handleRowClick = (docente: Docente) => {
    setSelectedDocente(docente)
  }

  const handleCloseModal = () => {
    setSelectedDocente(null)
  }

  const handleSave = async (updatedDocente: Docente) => {
    try {
      await savePlanilla(updatedDocente).unwrap()
      setSelectedDocente(null)
      // Actualizar los datos locales
      const updatedData: Docente[] = data.map((d: Docente) =>
        d.nombre === updatedDocente.nombre && d.apellido === updatedDocente.apellido ? updatedDocente : d
      )
      // Aquí deberías tener una forma de actualizar los datos en el store de Redux
      // Por ejemplo: dispatch(updatePlanillaData(updatedData))
    } catch (error) {
      console.error('Error al guardar la planilla:', error)
    }
  }

  if (isLoading) return <Spinner />
  if (isError) return <div>Error al cargar los datos</div>
  if (!data) return <div>No hay datos disponibles</div>

  return (
    <Card>
      <CardContent>
        <CriterioBusqueda />
        <DocenteTable
          data={data}
          diasRegistrados={diasRegistrados}
          onRowClick={handleRowClick}
        />
        {selectedDocente && (
          <DocenteModal
            docente={selectedDocente}
            onClose={handleCloseModal}
            onSave={handleSave}
          />
        )}
      </CardContent>
    </Card>
  )
}

