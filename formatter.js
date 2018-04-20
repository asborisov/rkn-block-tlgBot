const getSign = value => value ? (value > 0 ? '+' : '-') : '';

module.exports = {
    formatRkn: (value) => value ? `Currently blocked: ${value.value}${value.diff ? `, diff: ${getSign(value.diff)}${value.diff}` : ''}` : ''
};