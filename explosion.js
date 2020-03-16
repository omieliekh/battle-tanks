Tanks.Explosion = atom.Class({
	pos : null,

	Extends: DrawableSprite,
	
	animation: null,

	initialize : function (layer, pos) {
		var self = this;
		this.pos = pos;
		this.zIndex = Infinity;
		this.layer = layer.addElement( this );
		
		this.shape  = new Rectangle(this.pos.x - glob.exs/2, this.pos.y - glob.exs/2, glob.exs, glob.exs);
		this.sprite = this.layer.getImage('explosion').sprite(0, 0, glob.exts, glob.exts);
		
		this.addEvent('libcanvasSet', function () {
			this.animation = new LibCanvas.Animation.Sprite()
				.addSprites( this.layer.getImage('explosion'), glob.exts )
				.run( Array.range(0, glob.exf-1) )
				.addEvent('stop', function () {
					this.libcanvas.rmElement(this);
					this.fireEvent('stop', []);
				}.bind(this));
				
			this.layer.addFunc(function (time) {
				if (this.animation.sprite) {
					this.sprite = this.animation.sprite;
					this.libcanvas.update();
				}
			}.bind(this));
			
			this.sprite = this.animation.sprite;
		});
	}
});
