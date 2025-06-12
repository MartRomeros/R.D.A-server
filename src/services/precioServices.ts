const pesosChilenos = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
})

export const formatearMonto = (monto: number) => {
    const valorFormateado = pesosChilenos.format(monto)
    return `${valorFormateado} CLP`
}