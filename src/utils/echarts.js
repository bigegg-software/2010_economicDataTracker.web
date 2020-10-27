export const fontSize = (res = 0.16) => {
  let
    clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (!clientWidth) return;
  let fontSize = 100 * (clientWidth / 1920);
  return res * fontSize;
}

export const objArrtransArr=(arr, oldname, oldnum)=> {
  // nameArr内部存储柱状图y轴名称信息
  var nameArr = [];
  //numArr为柱状图serice的data数据
  var numArr = [];
  arr.forEach(item => {
    nameArr.push(item[oldname]);
    numArr.push(item[oldnum]);
  });
  return { nameArr, numArr };
}