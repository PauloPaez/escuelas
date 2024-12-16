import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const objetosApi = createApi({
    reducerPath: "objetosApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/" }),
    tagTypes: ['Planillas'], // Define tus tagTypes aquí
    endpoints: (builder) => ({
        getPlanillasMensuales: builder.query({
            query: ({ mes, anio, escuela, direccion }) => `planillas/${mes}/${anio}/${escuela}/${direccion}`,
            providesTags: ['Planillas'], // Asocia esta consulta con el tag 'Planillas'  
        }),
        savePlanilla: builder.mutation({
            query: (planilla) => ({
                url: '/planillas',
                method: 'POST',
                body: planilla,
            }),
            invalidatesTags: ['Planillas'],
        }),
    })
});

export const {
    useGetPlanillasMensualesQuery,
    useSavePlanillaMutation
} = objetosApi;