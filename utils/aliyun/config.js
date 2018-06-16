var fileHost = "https://yjysw.oss-cn-hangzhou.aliyuncs.com"

var config = {
  //aliyun OSS config
  uploadImageUrl: `${fileHost}`, //默认存在根目录，可根据需求改
  AccessKeySecret: 'hbza9x8RJwZj291Kgtduwxf4EKkhHM',
  OSSAccessKeyId: 'LTAIwRhwVNzhchJg',
  osskey:"yijieyuan",
  timeout: 87600 //这个是上传文件时Policy的失效时间
};
module.exports = config
