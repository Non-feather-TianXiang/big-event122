// ---------------------------------------------------列表
function getList() {
    $.ajax({
        url: "/my/article/cates",
        success: function (res) {
            if (res.status == 0) {
                var str = "";
                $.each(res.data, function (index, ele) {
                    str += `<tr>
                    <td>${ele.name}</td>
                    <td>${ele.alias}</td>
                    <td>
                      <button myid="${ele.Id}" data-name="${ele.name}" data-alias="${ele.alias}" type="button" class="layui-btn layui-btn-xs edit">编辑</button>
  
                      <button myid="${ele.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger delete">删除</button>
                    </td>
                  </tr>`;
                });
                $("tbody").html(str);
            }
        }
    });
}
getList();

// -------------------------------------------------------------新增
var add_str = `
  <form class="layui-form add-form" action="" style="margin: 30px; margin-left: 0px;" id="add_form">
    <div class="layui-form-item">
      <label class="layui-form-label">类别名称</label>
      <div class="layui-input-block">
        <input type="text" name="name" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">类别别名</label>
      <div class="layui-input-block">
        <input type="text" name="alias" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
      </div>
    </div>
  </form>`;

$(".add").click(function () {

    // 1.弹窗  layer.open({})
    layer.open({
        type: 1,
        title: '添加类别',
        content: add_str,
        area: ['500px', '250px'],
        // 层创建完毕时
        success: function (layero, index) {
            // index: number值，layer专门关闭用！
            // 注册提交事件
            add_sub(index);
        }
    });

});
// -----------步骤1：
// $("#add_form").on("submit", function (e) {
//   e.preventDefault();
//   console.log(1);
// });
// 问题：不能把提交事件放在弹窗外面注册：
// 原因：代码执行到这，就是现在就要给$("#add_form")注册提交事件
//       但是 现在：页面没有 $("#add_form"); 
// 解决：等待form出来后，才能获取，然后再次注册提交事件
// 代码：layer.open(success 里面注册提交事件);



// -------------步骤2：
// 注册事件放在  layer.open(success 里面注册提交事件);
// 测试是否生效  代码变的不容易维护；


// -------------步骤3：
// 把写入内部代码，先在外面封装，在里面调用！
function add_sub(numb) {
    $("#add_form").on("submit", function (e) {
        e.preventDefault();
        // console.log(1);


        // 1.收集数据:
        var data = $(this).serialize();

        // 2.提交
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: data,
            success: function (res) {
                // 无论成功，还是失败，都给提示
                layer.msg(res.message);

                if (res.status === 0) {
                    // 添加成功，重新渲染列表
                    getList();

                    // 关闭弹出层
                    layer.close(numb);
                }
            }
        });


    });
}

// -------------------------------------------------------------删除
// /my/article/deletecate/:id  为了获取id值！
// 1.事件委托
$("tbody").on("click", ".delete", function (e) {
    // 2.获取id；初始化的时候，需要把id和删除按钮绑定在一起；
    var id = $(e.target).attr("myid");

    // 3.发送删除请求
    $.ajax({
        url: "/my/article/deletecate/" + id,
        success: function (res) {
            // 4.成功后：重新加载列表
            layer.msg(res.message);
            if (res.status === 0) {
                // 删除成功，重新渲染
                getList();
            }
        }
    })
});