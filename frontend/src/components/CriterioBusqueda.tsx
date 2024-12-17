"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDispatch } from "react-redux"
import { setCriterio } from "../store/appSlice"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    escuela: z.string().min(1, "Seleccione una escuela"),
    direccion: z.string().min(1, "Ingrese una dirección"),
    mes: z.coerce.number().min(1).max(12, "Mes inválido"),
    anio: z.coerce.number().min(2000).max(2100, "Año inválido"),
})

export function CriterioBusqueda() {
    const dispatch = useDispatch()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            escuela: "",
            direccion: "",
            mes: undefined,
            anio: undefined,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        dispatch(setCriterio(values))
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex space-x-4">
                    <FormField
                        control={form.control}
                        name="escuela"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Escuela" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Rivadavia">Rivadavia</SelectItem>
                                        <SelectItem value="San Martin">San Martin</SelectItem>
                                        <SelectItem value="Belgrano">Belgrano</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="direccion"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Dirección" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mes"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Mes"
                                        {...field}
                                        min={1}
                                        max={12}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="anio"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Año"
                                        {...field}
                                        min={2000}
                                        max={2100}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Buscar</Button>
                </div>
            </form>
        </Form>
    )
}

