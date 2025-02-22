document.addEventListener('DOMContentLoaded', function () {
    const addSupplierButton = document.getElementById('addSupplier');

    // 获取当前活动标签页的URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
    const url = activeTab.url;
        // 添加按钮点击事件
    addSupplierButton.addEventListener('click', function () {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((html) => {
          // 查找 "skuModel" 和 "offerBaseInfo" 之间的内容
          const skuModelIndex = html.indexOf('"skuModel":');
          if (skuModelIndex === -1) {
            alert('未找到 skuModel');
            return;
          }

          const offerBaseInfoIndex = html.indexOf('"offerBaseInfo"', skuModelIndex);
          if (offerBaseInfoIndex === -1) {
            alert('未找到 offerBaseInfo');
            return;
          }

          // 提取 "skuModel" 和 "offerBaseInfo" 之间的内容
          const extractedContent = html.substring(
            skuModelIndex + '"skuModel":'.length,
            offerBaseInfoIndex
          );

          // 展示提取的内容
          alert(`提取的内容:\n${extractedContent}`);
        })
        .catch((error) => {
          console.error('请求失败:', error);
          alert('请求失败，请检查控制台日志。');
        });
    });
  });
});
