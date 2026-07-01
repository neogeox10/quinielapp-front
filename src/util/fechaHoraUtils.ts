import { meses } from "./meses";

export const fechaHora = (date: string) => {
    const fecha = new Date(date);
    return `${fecha.getUTCDate().toString().padStart(2,'0')} / ${meses[fecha.getMonth()].short} / ${fecha.getFullYear()} ${fecha.getUTCHours().toString().padStart(2,'0')}:${fecha.getUTCMinutes().toString().padStart(2,'0')}`;
};

export const fechaHoraExacta = (date: string) => {
    const fecha = new Date(date);
    return `${fecha.getUTCDate().toString().padStart(2,'0')}/${meses[fecha.getMonth()].short}/${fecha.getFullYear()} ${fecha.getUTCHours().toString().padStart(2,'0')}:${fecha.getUTCMinutes().toString().padStart(2,'0')}:${fecha.getUTCSeconds().toString().padStart(2,'0')}.${fecha.getUTCMilliseconds().toString().padEnd(3,'0')}`;
};