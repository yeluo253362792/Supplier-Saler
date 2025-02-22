const config = {
  apiDomain: 'http://localhost:8080', // 替换为实际的API域名
};

document.addEventListener('DOMContentLoaded', function () {
  const addSupplierButton = document.getElementById('addSupplier');
  const messageBox = document.getElementById('messageBox');
  const messageContent = document.getElementById('messageContent');
  const closeMessageButton = document.getElementById('closeMessage');


  // 获取当前活动标签页的URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    const url = new URL(activeTab.url);
    const domain = url.hostname;

    // 根据域名和URL参数设置按钮状态
    if (domain === 'detail.1688.com' && !url.search.includes('sk=consign')) {
      addSupplierButton.disabled = false;
    } else {
      addSupplierButton.disabled = true;
    }

    // 添加按钮点击事件
    addSupplierButton.addEventListener('click', function () {
      if (!addSupplierButton.disabled) {
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then((html) => {
            // 提取 "skuModel" 的内容
            const skuModelIndex = html.indexOf('"skuModel":');
            let skuModel = null;
            if (skuModelIndex !== -1) {
              const offerBaseInfoIndex = html.indexOf('"offerBaseInfo"', skuModelIndex);
              if (offerBaseInfoIndex !== -1) {
                skuModel = html.substring(
                  skuModelIndex + '"skuModel":'.length,
                  offerBaseInfoIndex
                ).trim();
              }
            }

            // 提取 "tempModel" 的内容
            const tempModelIndex = html.indexOf('"tempModel":');
            let tempModel = null;
            if (tempModelIndex !== -1) {
              const isSourcePromotionIndex = html.indexOf('"isSourcePromotion"', tempModelIndex);
              if (isSourcePromotionIndex !== -1) {
                tempModel = html.substring(
                  tempModelIndex + '"tempModel":'.length,
                  isSourcePromotionIndex
                ).trim();
              }
            }

            // 提取 "orderParamModel" 的内容
            const orderParamModelIndex = html.indexOf('"orderParamModel":');
            let orderParamModel = null;
            if (orderParamModelIndex !== -1) {
              const qrCodeIndex = html.indexOf('"qrCode"', orderParamModelIndex);
              if (qrCodeIndex !== -1) {
                orderParamModel = html.substring(
                  orderParamModelIndex + '"orderParamModel":'.length,
                  qrCodeIndex
                ).trim();
              }
            }

            // 组装结果为 JSON 字符串
            const result = {
              url: url.href,
              skuModel: skuModel.substring(0, skuModel.length - 1),
              tempModel: tempModel.substring(0, tempModel.length - 1),
              orderParamModel: orderParamModel.substring(0, orderParamModel.length - 1),
            };

            // 展示结果
            console.log(JSON.stringify(result, null, 2));

            // === 新增代码：发送“新增原始产品供应源”HTTP请求 ===
            const apiUrl = `${config.apiDomain}/api/supplier/raw`;

            fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url: result.url,
                content: JSON.stringify(result),
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                messageContent.textContent = '新增原始产品供应源成功！';
                messageBox.style.display = 'block';
              })
              .catch((error) => {
                console.error('新增原始产品供应源失败:', error);
                messageContent.textContent = '新增原始产品供应源失败！';
                messageBox.style.display = 'block';
              });
          })
          .catch((error) => {
            console.error('请求失败:', error);
            messageContent.textContent = '请求失败！';
            messageBox.style.display = 'block';
          });
      }
    });

    closeMessageButton.addEventListener('click', () => {
      messageBox.style.display = 'none';
    });
  });
});
