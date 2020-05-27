export default {
    setCookie : function(name, value, expireTime) {
        if(!expireTime){
            expireTime = 30;
        }
        var time = new Date();
        time.setMinutes(time.getMinutes() + expireTime);
        document.cookie = name + '=' + escape(value) + ';path=/;expires =' + time.toGMTString();
    },
    getCookie : function(name) {
        var arr = document.cookie.split(';');
        var paramObj = {};
        if(name == 'token'){
            for (var key = 0; key < arr.length; key++) {
                var index = arr[key].indexOf('=');
                var param = [arr[key].substr(0,index),arr[key].substring(index+2,arr[key].length-1)];
                if (param[0] && param[1]) {
                    paramObj[param[0].replace(/^\s+/, "")] = param[1].replace(
                            /^\s+/, "");
                }
            }
        }else{
            for (var key = 0; key < arr.length; key++) {
                var param = arr[key].split('=');
                if (param[0] && param[1]) {
                    paramObj[param[0].replace(/^\s+/, "")] = param[1].replace(
                            /^\s+/, "");
                }
            }
        }
        if (name) {
            return unescape(paramObj[name]) || '';
        }
        return paramObj;
    },
    removeCookie : function(name) {
        this.setCookie(name, 1, -1);
    },
    /**
     * 自定义时间 time 时间 format 想要的格式
     */
    simpleDateFormat : function(time, format) {
        var t = new Date(time);
        var tf = function(i) {
            return (i < 10 ? '0' : '') + i
        };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                case 'MM':
                    return tf(t.getMonth() + 1);
                case 'mm':
                    return tf(t.getMinutes());
                case 'dd':
                    return tf(t.getDate());
                case 'HH':
                    return tf(t.getHours());
                case 'ss':
                    return tf(t.getSeconds());
            }
        })
    },
    /**
     * 当前时间 時分秒
     */
    audioSet : function() {
        var mydate = new Date();
        var h = mydate.getHours() > 9 ? mydate.getHours() : "0"
                + mydate.getHours();
        var m = mydate.getMinutes() > 9 ? mydate.getMinutes() : "0"
                + mydate.getMinutes();
        var s = mydate.getSeconds() > 9 ? mydate.getSeconds() : "0"
                + mydate.getSeconds();
        return h + ':' + m + ':' + s;
    },
    /**
		 * 距今多少天
		 */
		getOffsetDays: function (time1, time2) {
            var offsetTime = Math.abs(time1 - time2);
            return Math.floor(offsetTime / (3600 * 24 * 1e3));
          },
    /**
     * 获取对象长度
     *
     * @param object
     * @returns
     */
    getObjLength : function(object) {
        var count = 0;
        for ( var i in object)
            count++;
        return count;
    },
    /**
     * 获取url中‘？’后的参数
     *
     * @param key
     * @returns
     */
    getRequestParam : function(item) {
        var url = location.search.replace(/^\?/,'').split('&');
        var paramsObj = {};
        for(var key=0;key<url.length;key++){
            var param =url[key].split('=');
            paramsObj[param[0]]=unescape(decodeURI(param[1]));
        }
        if(item){
            return paramsObj[item] || '';
        }
        return paramsObj;
    },
    /**
     * 删除url中的参数
     *
     * @param name
     * @returns 删除后的url
     */
    delURLQuery : function(name) {
        var loca = window.location;
        var baseUrl = loca.origin + loca.pathname + "?";
        var query = loca.search.substr(1);
        if (query.indexOf(name) > -1) {
            var obj = {}
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            }
            delete obj[name];
            var url = baseUrl
                    + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(
                            /\:/g, "=").replace(/\,/g, "&");
            return url
        }
    },
    /*
    * url 随机数
    */
    next:function(url){
        let _ = new Date().getTime();
        let random = '';
        url += url.indexOf('?')>=0?'&_='+_:'?_='+_;
        // if(url.indexOf('?')){
        //     url += '&_='+_;
        // }else{
        //     url += '?_='+_;
        // }
        window.location.href = url;
    },
    mul:function(n1,n2) {
        var r1 = 0 , r2 = 0;n1 = "" + n1 ,n2 = "" + n2;
        if (~n1.indexOf(".")){r1 = n1.split(".")[1].length;}
        if (~n2.indexOf(".")){r2 = n2.split(".")[1].length;}
        n1 = n1.replace(".","") * 1 ;
        n2 = n2.replace(".","") * 1 ;
        return (n1*n2) / Math.pow(10,r1+r2);
    },
    wxConfig(axios,infomation,cb){
        //   这里的api不用删除
        axios.post('/api/WeiXin/jssdkconfig.action',{url:infomation.url}).then((result) => {
            result = result.data;
            let newObj = {
                debug:false,
                appId:result.appId,
                timestamp:result.timeStamp,
                nonceStr:result.nonceStr,
                signature:result.signature,
                jsApiList:infomation.jsList
            };
            if(result){
                wx.config(newObj);
                cb(result);
            }else{
                console.error('调用返回信息错误',result);
            }
        },(error) => {
            console.error('调用返回信息错误==',error);
        });
    },
    /**
     * 判断是否对象
     * @param {*} object
     */
    isObj(object){
        return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
    },
    /**
     * 判断是否数组
     * @param {*} object
     */
    isArray(object) {
        return object && typeof (object) == 'object' && object.constructor == Array;
    },
    /**
     * 深拷贝
     * @param {*} source
     */
    deepCopy(o){
        if (!o || (typeof o) != 'object') return o;
        let dc = Array.isArray(o) ? [] : {};
        let keys = Object.keys(o);
        parentObjects.push(o);
        for(let k of keys) {
            let v = o[k];
            if (parentObjects.indexOf(v) > -1) {
                throw Error("检测到属性循环引用");
            }
            dc[k] = this.deepCopy(v);
        }
        parentObjects.pop();
        return dc;
    },
    /**
     * 计算百分比
     * @param num
     * @param total
     * @returns {*}
     * @constructor
     */
    getPercent(num, total) {
        num = parseFloat(num);
        total = parseFloat(total);
        if (isNaN(num) || isNaN(total)) {
            return "-";
        }
        if(num< 0){
	        return total <= 0 ? "0%" : -Math.round(-num / total * 10000) / 100.00 + "%";
        }else {
	        return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%");
        }
    },
    /**
     * 获取数组下标
     * @param value
     * @param arr
     * @returns {number}
     */
    getArrIndex : function(value,arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == value)
            return i;
        }
    },
	/**
	 * 根据身份证获取年纪
	 *
	 * @param identityCard 身份证号
	 * @returns 年龄
	 */
	getAge : function (identityCard) {
		var len = (identityCard + "").length;
		if (len == 0) {
			return 0;
		} else {
			if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
			{
				return 0;
			}
		}
		var strBirthday = "";
		if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
		{
			strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
		}
		if (len == 15) {
			strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
		}
		//时间字符串里，必须是“/”
		var birthDate = new Date(strBirthday);
		var nowDateTime = new Date();
		var age = nowDateTime.getFullYear() - birthDate.getFullYear();
		//再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
		if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	},
	jsGetAge: function (strBirthday) {
		var returnAge;
		var strBirthdayArr = strBirthday.split("-");
		var birthYear = strBirthdayArr[0];
		var birthMonth = strBirthdayArr[1];
		var birthDay = strBirthdayArr[2];

		var d = new Date();
		var nowYear = d.getFullYear();
		var nowMonth = d.getMonth() + 1;
		var nowDay = d.getDate();

		if (nowYear == birthYear) {
			returnAge = 0;//同年 则为0岁
		}
		else {
			var ageDiff = nowYear - birthYear; //年之差
			if (ageDiff > 0) {
				if (nowMonth == birthMonth) {
					var dayDiff = nowDay - birthDay;//日之差
					if (dayDiff < 0) {
						returnAge = ageDiff - 1;
					}else {
						returnAge = ageDiff;
					}
				}
				else {
					var monthDiff = nowMonth - birthMonth;//月之差
					if (monthDiff < 0) {
						returnAge = ageDiff - 1;
					} else {
						returnAge = ageDiff;
					}
				}
			}
			else {
				returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
			}
		}
		return returnAge;//返回周岁年龄
	},
	/*
	 生成guid
	 */
	guid : function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},
	/*根据字典ID获取家医字典*/
	getJYDictionary : function(itemType){
		for(let i = 0; i < this.JYDictionary.length;i++){
			if(this.JYDictionary[i].itemType == itemType){
				return this.JYDictionary[i].item
			}
		}
	},
	/*家医字典*/
	JYDictionary :
		[
			{
				'itemType': '0',
				'itemDesc': '是否',
				'item':[{'itemId': '1','itemName': '是'},{'itemId': '2','itemName': '否'}]
			},
			{
				'itemType': '1',
				'itemDesc': '重点人群',
				'item':[{'itemId': '1','itemName': '老年人'},{'itemId': '2','itemName': '高血压'},{'itemId': '3','itemName': '糖尿病'},{'itemId': '4','itemName': '重性精神病'},{'itemId': '5','itemName': '孕产妇'},{'itemId': '6','itemName': '儿童'}]
			},
			{
				'itemType': '2',
				'itemDesc': '家庭关系',
				'item':[{'itemId': '1','itemName': '本人或户主'},{'itemId': '2','itemName': '配偶'},{'itemId': '3','itemName': '子'},{'itemId': '4','itemName': '女'},{'itemId': '5','itemName': '孙子、孙女或外孙子、外孙女'},{'itemId': '6','itemName': '父母'},{'itemId': '7','itemName': '祖父母或外祖父母'},{'itemId': '8','itemName': '兄、弟、姐、妹'},{'itemId': '9','itemName': '其他'}]
			},
			{
				'itemType': '3',
				'itemDesc': '居住情况',
				'item':[{'itemId': '1','itemName': '常驻（户籍）'},{'itemId': '2','itemName': '常驻（非户籍）'},{'itemId': '3','itemName': '住外户籍（户籍）'},{'itemId': '4','itemName': '长外出（不在本地）'},{'itemId': '5','itemName': '不详'}]
			},
			{
				'itemType': '4',
				'itemDesc': '居住类型',
				'item':[{'itemId': '1','itemName': '流动'},{'itemId': '2','itemName': '常住'}]
			},
			{
				'itemType': '5',
				'itemDesc': '户口类型',
				'item':[{'itemId': '1','itemName': '乡村'},{'itemId': '2','itemName': '城镇'}]
			},
			{
				'itemType': '6',
				'itemDesc': '血型',
				'item':[{'itemId': '1','itemName': 'A'},{'itemId': '2','itemName': 'B'},{'itemId': '3','itemName': 'AB'},{'itemId': '4','itemName': 'O'},{'itemId': '5','itemName': '不详'},{'itemId': '6','itemName': '未检查'}]
			},
			{
				'itemType': '7',
				'itemDesc': 'RH',
				'item':[{'itemId': '1','itemName': '否'},{'itemId': '2','itemName': '是'},{'itemId': '2','itemName': '不详'}]
			},
			{
				'itemType': '8',
				'itemDesc': '文化程度',
				'item':[{'itemId': '1','itemName': '文盲或半文盲'},{'itemId': '2','itemName': '小学'},{'itemId': '3','itemName': '初中'},{'itemId': '4','itemName': '高中'},{'itemId': '5','itemName': '大学'},{'itemId': '6','itemName': '不详'}]
			},
			{
				'itemType': '9',
				'itemDesc': '职业',
				'item':[{'itemId': '1','itemName': '国家机关、党群组织、企业、事业单位负责人'},{'itemId': '2','itemName': '专业技术人员'},{'itemId': '3','itemName': '办事人员和有关人员'},{'itemId': '4','itemName': '商业、服务业人员'},{'itemId': '5','itemName': '农、林、牧、渔、水利业生产人员'},{'itemId': '6','itemName': '生产、运输设备操作员及有关人员'},{'itemId': '7','itemName': '军人'},{'itemId': '8','itemName': '不便分类的其他从业人员'},{'itemId': '9','itemName': '无职业'}]
			},
			{
				'itemType': '10',
				'itemDesc': '婚姻状态',
				'item':[{'itemId': '1','itemName': '未婚'},{'itemId': '2','itemName': '已婚'},{'itemId': '3','itemName': '离婚'},{'itemId': '4','itemName': '丧偶'},{'itemId': '5','itemName': '未说明婚姻状态'}]
			},
			{
				'itemType': '11',
				'itemDesc': '证件类型',
				'item':[{'itemId': '1','itemName': '身份证'},{'itemId': '2','itemName': '军官证'},{'itemId': '3','itemName': '其他证件'},{'itemId': '4','itemName': '护照'},{'itemId': '5','itemName': '户口本'},{'itemId': '6','itemName': '无'}]
			},
			{
				'itemType': '12',
				'itemDesc': '处置安排',
				'item':[{'itemId': '1','itemName': '持续管理'},{'itemId': '2','itemName': '居家治疗'},{'itemId': '3','itemName': '请管理团队会诊'},{'itemId': '4','itemName': '转诊门诊治疗'},{'itemId': '5','itemName': '转诊住院治疗'}]
			},
			{
				'itemType': '13',
				'itemDesc': '服务方式',
				'item':[{'itemId': '1','itemName': '主动服务'},{'itemId': '2','itemName': '上门服务'},{'itemId': '3','itemName': '预约服务'},{'itemId': '4','itemName': '电话随访'},{'itemId': '5','itemName': '其他'}]
			},
			{
				'itemType': '14',
				'itemDesc': '医保类型',
				'item':[{'itemId': '1','itemName': '新农合'},{'itemId': '2','itemName': '职工医保'},{'itemId': '3','itemName': '居民医保'},{'itemId': '4','itemName': '其他或无'}]
			},
			{
				'itemType': '15',
				'itemDesc': '签约人群',
				'item':[{'itemId': '1','itemName': '普通居民'},{'itemId': '2','itemName': '老年人'},{'itemId': '3','itemName': '高血压'},{'itemId': '4','itemName': '糖尿病'},{'itemId': '5','itemName': '孕产妇'},{'itemId': '6','itemName': '0-6岁儿童'},{'itemId': '7','itemName': '脑卒中'},{'itemId': '8','itemName': '计划生育特殊家庭对象'},{'itemId': '9','itemName': '精神病'},{'itemId': '10','itemName': '慢性呼吸道疾病'}]
			}
		]
}
let parentObjects = [];
