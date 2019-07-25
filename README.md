<div align="center">

[![MIT](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](http://opensource.org/licenses/MIT)

</div>

# 简介
这是一个基于AXIOS自动取消axios重复请求的库

# 使用
`npm i --save axios-shim`
```
import axios from 'axios-shim'
axios({
  isAutoCancel: true, // default false
})
```

# License
[MIT](http://opensource.org/licenses/MIT)
