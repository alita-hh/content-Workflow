/** 雷达条目：按日历日期 date（YYYY-MM-DD）筛选 */
export const radarHotspots = [
  {
    id: "hotspot-1",
    date: "2026-04-10",
    category: "产业快讯",
    theme: "智谱 API 全线降价，大模型价格战打响",
    sector: "科技板块",
    summary:
      "多家厂商同步下调模型调用价格，行业竞争重心从参数规模转向推理成本和商业落地效率，科技板块情绪被明显激活。",
    outline:
      "1）背景：大模型 API 降价潮与商业策略调整。\n2）产业链：算力与应用端成本曲线、订单与毛利影响。\n3）市场：科技板块情绪与成交额变化、短线交易关注点。\n4）风险：竞争加剧、业绩兑现节奏不确定。"
  },
  {
    id: "hotspot-2",
    date: "2026-04-10",
    category: "资金流向",
    theme: "北向资金午后回流，新能源链条成交额显著放大",
    sector: "新能源",
    summary:
      "盘中资金风格出现切换，北向资金回补带动新能源方向放量，短线关注成交持续性与业绩兑现窗口。",
    outline:
      "1）盘面：北向净流入时段与结构。\n2）板块：新能源链条放量品种与龙头表现。\n3）逻辑：资金回补驱动 vs 基本面催化。\n4）跟踪：后续成交持续性、季报窗口。"
  },
  {
    id: "hotspot-3",
    date: "2026-04-10",
    category: "资产配置",
    theme: "国债收益率震荡下行，红利低波资产关注度持续升温",
    sector: "红利低波",
    summary:
      "长端利率回落强化防御型资产配置逻辑，红利低波策略关注度提升，机构更偏好现金流稳定与高分红标的。",
    outline:
      "1）利率：长端收益率走势与驱动因素。\n2）策略：红利低波的配置逻辑与适用环境。\n3）资产：高股息与现金流稳定标的筛选维度。\n4）风险：风格切换、盈利下滑对分红的冲击。"
  },
  {
    id: "hotspot-4",
    date: "2026-04-09",
    category: "全球宏观",
    theme: "美联储官员释放鹰派信号，全球风险资产波动率抬升",
    sector: "全球宏观",
    summary:
      "隔夜海外利率预期反复，跨境资金流向出现再平衡，A股与港股高估值赛道短线承压，关注政策对冲节奏。",
    outline:
      "1）海外：联储表态与利率路径预期变化。\n2）传导：汇率、风险偏好与跨境资金。\n3）市场：AH 高估值赛道波动特征。\n4）对冲：国内政策与流动性预期线索。"
  },
  {
    id: "hotspot-5",
    date: "2026-04-05",
    category: "宏观数据",
    theme: "制造业 PMI 回升至扩张区间，工业金属期货集体走强",
    sector: "周期股",
    summary:
      "景气指标改善提振周期板块风险偏好，铜铝等品种联动上行，后续需结合库存与出口订单验证持续性。",
    outline:
      "1）数据：PMI 分项与扩张含义。\n2）商品：工业金属期货联动与库存位置。\n3）权益：周期板块估值与资金行为。\n4）验证：出口订单、库存周期与后续景气跟踪。"
  }
];

export const collectionViralPosts = [
  {
    id: "post-1",
    title: "红利低波还能不能上车？三张图看懂当下窗口期",
    platform: "微信公众号",
    likes: "2.4w"
  },
  {
    id: "post-2",
    title: "银行股再创新高，A股稳健资金正在买什么",
    platform: "小红书",
    likes: "1.8w"
  },
  {
    id: "post-3",
    title: "从利率到估值：高股息策略的下一步分化逻辑",
    platform: "今日头条",
    likes: "9.6k"
  }
];

export const collectionCrawlResults = [
  "已完成：泽平宏观（近 30 篇）",
  "已完成：财经林园（近 24 篇）",
  "进行中：价值捕手（已抓取 12/30）"
];

export const styleLabXhsMock = {
  imagePrompt:
    "封面图风格：蓝白金融图表背景 + 轻科技发光线条；主体标题 9-12 字，突出“机会/风险”；整体对比度高，适合小红书信息流首屏。",
  contentPrompt:
    "正文风格：短句分点 + emoji 引导 + 结论先行。每段 1-2 句，节奏快，强调“可执行清单”。结尾统一使用 #A股 #投资搞钱 #科技板块。"
};

export const styleLabWechatMock = {
  titlePrompt:
    "标题生成规则：宏观变量 + 市场动作 + 操作问题句，例如《利率边际回落后，红利低波还能继续跑赢吗？》",
  outlinePrompt:
    "内容框架：1) 今日关键数据；2) 资金与估值映射；3) 交易策略与风险提示。每节前置一句结论，后跟 2-3 条证据。",
  bodyPrompt:
    "正文风格：中长段分析，强调因果链。避免口语化和情绪词，统一使用“数据-逻辑-结论”结构，并在末尾附合规免责声明。"
};

export const styleGenes = [
  {
    id: "gene-1",
    styleName: "泽平宏观",
    platform: "公众号",
    note: "重宏观数据，爱用排比句",
    wechatOutlinePrompt: "框架固定：宏观数据变化 -> 资金传导 -> 行业映射 -> 风险提示。",
    wechatBodyPrompt: "正文强调数据证据与因果链条，段落偏中长，结尾增加执行清单与免责声明。",
    updatedAt: "2026-04-09 16:45"
  },
  {
    id: "gene-2",
    styleName: "价值捕手",
    platform: "小红书",
    note: "偏产业链验证，喜欢先结论后拆解",
    xhsImagePrompt: "封面用红蓝撞色 K 线图 + 大字标题，营造强结论冲击感。",
    xhsContentPrompt: "正文先给结论，再用 3 条 bullet 拆估值、资金流、催化剂，结尾带行动建议。",
    updatedAt: "2026-04-08 21:10"
  },
  {
    id: "gene-3",
    styleName: "低波研习社",
    platform: "小红书",
    note: "稳健风格，常用历史区间对比",
    xhsImagePrompt: "封面以蓝白低饱和图表底图为主，标题强调“稳健”“低波”。",
    xhsContentPrompt: "内容突出历史分位、回撤控制、持仓节奏，emoji 使用克制。",
    updatedAt: "2026-04-07 10:22"
  },
  {
    id: "gene-4",
    styleName: "宏观交易笔记",
    platform: "公众号",
    note: "强调政策脉络，框架化拆解",
    wechatOutlinePrompt: "结构分为政策信号、资产定价路径、行业优先级、风险场景。",
    wechatBodyPrompt: "正文偏研究报告风，减少口语词，重点写清“政策-盈利-估值”三段映射。",
    updatedAt: "2026-04-06 09:18"
  }
];

export const matrixSelectedHotspot = "智谱 API 全线降价，大模型价格战打响";

export const MATRIX_TOPIC_STORAGE_KEY = "matrix:selectedTopic";

export const matrixGeneOptions = ["泽平宏观", "宏观交易笔记"];

export const matrixWechatPreview = {
  title: "AI 价格战升温：科技板块如何在波动中找确定性",
  intro:
    "今日热点聚焦“智谱 API 全线降价”，大模型商业化竞争进入成本与效率并重阶段。对二级市场而言，这意味着算力与应用两端的估值锚正在重估。",
  points: [
    "第一，模型价格下探将加速推理调用规模扩张，利好具备稳定云资源与客户触达能力的平台型公司。",
    "第二，产业链利润分配可能从“参数规模竞赛”转向“场景落地效率”，应用层边际改善值得跟踪。",
    "第三，短期交易层面建议关注成交额与北向资金共振信号，避免追涨高波动标的。"
  ],
  risk: "标准合规免责声明：市场有风险，投资需谨慎。本内容仅供学习交流，不构成任何投资建议。"
};

export const matrixXhsPreview = {
  title: "AI价格战来了，普通人怎么跟上机会？",
  coverLabel: "AI 生成专业图表背景（预览）",
  body: [
    "📌 今天最炸裂的财经热点：智谱 API 全线降价！",
    "📈 这意味着什么？模型调用门槛下降，应用爆发窗口可能提前。",
    "🧠 投资视角别只盯概念，要看谁真的有现金流和订单承接能力。",
    "✅ 我的跟踪清单：算力成本、平台调用量、产业链业绩兑现。"
  ],
  tags: ["#A股", "#投资搞钱", "#科技板块", "#AI算力"]
};
