import { PlanillaDocentes } from "@/components/PlanillaDocentes";


export default function Home() {
  return (
    <section className="w-full flex flex-col">
      <section className="h-[140px] relative w-full flex justify-center px-12 sm:px-20 md:px-32 lg:px-[222px] bg-naranjaPrincipal -z-10"></section>
      <section className="mt-[-70px] flex w-full justify-center px-4 sm:px-20 md:px-32 lg:px-[120px] max-w-[1600px] mx-auto">
        <div className="w-full bg-white border-2 px-6 md:px-10 lg:px-32 py-9 flex flex-col rounded-lg shadow-md">
          <h1 className="flex-grow-0 flex-shrink-0 text-2xl md:text-3xl font-bold text-center text-grisPrincipal">
            Asistencia mensual
          </h1>
        </div>
      </section>
      <div className="container mx-auto px-4 mt-7">
        <PlanillaDocentes />
      </div>
    </section>
  );
}
