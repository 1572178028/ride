export default [
  {
    id: "westlake-research",
    region: "westlake",
    title: "西湖外围研究预览 · 免费停车待核查",
    distance: 15.2,
    shape: "外围道路参考",
    research: true,
    stops: [
      {
        name: "北山街方向",
        point: [120.1476357, 30.2616005],
      },
      {
        name: "南山路方向",
        point: [120.1528705, 30.239921],
      },
      {
        name: "杨公堤方向",
        point: [120.1241783, 30.2450109],
      },
      {
        name: "北山街西段",
        point: [120.1279349, 30.2550329],
      },
    ],
    supply: [],
    food: [],
    mapWater: {
      name: "西湖",
      point: [120.14, 30.245],
    },
  },
  {
    id: "jiapu-research",
    region: "jiapu",
    title: "夹浦滨湖大道南段研究 · 停车接驳待核查",
    distance: 12.8,
    shape: "原路往返",
    research: true,
    stops: [
      {
        name: "滨湖大道辅道南段",
        point: [119.9795774, 31.0617466],
      },
      {
        name: "夹浦南侧道路折返",
        point: [119.9425577, 31.1077907],
      },
    ],
    supply: [],
    food: [],
    mapWater: {
      name: "太湖",
      point: [119.968, 31.098],
    },
  },
  {
    id: "didang-research",
    region: "didang",
    research: true,
    title: "迪荡湖西南外围公共道路 · 停车接驳待核",
    distance: 5.4,
    shape: "往返环路",
    stops: [
      {
        name: "西南外围研究起点",
        point: [120.6018802, 30.0125579],
      },
      {
        name: "西施山路与迪荡湖路",
        point: [120.5959341, 30.011846],
      },
      {
        name: "迪荡湖路中段",
        point: [120.6014004, 30.0201571],
      },
      {
        name: "返回研究起点",
        point: [120.6018802, 30.0125579],
      },
    ],
    food: [],
    supply: [],
    mapWater: {
      name: "迪荡湖",
      point: [120.605, 30.017],
    },
  },
  {
    id: "eastlake-connection-research",
    region: "eastlake-connection",
    research: true,
    title: "东湖南侧道路 · 辅路缺口待补",
    distance: 3.2,
    shape: "研究往返",
    stops: [
      {
        name: "东湖路/人民东路",
        point: [120.6386819, 29.9961021],
      },
      {
        name: "湖山北路路口",
        point: [120.6337598, 29.9988155],
      },
      {
        name: "敬宾路北端研究折返点",
        point: [120.6341371, 30.0036195],
      },
      {
        name: "返回湖山北路",
        point: [120.6337598, 29.9988155],
      },
      {
        name: "返回东湖路",
        point: [120.6386819, 29.9961021],
      },
    ],
    food: [],
    supply: [],
  },
];
