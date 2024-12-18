import { configureStore } from "@reduxjs/toolkit";
import { objetosApi } from "./apiSlice";
import { busqueda } from "./appSlice";

export const store = configureStore({
    reducer: {
        [objetosApi.reducerPath]: objetosApi.reducer,
        criterio: busqueda.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(objetosApi.middleware)
})