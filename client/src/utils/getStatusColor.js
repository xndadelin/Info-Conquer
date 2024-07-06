export const getStatusColor = (status) => {
    if(!status) return ''
    if (status === 'Accepted' || status == 'AC') {
        return 'success'
    }
    if (status.includes('WA')) {
        return 'danger'
    }
    if (status.includes('TLE') || status.includes('MLE')) {
        return 'warning'
    }
}