cc.Class(
{
    extends: cc.Component,
    properties: 
    {
        Color: cc.Node,
        Text: { default: null, type: cc.Label }
    },
    
    setNumberBy: function( number )
    {
        //這邊直接將我們的Label字串設定為 No.#
        this.Text.string = ( 'No.' + number );
    },
    
    Run: function()
    {
        //這邊建立一個永遠不停止的repeat，動作是每1秒轉360度
        var action = cc.repeatForever( cc.rotateBy( 1, 360 ) );
        //讓我們的彩球旋轉吧!
        this.Color.runAction( action );
    }
});
