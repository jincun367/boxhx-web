<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>3D卡片 | 悬浮延展收缩 · 标签脱离3D效果</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none; /* 避免拖动选中文字，提升体验 */
        }

        body {
            min-height: 100vh;
            background: radial-gradient(circle at 30% 10%, #0b0e1a, #03050b);
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', 'Inter', 'Poppins', system-ui, -apple-system, sans-serif;
            overflow: hidden;
            padding: 1.5rem;
        }

        /* 单卡片容器 - 完全居中，透视空间足够 */
        .card-container {
            perspective: 1400px;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
            cursor: pointer;
        }

        /* 卡片主体 - 需要产生3D变形的层 */
        .card {
            width: 100%;
            aspect-ratio: 3 / 4;
            max-width: 360px;
            height: auto;
            background: linear-gradient(145deg, rgba(25, 30, 55, 0.9), rgba(15, 18, 35, 0.96));
            backdrop-filter: blur(4px);
            border-radius: 32px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 25px 40px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            /* 关键: 启用3D空间，供内容子元素做独立反向变换 */
            transform-style: preserve-3d;
            transition: transform 0.38s cubic-bezier(0.2, 0.9, 0.4, 1.1),
                        box-shadow 0.3s ease,
                        border-color 0.2s ease;
            transform: rotateX(0deg) rotateY(0deg) translateZ(0);
            transform-origin: 0% 100%; /* 基准点左下角，保证形变正确 */
            will-change: transform;
        }

        /* 卡片内部内容层 - 用于布局，但不干扰3D反向独立 */
        .card-content {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 2rem 1.8rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 32px;
            z-index: 2;
            /* 注意：不设置 transform-style，普通块级，不继承3D，但内部元素如果需要独立反向需要单独处理 */
        }

        /* 普通内容区域（参与3D变形的部分） - 我们希望这部分跟随父级3D */
        .card-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            transform-style: preserve-3d; /* 保持3D空间让子元素有微调，但不需要反向 */
        }

        /* 装饰性icon区 (随卡片3D自然倾斜，增加沉浸感) */
        .card-icon {
            font-size: 3.8rem;
            margin-bottom: 1rem;
            filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.3));
            transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
            width: fit-content;
            /* 轻微跟随3D，但无需反向，保留透视更自然 */
        }

        .card-title {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(120deg, #FFFFFF, #c084fc, #60a5fa);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            margin-bottom: 0.5rem;
            letter-spacing: -0.3px;
            transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }

        .card-divider {
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #c084fc, #3b82f6);
            border-radius: 4px;
            margin: 0.7rem 0 1rem;
            transition: transform 0.3s ease;
        }

        .card-desc {
            font-size: 0.95rem;
            line-height: 1.5;
            color: #cddcff;
            margin-bottom: 1.2rem;
            transition: transform 0.3s ease;
        }

        /* ========= 关键部分：标签元素脱离父元素的3D效果 =========
           原理： .card 设置了 transform-style: preserve-3d，子元素默认会继承3D变换。
           要让 .independent-tag 不参与父级3D形变，使用 transform-style: flat 并应用反向补偿。
           更优雅且无计算偏移：使用 position: absolute + 脱离文档流 + 反向变换矩阵?
           但最简单且稳妥的方式：让标签脱离3D上下文，采用 transform: translateZ(0) 并重置变换，但由于父级旋转，
           直接设置 transform-style: flat 不够，因为它依然处于3D场景。
           完美解决方案：利用 “backface-visibility + 独立图层” 并通过 CSS 将标签用固定平面提升，但更好的方法：
           让标签不继承父级transform，需将其放在 .card 外部？但会破坏布局。
           最佳实践：为标签创建独立的层叠上下文，并使用反向 transform 来抵消父级的旋转变换。
           由于父级悬浮时的变换是 rotateX(15deg) rotateY(15deg) translateZ(12px)，我们可动态计算反向？
           但旋转角度固定，我们可预先使用 calc 或者利用 CSS 变量？反向变换很复杂。
           更简单的技巧：将标签独立于卡片主要3D内容之外，但仍在卡片区域内，使用绝对定位 + 独立于3D空间。
           但由于父级perspective，任何绝对定位子元素依旧会被3D影响。
           终极方案：将标签放在 .card 外部，但在视觉上覆盖卡片底部，使用相对/绝对定位来模拟位置。
           为了保证结构和语义，我们把标签从.card内部移动到.card-container层级，使用绝对定位模拟归属感，
           这样完全不受卡片3D变换影响，同时也满足设计需求。
           代码实现：将 .card-tag 移出 .card，放到 .card-container 内，用绝对定位覆盖在卡片底部区域，且不参与3D。
           这样就完美解决“标签不参与父元素3D效果”，同时视觉上依然属于卡片。
        */

        /* 独立标签容器 - 完全脱离卡片3D变换，不参与任何3D效果，永远保持平整 */
        .independent-tag {
            position: absolute;
            bottom: 20px;
            left: 24px;
            z-index: 10;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(20, 24, 45, 0.85);
            backdrop-filter: blur(12px);
            padding: 0.55rem 1.3rem;
            border-radius: 60px;
            font-size: 0.8rem;
            font-weight: 500;
            color: #e2e8ff;
            border: 0.8px solid rgba(192, 132, 252, 0.5);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.25s ease;
            pointer-events: none;  /* 避免干扰卡片点击 */
            white-space: nowrap;
            font-family: monospace;
            letter-spacing: 0.3px;
        }

        /* 标签内小图标和文字微调 */
        .independent-tag span:first-child {
            font-size: 1rem;
        }

        /* 容器相对定位，用于绝对定位标签 */
        .card-container {
            position: relative;
        }

        /* 为了让标签视觉上附着于卡片底部，且不参与3D，完全独立 */
        .card-container:hover .independent-tag {
            background: rgba(100, 80, 180, 0.9);
            border-color: rgba(255, 255, 255, 0.7);
            color: white;
            transform: translateY(-2px);  /* 轻微上浮，平滑，但完全不继承3D */
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        /* 卡片悬浮时的3D变形：左下角向外延伸，右上角向内收缩 */
        .card-container:hover .card {
            transform-origin: 0% 100%;
            transform: rotateX(15deg) rotateY(15deg) translateZ(12px);
            box-shadow: 0 35px 50px -18px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(192, 132, 252, 0.4);
            transition: transform 0.38s cubic-bezier(0.2, 0.9, 0.4, 1.1),
                        box-shadow 0.3s ease;
        }

        /* 增强悬浮时卡片内元素的景深位移，加强左下角外伸的感官 */
        .card-container:hover .card-icon {
            transform: translateZ(18px) scale(1.02);
        }
        .card-container:hover .card-title {
            transform: translateZ(14px);
        }
        .card-container:hover .card-divider {
            transform: translateZ(10px);
        }
        .card-container:hover .card-desc {
            transform: translateZ(8px);
        }

        /* 增加左下角方向光晕，强化向外延伸的视觉指向 (仍依附卡片，但无标签干扰) */
        .card::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 32px;
            background: radial-gradient(circle at 0% 100%, rgba(192, 132, 252, 0.25), rgba(59, 130, 246, 0) 70%);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
            z-index: 1;
        }
        .card-container:hover .card::before {
            opacity: 0.7;
        }

        /* 右上角微暗影，强化内收的景深感 */
        .card::after {
            content: "";
            position: absolute;
            top: 12px;
            right: 12px;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, rgba(0, 0, 0, 0.3), transparent);
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.35s ease;
            pointer-events: none;
            z-index: 0;
        }
        .card-container:hover .card::after {
            opacity: 0.6;
        }

        /* 优雅的呼吸光效背景，增加氛围 */
        .bg-soft {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at 20% 40%, rgba(96, 165, 250, 0.08), transparent 60%);
            pointer-events: none;
            z-index: -1;
        }

        /* 平滑的待机微浮动，让卡片有生命力，悬浮时暂停避免冲突 */
        @keyframes softFloat {
            0% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-6px);
            }
            100% {
                transform: translateY(0px);
            }
        }

        .card-container {
            animation: softFloat 4.5s ease-in-out infinite;
            transition: animation 0.2s;
        }

        .card-container:hover {
            animation-play-state: paused;
        }

        /* 确保卡片内所有元素层级正确且过渡流畅 */
        .card, .card-content, .card-icon, .card-title, .card-desc {
            transition: transform 0.38s cubic-bezier(0.2, 0.9, 0.4, 1.1), background 0.2s, color 0.2s;
        }

        /* GPU 加速 */
        .card {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        /* 响应式调整，确保标签位置适应移动端 */
        @media (max-width: 500px) {
            .card-container {
                max-width: 300px;
            }
            .card-content {
                padding: 1.5rem;
            }
            .card-title {
                font-size: 1.7rem;
            }
            .card-icon {
                font-size: 3rem;
            }
            .card-desc {
                font-size: 0.85rem;
            }
            .independent-tag {
                bottom: 16px;
                left: 18px;
                padding: 0.4rem 1rem;
                font-size: 0.7rem;
                white-space: nowrap;
            }
        }

        /* 确保标签不继承任何3d变形，且绝对定位使其独立于父级3D空间 */
        /* 因为独立标签是 .card-container 的直接子元素，而 .card-container 没有 3D 透视保留（perspective在父级但不影响绝对定位），
           并且标签不在具有 transform-style: preserve-3d 的 .card 内部，因此完全不受卡片3D旋转影响，完美脱离效果 */
    </style>

</head>
<body>
<div class="bg-soft"></div>
<div class="card-container">
    <!-- 卡片主体：包含需要3D变形的元素 -->
    <div class="card">
        <div class="card-content">
            <div class="card-main">
                <div class="card-icon">🌀</div>
                <div class="card-title">空间延展</div>
                <div class="card-divider"></div>
                <div class="card-desc">
                    悬浮时，<strong style="color:#c084fc">左下角向外延伸</strong>，<br>
                    <strong style="color:#60a5fa">右上角向内收缩</strong>。<br>
                    独特的3D透视，颠覆视觉边界。
                </div>
            </div>
            <!-- 卡片底部原先标签的位置现在留空，因为标签已完全独立 -->
        </div>
    </div>
    
    <!-- 独立标签元素 - 完全不参与卡片3D变换，永远保持平整，且视觉上位于卡片左下角区域 -->
    <div class="independent-tag">
        <span>✨</span> 左下外拓 · 右上内收
    </div>
</div>

<script>
    (function() {
        // 解决鼠标离开时卡片过渡卡顿问题 (已经通过 CSS 平滑 cubic-bezier 实现)
        // 额外加强处理: 确保鼠标离开时强制重绘，避免任何卡顿感，同时独立标签无3D影响，更流畅。
        const container = document.querySelector('.card-container');
        const card = document.querySelector('.card');
        
        if (!container || !card) return;
        
        // 鼠标离开时强制浏览器应用过渡，极微小优化防卡顿
        let isHovering = false;
        
        container.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        container.addEventListener('mouseleave', () => {
            isHovering = false;
            // 强制重绘确保变形归位流畅无卡顿
            void card.offsetHeight;
        });
        
        // 移动端触摸处理，确保独立标签仍然不参与3D，且悬浮效果完美
        let touchActive = false;
        let touchTimeout = null;
        
        // 移动端避免标签受任何影响已经通过绝对定位脱离，触摸时模拟hover效果
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (touchTimeout) clearTimeout(touchTimeout);
            container.classList.add('touch-hover');
            touchActive = true;
        });
        
        container.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (touchTimeout) clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                container.classList.remove('touch-hover');
                touchActive = false;
                if (card) void card.offsetHeight;
            }, 50);
        });
        
        container.addEventListener('touchcancel', (e) => {
            if (touchTimeout) clearTimeout(touchTimeout);
            container.classList.remove('touch-hover');
            touchActive = false;
            if (card) void card.offsetHeight;
        });
        
        // 为移动端提供动态样式(仅补充，保证 touch-hover 类可触发挥卡片的形变)
        if (!document.querySelector('#mobile-touch-fix')) {
            const style = document.createElement('style');
            style.id = 'mobile-touch-fix';
            style.textContent = `
                .card-container.touch-hover .card {
                    transform-origin: 0% 100%;
                    transform: rotateX(15deg) rotateY(15deg) translateZ(12px);
                    box-shadow: 0 35px 50px -18px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(192, 132, 252, 0.4);
                }
                .card-container.touch-hover .card::before {
                    opacity: 0.7;
                }
                .card-container.touch-hover .card::after {
                    opacity: 0.6;
                }
                .card-container.touch-hover .card-icon {
                    transform: translateZ(18px) scale(1.02);
                }
                .card-container.touch-hover .card-title {
                    transform: translateZ(14px);
                }
                .card-container.touch-hover .card-divider {
                    transform: translateZ(10px);
                }
                .card-container.touch-hover .card-desc {
                    transform: translateZ(8px);
                }
                .card-container.touch-hover .independent-tag {
                    background: rgba(100, 80, 180, 0.9);
                    border-color: rgba(255, 255, 255, 0.7);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                }
            `;
            document.head.appendChild(style);
        }
        
        // 防止移动端滚动干扰
        container.addEventListener('touchmove', (e) => {
            if (touchActive) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 页面加载完成提示，并确保独立标签完全不参与3D变形（已实现）
        window.addEventListener('load', () => {
            console.log('%c✨ 单卡片3D特效 | 悬浮时左下角外延 + 右上角内收 ✨', 'color: #c084fc; font-size: 14px; font-weight: bold;');
            console.log('%c标签元素已完全脱离父级3D效果，保持平整清晰 | 鼠标离开过渡丝滑', 'color: #60a5fa;');
            // 额外验证标签是否受到卡片3D影响（无）
            const tag = document.querySelector('.independent-tag');
            if (tag) {
                // 确保绝对定位的元素在卡片之上且完全独立
                tag.style.willChange = 'transform'; // 只是优化标签自己的hover微动
            }
            // 确保卡片硬件加速
            card.style.willChange = 'transform';
        });
        
        // 完美解决卡顿：CSS已经使用最佳实践，以及 mouseleave 强制重绘。
        // 独立标签技术说明：标签置于 .card-container 下，与 .card 同级，利用绝对定位覆盖卡片左下区域，
        // 因为不在具有 transform-style: preserve-3d 的 .card 内部，所以完全不参与3D旋转，始终平面显示。
        // 同时通过容器相对定位，标签视觉上完美贴合卡片，且悬浮时可有独立微动(不随卡片倾斜)，满足需求。
    })();
</script>
</body>
</html>
