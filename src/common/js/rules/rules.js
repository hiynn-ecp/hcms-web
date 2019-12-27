/**
 * 正则校验表单
 * 
 * @export
 */
//校验中文汉字
export function isChin(value) {
    if (value.length != 0) {
        const regex = /^[\u4e00-\u9fa5],{0,}$/;
        return regex.test(value);
    }
}

//校验数字
export function isNum(value) {
    if (value.length != 0) {
        const regex = /^[0-9]*$/;
        return regex.test(value);
    }
}

//校验整数
export function isIn(value) {
    if (value.length != 0) {
        const regex = /^-?\d+$/;
        return regex.test(value);
    }
}

//校验正整数
export function isPo_Int(value) {
    if (value.length != 0) {
        const regex = /^\+?[1-9][0-9]*$/;
        return regex.test(value);
    }
}

//校验浮点数
export function isFloat(value) {
    if (value.length != 0) {
        const regex = /^[-\+]?\d+(\.\d+)?$/;
        return regex.test(value);
    }
}

//校验非负浮点数
export function is_Nonegative_Float(value) {
    if (value.length != 0) {
        const regex = /^\d+(\.\d+)?$/;
        return regex.test(value);
    }
}

//校验正浮点数
export function is_Positive_Float(value) {
    if (value.length != 0) {
        const regex = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
        return regex.test(value);
    }
}

//校验负浮点数
export function is_Negative_Float(value) {
    if (value.length != 0) {
        const regex = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
        return regex.test(value);
    }
}

//校验26个英文字母组成的字符串
export function isLetter(value) {
    if (value.length != 0) {
        const regex = /^[A-Za-z]+$/;
        return regex.test(value);
    }
}

//校验26个大写英文字母组成的字符串
export function isCa_Letter(value) {
    if (value.length != 0) {
        const regex = /^[A-Z]+$/;
        return regex.test(value);
    }
}

//校验26个小写英文字母组成的字符串
export function isLow_Letter(value) {
    if (value.length != 0) {
        const regex = /^[a-z]+$/;
        return regex.test(value);
    }
}

//校验26个英文字母、数字组成的字符串
export function isLet_Num(value) {
    if (value.length != 0) {
        const regex = /^[A-Za-z0-9]+$/;
        return regex.test(value);
    }
}

//校验数字、横杠组成的字符串
export function is_Num_Rung(value) {
    if (value.length != 0) {
        const regex = /^[0-9\\-]+$/;
        return regex.test(value);
    }
}

//校验26个英文字母、数字或下划线组成的字符串
export function isLet_Num_Under(value) {
    if (value.length != 0) {
        const regex = /^\w+$/;
        return regex.test(value);
    }
}

//校验26个英文字母、数字或中文组成的字符串
export function isLet_Num_Chin(value) {
    if (value.length != 0) {
        const regex = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
        return regex.test(value);
    }
}

//校验密码：以字母开头，长度在6-18之间，只能包含字符、数字和下划线
export function isPwd(value) {
    if (value.length != 0) {
        const regex = /^[a-zA-Z]\w{5,17}$/;
        return regex.test(value);
    }
}

//校验email
export function isEmail(value) {
    if (value.length != 0) {
        const regex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return regex.test(value);
    }
}

//校验电话号码 正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX
export function isTel(value) {
    if (value.length != 0) {
        const regex = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
        return regex.test(value);
    }
}

//校验手机号
export function isPhone(value) {
    if (value.length != 0) {
        const regex = /^1[3456789]\d{9}$/;
        return regex.test(value);
    }
}

//校验身份证号
export function isCard(value) {
    if (value.length != 0) {
        const regex = /^\d{15}|\d{}18$/;
        return regex.test(value);
    }
}

//校验网址 必须以http:// https:// 开头
export function isWeb_Header(value) {
    if (value.length != 0) {
        const regex = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
        return regex.test(value);
    }
}


//校验网址 可以不以http:// https:// 开头
export function isWeb(value) {
    if (value.length != 0) {
        const regex = /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
        return regex.test(value);
    }
}

//校验ip
export function isIP(value) {
    if (value.length != 0) {
        const regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        return regex.test(value);
    }
}