/*
 * 上传图片引用百度WebUpload插件
 * 具体使用方法 http://fex.baidu.com/webuploader/
 * 由于多个地方上传显示位置还不一致，所以使用单个定义上传
 * 1.初始化上传控件封装
 * 2.需要添加图片的Dom的初始化载入
 */

/**
 *  ====== 1.初始化上传控件封装  =====
 *  */
$(function () {
    //初始化绑定默认的属性
    $.upLoadDefaults = $.upLoadDefaults || {};
    $.upLoadDefaults.property = {
        multiple: false, //是否多文件
        water: false, //是否加水印
        thumbnail: false, //是否生成缩略图
        sendurl: null, //发送地址
        filename : "file",  // 上传文件name
        filetypes: "jpg,JPEG,png,gif", //文件类型
        mimetypes: "image/*", // 只能传文件类型
        filesize: "12", //文件大小
        btntext: "浏览...", //上传按钮的文字
        swf: "/static/js/Uploader.swf", //SWF上传控件相对地址,上传SWF需要用到的文件
        duplicate : true,
        filequeued : function () {  // 当有文件添加进来的时候

        },
        uploadprogress : function () { // 文件上传过程中创建进度条实时显示

        },
        uploaderror : function () { // 当文件上传出错时触发

        },
        uploadsuccess : function () { // 当文件上传成功时触发

        },
        uploadcomplete : function () { // 不管成功或者失败，文件上传完成时触发

        },
    };
    //初始化上传控件
    $.fn.InitWebUpload = function (b) {
        var fun = function (uploaddom) {
            var p = $.extend({}, $.upLoadDefaults.property, b || {});

            //初始化WebUploader
            var uploader = WebUploader.create({
                auto: true, //自动上传
                swf: p.swf, //SWF路径
                server: p.sendurl, //上传地址
                pick: {
                    id: uploaddom,
                    multiple: p.multiple
                },
                accept: {
                    extensions: p.filetypes,
                    mimeTypes: p.mimetypes
                },
                formData: {
                    'DelFilePath': '', //定义参数
                    url: '算定义参数'
                },
                compress:{
                    width: 1200,
                    height: 1000,
                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality: 40,

                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: false,

                    // 是否允许裁剪。
                    crop: false,

                    // 是否保留头部meta信息。
                    preserveHeaders: true,

                    // 如果发现压缩后文件大小比原来还大，则使用原来图片
                    // 此属性可能会影响图片自动纠正功能
                    noCompressIfLarger: false,

                    // 单位字节，如果图片大小小于此值，不会采用压缩。
                    compressSize: 1024*1024
                },
                threads: "1",
                fileNumLimit: p.filenum,
                fileVal: p.filename, //上传域的名称
                duplicate : p.duplicate,
                fileSingleSizeLimit: p.filesize * 1024 * 1024 //文件大小
            });

            //当validate不通过时，会以派送错误事件的形式通知
            uploader.on('error', function (type) {
                var errorText = '';
                switch (type) {
                    case 'Q_EXCEED_NUM_LIMIT':
                        errorText = "错误：上传文件数量不能超过"+p.filenum+"个！";
                        break;
                    case 'Q_EXCEED_SIZE_LIMIT':
                        errorText = "错误：文件总大小超出限制！";
                        break;
                    case 'F_EXCEED_SIZE':
                        errorText = "错误：上传文件不能超过"+p.filesize+"M！";
                        break;
                    case 'Q_TYPE_DENIED':
                        errorText = "错误：禁止上传该类型文件！";
                        break;
                    case 'F_DUPLICATE':
                        errorText = "错误：请勿重复上传该文件！";
                        break;
                    default:
                        errorText = '错误代码：' + type;
                        break;
                }
                $.toast(errorText);
            });

            //当有文件添加进来的时候
            uploader.on('fileQueued', function (file) {
                p.filequeued(file);
            });
            //文件上传过程中创建进度条实时显示
            uploader.on('uploadProgress', function (file, percentage) {
                p.uploadprogress(file, percentage);
            });

            //当文件上传出错时触发
            uploader.on('uploadError', function (file, reason) {
                uploader.removeFile(file); //从队列中移除
                $.toast(file.name + "上传失败，错误代码：" + reason);
            });

            //当文件上传成功时触发
            uploader.on('uploadSuccess', function (file, data) {
                p.uploadsuccess(file, data);
            });

            //不管成功或者失败，文件上传完成时触发
            uploader.on('uploadComplete', function (file) {
                p.uploadcomplete(file);
            });

        }
        return $(this).each(function () {
            fun($(this));
        });
    }
});