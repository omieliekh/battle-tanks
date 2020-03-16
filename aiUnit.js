Tanks.AiUnit = atom.Class({
	Extends: Tanks.Unit,
	
	initialize: function (libcanvas, options) {
		var self = this;
		this.initUnitVars(libcanvas, options);
		this.targCell = this.coords;
		this.driveTo = null;
		this.r = 0; // ��� ��������� ��������
		this.prevDist = 9999; //���������� ���������� �� ����
		
		self.lcSet = function () {
			self.ev = function (time) {
				this.speed = (glob.bs*this.speedFactor)*time/1000;
				
				this.r = getRandomInt(0,glob.dirsLen-1);
				this.think(this.r);
			};
			
			self.ev_bind = self.ev.bind(this);
			
			this.libcanvas.addFunc(self.ev_bind);
		};
		
		this.addEvent('libcanvasSet', self.lcSet);
		
		this.id = glob.ids++;
		globObj[this.id] = this;
		this.addToGridArr();
	},
	
	think : function(r){
		var dist = {
			x:Math.abs(this.shape.x - this.targCell.x*glob.bs),
			y:Math.abs(this.shape.y - this.targCell.y*glob.bs)
		};
		dist.max = (dist.x > dist.y)?dist.x:dist.y;
		
		
		if (dist.max < this.prevDist && this.mv) {
			this.prevDist = dist.max;
		} else {
		
		
		/*if (
			Math.abs(this.shape.x - this.targCell.x*glob.bs) <= 0.55*this.speed 
		&&
			Math.abs(this.shape.y - this.targCell.y*glob.bs) <= 0.55*this.speed
		){*/
			
			this.shape.x = Math.floor( 4*(this.shape.x + this.shape.width/8)/glob.bs )*glob.bs/4;
			this.shape.y = Math.floor( 4*(this.shape.y + this.shape.height/8)/glob.bs )*glob.bs/4;
			
			
				this.coords = {
					x: Math.floor( (this.shape.x + 0.5*this.shape.width)/glob.bs ),
					y: Math.floor( (this.shape.y + 0.5*this.shape.height)/glob.bs )
				};
			if (dist.max <= this.speed) {
			
				var currItem = glob.pathArr[this.coords.y][this.coords.x];			
				var m,k,cnt;

				for (cnt=0; cnt<glob.dirsItemLen; cnt++) {
					m = glob.dirs[r][cnt].m;
					k = glob.dirs[r][cnt].k;
					
					if (glob.pathArr[k + this.coords.y] && glob.pathArr[k + this.coords.y][m + this.coords.x]){
						var newItem = glob.pathArr[k + this.coords.y][m + this.coords.x];
						
						if ( currItem.weight < glob.fs.w*glob.fs.h && currItem.weight > newItem.weight ) {
							//console.log(newItem);
							
							this.targCell = {
								x: m + this.coords.x,
								y: k + this.coords.y
							};
							
							if (-1 == k) {
								this.driveTo = 'up';
							}else if (1 == k) {
								this.driveTo = 'down';
							} else if (-1 == m) {
								this.driveTo = 'left';
							} else if (1 == m) {
								this.driveTo = 'right';
							}

							this.prevDist = 9999;
							break;
						}
						
					}
				}
				
			} else {
				//console.log('stuck');
				this.targCell = this.coords;
				this.prevDist++;
			}
		}
		
		var nextCell = {
			x:2*this.targCell.x - this.coords.x,
			y:2*this.targCell.y - this.coords.y
		};

		console.log('coords: ', this.coords, ' | targCell: ', this.targCell, ' | nextCell: ', nextCell);
		
		if (
			!this.mv 
		||
			glob.pathArr[this.targCell.y][this.targCell.x].tex == 'brick'
		||
			glob.pathArr[this.targCell.y][this.targCell.x].tex == 'base'
		||
			(glob.pathArr[nextCell.y] && glob.pathArr[nextCell.y][nextCell.x] && glob.pathArr[nextCell.y][nextCell.x].tex == 'brick')
		){
			this.fire(); // �������
		}
		
		if ('up' == this.driveTo) {
			if ( !this.up() ) {
				//this.shape.y += this.speed/4;
			}
		} else if ('down' == this.driveTo) {
			if ( !this.down() ) {
				//this.shape.y -= this.speed/4;
			}
		} else if ('left' == this.driveTo) {
			if ( !this.left() ){
				//this.shape.x += this.speed/4;
			}			
		} else if ('right' == this.driveTo) {
			if ( !this.right() ){
				//this.shape.x -= this.speed/4;
			}
		}
		
		if (!this.mv){
			this.prevDist++;
		}
		
	}
});





