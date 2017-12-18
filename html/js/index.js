$(function () {

    function handlerLeftSecond() {
        var mobileNo = $("#phone").val();
        var leftSecond = getLeftSecond(mobileNo);
        if (leftSecond > 0) {
            $("#getValidCodeBtn").html(leftSecond + "s后重新发送");
        } else {
            $("#getValidCodeBtn").html("获取验证码");
        }
    }

    //发送验证码
    $("#getValidCodeBtn").click(function () {
        var mobileNo = $("#phone").val();
        if (mobileNo == "") {
            showErrMsg("请填写手机号码");
            return
        }
        var leftSecond = getLeftSecond(mobileNo);
        if (leftSecond > 0) {
            setInterval(handlerLeftSecond, 1000);
        }
        $.get("/sendMsg", {"mobileNo": mobileNo}, function (res) {
            if (res.isSucess) {
                showSucessMsg(res.message);
                setInterval(handlerLeftSecond, 1000);
            } else {
                showErrMsg(res.message);
            }
        });
    });

    function getLeftSecond(mobileNo) {
        var leftSecond = 0;
        var cookieValue = $.fn.cookie("code" + mobileNo);
        if (cookieValue != null && cookieValue != '') {
            cookieValue = cookieValue.substr(1);
            cookieValue = cookieValue.substr(0, cookieValue.length - 1);
            var cookieInt = Date.parse(cookieValue);
            leftSecond = (30 - parseInt((new Date().getTime() - cookieInt) / 1000));
            if (leftSecond < 0) {
                $.fn.cookie("code" + mobileNo, '');
            }
        }
        return leftSecond;
    }

    function get_cookie(Name) {
        var search = Name + "="//查询检索的值
        var returnvalue = "";//返回值
        if (document.cookie.length > 0) {
            sd = document.cookie.indexOf(search);
            if (sd != -1) {
                sd += search.length;
                end = document.cookie.indexOf(";", sd);
                if (end == -1)
                    end = document.cookie.length;
                //unescape() 函数可对通过 escape() 编码的字符串进行解码。
                returnvalue = unescape(document.cookie.substring(sd, end))
            }
        }
        return returnvalue;
    }

    $("#purchaseBtn").click(function () {
        if (!dataCheck()) return;
        var username = $("#username").val();
        var mobileNo = $("#phone").val();
        var code = $("#code").val();
        $.post("/addOrder", {"username": username, "mobileNo": mobileNo, "code": code}, function (res) {
            if (res.isSucess) {
                var sucessAlert = $("#alert-success");
                sucessAlert.addClass("show");
            } else {
                showErrMsg(res.message);
            }
        });
    })

    function dataCheck() {
        var username = $("#username").val();
        var mobileNo = $("#phone").val();
        var code = $("#code").val();
        if (username == "") {
            showErrMsg("姓名不得为空");
            return false;
        }
        if (mobileNo == "") {
            showErrMsg("手机号码不得为空");
            return false;
        }
        if (code == "") {
            showErrMsg("验证码不得为空");
            return false;
        }
        return true;
    }

    $("input").focus(function () {
        recoverMsg();
    })

    function recoverMsg() {
        var warnMsg = $("#warnMsg");
        warnMsg.hide();
    }

    function showSucessMsg(msg) {
        var warnMsg = $("#warnMsg");
        warnMsg.removeClass();
        warnMsg.addClass("tips-sucess");
        warnMsg.addClass("tips-info");
        warnMsg.html(msg);
        warnMsg.show();
    }

    function showErrMsg(msg) {
        var warnMsg = $("#warnMsg");
        warnMsg.removeClass();
        warnMsg.addClass("tips-err");
        warnMsg.addClass("tips-info");
        warnMsg.html(msg);
        warnMsg.show();
    }
})