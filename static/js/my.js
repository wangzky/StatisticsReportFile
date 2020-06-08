;!function () {
    var layer = layui.layer
        , form = layui.form
        , $ = layui.$

    var stuName = "";
    var historyDataMedal = [];
    var historyDataReport = [];
    var dataX = [];

    // layer.msg('Hello World');

    layer.open({
        type: 1
        , title: false
        , offset: 'auto'
        , id: 'layerName'//防止重复弹出
        , area: ['250px','120px']
        , content: '<input style="text-align: center" type="text" id="nameInput" name="title" lay-verify="title" autocomplete="off" placeholder="请输入姓名" class="layui-input">'
        , btn: '查看成绩'
        , btnAlign: 'c' //按钮居中
        , closeBtn: 0
        , shade: 0.7 // 透明度
        // , skin: 'layui-layer-nobg' //没有背景色
        , yes: function () {
            getName();
        }
    });

    function getName() {
        var name = $("#nameInput").val()
        console.log(name)
        if (name == null || name == '') {
            console.log("输入为空！")
            layer.msg('输入为空');
            return false;
        }
        var loadIndex = layer.load()
        $.ajax({
            url: "/api/getHistoryInfo",
            data: {'name': name},
            type: "Post",
            dataType: "json",
            // async: false,
            success: function (data) {
                console.log(data)
                if (data.code == '0000') {
                    var info = data.data;
                    stuName = info.name;
                    historyDataMedal = info.medal;
                    historyDataReport = info.report;

                    document.getElementById("medalMax").innerHTML = info.medalMax;
                    document.getElementById("medalTotal").innerHTML = info.medalTotal;
                    document.getElementById("reportMax").innerHTML = info.reportMax;
                    document.getElementById("reportTotal").innerHTML = info.reportTotal;
                    document.getElementById("jy").innerHTML = info.jy;
                    document.getElementById("titleInfo").innerHTML = info.name + " " + info.titleInfo;

                    var l1 = historyDataMedal.length;
                    var l2 = historyDataReport.length;

                    for (i = 0; i < (l1 < l2 ? l2 : l1); i++) {
                        var num = i + 1;
                        dataX[i] = ('第' + num + '次')
                    }
                    layer.closeAll();
                    takeEcharts();
                } else if (data.code == '9999') {
                    layer.msg('查无此人');
                    layer.close(loadIndex)
                }

            },
            error: function (data) {
                layer.msg('错误');
            }
        });
    }


    /*echarts*/
    function takeEcharts() {
        var myChart = echarts.init(document.getElementById('main'), 'vintage');
        var option = {
            backgroundColor: 'transparent',
            title: {
                text: '成绩曲线'
            },
            tooltip: {},
            legend: {
                icon: "stack",
                data: ["成绩", "勋章数"]
            },
            // X轴 滑块 可缩放
            // dataZoom: [
            //     {
            //         type: "slider",
            //         show: false,
            //         start: 0, // 开始百分数
            //         end: 100 // 结束百分数
            //     }
            // ],
            xAxis: {
                type: "category",
                splitLine: {
                    // X 轴分隔线样式
                    show: true,
                    lineStyle: {
                        color: ["#f3f0f0"],
                        width: 2,
                        type: "solid"
                    }
                },
                data: dataX
            },
            yAxis: [
                {
                    name: "成绩",
                    type: "value",
                    max: 100,
                    min: 0,
                    position: "left",
                    splitNumber: 10, // Y 轴分隔格数
                    splitLine: {
                        // Y 轴分隔线样式
                        show: true,
                        lineStyle: {
                            color: ["#f3f0f0"],
                            width: 2,
                            type: "solid"
                        }
                    }
                },
                {
                    name: "勋章数",
                    type: "value",
                    max: 15,
                    min: 0,
                    position: "right",
                    splitNumber: 5, // Y 轴分隔格数
                    splitLine: {
                        // Y 轴分隔线样式
                        show: true,
                        lineStyle: {
                            color: ["#f3f0f0"],
                            width: 2,
                            type: "solid"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '成绩',
                    type: 'line', // 折线图
                    smooth:true,
                    data: historyDataReport,
                    yAxisIndex: 0,
                    markPoint: {
                        symbol: 'pin', //标记(气泡)的图形
                        symbolSize: 50, //标记(气泡)的大小
                        data: [
                            {
                                name: '最大值',
                                type: 'max'
                            }
                        ]
                    }
                },
                {
                    name: '勋章数',
                    type: 'line', // 折线图
                    smooth:true,
                    data: historyDataMedal,
                    yAxisIndex: 1,
                    markPoint: {
                        symbol: 'pin', //标记(气泡)的图形
                        symbolSize: 50, //标记(气泡)的大小
                        data: [
                            {
                                name: '最大值',
                                type: 'max'
                            }
                        ]
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
}();