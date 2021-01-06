var laypage = layui.laypage;
var layer = layui.layer;
var form = layui.form;
// ------------------------------------列表
// 接口参数：分页查询；
//     pagenum：页码
//     pagesize:每页要求返回几条数据

// 后台设计：
//     商品列表：1W
//     加载1W，显示出来，用户看起来费劲；
//     刚好要的数据 第11条；无形后面数据白白加载了！
//     减少请求次数、数据量，怕服务器！怕服务器：百万并发！同时请求！

// 设置全局变量
var data = {
  pagenum: 1, // 获取第1页的数据 
  pagesize: 2, // 每页显示2条数据 
}
list();

function list() {
  $.ajax({
    url: "/my/article/list",
    data: data,
    success: function(res) {
      if (res.status == 0) {
        // -----------------------------------数据进行渲染
        var str = "";
        $.each(res.data, function(index, item) {
          // 对时间处理：JS基础  字符串操作方法
          //   item.pub_date  2020-01-03 12:19:57.690   需要对这个值 截取处理  长度-4
          //   str.slice(0,str.length-4)
          //   item.pub_date.slice(0, item.pub_date.length - 4)
          str += `<tr>
                  <td>${item.title}</td>
                  <td>${item.cate_name}</td>
                  <td>${item.pub_date.slice(0, item.pub_date.length - 4)}</td>
                  <td>${item.state}</td>
                  <th>
                    <a href="/article/edit/edit.html?id=${item.Id}" class="layui-btn layui-btn-xs">编辑</a>
                    <button data-id="${item.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger danger">删除</button>
                  </th>
                </tr>`;
        });
        $("tbody").html(str);

        // ----------------------------------分页器加载
        page(res.total);
      }
    }
  });
}

// ------------------------------------分页
function page(total) {
  laypage.render({
    // ********核心配置
    elem: 'page', // 初始化分页器  DOM节点的id值；
    count: total, // 数据总数，从服务器获取
    limit: data.pagesize, //  每页显示的条数
    curr: data.pagenum, // 在第几页  模块自动根据提交数，渲染出分页器
    jump: function(obj, first) {
      // first：true；模块初始化的第一次加载！
      //        undefined: 用户自己点的时候，
      if (first == undefined) {
        // 1.obj.curr 当前要显示第几页：
        // 2.修改 data.pagenum ；再次去 请求 重新加载列表数据！
        data.pagenum = obj.curr;
        list();
      }

    }
  });
}


// -------------------------------------删除
$("tbody").on("click", ".danger", function() {

  // 1.获取对应
  var id = $(this).attr("data-id");

  // 2.发生请求：
  layer.confirm("您确认要删除该文章么？", function(index) {
    $.ajax({
      url: "/my/article/delete/" + id,
      success: function(res) {
        layer.msg(res.message);
        if (res.status == 0) {
          layer.close(index);

          // 业务：重新加载数据，回到第一页；
          data.pagenum = 1;
          list();

        }
      }
    })
  });

})


// --------------------------------------加载分类数据 及筛选
$.ajax({
  url: "/my/article/cates",
  success: function(res) {

    if (res.status == 0) {
      // 初始化默认空选项
      var str = `<option value="">空</option>`;
      // 遍历数据：累加
      $.each(res.data, function(index, item) {
        str += `<option value="${item.Id}">${item.name}</option>`;
      });
      // 设置HTML结构
      $("#category").html(str);

      form.render('select'); // 不是选择器，form重新渲染select功能
    }
  }
});

// 点击筛选的时候，收集数据
$("form").on("submit", function(e) {
  e.preventDefault();

  // 1.收集数据
  // var params = $(this).serialize();   // url拼接好字符串：请求发送的数据
  var params = $(this).serializeArray(); // 数组对象：想从里面获取某些数据


  // 2.发生请求 重新添加筛选条件，重新加载列表
  //   需要给data设置新的键值对 cate_id  state
  //   问题：params是个字符串，解析出来？
  data.cate_id = params[0].value;
  data.state = params[1].value;
  // 业务设计：默认显示第一页
  data.pagenum = 1;

  list();
})


// --------------------------------------编辑
// 设计：点击按钮，当前iframe窗口 转跳专门编辑页面；
//      编辑页面 样式和布局 和 发布页面是一模一样；
//      为什么还要单独写一个呢？
//          如果公用一个页面（编辑和发布是一个页面），发布JS  编辑的JS 写在一起；
//          页面中点击发布按钮：发布？编辑？
// list.js 配置编辑按钮的转跳链接
//    渲染列表的地方：<a href="/article/edit/edit.html" class="layui-btn layui-btn-xs">编辑</a>
//    edit.html是同一个页面，怎么就能渲染不同的数据？ /article/edit/edit.html?id=139 把文字id和地址绑定在一起！
//    可以地址后面拼接参数，在edit.html页面加载后，获取到传递的数据！