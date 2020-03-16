Tanks.Controller = atom.Class({
	initialize: function () {
		var self = this;
		
		this.loadingGifShow(true);
		
		this.libcanvas = new LibCanvas('canvas', {
			/*backBuffer: 'off',*/
			clear : true,
			invoke: false,
			fps: glob.fps,
			preloadImages: {
				bullet1 : 'images/bullet1.png',
				bullet2 : 'images/bullet2.png',
				bullet3 : 'images/bullet3.png',
				tank1: 'images/tank1.png',
				tank2: 'images/tank2.png',
				tank3: 'images/tank3.png',
				field_brick:'images/tex-brick.png',
				field_bush:'images/tex-bush.png',
				field_ice:'images/tex-ice.png',
				field_metal:'images/tex-metal.png',
				field_water:'images/tex-water.png',
				field_base:'images/base.png',
				explosion:'images/explosion.png',
				red:'images/red.png'
			}
		})
		.listenMouse()
		.listenKeyboard(['aup','aleft','adown','aright','w','a','s','d','space','np0','np1','np2','np3','np5','ctrl'])
		.size(glob.bs*13, glob.bs*13, true)
		.start()
		.addEvent('ready', function () {
			self.loadingGifShow(false);
			
			self.fieldBottom = this.createLayer('field_bottom', 0);
			self.fieldTop = this.createLayer('field_top');
			this.createLayer('explode');
			
			/* this.keyboard.addEvent('space', function (e) { alert('space event'); }); */
			
			/* TEST FUNCTION */
			
			/*this.createLayer('testpath');
			this.createLayer('testpath2');*/
			this.createLayer('testpath3');
			self.testFunc(/*this.layer('testpath'), this.layer('testpath2'), */this.layer('testpath3'));
			
			/*===============*/
			
			
			/* HUMAN TANK 1 CREATION */
			new Tanks.Unit(
				this, 
				{
					spriteName : 'tank1',
					coords: {x:4,y:12},
					keys : {u:'aup',l:'aleft',d:'adown',r:'aright',f:'space'},
					speedFactor : 3,
					bulletSpeedFactor : 2,
					bulletType : 'bullet1',
					side:'human'
				}
			);
			/*=================*/
			
			/* HUMAN TANK 2 CREATION */
			// new Tanks.Unit(
			// 	this,
			// 	{
			// 		spriteName : 'tank2',
			// 		coords: {x:8,y:12},
			// 		keys : {u:'np5',l:'np1',d:'np2',r:'np3',f:'np0'},
			// 		speedFactor : 3,
			// 		bulletSpeedFactor : 1,
			// 		bulletType : 'bullet2',
			// 		side:'human'
			// 	}
			// );
			/*=================*/
			
			/* AI TANK 1 CREATION */
			new Tanks.AiUnit(
				this, 
				{
					spriteName : 'tank3',
					coords: {x:0,y:0},
					speedFactor : 2,
					bulletSpeedFactor : 2,
					bulletType : 'bullet3',
					side:'comp'
				}
			);
			/*=================*/
			/* AI TANK 2 CREATION */
			new Tanks.AiUnit(
				this, 
				{
					spriteName : 'tank3',
					coords: {x:6,y:0},
					speedFactor : 2,
					bulletSpeedFactor : 2,
					bulletType : 'bullet3',
					side:'comp'
				}
			);
			/*=================*/
			/* AI TANK 3 CREATION */
			new Tanks.AiUnit(
				this, 
				{
					spriteName : 'tank3',
					coords: {x:12,y:0},
					speedFactor : 2,
					bulletSpeedFactor : 2,
					bulletType : 'bullet3',
					side:'comp'
				}
			);
			/*=================*/
			
			
			self.createField(self.fieldTop,self.fieldBottom);
			
			self.fieldTop.update();
			self.fieldBottom.update();			
			this.update();
		});
		
		
	},
	
	loadingGifShow : function (show) {
		var div = document.getElementById('loading');
		
		if (show) {
			div.style.display = '';
		} else {
			div.style.display = 'none';
		}
	},
	
	createField : function (topLayer,bottomLayer) {
		var i,j;
		var pField = this.prepareField(glob.field);
		for (i=0;i<glob.field.length;i++) for (j=0;j<glob.field[i].length;j++){			
			this.createFieldCell(topLayer, bottomLayer, {x:j,y:i}, pField[i][j]);			
		}
	},
	
	prepareField : function (input) {
		var i,j,item;
		
		var output = [];
		
		for (i=0;i<input.length;i++)  {
			output[i] = [];
			for (j=0;j<input[i].length;j++){
				item = input[i][j];
				
				switch (item) {
					case 1: 
						output[i][j] = 'brick';	break;
					case 2:
						output[i][j] = 'brick_top';	break;
					case 3:
						output[i][j] = 'brick_left'; break;
					case 4:
						output[i][j] = 'brick_bottom'; break;
					case 5:
						output[i][j] = 'brick_right'; break;
					case 6:
						output[i][j] = 'metal'; break;
					case 7:
						output[i][j] = 'bush'; break;
					case 8:
						output[i][j] = 'ice'; break;
					case 9:
						output[i][j] = 'water';	break;
					case 10:
						output[i][j] = 'base';	break;
					case 0:	
					default: 
						output[i][j] = 'empty'; break;
				}
				
				if (  (4 == j || 8 == j) && 12 == i ){
					output[i][j] = 'empty';
				} else if (6 == j && 12 == i){
					output[i][j] = 'base';
				}
			}
		}
		return output;
	},
	
	createFieldCell : function(topLayer, bottomLayer, coords, state) {
		//layer
		var layer;
		if ('bush' != state) {
			layer = bottomLayer;			
			//if ( !(layer = bottomLayer.layer('field_bottom_'+coords.x+'_'+coords.y)) ){
			//	layer = bottomLayer.createLayer('field_bottom_'+coords.x+'_'+coords.y, 0);
			//}
		} else {
			layer = topLayer;
		}
		
		//state
		if (6 == coords.x && 12 == coords.y) {
			state = 'base';
		} else if ( ('empty' == state) || ( (4 == coords.x || 8 == coords.x) && 12 == coords.y) ) {
			return;
		}
		
		//scale, brick-state, from-to values
		var scale,i_from,i_to,j_from,j_to;
		
		scale = 1;
		i_from = 0;
		i_to = 1;
		j_from = 0;
		j_to = 1;
		
		if ('brick' == state || 'brick_top' == state || 'brick_left' == state || 'brick_bottom' == state || 'brick_right' == state) {
			scale = 0.25;
			state = 'brick';
			if ('brick' == state) {
				i_to = 3;
				j_to = 3;			
			} else if ('brick_top' == state) {
				i_to = 1;
				j_to = 3;
			} else if ('brick_left' == state) {
				i_to = 3;
				j_to = 1;
			} else if ('brick_bottom' == state) {
				i_from = 2;
				i_to = 3;
				j_to = 3;				
			} else if ('brick_right' == state) {				
				i_to = 3;
				j_from = 2;
				j_to = 3;				
			}
		} else if ('metal' == state) {
			scale = 0.5;			
		}

		if (1 == scale) {
			new Tanks.Cell(layer, coords, state, [0,0], scale);
		} else {
			var i,j;
			for (i=i_from;i<=i_to;i++) for (j=j_from;j<=j_to;j++) {
				/**
					layer - ���� ��� ���������
					{x:coords.x+(j*scale),y:coords.y+(i*scale)} - �������� 1, 4, 8 ��� 16 ��������. "+(j*scale)", "+(i*scale)" - �������� �� scale ��������
					state - ����� �������� ����� ��� �����
					[j*(glob.ts*scale), i*(glob.ts*scale)] - ����� ����� �������� �����
					scale - ������ ������� �� ��������� � ������� �������� (�������: 1�1, ������: scale � scale )
				*/
				new Tanks.Cell(
					layer, 
					{x:coords.x+(j*scale),y:coords.y+(i*scale)}, 
					state, 
					{x:j*(glob.ts*scale), y:i*(glob.ts*scale)}, 
					scale
				);
			}			
		}
	
	},
	
	
	// test function
	testFunc : function(/*libcanvas, libcanvas2,*/ libcanvas3) {
		var pField = this.prepareField(glob.field);
		
		//console.log(pField);
		
		var i,j;
		glob.pathArr = [];
		for (j=0;j<=glob.fs.h-1;j++){
			glob.pathArr[j] = [];
			for (i=0;i<=glob.fs.w-1;i++){
				/**
					output[i][j] = 'brick';			break;
					output[i][j] = 'brick_top';		break;
					output[i][j] = 'brick_left';	break;
					output[i][j] = 'brick_bottom';	break;
					output[i][j] = 'brick_right';	break;
					output[i][j] = 'metal'; 		break;
					output[i][j] = 'bush';		 	break;
					output[i][j] = 'ice';		 	break;
					output[i][j] = 'water';			break;
					output[i][j] = 'base';			break;
				*/
				/*
				if ('metal' != pField[j][i] && 'water' != pField[j][i]) {
					libcanvas2.createShaper({
						shape: new Circle(i*glob.bs+glob.bs/2, j*glob.bs+glob.bs/2, glob.bs/6),
						fill : 'red',
						hover: { fill: 'red' }
					});
					
					if (pField[j][i+1] && 'metal' != pField[j][i+1] && 'water' != pField[j][i+1]) {
						libcanvas.createShaper({
							shape : new LibCanvas.Shapes.Rectangle( i*glob.bs+11/24*glob.bs, j*glob.bs+11/24*glob.bs, glob.bs, glob.bs/12 ),
							fill : 'red',
							hover: { fill: 'red' }
						});
					
					}
					
					if (pField[j+1] && 'metal' != pField[j+1][i] && 'water' != pField[j+1][i]) {
						libcanvas.createShaper({
							shape : new LibCanvas.Shapes.Rectangle( i*glob.bs+11/24*glob.bs, j*glob.bs+11/24*glob.bs, glob.bs/12, glob.bs ),
							fill : 'red',
							hover: { fill: 'red' }
						});
					
					}
					
				}
				*/
				
				glob.pathArr[j][i] = {weight:glob.fs.w*glob.fs.h,tex:pField[j][i]};
			}
			
		}
		
		glob.pathArr[12][6].weight = 0;
		glob.pathArr = this.recurce(glob.pathArr,{x:6,y:12});
		
		/*libcanvas3.addRender(function (time) {
			var i,j;
			
			for (j=0;j<=glob.fs.h-1;j++)
			for (i=0;i<=glob.fs.w-1;i++){
				if (glob.pathArr[j][i].weight < glob.fs.w*glob.fs.h) {
				
					
					var minus;
					if (glob.pathArr[j][i].weight > 9) {
						minus = -3;
					} else {
						minus = 0;
					}
					
					this.ctx.text({
						text : glob.pathArr[j][i].weight,
						color : 'white',
						size: 11,
						weight : 'bold',
						to: new LibCanvas.Shapes.Rectangle( i*glob.bs+10/24*glob.bs+minus, j*glob.bs+0.5*glob.bs-10, glob.bs/2, glob.bs/2 )
					});
				}
			}

			
		});
		libcanvas3.update();
		*/	
		
	},
	
	recurce : function(arr, coords) {
		var val = parseInt(arr[coords.y][coords.x].weight)+1;
		
		var m,k,cnt;
		
		for (cnt=0; cnt<glob.dirsItemLen; cnt++) {
				m = glob.dirs[0][cnt].m;
				k = glob.dirs[0][cnt].k;

			if (arr[k+coords.y] && arr[k+coords.y][m+coords.x] && arr[k+coords.y][m+coords.x].tex != 'metal' && arr[k+coords.y][m+coords.x].tex != 'water') {
				if (arr[k+coords.y][m+coords.x].weight > val) {
					arr[k+coords.y][m+coords.x].weight = val;

					arr = this.recurce(arr,{x:(m+coords.x), y:(k+coords.y)});
				}
			}
		
		}
		
		return arr;
		
	}
	
});



