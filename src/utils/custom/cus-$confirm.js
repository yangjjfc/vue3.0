const confirmOptions = {
    content: '', // 内容
    tips: '提示',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showCancelButton: true,
    center: true
};

export default (self) => (options) => new Promise((resolve, reject) => {
    options = { ...confirmOptions, ...options };
    let { confirmButtonText, cancelButtonText, showCancelButton, type, center } = options;
    self.$confirm(options.content, options.tips, {
        confirmButtonText,
        cancelButtonText,
        showCancelButton,
        type,
        center
    }).then(() => {
        resolve();
    }).catch(() => {
        reject();
    });
});