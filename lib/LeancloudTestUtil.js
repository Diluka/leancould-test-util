(function () {
    "use strict";


    var AV, request, appInfo;

    /**
     *
     * @param _AV
     * @param supertest
     * @param url 测试地址
     * @constructor
     */
    var LeancloudTestUtil = function (_AV, supertest, url) {
        AV = _AV;
        request = supertest.agent(url);
        appInfo = null;
    };


    /**
     * 初始化
     * @param prod 生产环境
     * @param done 回调
     */
    LeancloudTestUtil.prototype.init = function (prod, done) {
        request.get("/__engine/1/appInfo")
            .expect(200)
            .end(function (err, res) {
                appInfo = res.body;
                AV.initialize(appInfo.appId, appInfo.appKey, appInfo.masterKey);
                AV.Cloud.useMasterKey();
                AV.setProduction(prod);
                done();
            });
    };

    /**
     *
     * @param req 请求
     * @param name 函数名
     * @param data json数据
     * @param user 用户
     * @return {*}
     */
    LeancloudTestUtil.prototype.callCloudFunc = function (req, name, data, user) {

        var _url = "/1.1/functions/" + name;
        return req.post(_url)
            .set("X-AVOSCloud-Application-Id", appInfo.appId)
            .set("X-AVOSCloud-Application-Key", appInfo.appKey)
            .set("X-AVOSCloud-Session-Token", user ? user._sessionToken : "")
            .set("Content-Type", "application/json")
            .send(JSON.stringify(data));
    };

    /**
     *
     * @param uid 用户id
     * @return {*}
     */
    LeancloudTestUtil.prototype.getUser = function (uid) {
        return AV.Object.createWithoutData("_User", uid).fetch();
    };

    module.exports = LeancloudTestUtil;
})();

