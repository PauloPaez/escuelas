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
    mes: z.string().min(1, "Seleccione un mes"),
})

export function CriterioBusqueda() {
    const dispatch = useDispatch()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            escuela: "",
            direccion: "",
            mes: new Date().toISOString().slice(0, 7),
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        dispatch(setCriterio(values))
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
                <div className="flex justify-around max-w-5xl mx-auto space-x-4">
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
                                        type="month"
                                        placeholder="Mes"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="bg-naranjaPrincipal" type="submit">Buscar</Button>
                </div>
            </form>
        </Form>
    )
}

