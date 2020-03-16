Tanks.Bullet = atom.Class({
	Extends: Tanks.MobileObject,
	/**
	*	options:{
	*		spriteName, 
	*		shape,
	*		speedFactor,
	*		direction,
	*		par
	*	}
	*/
	
	objType : 'bullet',
	
	initialize: function (libcanvas, options) {
		var self = this;
		
		libcanvas.addElement( this );
		this.zIndex = 0;
		this.spriteName = options.spriteName;
		this.img = this.libcanvas.getImage(this.spriteName);		
		this.dirn = options.direction;
		this.crashMetal = options.crashMetal; // бронебойная пуля или нет
		this.objType = 'bullet';
		var spriteFrame = 0;
		if (1 == this.dirn.x) {
			spriteFrame = 3;
		} else if (-1 == this.dirn.x) {
			spriteFrame = 1;
		} else if (1 == this.dirn.y) {
			spriteFrame = 2;
		}
		this.sprite = this.img.sprite(spriteFrame*glob.bts, 0, glob.bts, glob.bts);
		this.shape  = new Rectangle(options.shape);
				
		this.speedFactor = options.speedFactor;		
		this.par = options.par;
		this.side = options.side;
		
		self.lcSet = function () {			
			self.ev = function (time) {				
				if (self.mv) {
					this.speed = (glob.bs * this.speedFactor)*time/1000;
					this.move({x:this.speed*this.dirn.x, y:this.speed*this.dirn.y});
				}				
			};
			
			self.ev_bind = self.ev.bind(this);			
			this.libcanvas.addFunc(self.ev_bind);
		};
		
		this.addEvent('libcanvasSet', self.lcSet);
		
		this.id = glob.ids++;
		globObj[this.id] = this;
		this.addToGridArr();
	},
	
	boom : function () {
		var self = this;
		this.libcanvas.rmFunc(self.ev_bind).removeEvent('libcanvasSet',self.lcSet);
		this.rmFromGlob();
		
		if (this.par.bulletLimit < this.par.maxBulletLimit) {
			this.par.bulletLimit++;
		} else {
			this.par.bulletLimit = this.par.maxBulletLimit;
		}
		
		this.libcanvas.addElement(
			new Tanks.Explosion( self.libcanvas.layer('explode'), this.shape.center.clone() )
		);
	}
});

