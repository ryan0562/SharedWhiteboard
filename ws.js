const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

let drawings = []; // 存储绘制数据的数组
let mousePoints = {} // 存储鼠标坐标
let steps = []; //存储步奏


wss.on('connection', (ws) => {
  // 初始化时返回步奏，给与绘制
  const init = { type: 'steps', data: steps }
  ws.send(JSON.stringify(init));

  ws.on('error', console.error);

  ws.on('message', function message(message) {
    const data = message.toString()
    const parseData = JSON.parse(message.toString());
    wss.clients.forEach((client)=> {
      if (client.readyState === WebSocket.OPEN) {
        switch (parseData.type) {
          // 实时绘画
          case 'draw':
            drawings.push(parseData);
            client.send(data);
            break;
          // 存储步奏
          case 'steps':
            steps.push(parseData.data);
            break;
          // 实时鼠标点位
          case 'mousePoint':
            mousePoints[parseData.name] = parseData.pos;
            client.send(mousePoints);
            break;
          default:
            break;
        }

      }
    });









  });


  // 
});


/* 数据结构 */
// type steps:{
//   type:'steps',
//   data:[
//     {
//       type:'draw',
//       data:pot
//     },
//     {
//       type:'image',
//       data:pot
//     },
//     ...
//   ]
// }