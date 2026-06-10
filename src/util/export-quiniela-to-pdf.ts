import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { COUNTRIES } from '../constants/countries.constants';

interface ExportData {
    quiniela: any;       // Tu modelo QuinielaModel (con los partidos de la fase actual)
    pronosticos: any[];  // El arreglo de todos los pronósticos recopilados para esta quiniela
    usuarios: any[];     // Lista de usuarios asignados a la quiniela
}

const nombreEquipo = (FIFA: string) => COUNTRIES.find(c => c.fifa === FIFA)?.nombreES;

export const exportQuinielaToPDF = ({ quiniela, pronosticos, usuarios }: ExportData) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
    });

    const fechaReporte = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
    const faseFiltrada = quiniela.faseActual;

    // --- ENCABEZADO DEL DOCUMENTO ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41); // Gris oscuro
    doc.text("QUINIELAPP - REPORTE DE RESPALDO", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125); // Gris claro
    doc.text(`Quiniela: ${quiniela.nombre}`, 14, 27);
    doc.text(`Fase Activa: ${faseFiltrada}`, 14, 32);
    doc.text(`Fecha del Reporte: ${fechaReporte}`, 14, 37);
    doc.text("Nota: Este documento sirve como testigo de los pronósticos bloqueados antes del inicio de la jornada.", 14, 42);

    // Línea divisoria decorativa
    doc.setDrawColor(0, 123, 255); // Azul primario
    doc.setLineWidth(1);
    doc.line(14, 46, 202, 46);

    let currentY = 52;

    // Filtrar partidos que pertenezcan a la fase actual
    const partidosFase = quiniela.partidos.filter((p: any) => p.fase === faseFiltrada);

    if (partidosFase.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.text("No hay partidos registrados o activos para esta fase.", 14, currentY);
        doc.save(`Respaldo_${quiniela.nombre.replace(/\s+/g, '_')}_${faseFiltrada}.pdf`);
        return;
    }

    // --- GENERAR TABLA POR CADA PARTIDO ---
    partidosFase.forEach((partido: any, index: number) => {
        // Verificar si nos estamos quedando sin espacio en la página actual para el siguiente bloque
        if (currentY > 230) {
            doc.addPage();
            currentY = 20; // Reiniciar margen superior en la nueva hoja
        }

        // Título del Partido
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 123, 255);
        doc.text(`PARTIDO ${index + 1}: ${nombreEquipo(partido.local)} vs ${nombreEquipo(partido.visitante)}`, 14, currentY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(108, 117, 125);
        doc.text(`Fecha del juego: ${new Date(partido.fecha).toLocaleDateString('es-MX')}`, 14, currentY + 5);

        // Construir las filas de la tabla cruzando usuarios con sus predicciones correspondientes
        const tableRows = usuarios.map((usr: any) => {
            // Buscar el documento de pronósticos de este usuario específico
            const pronosticoUsuario = pronosticos.find((pr: any) => pr.usuario._id === usr._id || pr.usuario === usr._id);

            // Buscar la predicción exacta para este partido dentro del arreglo de predicciones
            const prediccionPartido = pronosticoUsuario?.predicciones?.find(
                (pred: any) => pred.partidoId.toString() === partido._id.toString()
            );

            // Si el usuario no cargó nada, mostrar guiones
            const golesL = prediccionPartido?.golesLocal !== undefined ? prediccionPartido.golesLocal : '-';
            const golesV = prediccionPartido?.golesVisitante !== undefined ? prediccionPartido.golesVisitante : '-';

            return [
                `${usr.nombre} ${usr.apellidos}`,
                usr.correo,
                `${golesL}  -  ${golesV}`
            ];
        });
        // Renderizar la tabla de comparativa para el partido actual
        autoTable(doc, {
            startY: currentY + 8,
            head: [['Jugador', 'Correo Electrónico', 'Pronóstico']],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [52, 58, 64], fontStyle: 'bold', fontSize: 9 }, // Tabla estilo oscuro elegante
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 75 },
                2: { cellWidth: 43, halign: 'center', fontStyle: 'bold' } // Resaltar el marcador en negritas
            },
            margin: { left: 14, right: 14 },
            didDrawPage: (data) => {
                // Actualizar la coordenada Y actual donde terminó la tabla para que la siguiente no se empalme
                currentY = data.cursor ? data.cursor.y + 12 : currentY + 30;
            }
        });
    });

    // --- NÚMERO DE PÁGINAS (PIE DE PÁGINA) ---
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text(
            `Página ${i} de ${totalPages}`,
            doc.internal.pageSize.getWidth() - 25,
            doc.internal.pageSize.getHeight() - 10
        );
        doc.text(
            "QuinielApp - Copia de seguridad oficial e inalterable.",
            14,
            doc.internal.pageSize.getHeight() - 10
        );
    }

    // Descargar el archivo terminado
    doc.save(`Respaldo_${quiniela.nombre.replace(/\s+/g, '_')}${faseFiltrada !== 'NINGUNA' ? `_${faseFiltrada}` : ''}.pdf`);
};