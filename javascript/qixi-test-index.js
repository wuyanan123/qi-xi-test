/**
 * Created by wuyanan on 2016/9/1.
 */
$(function(){

    var container = $("#content");
    var swipe = Swipe(container);
    var visualWidth = container.width();
    var visualHeight = container.height();
    var $boy = BoyWalk();
    // 开始时需要添加动画---太阳、云、背景音乐等
    function startInfo(){
        // 太阳公转
        $("#sun").addClass('rotation');

        // 飘云
        $(".cloud:first").addClass('cloud1Anim');
        $(".cloud:last").addClass('cloud2Anim');
        var audio1 = Hmlt5Audio(audioConfig.playURl);
        audio1.end(function() {
            Hmlt5Audio(audioConfig.cycleURL, true);
        });
    }


    // 开始
    $("button").click(function(){
        startInfo();
        // 开始走路--z走到背景图0.8位置时滚动页面
        $boy.walkTo(7,0.7)
            .then(function(){
                // 第一次走路完成时--滚动页面
                bird.fly();  // 飞鸟动画
                swipe.scrollTo(visualWidth,6);
            }).then(function(){
            // 第二次走路
            return $boy.walkTo(6,0.5);
        }).then(function(){
            // 背景B--商店取花
            // 暂停脚步
            $boy.stopWalk();
        }).then(function(){
            // 开门
            return openDoor();
        }).then(function(){
            // 开灯
            lamp.bright();
        }).then(function(){
            // 走进商店
            return $boy.toShop(1500);
        }).then(function(){
            // 取花
            return $boy.talkFlower();
        }).then(function(){
            // 关门
            shutDoor();
            // 关灯
            lamp.dark();
            // c出商店
            return $boy.outShop(1500);
        }).then(function(){
            // 滚动背景C--
            swipe.scrollTo(visualWidth*2,6);
        }).then(function(){
            // 第二次走路
            return $boy.walkTo(6,0.15);
        }).then(function(){
            // 第三次走路--取花后继续前进
            // --走到桥边
            // 第四次走路走到桥上
            return $boy.walkTo(1.5, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
        }).then(function(){
            // 实际走路的比例
            var proportionX = (girl.getOffset().left - $boy.getWidth() + girl.getWidth() / 5) / visualWidth;
            // 第三次桥上直走到小女孩面前
            return $boy.walkTo(1.5, proportionX);
        }).then(function(){
            // 图片还原原地停止状态
            $boy.resetOriginal();
        }).then(function(){
            // 增加转身动作
            setTimeout(function() {
                girl.rotate();
                $boy.rotate(function() {
                    // 开始logo动画
                    logo.run();
                });
            }, 1000);
        }).then(function(){
            snowflake();
        })
    });
    
});
