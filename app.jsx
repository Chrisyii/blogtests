import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { ArrowRight, Github, Twitter, Instagram, Mail, Sparkles, Code, Coffee, Terminal, ExternalLink, ChevronDown, BookOpen, Zap, ArrowLeft, Clock, Hash, Layers, Cpu, Globe, MapPin, Camera, Play, Database, Wifi, Box } from 'lucide-react';

// --- 全局配置 ---
const IMAGES = {
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200", 
  post1: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200", 
  post2: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200", 
  post3: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200", 
  project1: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200", // Nebula - Abstract fluid
  project2: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1200", // Zenith - Minimal desk
  project3: "https://images.unsplash.com/photo-1614728263952-84ea2563bc10?auto=format&fit=crop&q=80&w=1200", // Vortex - Particles
};

// 模拟胶片噪声纹理
const NoiseOverlay = () => (
  <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04] mix-blend-overlay"
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
  />
);

// --- 核心组件库 ---

const MagneticButton = ({ children, className = "", onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const center = { x: left + width / 2, y: top + height / 2 };
    x.set((clientX - center.x) * 0.35);
    y.set((clientY - center.y) * 0.35);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.button>
  );
};

function Spotlight({ children, className = "", onClick, delay = 0, image }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onClick={onClick}
      className={`group relative border border-white/5 bg-slate-900/40 overflow-hidden backdrop-blur-sm ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {image && (
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-slate-950/60 z-10 transition-opacity group-hover:opacity-40 duration-500" />
            <img src={image} alt="" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 ease-out" />
        </div>
      )}

      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-20"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              500px circle at ${mouseX}px ${mouseY}px,
              rgba(124, 58, 237, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full z-20">{children}</div>
      
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30"
        style={{
            background: useMotionTemplate`
              radial-gradient(
                500px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 40%
              )
            `,
            maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
            maskClip: 'content-box, border-box',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px'
          }}
      />
    </motion.div>
  );
}

// --- 数据模型 (Posts & Projects) ---

const POSTS = [
  {
    id: 1,
    date: "2024.05.15",
    category: "Engineering",
    image: IMAGES.post1,
    title: "重构的艺术：代码的诗意与留白",
    desc: "代码不仅仅是给机器执行的指令，更是写给人类阅读的文学。",
    readTime: "8 min",
    content: (
      <>
        <p className="lead text-xl md:text-2xl leading-relaxed text-slate-300 mb-8 font-serif italic border-l-4 border-purple-500 pl-6">
          “混乱是阶梯，但在软件工程中，混乱只是单纯的混乱。它不仅吞噬性能，更吞噬灵魂。”
        </p>
        <p className="text-lg text-slate-300 mb-8 first-letter:text-5xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left">
          记得刚入行那会儿，我总是痴迷于写出那种“看起来很厉害”的代码。一行里面塞进三个三元运算符，仿佛只有这样才能证明我驾驭了机器。但现在我意识到，代码是写给人看的。
        </p>
        <h3 className="text-2xl font-bold text-white mt-12 mb-6">熵增定律与代码腐烂</h3>
        <p className="text-lg text-slate-300 mb-6">
          在一个封闭的系统中，如果没有任何外力做功，熵（混乱度）总是趋于增加的。每当我们为了赶进度而写下一个 <code>// TODO: fix this later</code>，我们就在向未来借债。
        </p>
        <p className="text-lg text-slate-300 mb-8">
          重构，就是对抗熵增的过程。好的代码应该像一篇逻辑严密又文笔优美的散文，每一个函数名都是精准的动词，每一个变量都是恰当的名词。
        </p>
      </>
    )
  },
  {
    id: 2,
    date: "2024.04.28",
    category: "Design System",
    image: IMAGES.post2,
    title: "虚无与存在：暗黑模式设计论",
    desc: "不仅仅是反转颜色。深入解析色彩语义与层级深度。",
    readTime: "12 min",
    content: <><p className="text-lg text-slate-300 mb-6">内容填充...</p></>
  },
  {
    id: 3,
    date: "2024.04.10",
    category: "Thoughts",
    image: IMAGES.post3,
    title: "数字游民的孤独与自由",
    desc: "在巴厘岛的咖啡馆写代码，在东京的深夜修 Bug。",
    readTime: "6 min",
    content: <><p className="text-lg text-slate-300 mb-6">内容填充...</p></>
  }
];

const PROJECTS = [
  {
    id: 1,
    title: "Nebula UI",
    category: "Open Source",
    image: IMAGES.project1,
    desc: "一个试图反叛 Material Design 的组件库。拒绝平庸的过渡动画，追求符合物理直觉的交互触感。",
    tags: ["React", "Framer Motion", "Design System"],
    github: "github.com/alex/nebula-ui",
    demo: "nebula.lumina.dev",
    content: (
      <>
        <p className="text-lg text-slate-300 mb-8 first-letter:text-5xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left">
          我对市面上的 UI 组件库一直有种莫名的抵触。它们太“稳”了，稳到无聊。点击一个按钮，它只是简单地变色；打开一个模态框，它只是线性地淡入。但在真实世界里，没有东西是线性运动的。
        </p>
        <p className="text-lg text-slate-300 mb-8">
           Nebula UI 的诞生源于我的一次执念：我想让网页上的元素拥有“质量”和“摩擦力”。
        </p>

        <h3 className="text-2xl font-bold text-white mt-12 mb-6">弹簧物理学</h3>
        <p className="text-lg text-slate-300 mb-6">
           我抛弃了传统的 CSS 贝塞尔曲线，全面拥抱了弹簧物理（Spring Physics）。当你的鼠标划过卡片时，它的回弹不应该是一个固定的时间，而应该取决于你滑动的速度。这多出的几毫秒计算，换来的是那种“跟手”的微妙快感。
        </p>
        <div className="bg-slate-900 p-6 rounded-xl border border-white/10 my-8 font-mono text-sm text-slate-400">
           &lt;MotionConfig transition=&#123;&#123; type: "spring", stiffness: 400, damping: 30 &#125;&#125;&gt;<br/>
           &nbsp;&nbsp;...<br/>
           &lt;/MotionConfig&gt;
        </div>

        <h3 className="text-2xl font-bold text-white mt-12 mb-6">无障碍的妥协与坚持</h3>
        <p className="text-lg text-slate-300 mb-6">
           为了追求极致的视觉效果，很容易牺牲掉可访问性（A11y）。但在 Nebula 中，我强迫自己遵守 WAI-ARIA 标准。因为最酷的科技，应该是对所有人包容的。我们实现了完整的键盘导航支持，甚至为了屏幕阅读器专门优化了动画的播报逻辑。
        </p>
      </>
    )
  },
  {
    id: 2,
    title: "Zenith Note",
    category: "SaaS Product",
    image: IMAGES.project2,
    desc: "为极简主义者打造的双向链接笔记应用。没有 AI 助手，没有团队协作，只有你和你的思想。",
    tags: ["Local-First", "Electron", "CRDTs"],
    github: "github.com/alex/zenith",
    demo: "zenith.app",
    content: (
      <>
         <p className="text-lg text-slate-300 mb-8 first-letter:text-5xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left">
           我的大脑并不像文件夹那样工作，它是网状的。A 想法会连接到 B 想法，尽管它们看起来毫无关联。这也是为什么我一直用不惯传统的层级式笔记软件。
         </p>
         <p className="text-lg text-slate-300 mb-8">
            市面上现在的笔记软件太“吵”了。一打开就是 AI 助手问你要不要自动生成摘要，要么就是弹窗提醒你某个同事修改了文档。Zenith Note 是我对这种“生产力噪音”的反击。
         </p>

         <h3 className="text-2xl font-bold text-white mt-12 mb-6">本地优先 (Local-First)</h3>
         <p className="text-lg text-slate-300 mb-6">
            我坚信你的思想属于你，而不属于亚马逊云服务（AWS）。Zenith 的数据完全存储在本地的 Markdown 文件中。你可以用任何文本编辑器打开它们。即使没有网络，即使 Zenith 这家公司倒闭了，你的笔记依然安然无恙。
         </p>

         <h3 className="text-2xl font-bold text-white mt-12 mb-6">同步的魔法：CRDT</h3>
         <p className="text-lg text-slate-300 mb-6">
            虽然数据在本地，但多端同步依然是刚需。为了解决冲突问题，我没有使用中心化的数据库锁，而是引入了 CRDT（无冲突复制数据类型）。这是一种数学上的魔法，让不同设备上的修改能够自动合并，就像水流汇入大海一样自然。
         </p>
      </>
    )
  },
  {
    id: 3,
    title: "Vortex Engine",
    category: "WebGL Experiment",
    image: IMAGES.project3,
    desc: "基于 Three.js 的流体模拟引擎。在浏览器中重现纳维-斯托克斯方程，只为了那一瞬的混沌之美。",
    tags: ["WebGL", "GLSL", "Three.js"],
    github: "github.com/alex/vortex",
    demo: "vortex.lumina.dev",
    content: (
      <>
         <p className="text-lg text-slate-300 mb-8 first-letter:text-5xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left">
            这是一个完全没有“商业价值”的项目。它不能提高生产力，也不能帮你赚钱。它存在的唯一意义，就是为了好看。
         </p>
         <p className="text-lg text-slate-300 mb-8">
            我对流体动力学一直很着迷。烟雾的缭绕，水流的湍急，这些混沌现象背后其实都有着严谨的数学公式——纳维-斯托克斯方程（Navier-Stokes equations）。我想在浏览器里运行它。
         </p>

         <h3 className="text-2xl font-bold text-white mt-12 mb-6">GPU 上的作画</h3>
         <p className="text-lg text-slate-300 mb-6">
            在 CPU 上计算几百万个粒子的运动是不可能的。所以我必须编写 GLSL 着色器代码，直接指挥显卡工作。这感觉不像是在写代码，更像是在用数学公式作画。你需要控制每个像素的颜色、速度、甚至它的“衰减率”。
         </p>
         
         <h3 className="text-2xl font-bold text-white mt-12 mb-6">不仅是炫技</h3>
         <p className="text-lg text-slate-300 mb-6">
            很多人问我做这个有什么用。我说，当你盯着屏幕上那些随着你鼠标流动的光点发呆时，那几秒钟的放空，就是它的用处。在这个焦虑的数字时代，我们需要一些无意义的美好。
         </p>
      </>
    )
  }
];

// --- 页面组件 ---

// 1. 首页 (Home) - 保持不变
const HomePage = ({ setPage, setPostId }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full"
    >
      {/* Hero */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[100px] animate-pulse duration-[10s]" />
            <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-blue-600/10 rounded-full blur-[100px] animate-pulse duration-[8s] delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-purple-300 text-xs font-mono mb-8 backdrop-blur-md"
            >
               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
               Open to new opportunities
            </motion.div>

            <motion.h1 
              style={{ y: y1, opacity }}
              className="text-6xl md:text-9xl font-bold text-white tracking-tighter mb-8 leading-[0.9] mix-blend-difference"
            >
              DIGITAL<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 font-serif italic pr-4">Gardener.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-xl mx-auto text-lg text-slate-400 leading-relaxed mb-12"
            >
              我是 <strong>Alex</strong>。在这个混乱的数字荒原中，我负责修剪代码的枝叶，灌溉设计的灵感，构建具有灵魂的数字体验。
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="flex justify-center gap-4"
            >
              <MagneticButton 
                onClick={() => setPage('projects')}
                className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors"
              >
                探索作品
              </MagneticButton>
              <MagneticButton 
                onClick={() => setPage('about')}
                className="px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/5 backdrop-blur-sm"
              >
                关于我
              </MagneticButton>
            </motion.div>
        </div>
        
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
        >
            <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-600 to-transparent" />
        </motion.div>
      </div>

      {/* Bento Grid Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
             <h2 className="text-3xl md:text-5xl font-bold text-white">思维碎片</h2>
             <p className="hidden md:block text-slate-500 font-mono text-sm">ARCHIVE 2024</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-5 h-auto md:h-[600px]">
            <Spotlight 
              onClick={() => { setPostId(POSTS[0].id); setPage('post'); }}
              image={IMAGES.post1}
              className="md:col-span-2 md:row-span-2 rounded-3xl p-8 flex flex-col justify-end shadow-2xl"
            >
               <div className="relative z-20">
                 <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500/80 text-white text-xs font-bold backdrop-blur-md">Feature</span>
                    <span className="text-slate-300 text-xs font-mono bg-black/50 px-2 py-1 rounded">{POSTS[0].date}</span>
                 </div>
                 <h3 className="text-3xl font-bold text-white mb-4 leading-tight drop-shadow-lg">{POSTS[0].title}</h3>
                 <p className="text-slate-200 line-clamp-2 drop-shadow-md text-sm md:text-base">{POSTS[0].desc}</p>
                 <div className="flex items-center gap-2 text-white mt-6 font-medium">
                    <span>阅读全文</span>
                    <ArrowRight size={16} />
                 </div>
               </div>
            </Spotlight>

            <Spotlight className="md:col-span-1 rounded-3xl p-6 bg-slate-900/50 flex flex-col justify-center items-center text-center">
               <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <Github size={24} />
               </div>
               <div className="text-3xl font-bold text-white mb-1">128</div>
               <div className="text-slate-500 text-xs uppercase tracking-wider">Commits</div>
            </Spotlight>

             <Spotlight className="md:col-span-1 rounded-3xl p-6 bg-slate-900/50 flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-slate-300 text-sm font-medium">Reading</span>
               </div>
               <div className="text-white font-serif italic">"The Pragmatic Programmer"</div>
               <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
                  <div className="w-[65%] h-full bg-green-500 rounded-full" />
               </div>
            </Spotlight>

            <Spotlight 
               onClick={() => { setPostId(POSTS[1].id); setPage('post'); }}
               className="md:col-span-2 rounded-3xl p-8 flex items-center justify-between group bg-slate-900/80"
               delay={0.1}
            >
               <div className="pr-4">
                  <div className="text-xs text-purple-400 font-mono mb-2">{POSTS[1].category}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{POSTS[1].title}</h3>
                  <p className="text-slate-400 text-sm max-w-xs line-clamp-2">{POSTS[1].desc}</p>
               </div>
               <div className="shrink-0 w-24 h-24 rounded-xl overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                  <img src={IMAGES.post2} alt="" className="w-full h-full object-cover" />
               </div>
            </Spotlight>
        </div>
      </section>
    </motion.div>
  );
};

// 2. 文章详情页 (Post Page)
const PostPage = ({ postId, setPage }) => {
  const post = POSTS.find(p => p.id === postId) || POSTS[0];
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="min-h-screen bg-slate-950 relative z-20 pb-20"
    >
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-purple-500 z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="h-[50vh] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-10" />
        <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-70" />
        
        <div className="absolute top-6 left-6 z-20">
             <button 
              onClick={() => setPage('home')}
              className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-md text-white text-sm border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Back
            </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 max-w-4xl mx-auto right-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 font-mono mb-4">
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/20">{post.category}</span>
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {post.readTime}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">{post.title}</h1>
            </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-12">
          <article className="prose prose-invert prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-p:leading-loose prose-img:rounded-2xl prose-img:shadow-xl">
             {post.content}
          </article>
      </div>
    </motion.div>
  );
};

// 3. 项目详情页 (New Project Detail Page)
const ProjectDetailPage = ({ projectId, setPage }) => {
  const project = PROJECTS.find(p => p.id === projectId) || PROJECTS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="min-h-screen bg-slate-950 relative z-20 pb-20"
    >
      {/* Back Button */}
      <div className="fixed top-24 left-6 z-50">
        <button 
          onClick={() => setPage('projects')}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Header */}
      <div className="pt-32 pb-12 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between mb-12">
           <div>
              <motion.div 
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                 className="text-purple-400 font-mono text-sm mb-4 flex items-center gap-2"
              >
                <Code size={16} /> {project.category}
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-white mb-4"
              >
                {project.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-xl text-slate-400 max-w-2xl"
              >
                {project.desc}
              </motion.p>
           </div>
           
           <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex gap-4"
           >
              <a href={`https://${project.github}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 font-medium">
                 <Github size={18} /> GitHub
              </a>
              <a href={`https://${project.demo}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-purple-500/20">
                 <Play size={18} /> Live Demo
              </a>
           </motion.div>
        </div>

        {/* Main Image */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
           className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative mb-16"
        >
           <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
        </motion.div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
           {/* Sidebar Info */}
           <div className="space-y-8">
              <div>
                 <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Layers size={18}/> 技术栈</h4>
                 <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-slate-300 text-sm font-mono">{tag}</span>
                    ))}
                 </div>
              </div>
              
              <div>
                 <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Cpu size={18}/> 开发周期</h4>
                 <p className="text-slate-400 text-sm">3 个月 / 245 次提交</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5">
                 <p className="text-slate-400 text-sm italic">
                    "这个项目的挑战在于如何在性能和美学之间找到平衡点。我重写了三次渲染核心才达到现在的帧率。"
                 </p>
                 <div className="mt-4 flex items-center gap-3">
                    <img src={IMAGES.avatar} className="w-8 h-8 rounded-full" alt="Alex"/>
                    <span className="text-white text-sm font-medium">Alex Chen</span>
                 </div>
              </div>
           </div>

           {/* Main Content */}
           <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-p:text-slate-300 prose-p:leading-loose">
              {project.content}
           </article>
        </div>
      </div>
    </motion.div>
  )
}

// 4. 项目列表页 (Projects List)
const ProjectsPage = ({ setPage, setProjectId }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 px-6 max-w-7xl mx-auto"
    >
       <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Laboratory.</h1>
          <p className="text-xl text-slate-400 max-w-2xl">
             这里是我的数字实验室。一些实验可能失败，一些可能永远不会发布，但它们都是探索未知的足迹。
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              onClick={() => { setProjectId(project.id); setPage('project-detail'); }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-white/5 flex flex-col cursor-pointer hover:border-purple-500/30 transition-colors"
            >
              {/* 顶部图片 */}
              <div className="h-56 relative overflow-hidden">
                 <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors" />
                 <img src={project.image} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute top-4 right-4 z-20">
                    <div className="p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-colors">
                        <ArrowRight size={16} />
                    </div>
                 </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                 <div className="text-xs font-mono text-purple-400 mb-2">{project.category}</div>
                 <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">{project.title}</h3>
                 <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-1 line-clamp-3">{project.desc}</p>
                 <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-slate-400 text-xs font-mono border border-white/5">{tag}</span>
                    ))}
                 </div>
              </div>
            </motion.div>
          ))}
       </div>
    </motion.div>
  )
}

// 5. 关于页面 (About) - 保持不变
const AboutPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen pt-32 px-6 max-w-5xl mx-auto"
        >
            <div className="grid md:grid-cols-2 gap-16 items-start">
                <div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">Behind<br/>the Screen.</h1>
                    <div className="prose prose-invert text-slate-300 text-lg leading-relaxed">
                        <p className="text-xl text-white font-medium mb-6">
                            嗨，我是 Alex。一名游走在设计与工程边缘的数字工匠。
                        </p>
                        <p>
                            我一直认为，最好的软件是那些让你感觉不到它存在的软件。就像一把趁手的锤子，或者一双合脚的鞋。为了达成这种“隐形”的体验，我不仅钻研代码的性能，更痴迷于交互的微心理学。
                        </p>
                        <p>
                             过去 5 年，我从一名只会写 HTML 的切图仔，成长为能够独立构建复杂全栈应用的架构师。我坚信技术应该服务于人文，而不是反过来奴役我们。
                        </p>
                    </div>
                    
                    <div className="mt-12 grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Code size={18}/> 技能栈</h4>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li>React / Next.js / TypeScript</li>
                                <li>Node.js / Postgres / Redis</li>
                                <li>WebGL / Three.js / GLSL</li>
                                <li>UI Design (Figma)</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Camera size={18}/> 兴趣</h4>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li>街头摄影 (Leica 用户)</li>
                                <li>科幻小说 (三体/沙丘)</li>
                                <li>独立游戏开发</li>
                                <li>手冲咖啡</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="relative">
                     <div className="aspect-[3/4] rounded-2xl overflow-hidden relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                         <img src={IMAGES.avatar} alt="Portrait" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-8">
                            <div className="flex items-center gap-2 text-white/80 font-mono text-xs">
                                <MapPin size={12} />
                                <span>Currently in Chiang Mai, Thailand</span>
                            </div>
                         </div>
                     </div>
                     <div className="absolute inset-0 border-2 border-purple-500/20 rounded-2xl -z-10 -rotate-3 scale-105" />
                </div>
            </div>
        </motion.div>
    )
}

// --- 主程序 ---

const Navbar = ({ page, setPage }) => {
  return (
    <nav className="fixed top-0 w-full z-50 p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cursor-pointer group"
          onClick={() => setPage('home')}
        >
          <span className="text-xl font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors">LUMINA.</span>
          <span className="ml-1 w-1 h-1 bg-purple-500 rounded-full inline-block mb-1 group-hover:scale-150 transition-transform" />
        </motion.div>
        
        <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-full shadow-2xl">
            {['home', 'projects', 'about'].map((item) => (
                <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${page === item || (page === 'project-detail' && item === 'projects') || (page === 'post' && item === 'home') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    {(page === item || (page === 'project-detail' && item === 'projects') || (page === 'post' && item === 'home')) && (
                        <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10">{item}</span>
                </button>
            ))}
        </div>
        
        <motion.a
          href="mailto:alex@lumina.dev"
          whileHover={{ scale: 1.05 }}
          className="hidden md:flex w-10 h-10 rounded-full border border-white/10 items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all bg-black/20 backdrop-blur-sm"
        >
            <Mail size={16} />
        </motion.a>
      </div>
    </nav>
  );
};

const App = () => {
  const [page, setPage] = useState('home');
  const [postId, setPostId] = useState(null);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-purple-500/30 selection:text-purple-200 font-sans overflow-x-hidden">
      <NoiseOverlay />
      <Navbar page={page} setPage={setPage} />
      
      <AnimatePresence mode="wait">
        {page === 'home' && <HomePage key="home" setPage={setPage} setPostId={setPostId} />}
        {page === 'post' && <PostPage key="post" postId={postId} setPage={setPage} />}
        {page === 'projects' && <ProjectsPage key="projects" setPage={setPage} setProjectId={setProjectId} />}
        {page === 'project-detail' && <ProjectDetailPage key="project-detail" projectId={projectId} setPage={setPage} />}
        {page === 'about' && <AboutPage key="about" />}
      </AnimatePresence>
      
      {(page !== 'post' && page !== 'project-detail') && (
        <footer className="py-12 text-center text-slate-600 text-sm border-t border-white/5 mt-20 relative z-10 bg-slate-950">
            <div className="flex justify-center gap-6 mb-8">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
            <p>Designed & Built by Alex. © 2024 LUMINA.</p>
        </footer>
      )}
    </div>
  );
};

export default App;