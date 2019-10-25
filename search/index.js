module.exports =  async (browser,text) => {
    const page = await browser.newPage();
    const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/63.0.3239.84 Chrome/63.0.3239.84 Safari/537.36";
    page.setUserAgent(UA),
    await page.goto('https://www.baidu.com');

    async function search(text){
        await page.type('#kw',text, {
            delay: 100
        });
        await page.keyboard.down('Enter');
         // page.keyboard.down('Control');
         // page.keyboard.down('F4');
        await page.waitForNavigation({waitUntil: 'domcontentloaded'})
        await page.waitFor(500);
        return await page.evaluate(() => {
            let data = {
                list: [],
                page: [],
            };
            let elements = document.querySelector('#content_left').children;

            for( var element of elements){
                if(element.className.indexOf('result')>-1){
                    let h3 = element.querySelector('h3');
                    let div = element.querySelector('div');
                    let a = h3.querySelector('a');
                    let href = a.href;
                    let title = h3.innerText;
                    let abstract = div.innerText;
                    data.list.push({
                        href: href,
                        title: title,
                        abstract: abstract
                    });
                }
            }

            let pageEl = document.querySelector('#container>div#page').children;

            for(var item of pageEl){
                data.page.push({
                    href: item.href || 'javascript:void(0)',
                    text: item.innerText
                })
            }
            setTimeout(()=>{
                window.open('about:blank','_self');
            },1000)
            return data;
        });
    }

    return await search(text);
}
