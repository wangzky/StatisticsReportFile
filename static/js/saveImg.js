//此代码仅在chrome测试下通过
function html2Svg() {
    //创建模版字符串
    var svgXML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
        '<foreignObject width="100%" height="100%">' + generateXML(html) + '</foreignObject>' +
        '</svg>'
    //利用Blob创建svg
    var svg = new Blob([svgXML], {type: 'image/svg+xml'})
    //利用DOMURL.createObjectURL取出对象
    var url = window.URL.createObjectURL(svg);
    var img = new Image()
    img.src = url
    return img
}

function generateXML(domStr) {
    var doc = document.implementation.createHTMLDocument('');
    doc.write(html);
    doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);
    doc = parseStyle(doc)
    console.log(doc)
    html = (new XMLSerializer).serializeToString(doc).replace('<!DOCTYPE html>', '');
    return html
}


function saveCanvas() {
    // html2canvas($(".Body")).then(function(canvas) {
    //     var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //     $("#download").attr("href",imgUri);
    //     console.log(imgUri);
    //     document.getElementById("download").click();
    // });
    setTimeout(save()
    , 3000
    )


}

function save() {
    html2canvas($('body'), {
        allowTaint: true,
        useCORS: true,
        logging: false
    }).then(function (canvas) {
        var dataURL = canvas.toDataURL("image/jpg")
        $("#download").attr("href", dataURL);
        console.log(dataURL);
        document.getElementById("download").click();
    })
}