// ----------------------------------------切换
// 去注册
$("#goto-register").on("click", function () {
    // $("#login").hide();
    $("#register").show();
});
// 去登录
$("#goto-login").on("click", function () {
    // $("#login").show();
    $("#register").hide();
});

// ---------------------------------------注册
// 对密码长度：非空\s 要求 6，12
var layer = layui.layer;
var form = layui.form;
form.verify({
    changdu: [/^\S{6,12}$/, "输入的密码不符合要求！"],
    // 密码和重新输入的值得一样，val 验证该项的值
    same: function (val) {
        if ($("#password").val() != val) {
            return "两个密码输入的不一致"
        }
    }
});


//------------------------------------------------
$("#register form").on("submit", function (e) {
    e.preventDefault();

    var params = $(this).serialize();

    $.ajax({
        url: '/api/reguser',
        type: "POST",
        data: params,
        success: function (res) {
            // 不管成功失败，都进行弹窗
            layer.msg(res.message);
            if (res.status == 0) {
                $("#login").show();
                $("#register").hide();
            }
            // 不成功的时候
            else {
                // 用户名id
                $("#username").val("");
            }
        }
    })
})
// 登录---------------------------------------------------------
$("#login form").on("submit", function (e) {
    e.preventDefault();

    var params = $(this).serialize();

    $.ajax({
        url: '/api/login',
        type: "POST",
        data: params,
        success: function (res) {
            layer.msg(res.message);
            // 登录成功
            // 返回token值：一会很多接口都要用，在index.html;
            // 本地储存：库页面使用
            // res.status == 0 后台的设计和 前面学习 状态码 没有关系！！！！
            if (res.status == 0) {
                location.href = "../index.html";
                localStorage.setItem("token", res.token);
            }
        }
    })
})