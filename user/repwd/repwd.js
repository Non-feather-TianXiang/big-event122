// ---------------------------------------------设计
// 不能数据回填！以防让别人看到原来的密码
// 等待用户提交新的数据
var form = layui.form;

form.verify({
    // 新密码 长度要求 6-12
    changdu: [/^\S{6,12}$/, "不满足长度要求"],

    // 两次输入  新密码 得一样；
    same: function (val) {
        // 第一输入新密码：直接获取；HTML结构上做一些简单类名补充，方便获取值
        // 再次输入新密码：val

        if ($(".newPwd").val() != val) {
            return "两次输入的密码不一致";
        }
    },

    // 新密码 和 旧密码 不能一样！
    diff: function (val) {
        // 旧密码: .oldPwd 
        // 新密码： val;

        if ($(".oldPwd").val() == val) {
            return "新旧密码不能一样！"
        }
    }
});

$("form").on("submit", function (e) {
    e.preventDefault();

    // 1.收集数据 不被收集：
    //      disabled 设置 
    //      无 name 设置
    var data = $(this).serialize();

    $.post('/my/updatepwd', data, function (res) {

        // 无论修改成功还是失败，都给出提示
        layer.msg(res.message);
        if (res.status === 0) {

            // 修改成功，清空输入框的值
            $('form')[0].reset();
        }
    });
})