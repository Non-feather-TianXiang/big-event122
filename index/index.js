// ----------------------------------获取用户信息

if (localStorage.getItem("token") == null) {
    location.href = "../login.html";
}

// 查接口文档

window.getInfo();

function getInfo() {
    $.ajax({
        url: "/my/userinfo",
        // 语法设置请求头 ：带上token值
        // headers: {
        //     Authorization: localStorage.getItem("token")
        // },
        success: function (res) {
            var name = res.data.nickname || res.data.username;

            $(".username").html(name);

            // 有头像地址显示图片 ，显示头像
            // 如果没有，截取名字第一字符，大写，显示在某个盒子内
            if (res.data.user_pic) {
                $(".layui-nav-img").show().attr("src", res.data.user_pic);
                $(".avatar").hide();
            } else {
                var first = name.substr(0, 1);
                first = first.toUpperCase();


                $(".layui-nav-img").hide();
                $(".avatar").show().css("display", "inline-block").text(first);
            }
        }
    })
}

//--------------------------------退出事件
var layer = layui.layer;
$("#logout").on("click", function () {
    // confirm: 询问
    //          带两个按钮 ， 确定 ，取消
    //          参数1：询问的话
    //          参数2： 点击确认的时候，执行的函数
    layer.confirm("您确定要退出吗？", function (index) {
        // index:数值用于关闭当前的弹窗

        // 设计：回到登录   token还在本地存着
        localStorage.removeItem("token");
        location.href = "../login.html";
        layer.close(index);
    })
})