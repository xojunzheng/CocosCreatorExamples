cc.Class(
{
    extends: cc.Component,
    properties: 
    {
        ClickCount: 0,
        //除了計數器外，這邊我故意留空，我準備全部使用代碼來控制
    },

    onLoad: function ()
    {
        //首先，我們先找到我們剛剛新增的按鈕
        var NodeBtnAdd = cc.find( 'Canvas/BtnAdd' ); //cc.find回傳的是Node
        
        //然後，記得養成時時檢查變數是否存在、並且寫Log的習慣，
        //上面的參數如果打錯，這邊就會印出Log，並且也不會再往下執行
        if( !NodeBtnAdd ) { cc.log('找不到Button, 請確認find的參數正確'); return; }
        
        //接著，我們將監聽按鈕的點擊事件，關聯至下方的onBtnAddClicked方法
        NodeBtnAdd.on( cc.Node.EventType.TOUCH_END, this.onBtnAddClicked.bind( this ) );
    },

    //由於我們打算動態新增Prefab來進行使用，所以我們在這個點擊事件中進行載入
    onBtnAddClicked: function()
    {
        //我們先動態取得Canvas
        var CanvasNode = cc.find( 'Canvas' );
        if( !CanvasNode ) { cc.log( '找不到Canvas畫布，請確認你的場景裡有Canvas' ); return; } 
        
        //這邊先將 this 指標存到另一個變數, 在別的方法裡this是會被改變的
        var root = this; 
        
        //Prefab的路徑
        //不過因為我們的MyPrefab直接就放在 /assets/resources/ 下，就直接寫
        var prefabPath = 'MyPrefab';
        //Ps. 假設你是放在在resources下的prefabs資料夾中，你就得寫 'prefabs/MyPrefab'
        
        
        //這邊我們新增一個私有方法，來做為載入Prefab時的方法
        //(當然你也可以直接寫在loadRes參數上，我只是覺得這樣比較容易看清楚)
        var onResourceLoaded = function( errorMessage, loadedResource )
        {
            //一樣，養成檢查的好習慣
            if( errorMessage ) { cc.log( '載入Prefab失敗, 原因:' + errorMessage ); return; }
            if( !( loadedResource instanceof cc.Prefab ) ) { cc.log( '你載入的不是Prefab, 你做了什麼事?' ); return; } //這個是型別的檢查
            
            //我們將root裡的計數器加1
            root.ClickCount++;
            
            //接著，我們就可以進行實例化了
            var newMyPrefab = cc.instantiate( loadedResource );
            
            //我們先將這個建立出來的Prefab加入畫布裡
            CanvasNode.addChild( newMyPrefab );
            
            //我們要開始設定位置，因為當時在Prefab我們沒有指定最外層的大小
            //所以這邊我們要取得在MyPrefab中，我們加入的 "SplitButtons_01" 這張圖片的高度
            var buttonBG = newMyPrefab.getChildByName( 'SplitButtons_01' );
            if( !buttonBG ) { cc.log('找不到指定名稱的Node, 是不是哪裡搞錯了？'); return; }
            
            //所以，y軸就是利用計數器乘上圖片的高度，再加上10額外邊界後，再減去場景的高度除以二
            var newY = ( root.ClickCount * buttonBG.height ) + 10 - ( CanvasNode.height / 2 );
            //減去場景高度這個動作，是為了讓每點擊一次按鈕，我們的Prefab就一直往上產生
            
            //設定位置，這邊x軸不變
            newMyPrefab.setPosition( 0, newY );
            
            //接著，我們取得MyPrefab裡的Script，這個就是我們當時定的名稱
            var newMyPrefabScript = newMyPrefab.getComponent( 'MyPrefabScript' );
            
            //然後，我們就可以呼叫我們寫在該腳本中的方法了
            //這邊我直接將計數器的值傳進去了
            newMyPrefabScript.setNumberBy( root.ClickCount );
            
            //然後，我新增了一個CallBack事件，使用計時器機制，讓它在1秒之後再執行
            var startRun = function(){ newMyPrefabScript.Run(); };
            
            //呼叫計時器
            newMyPrefabScript.scheduleOnce( startRun, 1 );
        };
        
        //這邊才是真的使用cc.loader進行載入，並且呼叫我們上面寫的方法
        cc.loader.loadRes( prefabPath, onResourceLoaded );
    },
});
