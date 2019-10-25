![avatar][img]



#### 初始化

```
//目前仅支持vue
import AreaCity form 'areaCity';

const areaCity = new AreaCity({
    //参数全部为可选
    area: obj.area || area, // 二级联动数据源 需要其他的二级联动数据时
    province: obj.province || null,//一级默认选中项
    city: obj.city || null,// 二级默认选中项 非必传 传默认一级 不传默认二级  二级默认选择 首项
    // 例子 [{"province": "北京市","city": [{"name": "北京市"]}]
    provinceKey: obj.provinceKey || 'province',//一级key
    cityArrayKey: obj.cityArrayKey || 'city',//二级 数组的key
    cityKey: obj.cityKey || 'name',//二级数组的中要展示的key
})
```


#### 获取状态以及选中项

```

const areaCity = new AreaCity();

areaCity().then(({action,getSelect}) =>{
    //getSelect 是一个数组
    if (action === 'comfir') {
        const [ province,city ] = getSelect;
    }
});


```


#### 销毁
```
ps: new 之后才会有销毁
areaCity && areaCity.destroyed && areaCity.destroyed();

```










[img]:data:image/png;base64,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