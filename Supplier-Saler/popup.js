document.addEventListener('DOMContentLoaded', function () {
  const addSupplierButton = document.getElementById('addSupplier');

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
            alert(`提取的内容:\n${JSON.stringify(result, null, 2)}`);
          })
          .catch((error) => {
            console.error('请求失败:', error);
            alert('请求失败，请检查控制台日志。');
          });
      }
    });
  });
});
