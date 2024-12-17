import { FacebookIcon, InstagramIcon, InstitucionalIcon, LogoSanJuanGob, XIcon, YoutubeIcon } from "./icons";

export default function Footer() {
    return (
        <footer className="flex flex-col justify-around items-start gap-2 px-2 py-4 bg-grisPrincipal md:flex-row md:px-20">
            <div className="flex flex-col justify-center items-center">
                <LogoSanJuanGob height={57} width={144} fill="#ffffff" />
                <img src="/img/Frame- Escudo SJ.svg" alt="Logo San Juan Gobierno" className="h-20 brightness-200 mt-2" />
            </div>
            <div className="flex gap-4 justify-center items-center">
                <InstitucionalIcon size={40} className="hidden md:block" />
                <ul className="flex flex-col gap-1 text-white">
                    <li>
                        <p>
                            Casa de Gobierno de la Provincia de San Juan
                        </p>
                    </li>
                    <li>
                        <p>Paula Albarracín de Sarmiento 134 norte | C.P: 5400 | San Juan | Argentina</p>
                    </li>
                    <li>
                        <p>Privado: (0264) 430 6848</p>
                    </li>
                    <li>
                        <p>Conmutador: (0264) 429-5000</p>
                    </li>
                    <li>
                        <p>FAX: (0264) 423-7333</p>
                    </li>
                    <li>
                        <p>Centro Cívico</p>
                    </li>
                    <li>
                        <p>
                            Avenida Libertador General San Martín 750 Oeste | C.P: 5400 | San Juan | Argentina
                        </p>
                    </li>
                </ul>
            </div>
            <div >
                <ul className="flex gap-4 justify-center items-center">
                    <li>
                        <FacebookIcon size={27} />
                    </li>
                    <li>
                        <XIcon size={27} />
                    </li>
                    <li>
                        <InstagramIcon size={27} />
                    </li>
                    <li>
                        <YoutubeIcon size={27} />
                    </li>
                </ul>
            </div>
        </footer>
    )
}
