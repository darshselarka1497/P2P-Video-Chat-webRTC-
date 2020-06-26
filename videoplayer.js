module.exports = Player

function Player(data){
    data = data || {}
    this.color = data.color || randomColor()
    this.x = data.x;
    this.y = data.y;
    this.top = data.top;
    this.left = data.left;
    this.name = data.name;
    this.element = document.createElement('video')
    Object.assign(this.element.style, {
        width:'50%',
        height: '50%',
        position: 'absolute',
        top:data.top+'px',
        left: data.left+'px',
        backgroundColor:this.color
    })
    document.body.appendChild(this.element)
}
