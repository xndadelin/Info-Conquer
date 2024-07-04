export const getStatusColor = (status) => {
    if (status === 'Accepted') {
        return 'success'
    }
    if (status.includes('WA')) {
        return 'danger'
    }
    if (status.includes('TLE') || status.includes('MLE')) {
        return 'warning'
    }
}