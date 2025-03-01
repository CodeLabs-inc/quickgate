function emailVerificationCodegen() {
    const dataset = '0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += dataset[Math.floor(Math.random() * dataset.length)];
    }
    return code;
}

module.exports = emailVerificationCodegen;