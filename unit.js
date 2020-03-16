Tanks.Unit = atom.Class({
	Extends: Tanks.MobileObject,
	
	zIndex : 0,
	objType : 'tank',
	crashMetal : false,  // ����������� ���� � ����� ��� ���
	health : 2,  // ������� ��������
	maxBulletLimit : 2, // ������������ ����� ��������
	bulletLimit : 2, // ����� ��������
	rechargeTime : 400, // �������� ����������� � ������������
	bulletReady : true, // ���� �� ����� ��������, ���� �� ������ �����������
	
	/**
	*	options:{
	*		spriteName,
	*		shape,
	*		coords,
	*		keys,
	*		speedFactor,
	*		bulletSpeedFactor,
	*		bulletType
	*	}
	*/
	initUnitVars : function(libcanvas, options){
		this.lc = libcanvas.addElement( this );	
		this.spriteName = options.spriteName;
		this.img = this.lc.getImage(this.spriteName);
		this.sprite = this.img.sprite(0, 0, glob.ts, glob.ts);
		this.dirn = {x:0,y:-1};
		this.key = options.keys;
		this.coords = options.coords;
		this.shape  = new Rectangle(glob.bs*this.coords.x, glob.bs*this.coords.y, glob.bs, glob.bs);
		this.speedFactor = options.speedFactor; // ���������� - ������� ������ ���� ������� ���� � �������
		this.moving = 0;
		this.bulletLimit = this.maxBulletLimit;
		this.bulletType = options.bulletType;
		this.bulletSpeedFactor = (options.bulletSpeedFactor > 1)?options.bulletSpeedFactor:1; //�� ����� ���� ������ �������� �����
		this.side = options.side; // �� ���� �� �������???  >:-[
	},
	
	initialize: function (libcanvas, options) {
		var self = this;
		this.initUnitVars(libcanvas, options);
		
		self.lcSet = function () {
			self.ev = function (time) {
				this.speed = (glob.bs*this.speedFactor)*time/1000;

				if (this.lc.getKey(this.key.u)) {
					this.up();
				}else if (this.lc.getKey(this.key.d)) {
					this.down();
				}else if (this.lc.getKey(this.key.l)) {
					this.left();
				}else if (this.lc.getKey(this.key.r)) {
					this.right();
				}
				
				if (this.lc.getKey('c') && this.lc.getKey('m')) { // ��� - ������ ������� c+m
					this.crashMetal = true;
					this.maxBulletLimit = 10;
					this.bulletLimit = this.maxBulletLimit;
					this.rechargeTime = 100;
					this.speedFactor = 10;
					this.bulletSpeedFactor = 5;
				}
				
				if ( !this.moving && (this.lc.getKey(this.key.u) ||	this.lc.getKey(this.key.d) || this.lc.getKey(this.key.r) ||	this.lc.getKey(this.key.l) )
				) { // ����� ��������
					this.moving = true;
				} else if (this.moving) { // �����������
					this.moving = false;
				}

				if (this.lc.getKey(this.key.f)) {
					this.fire(); // �������
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
	
	minusHealth : function(){
		this.health--;
		
		if (this.health <= 0) {
			this.boom();

			if (this.side == 'human') {
				setTimeout( function(){ alert('Your tank was been killed.\nGAME OVER'); }, 300 );
				this.lc.stop();
			}
		}
	},
	
	boom : function () {
		var self = this;
		this.libcanvas.rmFunc(self.ev_bind).removeEvent('libcanvasSet',self.lcSet);
		this.rmFromGlob();
		
		this.libcanvas.addElement(
			new Tanks.Explosion( self.libcanvas.layer('explode'), this.shape.center.clone() )
		);
	},
	
	fire : function(){
		var self = this;
		
		if (this.bulletLimit > 0 && this.bulletReady) {
			this.bulletLimit--;

			this.bulletReady = false;
			setTimeout(function(){self.bulletReady = true;}, this.rechargeTime);
			
			// ������� �������� �������� ����: (����.����� + �����.��������)
			this.bulletSF = this.speedFactor + this.bulletSpeedFactor;
			if (this.bulletSF < 5) {
				this.bulletSF = 5;
			}
			
			/* �������� ���� */
			
			new Tanks.Bullet(
				this.libcanvas,
				{
					spriteName : this.bulletType,
					shape : [
						this.shape.center.x/* + (this.dirn.x)*(this.shape.width/2)*/ - glob.bls/2,
						this.shape.center.y/* + (this.dirn.y)*(this.shape.height/2)*/ - glob.bls/2,
						glob.bls,
						glob.bls
					],
					speedFactor: this.bulletSF,
					direction : this.dirn,
					crashMetal: this.crashMetal,
					par: this,
					side: this.side
				}
			);
			/*===============*/
		}
	},
	
	up : function(){
		if (0 == this.dirn.x && -1 == this.dirn.y) {
			var res = this.move({x:0,y:-this.speed});
			return res;
		} else {
			this.dirn = {x:0,y:-1};
			this.sprite = this.img.sprite(0,0,glob.ts,glob.ts);
			return true;
		}
	},
	
	down : function(){
		if (0 == this.dirn.x && 1 == this.dirn.y) {
			var res = this.move({x:0,y:this.speed});
			return res;
		} else {
			this.dirn = {x:0,y:1};					
			this.sprite = this.img.sprite(2*glob.ts,0,glob.ts,glob.ts);
			return true;
		}
	},
	
	left : function(){
		if (-1 == this.dirn.x && 0 == this.dirn.y) {
			var res = this.move({x:-this.speed,y:0});
			return res;
		} else {
			this.dirn = {x:-1,y:0};					
			this.sprite = this.img.sprite(glob.ts,0,glob.ts,glob.ts);
			return true;
		}
	},
	
	right : function(){
		if (1 == this.dirn.x && 0 == this.dirn.y) {
			var res = this.move({x:this.speed,y:0});
			return res;
		} else {
			this.dirn = {x:1,y:0};
			this.sprite = this.img.sprite(3*glob.ts,0,glob.ts,glob.ts);
			return true;
		}	
	}
	
});





