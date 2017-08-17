/**
 * 小男孩走路封装
 * Created by wuyanan on 2016/9/2.
 */
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
// css3 的动作变化(小男孩的走路处理)
    function slowWalk(){
        $boy.addClass("slowWalk");
    }
// 计算移动距离
    function calculateDist(direction, proportion){
        return ((direction == 'x'?visualWidth:visualHeight)*proportion);
    }
// 用transition做运动
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
        time = time || 3000;
        // 脚动作
        slowWalk();
        // 开始走路
        var d1 = startRun({
            'left': dist + 'px',
            'top': disY ? disY : undefined
        }, time);
        return d1;
    };

    return {
        // 开始走路
        walkTo:function(time,proportionX,proportionY){
            var distX = calculateDist('x', proportionX);
            var distY = calculateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },
        // 停止走路
        stopWalk:function(){
            pauseWalk();
        },
        // 设置颜色
        setColor:function(value){
            $boy.css('background-color',value);
        }
    }

};