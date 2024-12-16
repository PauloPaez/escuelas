import { createSlice } from "@reduxjs/toolkit";

export const busqueda = createSlice({
    name: "criterio",
    initialState:{
        filtro:{}
    },
    reducers: {
        setCriterio: (state, action) => {
            state.filtro = { ...state.filtro, ...action.payload }
        },
    }
});
export const { setCriterio } = busqueda.actions;




