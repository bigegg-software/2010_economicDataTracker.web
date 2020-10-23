import html2canvas from 'html2canvas'

export const getImageDataUrl = async (html) => {
  window.pageYoffset = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  let canvas = await new html2canvas(document.querySelector(html), {
    backgroundColor: "transparent",
    allowTaint: true,
    useCORS: true,
    scale: window.devicePixelRatio,
    dpi: 500
  })
  return canvas.toDataURL("image/png", 1.0)
}
