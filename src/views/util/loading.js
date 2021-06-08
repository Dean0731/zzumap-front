export function loadingFullScreen(vue, text) {
  return vue.$loading({
    lock: true,
    text: text || 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
