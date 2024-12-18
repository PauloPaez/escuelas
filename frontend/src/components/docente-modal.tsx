import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DateRange } from 'react-day-picker';
import { format, isValid } from "date-fns"
import React, { useState } from 'react'
import { es } from "date-fns/locale"

interface Docente {
    nombre: string
    apellido: string
    escuela: string
    control: { dia: number; estado: string }[]
}

interface DocenteModalProps {
    docente: Docente
    onClose: () => void
    onSave: (updatedDocente: Docente) => void
}


export function DocenteModal({ docente, onClose, onSave }: DocenteModalProps) {
    const [editedDocente, setEditedDocente] = useState(docente)
    const [selectedAction, setSelectedAction] = useState<string>('')
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [dateRange, setDateRange] = useState<DateRange>({
        from: undefined,
        to: undefined,
    })
    const [licenciaType, setLicenciaType] = useState<string>('')

    const handleActionChange = (value: string) => {
        setSelectedAction(value)
        if (value !== 'licencia') {
            setLicenciaType('')
            setDateRange({ from: undefined, to: undefined })
        } else {
            setSelectedDate(undefined)
        }
    }

    const handleCalendarSelect = (value: Date | DateRange | undefined) => {
        if (selectedAction === 'licencia') {
            if (value && 'from' in value) {
                setDateRange(value as DateRange)
            }
        } else {
            setSelectedDate(value as Date | undefined)
        }
    }

    const handleSave = () => {
        let updatedControl = [...editedDocente.control]
        if (selectedAction === 'licencia' && dateRange.from && dateRange.to) {
            const start = dateRange.from.getDate()
            const end = dateRange.to.getDate()
            for (let day = start; day <= end; day++) {
                updateControlForDay(updatedControl, day, licenciaType)
            }
        } else if (selectedDate) {
            const day = selectedDate.getDate()
            const estado = selectedAction === 'presente' ? 'P' : 'A'
            updateControlForDay(updatedControl, day, estado)
        }

        const updatedDocente = {
            ...editedDocente,
            control: updatedControl
        }
        onSave(updatedDocente)
    }

    const updateControlForDay = (control: typeof editedDocente.control, day: number, estado: string) => {
        const index = control.findIndex(ctrl => ctrl.dia === day)
        if (index !== -1) {
            control[index].estado = estado
        } else {
            control.push({ dia: day, estado })
        }
    }

    const isDateSelected = (date: Date) => {
        if (selectedAction === 'licencia') {
            return !!(dateRange.from && date >= dateRange.from && dateRange.to && date <= dateRange.to)
        } else {
            return !!(selectedDate && date.getDate() === selectedDate.getDate())
        }
    }

    const getSelectedDateInfo = () => {
        if (selectedAction === 'licencia' && dateRange.from && dateRange.to && isValid(dateRange.from) && isValid(dateRange.to)) {
            return `Rango de fechas seleccionado: ${format(dateRange.from, "PP", { locale: es })} - ${format(dateRange.to, "PP", { locale: es })}`
        } else if (selectedDate && isValid(selectedDate)) {
            return `Fecha seleccionada: ${format(selectedDate, "PP", { locale: es })}`
        }
        return null
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="flex flex-col">
                <DialogHeader>
                    <DialogTitle>Docente: {docente.nombre} {docente.apellido}</DialogTitle>
                </DialogHeader>
                <div className="flex-grow flex flex-col space-y-4 overflow-y-auto">
                    <p><strong>Escuela:</strong> {docente.escuela}</p>
                    <div className="flex-grow relative">
                        {selectedAction === 'licencia' ? (
                            <Calendar
                                mode="range"
                                selected={dateRange}
                                onSelect={handleCalendarSelect}
                                className="rounded-md border"
                                numberOfMonths={1}
                                locale={es}
                                modifiers={{
                                    selected: isDateSelected
                                }}
                                footer={getSelectedDateInfo() ? (
                                    <p className="text-sm text-center">
                                        {getSelectedDateInfo()}
                                    </p>
                                ) : (
                                    <p className="text-sm text-center">
                                        Selecciona un rango de fechas para la licencia
                                    </p>
                                )}
                            />
                        ) : (
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleCalendarSelect}
                                className="rounded-md border"
                                numberOfMonths={1}
                                locale={es}
                                modifiers={{
                                    selected: isDateSelected
                                }}
                                footer={getSelectedDateInfo() ? (
                                    <p className="text-sm text-center">
                                        {getSelectedDateInfo()}
                                    </p>
                                ) : (
                                    <p className="text-sm text-center">
                                        Selecciona una fecha para la acción
                                    </p>
                                )}
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="action" className="text-right">
                            Acción
                        </Label>
                        <Select onValueChange={handleActionChange} value={selectedAction}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Seleccionar acción" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="presente">Presente</SelectItem>
                                <SelectItem value="ausente">Ausente</SelectItem>
                                <SelectItem value="licencia">Agregar Licencia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedAction === 'licencia' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="licenciaType" className="text-right">
                                Tipo de Licencia
                            </Label>
                            <Select onValueChange={setLicenciaType} value={licenciaType}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ED">Enfermedad</SelectItem>
                                    <SelectItem value="FR">Familiar</SelectItem>
                                    <SelectItem value="IA">Injustificada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        className="mr-auto"
                        disabled={!selectedAction || (selectedAction === 'licencia' ? (!dateRange.from || !dateRange.to || !licenciaType) : !selectedDate)}
                    >
                        Actualizar
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

