;!function () {
    var h_pages = ['p3','p4','p5','p6']; // 需要上滑的页
    var player = document.getElementById('player');
    var p1 = document.getElementById('p1');
    var p2 = document.getElementById('p2');
    var p3 = document.getElementById("p3");
    var openReportBtn = document.getElementById("openReport");

    document.addEventListener("touchmove", function (e) {
        e.preventDefault();
    }, false);
    for (var j=0;j< h_pages.length;j ++){
        var doc = document.getElementById(h_pages[j]);
        doc.addEventListener("touchstart", touchStart, false);
        doc.addEventListener("touchmove", touchMove, false);
        doc.addEventListener("touchend", touchEnd, false);
    }

    player.addEventListener('touchstart', touchPlayer, false);  // 监听播放器的触摸事件
    // p1.addEventListener('touchstart', touchPage1, false);       // 监听第一页的触摸事件

    var stuName = "";
    var historyDataMedal = [];
    var historyDataReport = [];
    var dataX = [];

    openReportBtn.onclick = function () {
        var name = $("#name").val()
        console.log(name)
        if (name == null || name == '') {
            console.log("输入为空！")
            layer.msg('输入为空');
            return false;
        }

        p1.classList.add('hide');
        p2.classList.remove('hide');

        // 请求
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
                    // document.getElementById("titleInfo").innerHTML = info.name + " " + info.titleInfo;

                    var l1 = historyDataMedal.length;
                    var l2 = historyDataReport.length;

                    for (i = 0; i < (l1 < l2 ? l2 : l1); i++) {
                        var num = i + 1;
                        dataX[i] = ('第' + num + '次')
                    }
                    takeEcharts();

                    setTimeout(function () {
                        p2.classList.add('outTop');
                        setTimeout(function () {
                            p3.classList.remove('hide');
                            p3.classList.add('inTop');
                        },1000)
                    }, 3000);

                    layui.reload()
                } else if (data.code == '9999') {
                    layer.msg('查无此人');
                    toIndex()
                }

            },
            error: function (data) {
                layer.msg('错误');
                toIndex()
            }
        });

    };

    function toIndex(){
        p2.classList.add('hide');
        p1.classList.remove('hide');
    }


    // 播放音乐
    function touchPlayer() {
        var music = document.getElementById('music');
        var player_disc = document.getElementById('player_disc');
        
        if (music.paused) {
            music.play();
            player_disc.classList.remove('paused');
        } else {
            music.pause();
            player_disc.classList.add('paused');
        }
    }


    // 点击第一页
    function touchPage1() {
        p1.classList.add('hide');
        p2.classList.remove('hide');

        setTimeout(function () {
            p2.classList.add('outTop');
            setTimeout(function () {
                p3.classList.remove('hide');
                p3.classList.add('inTop');
            },1000)
        }, 3000);
    }
    
    /*++++++++++++++++++++++++++++*/

    var curPage = 0; // 当前页 从0开始
    var PageL = h_pages.length;
    var canTouch = false;
    canTouch = true;

    var startY, endY, diff;

    function touchStart(e) {
        var touch = e.touches[0];
        startY = touch.pageY;
    }

    function touchMove(e) {
        //e.preventDefault();
        var touch = e.touches[0];
        endY = touch.pageY;
        diff = endY - startY;
    }

    function touchEnd(e) {
        console.log("curPage:"+curPage + ",PageL:" + PageL)
        if (Math.abs(diff) > 150 && canTouch) {
            // 向上滑
            if (diff > 0) {

                console.log("向上滑")
                if (curPage <= 0) {
                    console.log("第一页")
                    return;
                }
                $('#' + h_pages[curPage]).removeClass('inTop outTop inDown outDown hide').addClass('outDown');
                curPage--;
                $('#' + h_pages[curPage]).removeClass('inTop outTop inDown outDown hide').addClass('inDown');

            }
            // 向下滑
            else {
                console.log("向下滑")

                if (curPage >= (PageL-1)) {
                    console.log("最后一页")
                    $('.arrow').hide();
                    return;
                }
                $('.arrow').show();

                $('#' + h_pages[curPage]).removeClass('inTop outTop inDown outDown hide').addClass('outTop');
                curPage++;
                $('#' + h_pages[curPage]).removeClass('inTop outTop inDown outDown hide').addClass('inTop');

            }
            canTouch = false;
            setTimeout(function () {
                canTouch = true;
                diff = 0;
                if (curPage!==0){
                    $('#' +  h_pages[curPage-1]).addClass('hide');
                }
                if (curPage!==(PageL-1)){
                    $('#' +  h_pages[curPage+1]).addClass('hide');
                }
            }, 1000);
        }
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

}()
