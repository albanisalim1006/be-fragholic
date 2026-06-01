//biar format response nya konsisten di semua endpoint
const response = (statusCode, message, data = null) => {
    return { statusCode, message, data }
}

module.exports = { response }