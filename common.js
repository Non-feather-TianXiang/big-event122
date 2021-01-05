// 需求：
//     1.配置根路径
//     2.设置请求头
//     3.complete：验证token在后台的有效性；


// 高效：希望记住！
// ajax提前过滤 提前拿到配置数据，
$.ajaxPrefilter(function (obj) {
    // 1.到底是个啥？每次发生ajax请求之前，拿到ajax 传入的这些配置项！

    // 2.拿到配置对象，有啥用？ 将获取配置对象进行加工；
    //    2.1 配置根路径
    obj.url = "http://api-breakingnews-web.itheima.net" + obj.url;

    if ((obj.url.indexOf("/my/") != -1)) {

        obj.headers = {
            "Authorization": localStorage.getItem("token")
        };

        obj.complete = function (xhr) {
            // 后台接口设计：token过期无效，返回都是这些数据！
            // xhr 就是原生xhr  xhr.responseJSON解析后结果
            if (xhr.responseJSON.status == 1 || xhr.responseJSON.message == "身份认证失败！") {
                localStorage.removeItem("token");
                location.href = "./login.html";
            }
        }
    }

})