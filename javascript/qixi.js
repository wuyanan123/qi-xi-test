/**
 * Created by wuyanan on 2016/9/4.
 */
/*==========  开门关门以及开灯关灯 ============*/
// 动画结束事件
var animationEnd = (function() {
    var explorer = navigator.userAgent;
    if (~explorer.indexOf('WebKit')) {
        return 'webkitAnimationEnd';
    }
    return 'animationend';
})();


//  开门关门处理
function doorAction(left,right,time){
    var $door = $('.door');
    var doorLeft = $('.door-left');
    var doorRight = $('.door-right');
    var defer = $.Deferred();
    var count = 2;
    // 等待开门完成
    var complete = function(left,right,time){
        if(count == 1){
            defer.resolve();
            return;
        }
        count--;
    };
    doorLeft.transition({
        'left':left
    },time,complete);
    doorRight.transition({
        'left':right
    },time,complete);
    return defer;
};
// 开门
function openDoor(){
    return doorAction('-50%','100%',1000);
};
// 关门
function shutDoor(){
    return doorAction('0%','50%',2000);
}

/*==== 灯动画 ====*/
var lamp = {
    elem1:$(".b_background"),
    elem2:$(".b_background_preload"),
    bright:function(){
        this.elem1.css({
            'opacity':0
        });
        this.elem2.css({
            'opacity':1
        });
    },
    dark:function(){
        // this.elem.removeClass('lamp-bright');
        this.elem1.css({
            'opacity':1
        });
        this.elem2.css({
            'opacity':0
        });
    }
};


var container = $("#content");
var swipe = Swipe(container);
visualWidth = container.width();
visualHeight = container.height();

// 页面滚动到指定的位置
function scrollTo(time, proportionX) {
    var distX = visualWidth * proportionX;
    swipe.scrollTo(distX, time);
}

/*========== 页面C小女孩设置 ===========*/

// 获取数据
var getValue = function(className) {
    var $elem = $('' + className + '');
    // 走路的路线坐标
    return {
        height: $elem.height(),
        top: $elem.position().top
    };
};

// 桥的Y轴
var bridgeY = function() {
    var data = getValue('.c_background_middle');
    return data.top;
}();

////////
//小女孩 //
////////
var girl = {
    elem: $('.girl'),
    getHeight: function() {
        return this.elem.height();
    },
    // 转身动作
    rotate: function() {
        this.elem.addClass('girl-rotate');
    },
    setOffset: function() {
        this.elem.css({
            left: visualWidth / 2,
            top: bridgeY - this.getHeight()
        });
    },
    getOffset: function() {
        return this.elem.offset();
    },
    getWidth: function() {
        return this.elem.width();
    }
};

// 修正小女孩位置
girl.setOffset();
// 用来临时调整页面
// swipe.scrollTo(visualWidth * 2, 0);

///////////
//loge动画 //
///////////
var logo = {
    elem: $('.logo'),
    run: function() {
        this.elem.addClass('logolightSpeedIn')
            .on(animationEnd, function() {
                $(this).addClass('logoshake').off();
            });
    }
};


// 当前需要移动的坐标
var instanceX;
/*============  小男孩走路   ===============*/
function BoyWalk(){
    var container = $("#content");
    // 页面可视区域
    var visualWidth = container.width();
    var visualHeight = container.height();

    // 获取数据
    var getValue = function(className){
        var $elem = $(''+className+'');
        // 走路的路线坐标
        return{
            height:$elem.height(),
            top:$elem.position().top
        }
    };
    // 路的y轴
    var pathY = function(){
        var data = getValue('.a_background_middle');
        console.info(data);
        return data.top + data.height/2;
    }();
    var $boy = $("#boy");
    var boyHeight = $boy.height();
    // 修正小男孩的正确位置
    // 路的中间位置减去小男孩的高度，25是一个修正值
    $boy.css({
        top:pathY - boyHeight + 25
    });

    /*============== 动画处理 start=============*/
    // 暂停走路
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }

    // 恢复走路
    function restoreWalk(){
        $boy.removeClass('pauseWalk');
    };
    // css3 的动作变化(小男孩的走路处理--实现脚步的变换)
    function slowWalk(){
        $boy.addClass("slowWalk");
    }

    // 用transition做运动(向前走路效果)
    function startRun(options,runTime){
        var dfdPlay = $.Deferred();
        // 恢复走路
        restoreWalk();
        // 运动的属性(jquery.transit.js中的方法)
        // $.fn.transition()来进行 css3 动画效果。他和$.fn.animate()的效果一样，只是他使用了 css3 过渡。
        $boy.transition(
            options,  // 设置属性变化值
            runTime,  // 运动时间
            'linear',  // 缓动效果
            function() {
                dfdPlay.resolve(); // 动画完成
            });  // 回调函数(可任意返回需要的设置)
        return dfdPlay;
    };
    // 开始走路
    function walkRun(time, dist, disY) {
        time = time || 3;
        // 脚动作
        slowWalk();
        // 开始走路
        var d1 = startRun({
            'left': dist + 'px',
            'top': disY ? disY : undefined
        }, time*1000);
        return d1;
    };
    // 走进商店
    function walkToShop(runTime){
        var defer = new $.Deferred();
        var doorObj = $(".door");
        // 门的坐标(使用offset()取值点是相对于--document文档；position是相对于父元元素)
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;
        var doorOffsetTop  = offsetDoor.top;
        // 小孩当前的坐标
        var posBoy = $boy.position();
        var boyPoxLeft = posBoy.left;
        var boyPoxTop = posBoy.top;

        // 中间位置
        var boyMiddle     = $boy.width() / 2;
        var doorMiddle    = doorObj.width() / 2;
        var doorTopMiddle = doorObj.height() / 2;
        // 当前需要移动的坐标(门的left+门宽度的一半减去小男孩的left+小男孩宽度的一半)
        // 当前需要移动的坐标
        instanceX = (doorOffsetLeft + doorMiddle) - (boyPoxLeft + boyMiddle);
        // Y的坐标
        // top = 人物底部的top - 门中间的top值
        // var instanceY = boyPoxTop + boyHeight - doorOffsetTop + (doorTopMiddle);


        // 开始走路
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
            opacity:0.1
        },runTime);
        // 走路完毕
        walkPlay.done(function(){
            $boy.css('opacity',0);
            defer.resolve();
        });
        return defer;
    };
    //取花
    function talkFlower() {
        //增加延时等待效果
        var defer = $.Deferred();
        setTimeout(function() {
            //取花
            $boy.addClass('slowFlowerWalk');
            defer.resolve();
        }, 1000);
        return defer;
    }

    // 走出商店
    function walkOutShop(runTime){
        var defer = $.Deferred();
        restoreWalk();
        //开始走路
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX + 'px),scale(1,1)',
            opacity: 1
        }, runTime);
        //走路完毕
        walkPlay.done(function() {
            defer.resolve();
        });
        return defer;
        // // 开始走路
        // var walkPlay = startRun({
        //     transform: 'translateX(' + instanceX + 'px),translateY(0),scale(1,1)',
        //     opacity: 1
        // },1500);
        // // 走路完毕
        // walkPlay.done(function(){
        //     $boy.css('opacity',1);
        //     defer.resolve();
        // })
    };


    // 计算移动距离
    function calculateDist(direction, proportion){
        return ((direction == 'x'?visualWidth:visualHeight)*proportion);
    }

    return {
        // 开始走路
        walkTo:function(time,proportionX,proportionY){
            var distX = calculateDist('x', proportionX);
            var distY = calculateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },
        // 走进商店
        toShop:function(){
            return walkToShop.apply(null,arguments);
        },
        // 走出商店
        outShop:function(){
            return walkOutShop.apply(null,arguments);
        },
        // 停止走路
        stopWalk:function(){
            pauseWalk();
        },
        // 取花
        talkFlower:function(){
            return talkFlower();
        },
        // 转身动作
        rotate: function(callback) {
            restoreWalk();
            $boy.addClass('boy-rotate');
            // 监听转身完毕
            if (callback) {
                $boy.on(animationEnd, function() {
                    callback();
                    $(this).off();
                })
            }
        },
        // 获取男孩的宽度
        getWidth: function() {
            return $boy.width();
        },
        // 复位初始状态
        resetOriginal: function() {
            this.stopWalk();
            // 恢复图片
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        }
    };
};
/*=== 右边飞鸟 ==== */
var bird = {
    elem:$(".bird"),
    fly:function(){
        this.elem.addClass('birdFly');
        this.elem.transition({
            right:container.width()
        },15000,'linear',4000)
    }
};

var snowflakeURl = [
    '../../resource/qixiTest/images/snowflake/snowflake1.png',
    '../../resource/qixiTest/images/snowflake/snowflake2.png',
    '../../resource/qixiTest/images/snowflake/snowflake3.png',
    '../../resource/qixiTest/images/snowflake/snowflake4.png',
    '../../resource/qixiTest/images/snowflake/snowflake5.png',
    '../../resource/qixiTest/images/snowflake/snowflake6.png'
];
//////
//飘雪花 //
///////
function snowflake(){
    // 雪花容器
    var $flakeContainer = $("#snowflake");
    // 随机六张图
    function getImagesName(){
        return snowflakeURl[[Math.floor(Math.random()*6)]];
    }
    // 创建一个雪花元素
    function createSnowBox(){
        var url = getImagesName();
        return $('<div class="snowbox" />').css({
            'width':41,
            'height':41,
            'position':'absolute',
            'backgroundSize':'cover',
            'zIndex':100000,
            'top':'-41px',
            'backgroundImage':'url('+ url+')'
        }).addClass('snowRoll');
    };

    // 开始雪花
    setInterval(function(){
        // 运动的轨迹
        var startPositionLeft = Math.random()*visualWidth - 100,
            startOpacity = 1,
            endPositionTop = visualHeight - 40,
            endPositionLeft = startPositionLeft - 100 + Math.random()*500,
            duration = visualHeight*10 + Math.random()*5000;
        // 随机透明度 不小于0.5
        var randomStart = Math.random();
        randomStart = randomStart < 0.5?startOpacity:randomStart;

        // 创建一个雪花
        var $flake = createSnowBox();
        console.info($flake);
        // 设计起点位置
        $flake.css({
            left:startPositionLeft,
            opacity:randomStart
        });
        // 加入到容器
        $flakeContainer.append($flake);
        // 开始执行动画
        $flake.transition({
            top:endPositionTop,
            left:endPositionLeft,
            opacity:0.7
        },duration,'ease-out',function(){
            $(this).remove(); // 结束后删除
        });


    },200);
}

// 音乐配置
var audioConfig = {
    enable: true, // 是否开启音乐
    playURl: 'resource/music/happy.wav', // 正常播放地址
    cycleURL: 'resource/music/circulation.wav' // 正常循环播放地址
};

/////////
//背景音乐 //
/////////
function Hmlt5Audio(url, isloop) {
    var audio = new Audio(url);
    audio.autoPlay = true;
    audio.loop = isloop || false;
    audio.play();
    return {
        end: function(callback) {
            audio.addEventListener('ended', function() {
                callback();
            }, false);
        }
    };
}