const tarifa = parseInt(process.env.TARIFA!) || 2450

export const traerHorasTotalesArea = (actividades: any[]) => {
    let montoDifusion: number = 0
    let montoExtension: number = 0
    let montoComunicacion: number = 0
    let montoDesarrolloLaboral: number = 0

    let horasDesarrolloLaboral: number = 0
    let horasDifusion: number = 0
    let horasExtension: number = 0
    let horasComunicacion: number = 0

    actividades.forEach((actividad) => {
        switch (actividad.area_trabajo.id) {
            case 1:
                const inicioD = actividad.hora_inic_activdad;
                const terminoD = actividad.hora_term_actividad;
                if (inicioD && terminoD) {
                    horasDifusion += ((terminoD.getTime() - inicioD.getTime()) / (1000 * 60) / 60);
                    montoDifusion += Math.round(horasDifusion * tarifa)
                }
                break;
            case 2:
                const inicioE = actividad.hora_inic_activdad;
                const terminoE = actividad.hora_term_actividad;
                if (inicioE && terminoE) {
                    horasExtension += ((terminoE.getTime() - inicioE.getTime()) / (1000 * 60) / 60);
                    montoExtension += Math.round(horasExtension * tarifa)
                }
                break;
            case 3:
                const inicioC = actividad.hora_inic_activdad;
                const terminoC = actividad.hora_term_actividad;
                if (inicioC && terminoC) {
                    horasComunicacion += ((terminoC.getTime() - inicioC.getTime()) / (1000 * 60) / 60);
                    montoComunicacion += Math.round(horasComunicacion * tarifa)
                }
                break;
            case 4:
                const inicioDL = actividad.hora_inic_activdad;
                const terminoDL = actividad.hora_term_actividad;
                if (inicioDL && terminoDL) {
                    horasDesarrolloLaboral += ((terminoDL.getTime() - inicioDL.getTime()) / (1000 * 60) / 60);
                    montoDesarrolloLaboral += Math.round(horasDesarrolloLaboral * tarifa)
                }
                break;
            default:
                break;
        }
    })

    return [
        { area: 'Comercial', horasRealizadas: horasDifusion, totalAcumulado: montoDifusion, responsable: 'Estrella Vera' },
        { area: 'Comercial', horasRealizadas: horasExtension, totalAcumulado: montoExtension, responsable: 'Luisa Gamboa' },
        { area: 'Comercial', horasRealizadas: horasComunicacion, totalAcumulado: montoComunicacion, responsable: 'Carlos Contreras' },
        { area: 'Punto Estudiantil', horasRealizadas: horasDesarrolloLaboral, totalAcumulado: montoDesarrolloLaboral, responsable: 'Ramón Griñen' },
    ].filter(item => item.horasRealizadas > 0 && item.totalAcumulado > 0);

}

export const traerHorasTotalesMes = (actividades: any[]) => {
    let horasTotales: number = 0
    let montoTotal: number = 0

    actividades.forEach((actividad) => {
        const inicioDL = actividad.hora_inic_activdad;
        const terminoDL = actividad.hora_term_actividad;
        if (inicioDL && terminoDL) {
            horasTotales += ((terminoDL.getTime() - inicioDL.getTime()) / (1000 * 60) / 60);
            montoTotal += Math.round(horasTotales * tarifa)
        }
    })

    return { horasTotales, montoTotal }

}