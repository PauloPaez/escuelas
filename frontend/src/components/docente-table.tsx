import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


interface Docente {
    nombre: string
    apellido: string
    control: { dia: number; estado: string }[]
    escuela: string
}

interface DocenteTableProps {
    data: Docente[]
    diasRegistrados: number[]
    onRowClick: (docente: Docente) => void
}

export function DocenteTable({ data, diasRegistrados, onRowClick }: DocenteTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    {diasRegistrados.map((dia) => (
                        <TableHead key={dia}>{dia}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((docente, idx) => (
                    <TableRow key={idx} onClick={() => onRowClick(docente)} className="cursor-pointer">
                        <TableCell>{docente.nombre}</TableCell>
                        <TableCell>{docente.apellido}</TableCell>
                        {diasRegistrados.map((dia) => {
                            const controlDia = docente.control.find((ctrl) => ctrl.dia === dia)
                            return <TableCell key={dia}>{controlDia ? controlDia.estado : '-'}</TableCell>
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

